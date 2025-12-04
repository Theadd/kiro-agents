#!/usr/bin/env node
import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync, chmodSync, constants } from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INSTALL_DIR = join(homedir(), ".kiro", "steering");

// Files to install (relative to dist/ in package)
const FILES_TO_INSTALL = [
  "agent-system.md",
  "modes-system.md",
  "agent-system/strict-mode.md",
  "agent-system/kiro-spec-mode.md",
  "agent-system/kiro-vibe-mode.md",
  "agent-system/interactions/chit-chat.md",
  "agent-system/interactions/interaction-styles.md",
  "agent-system/tools/client-tools.md",
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
  
  // Get source file from package dist/
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
  console.log("📦 Installing kiro-agents to ~/.kiro/steering/\n");
  
  // Install all files
  for (const file of FILES_TO_INSTALL) {
    await installFile(file);
  }
  
  console.log("\n✨ Installation completed successfully!");
  console.log(`\n📁 Files installed to: ${INSTALL_DIR}`);
  console.log("\n💡 Files are set to read-only. To modify them, change permissions first.");
}

// Main execution
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
