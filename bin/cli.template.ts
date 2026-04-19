#!/usr/bin/env node
/**
 * kiro-agents CLI installer
 * 
 * Dual-installation system that installs both steering documents and kiro-protocols power
 * to user's home directory. Automatically registers power for immediate use in Kiro IDE.
 * Removes old installations before installing new versions.
 * 
 * **File Lists Generated from Manifest:**
 * STEERING_FILES and POWER_FILES constants are generated during build from src/manifest.ts
 * to ensure consistency across all build targets (npm, dev, cli).
 * 
 * Installation targets:
 * - Steering: ~/.kiro/steering/kiro-agents/ (core system files, read-only)
 * - Power source: ~/.kiro/powers/kiro-protocols/ (protocol library, writable — used as source by Kiro IDE)
 * - Power installed: ~/.kiro/powers/installed/kiro-protocols/ (physical copy — used by Kiro IDE at runtime)
 * - Registry: ~/.kiro/powers/installed.json + ~/.kiro/powers/registries/user-added.json
 * 
 * The CLI replicates exactly what Kiro IDE does when a user installs a power via
 * "Add Custom Power" in the Powers UI. Power appears as "installed" in Powers UI
 * immediately after running npx kiro-agents.
 * 
 * @example
 * ```bash
 * # Install via npx
 * npx kiro-agents
 * 
 * # Install via bunx
 * bunx kiro-agents
 * 
 * # Power automatically registered and ready to use
 * # No manual activation required
 * ```
 */
import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync, chmodSync, constants } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** Installation directory for steering documents (e.g., '~/.kiro/steering/kiro-agents') */
const STEERING_INSTALL_DIR = join(homedir(), ".kiro", "steering", "kiro-agents");

/**
 * Source directory for kiro-protocols power files (e.g., '~/.kiro/powers/kiro-protocols').
 * 
 * Files here are kept writable so Kiro IDE can read them as a source when needed.
 * Registered as `source.path` in `registries/user-added.json`.
 * 
 * @see registerPower - Registers this path as source in user-added registry
 */
const POWER_INSTALL_DIR = join(homedir(), ".kiro", "powers", "kiro-protocols");

/**
 * Runtime directory for kiro-protocols power files (e.g., '~/.kiro/powers/installed/kiro-protocols').
 * 
 * Contains a physical copy of the power files (no symlinks). This is where Kiro IDE
 * reads the power from at runtime. Populated by installPowerFiles() during installation,
 * replicating what Kiro IDE does when a user installs via "Add Custom Power" UI.
 * 
 * Files here are set to read-only after copying, matching Kiro IDE's behavior.
 * 
 * @see installPowerFiles - Copies files from POWER_INSTALL_DIR to this directory
 */
const POWER_INSTALLED_DIR = join(homedir(), ".kiro", "powers", "installed", "kiro-protocols");

/**
 * Path to Kiro's installed powers manifest (e.g., '~/.kiro/powers/installed.json').
 * 
 * Tracks which powers are installed and which registry they belong to.
 * The CLI adds kiro-protocols with registryId "user-added" to this file.
 * 
 * @see registerPower - Writes to this file during installation
 */
const INSTALLED_JSON_PATH = join(homedir(), ".kiro", "powers", "installed.json");

/**
 * Path to Kiro's user-added powers registry (e.g., '~/.kiro/powers/registries/user-added.json').
 * 
 * Tracks custom powers added by the user, including their source paths.
 * The CLI adds kiro-protocols with source.type "local" pointing to POWER_INSTALL_DIR.
 * 
 * @see registerPower - Writes to this file during installation
 */
const USER_ADDED_JSON_PATH = join(homedir(), ".kiro", "powers", "registries", "user-added.json");

/**
 * Steering files to install from dist/ directory in package.
 * 
 * **GENERATED FROM MANIFEST** - Populated during build from src/manifest.ts by expanding
 * STEERING_MAPPINGS with glob patterns. Ensures consistency across all build targets.
 * 
 * Core system files providing foundational kiro-agents functionality:
 * - Instruction aliases (aliases.md)
 * - Agent management (agents.md)
 * - Mode switching (modes.md, modes/*.md)
 * - Strict mode control (strict.md)
 * - Interaction patterns (interactions/*.md)
 * 
 * **Note:** Protocol files are NOT included here. They are distributed through the
 * kiro-protocols Power (see POWER_FILES) and loaded on-demand via kiroPowers tool.
 * 
 * Installed to `~/.kiro/steering/kiro-agents/` and loaded automatically by Kiro IDE.
 * 
 * @see src/manifest.ts - STEERING_MAPPINGS source of truth
 * @see getSteeringFilesForCLI - Function that generates this list
 */
const STEERING_FILES = /* STEERING_FILES_PLACEHOLDER */ as const;

/**
 * Power files to install from power/ directory in package.
 * 
 * **GENERATED FROM MANIFEST** - Populated during build from src/manifest.ts by expanding
 * POWER_MAPPINGS with glob patterns. Ensures consistency with power build.
 * 
 * kiro-protocols power files:
 * - Power metadata (POWER.md, mcp.json, icon.png)
 * - Protocol library (steering/agent-activation.md, steering/agent-creation.md, etc.)
 * 
 * Copied from `powers/kiro-protocols/` during build, packaged in npm distribution
 * for dual installation alongside steering files.
 * 
 * @see src/manifest.ts - POWER_MAPPINGS source of truth
 * @see getPowerFilesForCLI - Function that generates this list
 */
const POWER_FILES = /* POWER_FILES_PLACEHOLDER */ as const;

/**
 * Power metadata extracted from POWER.md frontmatter.
 * 
 * @property name - Power identifier (e.g., 'kiro-protocols')
 * @property displayName - Human-readable name shown in Powers UI (e.g., 'Kiro Protocols')
 * @property description - Brief description of power capabilities
 * @property keywords - Search terms for power discovery
 * @property author - Power author/maintainer
 */
interface PowerMetadata {
  name: string;
  displayName: string;
  description: string;
  keywords: string[];
  author: string;
}

/**
 * Structure of ~/.kiro/powers/installed.json.
 * 
 * Tracks which powers are installed and which registry entry describes them.
 * Kiro IDE reads this file on startup to determine installed powers.
 * 
 * @property version - File format version
 * @property installedPowers - List of installed power entries
 * @property dismissedAutoInstalls - Powers the user has dismissed from auto-install prompts
 */
interface InstalledPowers {
  version: string;
  installedPowers: Array<{ name: string; registryId: string }>;
  dismissedAutoInstalls: string[];
}

/**
 * Structure of ~/.kiro/powers/registries/user-added.json.
 * 
 * Registry of custom powers added by the user via "Add Custom Power" UI or CLI.
 * Kiro IDE reads this to find the source path for each user-added power.
 * 
 * @property powers - List of user-added power entries with source information
 */
interface UserAddedRegistry {
  powers: Array<{
    name: string;
    description: string;
    source: {
      type: string;
      path: string;
    };
  }>;
}

/**
 * Makes a file writable by setting appropriate permissions.
 * Silently ignores errors (e.g., file doesn't exist).
 * 
 * @param filePath - Absolute path to file
 * 
 * @example
 * ```typescript
 * await setWritable('/path/to/file.md');
 * // File now has rw-r--r-- permissions
 * ```
 */
async function setWritable(filePath: string): Promise<void> {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {
    // Ignore errors if file doesn't exist
  }
}

/**
 * Makes a file read-only by removing write permissions.
 * Warns if operation fails but continues execution.
 * 
 * @param filePath - Absolute path to file
 * 
 * @example
 * ```typescript
 * await setReadOnly('/path/to/file.md');
 * // File now has r--r--r-- permissions
 * ```
 */
async function setReadOnly(filePath: string): Promise<void> {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {
    console.warn(`⚠️  Could not set read-only: ${filePath}`);
  }
}

/**
 * Extracts power metadata from POWER.md frontmatter.
 * 
 * Parses the YAML frontmatter from POWER.md to extract metadata needed
 * for registry registration (name, displayName, description, keywords, author).
 * Uses regex patterns to extract each field, with fallback defaults for
 * kiro-protocols if fields are missing.
 * 
 * @param powerMdPath - Absolute path to POWER.md file
 * @returns Power metadata object with all required fields
 * @throws {Error} If POWER.md has no frontmatter section
 * 
 * @example
 * ```typescript
 * const metadata = await extractPowerMetadata('/path/to/POWER.md');
 * // { name: 'kiro-protocols', displayName: 'Kiro Protocols',
 * //   description: '...', keywords: [...], author: '...' }
 * ```
 */
async function extractPowerMetadata(powerMdPath: string): Promise<PowerMetadata> {
  const { readFile } = await import("fs/promises");
  const content = await readFile(powerMdPath, "utf-8");
  
  // Extract frontmatter (between --- markers)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch || !frontmatterMatch[1]) {
    throw new Error("No frontmatter found in POWER.md");
  }
  
  const frontmatter = frontmatterMatch[1];
  
  // Parse frontmatter fields with safe extraction
  const extractField = (pattern: RegExp, defaultValue: string): string => {
    const match = frontmatter.match(pattern);
    return match && match[1] ? match[1].trim() : defaultValue;
  };
  
  const extractKeywords = (): string[] => {
    const match = frontmatter.match(/^keywords:\s*\[(.*?)\]$/m);
    if (!match || !match[1]) return [];
    return match[1].split(",").map(k => k.trim().replace(/["']/g, ""));
  };
  
  return {
    name: extractField(/^name:\s*["']?([^"'\n]+)["']?$/m, "kiro-protocols"),
    displayName: extractField(/^displayName:\s*["']?([^"'\n]+)["']?$/m, "Kiro Protocols"),
    description: extractField(/^description:\s*["']?([^"'\n]+)["']?$/m, ""),
    keywords: extractKeywords(),
    author: extractField(/^author:\s*["']?([^"'\n]+)["']?$/m, ""),
  };
}

/**
 * Recursively copies a file or directory, preserving directory structure.
 * 
 * Used internally by `installPowerFiles` to copy subdirectories (e.g., `steering/`).
 * 
 * @param src - Source path (file or directory)
 * @param dest - Destination path
 * 
 * @example
 * ```typescript
 * await copyRecursive('/source/steering', '/dest/steering');
 * // Copies all .md files preserving subdirectory layout
 * ```
 */
async function copyRecursive(src: string, dest: string): Promise<void> {
  const { stat, readdir, mkdir, copyFile } = await import("fs/promises");
  
  const stats = await stat(src);
  
  if (stats.isDirectory()) {
    await mkdir(dest, { recursive: true });
    const entries = await readdir(src);
    for (const entry of entries) {
      await copyRecursive(join(src, entry), join(dest, entry));
    }
  } else {
    await copyFile(src, dest);
  }
}

/**
 * Copies power files from POWER_INSTALL_DIR to POWER_INSTALLED_DIR as physical files.
 * 
 * Replicates what Kiro IDE does when a user installs a power via "Add Custom Power" UI:
 * copies all files (except `icon.png`, which Kiro IDE skips) from the source directory
 * to the `installed/` directory as real files, then sets them read-only.
 * 
 * This is NOT a symlink operation. Kiro IDE reads from `installed/` directly at runtime
 * and does not auto-repair this directory if it is missing or corrupted.
 * 
 * Process:
 * 1. Removes existing installed directory if present (clean install)
 * 2. Copies all entries from POWER_INSTALL_DIR except `icon.png`
 * 3. For files: copies and sets read-only immediately
 * 4. For directories (e.g., `steering/`): copies recursively, then sets top-level entries read-only
 * 
 * **Note:** Read-only is applied to direct children of subdirectories only (one level deep).
 * Deeply nested files are copied but not explicitly chmod'd.
 * 
 * @example
 * ```typescript
 * await installPowerFiles();
 * // Creates ~/.kiro/powers/installed/kiro-protocols/ with:
 * // - POWER.md (read-only)
 * // - mcp.json (read-only)
 * // - steering/*.md (read-only)
 * // icon.png is intentionally excluded (Kiro IDE does not copy it)
 * ```
 */
async function installPowerFiles(): Promise<void> {
  const { readdir, mkdir, rm, stat, copyFile } = await import("fs/promises");
  
  // Remove existing installed directory for clean install
  if (existsSync(POWER_INSTALLED_DIR)) {
    await rm(POWER_INSTALLED_DIR, { recursive: true, force: true });
  }
  await mkdir(POWER_INSTALLED_DIR, { recursive: true });
  
  // Copy all entries from source except icon.png (Kiro IDE does not copy it)
  const entries = await readdir(POWER_INSTALL_DIR);
  for (const entry of entries) {
    if (entry === "icon.png") continue;
    
    const srcPath = join(POWER_INSTALL_DIR, entry);
    const destPath = join(POWER_INSTALLED_DIR, entry);
    const stats = await stat(srcPath);
    
    if (stats.isDirectory()) {
      // Recursively copy subdirectory (e.g., steering/)
      await copyRecursive(srcPath, destPath);
      // Set all files in subdirectory to read-only
      const subEntries = await readdir(destPath);
      for (const subEntry of subEntries) {
        await setReadOnly(join(destPath, subEntry));
      }
    } else {
      await copyFile(srcPath, destPath);
      await setReadOnly(destPath);
    }
    
    console.log(`✅ Installed: ${entry}`);
  }
}

/**
 * Registers kiro-protocols in Kiro's power registry files.
 * 
 * Replicates exactly what Kiro IDE does when a user installs a power via
 * "Add Custom Power" UI. Writes to two files:
 * 
 * 1. `~/.kiro/powers/installed.json` — marks kiro-protocols as installed
 *    with registryId "user-added". Merges with existing entries (idempotent).
 * 
 * 2. `~/.kiro/powers/registries/user-added.json` — records the source path
 *    (`POWER_INSTALL_DIR`) so Kiro IDE knows where the power came from.
 *    Updates existing entry if present, otherwise appends.
 * 
 * Does NOT modify `~/.kiro/powers/registry.json` — that file is the marketplace
 * catalog managed exclusively by Kiro IDE.
 * 
 * @returns True if successful, false if failed
 * 
 * @example Register on fresh install
 * ```typescript
 * const success = await registerPower();
 * // Writes to installed.json and registries/user-added.json
 * // Power appears as installed in Kiro Powers UI
 * ```
 * 
 * @example Re-running is safe (idempotent)
 * ```typescript
 * await registerPower(); // first install
 * await registerPower(); // update — merges, no duplicates
 * ```
 */
async function registerPower(): Promise<boolean> {
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  
  // Ensure registries directory exists
  await mkdir(dirname(USER_ADDED_JSON_PATH), { recursive: true });
  
  // --- installed.json ---
  let installed: InstalledPowers;
  if (existsSync(INSTALLED_JSON_PATH)) {
    const content = await readFile(INSTALLED_JSON_PATH, "utf-8");
    installed = JSON.parse(content);
  } else {
    installed = { version: "1.0.0", installedPowers: [], dismissedAutoInstalls: [] };
  }
  
  // Add kiro-protocols entry if not already present
  const alreadyInstalled = installed.installedPowers.some(p => p.name === "kiro-protocols");
  if (!alreadyInstalled) {
    installed.installedPowers.push({ name: "kiro-protocols", registryId: "user-added" });
  }
  await writeFile(INSTALLED_JSON_PATH, JSON.stringify(installed, null, 2), "utf-8");
  
  // --- registries/user-added.json ---
  let userAdded: UserAddedRegistry;
  if (existsSync(USER_ADDED_JSON_PATH)) {
    const content = await readFile(USER_ADDED_JSON_PATH, "utf-8");
    userAdded = JSON.parse(content);
  } else {
    userAdded = { powers: [] };
  }
  
  // Extract description from POWER.md for the registry entry (currently unused — description is derived from path)
  // const metadata = await extractPowerMetadata(powerMdPath); // reserved for future use
  
  // Update or add kiro-protocols entry
  const existingIdx = userAdded.powers.findIndex(p => p.name === "kiro-protocols");
  const entry = {
    name: "kiro-protocols",
    description: `Custom power from ${POWER_INSTALL_DIR}`,
    source: {
      type: "local",
      path: POWER_INSTALL_DIR,
    },
  };
  if (existingIdx >= 0) {
    userAdded.powers[existingIdx] = entry;
  } else {
    userAdded.powers.push(entry);
  }
  await writeFile(USER_ADDED_JSON_PATH, JSON.stringify(userAdded, null, 2), "utf-8");
  
  console.log("✅ Power registered in Kiro registry");
  return true;
}

/**
 * Installs a single file from package to target directory.
 * 
 * Process:
 * 1. Restores write permissions if file exists (for updates)
 * 2. Reads source file from package
 * 3. Creates destination directory if needed
 * 4. Writes file to destination
 * 5. Sets file to read-only (steering files only — power source files stay writable)
 * 
 * @param relativePath - Path relative to source directory (e.g., 'agents.md', 'steering/agent-activation.md')
 * @param installDir - Absolute installation directory (e.g., '~/.kiro/steering/kiro-agents')
 * @param sourceDir - Source directory in package (e.g., 'dist', 'power')
 * @param readOnly - Whether to set the file read-only after install (default: true)
 * 
 * @example
 * ```typescript
 * // Install steering file (read-only)
 * await installFile('agents.md', STEERING_INSTALL_DIR, 'dist');
 * 
 * // Install power source file (writable — Kiro IDE needs to read it as source)
 * await installFile('steering/agent-activation.md', POWER_INSTALL_DIR, 'power', false);
 * ```
 */
async function installFile(relativePath: string, installDir: string, sourceDir: string, readOnly = true): Promise<void> {
  const destPath = join(installDir, relativePath);
  
  // Restore write permissions if file exists (needed for updates)
  if (existsSync(destPath)) {
    await setWritable(destPath);
  }
  
  // Get source file from package
  const srcPath = join(__dirname, "..", sourceDir, relativePath);
  
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const content = await readFile(srcPath);
  
  // Ensure directory exists
  const destDir = dirname(destPath);
  await mkdir(destDir, { recursive: true });
  
  await writeFile(destPath, content);
  
  if (readOnly) {
    await setReadOnly(destPath);
  }
  
  console.log(`✅ Installed: ${relativePath}`);
}

/**
 * Main installation function that performs dual installation with automatic registration.
 * 
 * Installation process:
 * 1. Removes existing steering installation if present
 * 2. Installs steering files to ~/.kiro/steering/kiro-agents/ (read-only)
 * 3. Removes existing power source installation if present
 * 4. Installs power files to ~/.kiro/powers/kiro-protocols/ (writable — source directory)
 * 5. Copies power files to ~/.kiro/powers/installed/kiro-protocols/ (read-only — runtime directory)
 * 6. Registers kiro-protocols in installed.json and registries/user-added.json
 * 
 * This replicates exactly what Kiro IDE does when a user installs a power via
 * "Add Custom Power" UI, ensuring compatibility with current and future Kiro versions.
 * 
 * @throws {Error} If installation fails (caught by main execution handler)
 * 
 * @example
 * ```typescript
 * await install();
 * // Both steering and power files installed
 * // Power automatically registered and ready to use
 * ```
 */
async function install(): Promise<void> {
  console.log("🚀 Installing kiro-agents system...\n");
  
  let hasWarnings = false;
  
  // --- Steering files ---
  console.log("📄 Installing steering files to ~/.kiro/steering/kiro-agents/");
  if (existsSync(STEERING_INSTALL_DIR)) {
    console.log("🗑️  Removing existing steering installation...");
    const { rmSync } = await import("fs");
    rmSync(STEERING_INSTALL_DIR, { recursive: true, force: true });
  }
  for (const file of STEERING_FILES) {
    await installFile(file, STEERING_INSTALL_DIR, "dist");
  }
  
  // --- Power source files (writable) ---
  console.log("\n⚡ Installing kiro-protocols source to ~/.kiro/powers/kiro-protocols/");
  if (existsSync(POWER_INSTALL_DIR)) {
    console.log("🗑️  Removing existing power source...");
    const { rmSync } = await import("fs");
    rmSync(POWER_INSTALL_DIR, { recursive: true, force: true });
  }
  for (const file of POWER_FILES) {
    await installFile(file, POWER_INSTALL_DIR, "power", false);
  }
  
  // --- Power installed files (physical copy, read-only) ---
  console.log("\n📋 Copying power files to ~/.kiro/powers/installed/kiro-protocols/");
  try {
    await installPowerFiles();
  } catch (error) {
    console.warn("⚠️  Warning: Could not copy power files to installed/:", error instanceof Error ? error.message : error);
    console.warn("   Power may not appear correctly in Kiro Powers UI.");
    hasWarnings = true;
  }
  
  // --- Registry registration ---
  console.log("\n📝 Registering power in Kiro registry...");
  try {
    await registerPower();
  } catch (error) {
    console.warn("⚠️  Warning: Could not register power:", error instanceof Error ? error.message : error);
    console.warn("   The power files are installed but may not appear in Kiro Powers UI.");
    console.warn("   You can manually add the power via: Powers panel → Add Custom Power → Local Directory");
    console.warn(`   Path: ${POWER_INSTALL_DIR}`);
    hasWarnings = true;
  }
  
  // Final status
  if (hasWarnings) {
    console.log("\n⚠️  Installation completed with warnings!");
    console.log("   Core files installed successfully, but some optional features may not work.");
  } else {
    console.log("\n✨ Installation completed successfully!");
  }
  
  console.log(`\n📁 Steering files:  ${STEERING_INSTALL_DIR}`);
  console.log(`📁 Power source:    ${POWER_INSTALL_DIR}`);
  console.log(`📁 Power installed: ${POWER_INSTALLED_DIR}`);
  console.log("\n💡 The kiro-protocols power should now appear as installed in Kiro Powers UI.");
  console.log("\n🔄 To update, simply run 'npx kiro-agents' again.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
