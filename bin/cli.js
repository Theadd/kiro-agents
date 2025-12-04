#!/usr/bin/env node
import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// bin/cli.ts
import { join, dirname } from "path";
import { homedir } from "os";
import { existsSync, chmodSync, constants } from "fs";
import { fileURLToPath } from "url";
var __filename2 = fileURLToPath(import.meta.url);
var __dirname2 = dirname(__filename2);
var INSTALL_DIR = join(homedir(), ".kiro", "steering");
var FILES_TO_INSTALL = [
  "agent-system.md",
  "modes-system.md",
  "agent-system/strict-mode.md",
  "agent-system/kiro-spec-mode.md",
  "agent-system/kiro-vibe-mode.md",
  "agent-system/interactions/chit-chat.md",
  "agent-system/interactions/interaction-styles.md",
  "agent-system/tools/client-tools.md"
];
async function setWritable(filePath) {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {}
}
async function setReadOnly(filePath) {
  try {
    chmodSync(filePath, constants.S_IRUSR | constants.S_IRGRP | constants.S_IROTH);
  } catch (error) {
    console.warn(`⚠️  Could not set read-only: ${filePath}`);
  }
}
async function installFile(relativePath) {
  const destPath = join(INSTALL_DIR, relativePath);
  if (existsSync(destPath)) {
    await setWritable(destPath);
  }
  const srcPath = join(__dirname2, "..", "dist", relativePath);
  const { readFile, writeFile, mkdir } = await import("fs/promises");
  const content = await readFile(srcPath);
  const destDir = dirname(destPath);
  await mkdir(destDir, { recursive: true });
  await writeFile(destPath, content);
  await setReadOnly(destPath);
  console.log(`✅ Installed: ${relativePath}`);
}
async function install() {
  console.log(`\uD83D\uDCE6 Installing kiro-agents to ~/.kiro/steering/
`);
  for (const file of FILES_TO_INSTALL) {
    await installFile(file);
  }
  console.log(`
✨ Installation completed successfully!`);
  console.log(`
\uD83D\uDCC1 Files installed to: ${INSTALL_DIR}`);
  console.log(`
\uD83D\uDCA1 Files are set to read-only. To modify them, change permissions first.`);
}
install().catch((error) => {
  console.error("❌ Installation failed:", error);
  process.exit(1);
});
