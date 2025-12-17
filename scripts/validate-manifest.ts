#!/usr/bin/env bun
/**
 * Manifest Validation Script
 * 
 * Validates the centralized file manifest to ensure consistency across build targets.
 * Catches issues before they cause build failures or dev mode mismatches.
 * 
 * **Validation checks:**
 * - Dev mode files match CLI installation files (no more mismatch!)
 * - All source files referenced in manifest actually exist
 * - No duplicate destination paths (would cause file overwrites)
 * - Glob patterns resolve to at least one file
 * - Power files exist in powers/kiro-protocols/ directory
 * 
 * **Exit codes:**
 * - 0: All validations passed
 * - 1: Validation failures detected
 * 
 * @example Validate manifest
 * ```bash
 * bun run validate:manifest
 * # or: bun run scripts/validate-manifest.ts
 * ```
 */

import { existsSync } from "fs";
import { join } from "path";
import { expandMappings, STEERING_MAPPINGS, POWER_MAPPINGS } from "../src/manifest.ts";

/**
 * Validates that dev mode files match CLI installation files.
 * 
 * This is the critical check that prevents the dev mode mismatch issue.
 * Both `dev` and `cli` targets should produce identical file lists.
 * 
 * **Note:** Protocol files are excluded from both targets - they are distributed
 * through kiro-protocols Power, not as steering files.
 */
async function validateDevMatchesCLI(): Promise<boolean> {
  console.log("🔍 Validating dev mode matches CLI installation...\n");
  
  const devFiles = await expandMappings(STEERING_MAPPINGS, "src", "dev");
  const cliFiles = await expandMappings(STEERING_MAPPINGS, "src", "cli");
  
  const devPaths = devFiles.map(f => f.dest).sort();
  const cliPaths = cliFiles.map(f => f.dest).sort();
  
  if (JSON.stringify(devPaths) !== JSON.stringify(cliPaths)) {
    console.error("❌ Dev mode files don't match CLI installation!\n");
    console.error("Dev files:", devPaths);
    console.error("\nCLI files:", cliPaths);
    
    // Show differences
    const devOnly = devPaths.filter(p => !cliPaths.includes(p));
    const cliOnly = cliPaths.filter(p => !devPaths.includes(p));
    
    if (devOnly.length > 0) {
      console.error("\n📁 Files only in dev mode:", devOnly);
    }
    if (cliOnly.length > 0) {
      console.error("\n📁 Files only in CLI:", cliOnly);
    }
    
    return false;
  }
  
  console.log(`✅ Dev mode matches CLI installation (${devPaths.length} files)\n`);
  return true;
}

/**
 * Validates that all source files referenced in manifest exist.
 * 
 * Checks both steering files (`src/`) and power files (`powers/kiro-protocols/`).
 */
async function validateSourceFilesExist(): Promise<boolean> {
  console.log("🔍 Validating source files exist...\n");
  
  let allExist = true;
  
  // Check steering files
  const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "npm");
  
  for (const mapping of steeringFiles) {
    const srcPath = join("src", mapping.src);
    if (!existsSync(srcPath)) {
      console.error(`❌ Source file not found: ${srcPath}`);
      allExist = false;
    }
  }
  
  // Check power files
  const powerFiles = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "npm");
  
  for (const mapping of powerFiles) {
    const srcPath = join("powers/kiro-protocols", mapping.src);
    if (!existsSync(srcPath)) {
      console.error(`❌ Power file not found: ${srcPath}`);
      allExist = false;
    }
  }
  
  if (allExist) {
    console.log(`✅ All source files exist (${steeringFiles.length + powerFiles.length} files)\n`);
  } else {
    console.error("\n");
  }
  
  return allExist;
}

/**
 * Validates that there are no duplicate destination paths.
 * 
 * Duplicate destinations would cause files to overwrite each other.
 */
async function validateNoDuplicateDestinations(): Promise<boolean> {
  console.log("🔍 Validating no duplicate destinations...\n");
  
  const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "npm");
  const dests = steeringFiles.map(f => f.dest);
  const uniqueDests = new Set(dests);
  
  if (dests.length !== uniqueDests.size) {
    console.error("❌ Duplicate destination paths detected!\n");
    
    // Find duplicates
    const seen = new Set<string>();
    const duplicates = new Set<string>();
    
    for (const dest of dests) {
      if (seen.has(dest)) {
        duplicates.add(dest);
      }
      seen.add(dest);
    }
    
    console.error("Duplicate paths:", Array.from(duplicates));
    return false;
  }
  
  console.log(`✅ No duplicate destinations (${dests.length} unique paths)\n`);
  return true;
}

/**
 * Validates that glob patterns resolve to at least one file.
 * 
 * Empty glob results indicate missing files or incorrect patterns.
 */
async function validateGlobPatternsResolve(): Promise<boolean> {
  console.log("🔍 Validating glob patterns resolve...\n");
  
  let allResolve = true;
  
  // Check steering mappings
  for (const mapping of STEERING_MAPPINGS) {
    if (mapping.src.includes("*")) {
      const expanded = await expandMappings([mapping], "src", "npm");
      
      if (expanded.length === 0) {
        console.error(`❌ Glob pattern resolved to 0 files: ${mapping.src}`);
        allResolve = false;
      } else {
        console.log(`✅ ${mapping.src} → ${expanded.length} files`);
      }
    }
  }
  
  // Check power mappings
  for (const mapping of POWER_MAPPINGS) {
    if (mapping.src.includes("*")) {
      const expanded = await expandMappings([mapping], "powers/kiro-protocols", "npm");
      
      if (expanded.length === 0) {
        console.error(`❌ Glob pattern resolved to 0 files: ${mapping.src}`);
        allResolve = false;
      } else {
        console.log(`✅ ${mapping.src} → ${expanded.length} files`);
      }
    }
  }
  
  console.log();
  return allResolve;
}

/**
 * Validates file counts are reasonable.
 * 
 * Sanity check to catch major issues (e.g., all files missing or glob patterns failing).
 */
async function validateFileCounts(): Promise<boolean> {
  console.log("🔍 Validating file counts...\n");
  
  const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "npm");
  const powerFiles = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "npm");
  
  console.log(`📋 Steering files: ${steeringFiles.length}`);
  console.log(`⚡ Power files: ${powerFiles.length}\n`);
  
  // Sanity checks
  if (steeringFiles.length < 5) {
    console.error("❌ Too few steering files (expected at least 5)");
    return false;
  }
  
  if (powerFiles.length < 3) {
    console.error("❌ Too few power files (expected at least 3)");
    return false;
  }
  
  console.log("✅ File counts are reasonable\n");
  return true;
}

/**
 * Main validation orchestrator.
 * 
 * Runs all validation checks and reports results.
 */
async function validateManifest(): Promise<void> {
  console.log("🧪 Validating file manifest...\n");
  console.log("=".repeat(50) + "\n");
  
  const results = await Promise.all([
    validateDevMatchesCLI(),
    validateSourceFilesExist(),
    validateNoDuplicateDestinations(),
    validateGlobPatternsResolve(),
    validateFileCounts(),
  ]);
  
  console.log("=".repeat(50));
  console.log("\n📊 Validation Summary\n");
  
  const passed = results.filter(r => r).length;
  const failed = results.length - passed;
  
  console.log(`Total checks: ${results.length}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log("\n⚠️  Manifest validation failed!");
    console.log("Fix the issues above before building.\n");
    process.exit(1);
  } else {
    console.log("\n✨ All manifest validations passed!");
    console.log("Manifest is consistent and ready for builds.\n");
    process.exit(0);
  }
}

// Run validation
validateManifest();
