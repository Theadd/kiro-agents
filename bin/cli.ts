#!/usr/bin/env node
import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync, chmodSync, constants } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INSTALL_DIR = join(homedir(), ".kiro", "steering", "kiro-agents");

// Files to install (relative to dist/ in package)
const FILES_TO_INSTALL = [
  "agent-system.md",
  "modes-system.md",
  "strict-mode.md",
  "agents.md",
  "modes.md",
  "strict.md",
  "interactions/chit-chat.md",
  "interactions/interaction-styles.md",
  "modes/kiro-spec-mode.md",
  "modes/kiro-vibe-mode.md",
] as const;

async function setWritable(filePath: string): Promise<void> {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {
    // Ignore errors if file doesn't exist
  }
}

async function setReadOnly(filePath: string): Promise<void> {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {
    console.warn(`⚠️  Could not set read-only: ${filePath}`);
  }
}

async function installFile(relativePath: string): Promise<void> {
  const destPath = join(INSTALL_DIR, relativePath);
  
  // Restore write permissions if file exists
  if (existsSync(destPath)) {
    await setWritable(destPath);
  }
  
  // Get source file from package build/npm/dist/
  const srcPath = join(__dirname, "..", "dist", relativePath);
  
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

async function install(): Promise<void> {
  console.log("📦 Installing kiro-agents to ~/.kiro/steering/kiro-agents/\n");
  
  // Remove existing installation if present
  if (existsSync(INSTALL_DIR)) {
    console.log("🗑️  Removing existing installation...\n");
    const { rmSync } = await import("fs");
    rmSync(INSTALL_DIR, { recursive: true, force: true });
  }
  
  // Install all files
  for (const file of FILES_TO_INSTALL) {
    await installFile(file);
  }
  
  console.log("\n✨ Installation completed successfully!");
  console.log(`\n📁 Files installed to: ${INSTALL_DIR}`);
  console.log("\n💡 Files are set to read-only. To modify them, change permissions first.");
  console.log("\n🔄 To update, simply run 'npx kiro-agents' again.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
