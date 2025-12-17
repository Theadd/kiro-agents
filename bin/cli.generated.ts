#!/usr/bin/env node
/**
 * kiro-agents CLI installer
 * 
 * Dual-installation system that installs both steering documents and kiro-protocols power
 * to user's home directory. Automatically registers power in Kiro's registry for immediate use.
 * Removes old installations before installing new versions.
 * 
 * **File Lists Generated from Manifest:**
 * STEERING_FILES and POWER_FILES constants are generated during build from src/manifest.ts
 * to ensure consistency across all build targets (npm, dev, cli).
 * 
 * Installation targets:
 * - Steering: ~/.kiro/steering/kiro-agents/ (core system files)
 * - Power: ~/.kiro/powers/kiro-protocols/ (protocol library power)
 * - Symlinks: ~/.kiro/powers/installed/kiro-protocols/ (points to power files)
 * - Registry: ~/.kiro/powers/registry.json (automatic registration)
 * 
 * The CLI installs power files and registers them in registry.json following Kiro's
 * exact pattern for local power installations. Power appears as "installed" in Powers UI.
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

/** Installation directory for kiro-protocols power (e.g., '~/.kiro/powers/kiro-protocols') */
const POWER_INSTALL_DIR = join(homedir(), ".kiro", "powers", "kiro-protocols");

/**
 * Installation directory for Kiro's installed power symlinks (e.g., '~/.kiro/powers/installed/kiro-protocols').
 * 
 * Kiro IDE expects installed powers to have symlinks in this directory pointing to the actual
 * power files in POWER_INSTALL_DIR. The CLI creates these symlinks during installation to match
 * Kiro's pattern for local power installations.
 * 
 * @see createSymbolicLinks - Creates symlinks in this directory
 * @see registerPowerInRegistry - Registers this path as installPath in registry
 */
const POWER_INSTALLED_DIR = join(homedir(), ".kiro", "powers", "installed", "kiro-protocols");

/** Kiro powers registry file path (e.g., '~/.kiro/powers/registry.json') */
const REGISTRY_PATH = join(homedir(), ".kiro", "powers", "registry.json");

/**
 * Steering files to install from dist/ directory in package.
 * 
 * **GENERATED FROM MANIFEST** - Populated during build from src/manifest.ts by expanding
 * STEERING_MAPPINGS with glob patterns. Ensures consistency across all build targets.
 * 
 * Core system files providing foundational kiro-agents functionality:
 * - Instruction aliases (aliases.md)
 * - Agent management (agents.md, protocols/agent-*.md)
 * - Mode switching (modes.md, modes/*.md, protocols/mode-*.md)
 * - Strict mode control (strict.md, protocols/strict-mode.md)
 * - Interaction patterns (interactions/*.md)
 * 
 * Installed to `~/.kiro/steering/kiro-agents/` and loaded automatically by Kiro IDE.
 * 
 * @see src/manifest.ts - STEERING_MAPPINGS source of truth
 * @see getSteeringFilesForCLI - Function that generates this list
 */
const STEERING_FILES = [
  "aliases.md",
  "protocols/strict-mode.md",
  "protocols/agent-management.md",
  "protocols/agent-creation.md",
  "protocols/agent-activation.md",
  "protocols/mode-switching.md",
  "protocols/mode-management.md",
  "agents.md",
  "modes.md",
  "strict.md",
  "interactions/interaction-styles.md",
  "interactions/conversation-language.md",
  "interactions/chit-chat.md",
  "modes/kiro-vibe-mode.md",
  "modes/kiro-spec-mode.md"
] as const;

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
const POWER_FILES = [
  "POWER.md",
  "mcp.json",
  "icon.png",
  "steering/strict-mode.md",
  "steering/mode-switching.md",
  "steering/mode-management.md",
  "steering/agent-management.md",
  "steering/agent-creation.md",
  "steering/agent-activation.md"
] as const;

/**
 * Power metadata extracted from POWER.md frontmatter for registry registration.
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
 * Kiro registry structure for tracking installed powers.
 * 
 * Located at `~/.kiro/powers/registry.json`, maintains state of all powers
 * installed in Kiro IDE for Powers UI integration.
 * 
 * @property version - Registry format version (e.g., '1.0.0')
 * @property powers - Map of power name to power entry
 * @property repoSources - Map of repo ID to repository source
 * @property lastUpdated - ISO timestamp of last registry modification
 */
interface KiroRegistry {
  version: string;
  powers: Record<string, PowerEntry>;
  repoSources: Record<string, RepoSource>;
  lastUpdated: string;
}

/**
 * Power entry in the registry representing an installed or available power.
 * 
 * @property name - Power identifier
 * @property displayName - Human-readable name
 * @property description - Power capabilities description
 * @property mcpServers - MCP server names provided by power (empty for kiro-protocols)
 * @property author - Power author/maintainer
 * @property keywords - Search terms for discovery
 * @property installed - Whether power is currently installed
 * @property installedAt - ISO timestamp of installation (if installed)
 * @property installPath - Path to symlink directory in installed/ (if installed)
 * @property source - Repository source information
 * @property sourcePath - Path to actual power directory (if installed)
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
 * Repository source entry tracking power source locations.
 * 
 * @property name - Repository display name (full path for local repos)
 * @property type - Source type ('local' for filesystem, 'git' for remote)
 * @property enabled - Whether source is active for power discovery
 * @property addedAt - ISO timestamp when source was added
 * @property path - Filesystem path to repository
 * @property lastSync - ISO timestamp of last synchronization
 * @property powerCount - Number of powers available from this source
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
 * Creates symbolic links in installed/ directory pointing to power files.
 * 
 * Kiro IDE expects installed powers to be in ~/.kiro/powers/installed/{power-name}/
 * with symbolic links pointing to the actual files in ~/.kiro/powers/{power-name}/.
 * 
 * Process:
 * 1. Removes existing installed directory if present
 * 2. Creates new installed directory
 * 3. Creates symbolic links for each file and directory in power directory
 * 
 * Platform-specific behavior:
 * - Windows: Uses junction for directories, symlink for files
 * - Unix: Uses symbolic links for both files and directories
 * 
 * @throws {Error} If symbolic link creation fails
 * 
 * @example
 * ```typescript
 * await createSymbolicLinks();
 * // Creates ~/.kiro/powers/installed/kiro-protocols/ with symlinks to:
 * // - POWER.md -> ../../kiro-protocols/POWER.md
 * // - mcp.json -> ../../kiro-protocols/mcp.json
 * // - icon.png -> ../../kiro-protocols/icon.png
 * // - steering/ -> ../../kiro-protocols/steering/
 * ```
 */
async function createSymbolicLinks(): Promise<void> {
  const { readdir, mkdir, symlink, rm, stat } = await import("fs/promises");
  const { platform } = await import("os");
  
  // Remove existing installed directory
  if (existsSync(POWER_INSTALLED_DIR)) {
    await rm(POWER_INSTALLED_DIR, { recursive: true, force: true });
  }
  
  // Create installed directory
  await mkdir(POWER_INSTALLED_DIR, { recursive: true });
  
  // Get all files and directories in power directory
  const entries = await readdir(POWER_INSTALL_DIR);
  
  // Create symbolic links for each entry
  for (const entry of entries) {
    const sourcePath = join(POWER_INSTALL_DIR, entry);
    const targetPath = join(POWER_INSTALLED_DIR, entry);
    
    try {
      // Check if entry is directory
      const stats = await stat(sourcePath);
      const isDirectory = stats.isDirectory();
      
      // Windows requires different link types
      if (platform() === "win32") {
        // Use junction for directories, symlink for files
        await symlink(sourcePath, targetPath, isDirectory ? "junction" : "file");
      } else {
        // Unix uses symlink for both
        await symlink(sourcePath, targetPath);
      }
      
      console.log(`✅ Linked: ${entry}`);
    } catch (error) {
      console.warn(`⚠️  Could not link ${entry}:`, error instanceof Error ? error.message : error);
    }
  }
}

/**
 * Registers the kiro-protocols power in Kiro's registry.json.
 * 
 * Follows the exact pattern used by Kiro IDE for local power installations.
 * The power is registered with a stable repoId and proper paths to ensure
 * it appears as "installed" in Kiro's Powers UI.
 * 
 * Process:
 * 1. Ensures registry directory exists (~/.kiro/powers/)
 * 2. Reads existing registry or creates new one
 * 3. Extracts power metadata from POWER.md frontmatter
 * 4. Creates/updates power entry with installation info
 * 5. Creates/updates local repo source entry
 * 6. Saves updated registry with timestamp
 * 
 * Registry structure follows Kiro's pattern:
 * - Power entry uses installPath pointing to installed/ directory
 * - Power entry uses sourcePath pointing to actual power directory
 * - Repo source uses stable ID "local-kiro-protocols" (no timestamp)
 * - Source type is "repo" (not "local") for proper UI integration
 * 
 * @throws {Error} If POWER.md is missing or has invalid frontmatter
 * 
 * @example
 * ```typescript
 * await registerPowerInRegistry();
 * // Power registered in registry.json
 * // Appears as installed in Kiro Powers UI
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
  
  // Use stable repo ID (matches Kiro's pattern for local powers)
  const repoId = "local-kiro-protocols";
  
  // Create/update power entry (following Kiro's exact pattern)
  registry.powers[metadata.name] = {
    name: metadata.name,
    displayName: metadata.displayName,
    description: metadata.description,
    mcpServers: [], // kiro-protocols has no MCP servers
    author: metadata.author,
    keywords: metadata.keywords,
    installed: true,
    installedAt: new Date().toISOString(),
    installPath: POWER_INSTALLED_DIR, // Points to installed/ directory with symlinks
    source: {
      type: "repo", // Changed from "local" to match Kiro's pattern
      repoId: repoId,
      repoName: POWER_INSTALL_DIR, // Full path to actual power directory
    },
    sourcePath: POWER_INSTALL_DIR, // Points to actual power directory
  };
  
  // Create/update repo source entry (following Kiro's exact pattern)
  registry.repoSources[repoId] = {
    name: POWER_INSTALL_DIR, // Full path as name
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
  await writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");
  
  console.log("✅ Power registered in Kiro registry");
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
 * Main installation function that performs dual installation with automatic registration.
 * 
 * Installation process:
 * 1. Removes existing steering installation if present
 * 2. Installs steering files to ~/.kiro/steering/kiro-agents/
 * 3. Removes existing power installation if present
 * 4. Installs power files to ~/.kiro/powers/kiro-protocols/
 * 5. Creates symbolic links in ~/.kiro/powers/installed/kiro-protocols/
 * 6. Registers kiro-protocols in ~/.kiro/powers/registry.json
 * 7. Sets all files to read-only
 * 
 * Steering files include core system files that provide foundational kiro-agents
 * functionality including instruction aliases, agent management, mode switching,
 * strict mode control, and interaction patterns.
 * 
 * Power files include:
 * - Power metadata (POWER.md, mcp.json, icon.png)
 * - Protocol files (agent-activation.md, agent-creation.md, etc.)
 * 
 * Registry registration follows Kiro's exact pattern:
 * - Stable repoId: "local-kiro-protocols"
 * - installPath points to symlink directory
 * - sourcePath points to actual power directory
 * - Power appears as "installed" in Powers UI
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
  
  // Create symbolic links in installed/ directory
  console.log("\n🔗 Creating symbolic links in installed/ directory...");
  try {
    await createSymbolicLinks();
  } catch (error) {
    console.warn("⚠️  Warning: Could not create symbolic links:", error instanceof Error ? error.message : error);
    console.warn("   Power may not appear correctly in Kiro Powers UI.");
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
  console.log(`📁 Installed links: ${POWER_INSTALLED_DIR}`);
  console.log("\n💡 The kiro-protocols power should now appear as installed in Kiro Powers UI.");
  console.log("💡 Files are set to read-only. To modify them, change permissions first.");
  console.log("\n🔄 To update, simply run 'npx kiro-agents' again.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
