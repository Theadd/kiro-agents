#!/usr/bin/env bun
import { rmSync, existsSync } from "fs";

console.log("🧹 Cleaning build artifacts...\n");

const dirsToClean = [
  "build",
  "power",
];

for (const dir of dirsToClean) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`✅ Removed: ${dir}/`);
  } else {
    console.log(`⏭️  Skipped: ${dir}/ (doesn't exist)`);
  }
}

console.log("\n✨ Clean completed!");
