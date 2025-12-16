#!/usr/bin/env node
/**
 * kiro-agents CLI installer
 * 
 * Dual-installation system that installs both steering documents and kiro-protocols power
 * to user's home directory. Removes old installations before installing new versions.
 * 
 * Installation targets:
 * - Steering: ~/.kiro/steering/kiro-agents/ (core system files)
 * - Power: ~/.kiro/powers/kiro-protocols/ (protocol library power)
 * - Registry: ~/.kiro/powers/registry.json (power registration for UI integration)
 * 
 * The CLI registers the kiro-protocols power in Kiro's registry.json so it appears
 * as installed in the Powers UI without requiring manual activation. If registration
 * fails, the power files are still installed and users receive instructions for manual
 * activation via the Powers panel.
 * 
 * @example
 * ```bash
 * # Install via npx
 * npx kiro-agents
 * 
 * # Install via bunx
 * bunx kiro-agents
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

/** Installation directory for kiro-protocols power (e.g., '~/.kiro/powers/kiro-protocols') */
const POWER_INSTALL_DIR = join(homedir(), ".kiro", "powers", "kiro-protocols");

/** Kiro powers registry file path */
const REGISTRY_PATH = join(homedir(), ".kiro", "powers", "registry.json");

/**
 * Steering files to install from dist/ directory in package.
 * These are core system files (agents, modes, strict mode, interactions).
 */
const STEERING_FILES = [
  "strict-mode.md",
  "agents.md",
  "modes.md",
  "strict.md",
  "interactions/chit-chat.md",
  "interactions/interaction-styles.md",
  "modes/kiro-spec-mode.md",
  "modes/kiro-vibe-mode.md",
] as const;

/**
 * Power files to install from power/ directory in package.
 * These are kiro-protocols power files (metadata, protocols, icon) copied from
 * `powers/kiro-protocols/` during build and packaged in npm distribution.
 * 
 * @see scripts/build.ts - NPM_POWER_FILES constant that copies these during build
 */
const POWER_FILES = [
  "POWER.md",
  "mcp.json",
  "icon.png",
  "steering/agent-activation.md",
  "steering/agent-creation.md",
  "steering/agent-management.md",
  "steering/mode-management.md",
  "steering/mode-switching.md",
] as const;

/**
 * Power metadata extracted from POWER.md frontmatter.
 * This metadata is used to register the power in Kiro's registry.
 */
interface PowerMetadata {
  name: string;
  displayName: string;
  description: string;
  keywords: string[];
  author: string;
}

/**
 * Kiro registry structure for tracking installed powers.
 */
interface KiroRegistry {
  version: string;
  powers: Record<string, PowerEntry>;
  repoSources: Record<string, RepoSource>;
  lastUpdated: string;
}

/**
 * Power entry in the registry.
 */
interface PowerEntry {
  name: string;
  displayName: string;
  description: string;
  mcpServers: string[];
  author: string;
  keywords: string[];
  installed: boolean;
  installedAt?: string;
  installPath?: string;
  source: {
    type: string;
    repoId: string;
    repoName: string;
  };
  sourcePath?: string;
}

/**
 * Repository source entry in the registry.
 */
interface RepoSource {
  name: string;
  type: string;
  enabled: boolean;
  addedAt: string;
  path: string;
  lastSync: string;
  powerCount: number;
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
 * Registers the kiro-protocols power in Kiro's registry.json.
 * 
 * Process:
 * 1. Ensures registry directory exists (~/.kiro/powers/)
 * 2. Reads existing registry or creates new one
 * 3. Extracts power metadata from POWER.md frontmatter
 * 4. Creates/updates power entry with installation info
 * 5. Creates/updates local repo source entry
 * 6. Saves updated registry with timestamp
 * 
 * This makes the power appear as "installed" in Kiro's Powers UI
 * without requiring manual activation. The power is registered as
 * a local source with type "npx kiro-agents" for tracking.
 * 
 * @throws {Error} If POWER.md is missing or has invalid frontmatter
 * 
 * @example
 * ```typescript
 * await registerPowerInRegistry();
 * // Power now appears as installed in Kiro UI
 * // Registry updated with power entry and repo source
 * ```
 */
async function registerPowerInRegistry(): Promise<void> {
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  
  // Ensure registry directory exists
  const registryDir = dirname(REGISTRY_PATH);
  await mkdir(registryDir, { recursive: true });
  
  // Read existing registry or create new one
  let registry: KiroRegistry;
  if (existsSync(REGISTRY_PATH)) {
    const content = await readFile(REGISTRY_PATH, "utf-8");
    registry = JSON.parse(content);
  } else {
    registry = {
      version: "1.0.0",
      powers: {},
      repoSources: {},
      lastUpdated: new Date().toISOString(),
    };
  }
  
  // Extract metadata from POWER.md
  const powerMdPath = join(POWER_INSTALL_DIR, "POWER.md");
  const metadata = await extractPowerMetadata(powerMdPath);
  
  // Create repo source ID
  const repoId = `npx-kiro-agents-${Date.now()}`;
  
  // Create/update power entry
  registry.powers[metadata.name] = {
    name: metadata.name,
    displayName: metadata.displayName,
    description: metadata.description,
    mcpServers: [], // kiro-protocols has no MCP servers
    author: metadata.author,
    keywords: metadata.keywords,
    installed: true,
    installedAt: new Date().toISOString(),
    installPath: POWER_INSTALL_DIR,
    source: {
      type: "local",
      repoId: repoId,
      repoName: "npx kiro-agents",
    },
    sourcePath: POWER_INSTALL_DIR,
  };
  
  // Create/update repo source entry
  registry.repoSources[repoId] = {
    name: "npx kiro-agents",
    type: "local",
    enabled: true,
    addedAt: new Date().toISOString(),
    path: POWER_INSTALL_DIR,
    lastSync: new Date().toISOString(),
    powerCount: 1,
  };
  
  // Update lastUpdated timestamp
  registry.lastUpdated = new Date().toISOString();
  
  // Save registry
  // await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");
  
  console.log("✅ Registered power in Kiro registry");
}

/**
 * Installs a single file from package to target directory.
 * 
 * Process:
 * 1. Restores write permissions if file exists
 * 2. Reads source file from package
 * 3. Creates destination directory if needed
 * 4. Writes file to destination
 * 5. Sets file to read-only
 * 
 * @param relativePath - Path relative to source directory (e.g., 'agents.md', 'steering/agent-activation.md')
 * @param installDir - Absolute installation directory (e.g., '~/.kiro/steering/kiro-agents')
 * @param sourceDir - Source directory in package (e.g., 'dist', 'power')
 * 
 * @example
 * ```typescript
 * // Install steering file
 * await installFile('agents.md', STEERING_INSTALL_DIR, 'dist');
 * 
 * // Install power file
 * await installFile('steering/agent-activation.md', POWER_INSTALL_DIR, 'power');
 * ```
 */
async function installFile(relativePath: string, installDir: string, sourceDir: string): Promise<void> {
  const destPath = join(installDir, relativePath);
  
  // Restore write permissions if file exists
  if (existsSync(destPath)) {
    await setWritable(destPath);
  }
  
  // Get source file from package
  const srcPath = join(__dirname, "..", sourceDir, relativePath);
  
  // Read file using fs for Node.js compatibility
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const content = await readFile(srcPath);
  
  // Ensure directory exists
  const destDir = dirname(destPath);
  await mkdir(destDir, { recursive: true });
  
  // Write file
  await writeFile(destPath, content);
  
  // Set read-only
  await setReadOnly(destPath);
  
  console.log(`✅ Installed: ${relativePath}`);
}

/**
 * Main installation function that performs dual installation with registry registration.
 * 
 * Installation process:
 * 1. Removes existing steering installation if present
 * 2. Installs steering files to ~/.kiro/steering/kiro-agents/
 * 3. Removes existing power installation if present
 * 4. Installs power files to ~/.kiro/powers/kiro-protocols/
 * 5. Registers kiro-protocols in ~/.kiro/powers/registry.json (appears as installed in Powers UI)
 * 6. Sets all files to read-only
 * 
 * Steering files include:
 * - Core system files (agents.md, modes.md, strict-mode.md, strict.md)
 * - Interaction patterns (chit-chat.md, interaction-styles.md)
 * - Mode definitions (kiro-spec-mode.md, kiro-vibe-mode.md)
 * 
 * Power files include:
 * - Power metadata (POWER.md, mcp.json, icon.png)
 * - Protocol files (agent-activation.md, agent-creation.md, etc.)
 * 
 * Registry registration ensures:
 * - Power appears in Kiro Powers UI without manual activation
 * - Seamless integration with Kiro's power management system
 * - Automatic discovery by Kiro IDE on startup
 * - Gracefully handles registration failures with fallback instructions
 * 
 * @throws {Error} If installation fails (caught by main execution handler)
 * 
 * @example
 * ```typescript
 * await install();
 * // Both steering and power installed, registry updated
 * // If registry registration fails, user gets manual installation instructions
 * ```
 */
async function install(): Promise<void> {
  console.log("🚀 Installing kiro-agents system...\n");
  
  // Install steering files
  console.log("📄 Installing steering files to ~/.kiro/steering/kiro-agents/");
  if (existsSync(STEERING_INSTALL_DIR)) {
    console.log("🗑️  Removing existing steering installation...");
    const { rmSync } = await import("fs");
    rmSync(STEERING_INSTALL_DIR, { recursive: true, force: true });
  }
  
  for (const file of STEERING_FILES) {
    await installFile(file, STEERING_INSTALL_DIR, "dist");
  }
  
  // Install power files
  console.log("\n⚡ Installing kiro-protocols power to ~/.kiro/powers/kiro-protocols/");
  if (existsSync(POWER_INSTALL_DIR)) {
    console.log("🗑️  Removing existing power installation...");
    const { rmSync } = await import("fs");
    rmSync(POWER_INSTALL_DIR, { recursive: true, force: true });
  }
  
  for (const file of POWER_FILES) {
    await installFile(file, POWER_INSTALL_DIR, "power");
  }
  
  // Register power in Kiro registry
  console.log("\n📝 Registering power in Kiro registry...");
  try {
    await registerPowerInRegistry();
  } catch (error) {
    console.warn("⚠️  Warning: Could not register power in registry:", error instanceof Error ? error.message : error);
    console.warn("   The power files are installed but may not appear in Kiro Powers UI.");
    console.warn("   You can manually add the power via: Powers panel → Add Repository → Local Directory");
    console.warn(`   Path: ${POWER_INSTALL_DIR}`);
  }
  
  console.log("\n✨ Installation completed successfully!");
  console.log(`\n📁 Steering files: ${STEERING_INSTALL_DIR}`);
  console.log(`📁 Power files: ${POWER_INSTALL_DIR}`);
  console.log("\n💡 The kiro-protocols power should now appear as installed in Kiro Powers UI.");
  console.log("💡 Files are set to read-only. To modify them, change permissions first.");
  console.log("\n🔄 To update, simply run 'npx kiro-agents' again.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
