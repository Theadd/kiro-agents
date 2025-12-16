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
 * Main installation function that performs dual installation.
 * 
 * Installation process:
 * 1. Removes existing steering installation if present
 * 2. Installs steering files to ~/.kiro/steering/kiro-agents/
 * 3. Removes existing power installation if present
 * 4. Installs power files to ~/.kiro/powers/kiro-protocols/
 * 5. Sets all files to read-only
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
 * @throws {Error} If installation fails (caught by main execution handler)
 * 
 * @example
 * ```typescript
 * await install();
 * // Both steering and power installed successfully
 * ```
 */
async function install(): Promise<void> {
  console.log("� Installinng kiro-agents system...\n");
  
  // Install steering files
  console.log("� InTstalling steering files to ~/.kiro/steering/kiro-agents/");
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
  
  console.log("\n✨ Installation completed successfully!");
  console.log(`\n📁 Steering files: ${STEERING_INSTALL_DIR}`);
  console.log(`📁 Power files: ${POWER_INSTALL_DIR}`);
  console.log("\n💡 Files are set to read-only. To modify them, change permissions first.");
  console.log("\n🔄 To update, simply run 'npx kiro-agents' again.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
