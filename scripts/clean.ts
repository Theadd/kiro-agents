#!/usr/bin/env bun
import { rmSync, existsSync } from "fs";

const DIRS_TO_CLEAN = ["dist"];

console.log("🧹 Cleaning build directories...\n");

for (const dir of DIRS_TO_CLEAN) {
  if (existsSync(dir)) {
    rmSync(dir, { recursive: true, force: true });
    console.log(`✅ Removed: ${dir}/`);
  } else {
    console.log(`⏭️  Skipped: ${dir}/ (doesn't exist)`);
  }
}

console.log("\n✨ Clean completed!");
