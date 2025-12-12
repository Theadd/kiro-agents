#!/usr/bin/env bun
/**
 * Power Validation Script
 * 
 * Validates Kiro Power structure, POWER.md frontmatter, steering files, and icons.
 * Ensures powers meet distribution requirements before committing or releasing.
 * 
 * **Validation checks:**
 * - POWER.md exists with valid YAML frontmatter (name, displayName, description)
 * - steering/ directory contains at least one .md protocol file
 * - Protocol files have reasonable content and structure
 * - Icon files meet size and format requirements
 * 
 * **Exit codes:**
 * - 0: All validations passed
 * - 1: Validation failures detected
 * 
 * @example Validate all powers in powers/ directory
 * ```bash
 * bun run validate:powers
 * # or: bun run scripts/validate-powers.ts
 * ```
 * 
 * @example Validate specific power by name
 * ```bash
 * bun run validate:powers kiro-protocols
 * # or: bun run scripts/validate-powers.ts kiro-protocols
 * ```
 * 
 * @see scripts/build-powers.ts - Power build system
 * @see powers/README.md - Power structure documentation
 */

import { readdirSync, existsSync, readFileSync, statSync } from "fs";
import { join } from "path";

/**
 * Validation result for a single power with errors and warnings.
 */
interface ValidationResult {
  /** Power name (directory name) */
  power: string;
  /** Whether power passed all validation checks (no errors) */
  valid: boolean;
  /** Critical issues that prevent power from working (e.g., missing POWER.md) */
  errors: string[];
  /** Non-critical issues that should be addressed (e.g., missing icon) */
  warnings: string[];
}

/**
 * Validates POWER.md exists with required frontmatter fields.
 * 
 * Checks for YAML frontmatter with name, displayName, description (required)
 * and keywords, author (recommended). Validates name format is lowercase kebab-case.
 * 
 * @param powerPath - Path to power directory (e.g., 'powers/kiro-protocols')
 * @returns Object with errors (critical) and warnings (recommended) arrays
 * 
 * @example
 * ```typescript
 * const result = validatePowerMd('powers/kiro-protocols');
 * // result.errors: ["Missing POWER.md"] or []
 * // result.warnings: ["Missing recommended field: keywords"] or []
 * ```
 */
function validatePowerMd(powerPath: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const powerMdPath = join(powerPath, "POWER.md");
  
  if (!existsSync(powerMdPath)) {
    errors.push("Missing POWER.md");
    return { errors, warnings };
  }
  
  const content = readFileSync(powerMdPath, "utf-8");
  
  // Check frontmatter exists
  if (!content.startsWith("---")) {
    errors.push("POWER.md missing frontmatter");
    return { errors, warnings };
  }
  
  // Extract frontmatter
  const frontmatterEnd = content.indexOf("---", 3);
  if (frontmatterEnd === -1) {
    errors.push("Invalid frontmatter format");
    return { errors, warnings };
  }
  
  const frontmatter = content.slice(3, frontmatterEnd);
  
  // Check required fields
  const requiredFields = [
    { field: "name:", name: "name" },
    { field: "displayName:", name: "displayName" },
    { field: "description:", name: "description" },
  ];
  
  for (const { field, name } of requiredFields) {
    if (!frontmatter.includes(field)) {
      errors.push(`Missing required field: ${name}`);
    }
  }
  
  // Check optional but recommended fields
  const recommendedFields = [
    { field: "keywords:", name: "keywords" },
    { field: "author:", name: "author" },
  ];
  
  for (const { field, name } of recommendedFields) {
    if (!frontmatter.includes(field)) {
      warnings.push(`Missing recommended field: ${name}`);
    }
  }
  
  // Validate name format (lowercase kebab-case)
  const nameMatch = frontmatter.match(/name:\s*"([^"]+)"/);
  if (nameMatch) {
    const name = nameMatch[1];
    if (!/^[a-z0-9-]+$/.test(name ?? "")) {
      errors.push(`Invalid name format: "${name}" (must be lowercase kebab-case)`);
    }
  }
  
  // Check for content after frontmatter
  const bodyContent = content.slice(frontmatterEnd + 3).trim();
  if (bodyContent.length < 100) {
    warnings.push("POWER.md content is very short (< 100 chars)");
  }
  
  return { errors, warnings };
}

/**
 * Validates steering/ directory exists with at least one protocol file.
 * 
 * Checks that steering/ directory contains .md files with reasonable content
 * (not empty, has sections). Protocol files are loaded on-demand by AI agents.
 * 
 * @param powerPath - Path to power directory (e.g., 'powers/kiro-protocols')
 * @returns Object with errors (critical) and warnings (recommended) arrays
 * 
 * @example
 * ```typescript
 * const result = validateSteering('powers/kiro-protocols');
 * // result.errors: ["Missing steering/ directory"] or []
 * // result.warnings: ["Very short protocol file: test.md"] or []
 * ```
 */
function validateSteering(powerPath: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const steeringPath = join(powerPath, "steering");
  
  if (!existsSync(steeringPath)) {
    errors.push("Missing steering/ directory");
    return { errors, warnings };
  }
  
  // Check if directory is empty
  const files = readdirSync(steeringPath).filter(f => f.endsWith(".md"));
  
  if (files.length === 0) {
    errors.push("No protocol files in steering/ directory");
    return { errors, warnings };
  }
  
  // Validate each protocol file
  for (const file of files) {
    const filePath = join(steeringPath, file);
    const content = readFileSync(filePath, "utf-8");
    
    // Check file is not empty
    if (content.trim().length === 0) {
      errors.push(`Empty protocol file: ${file}`);
      continue;
    }
    
    // Check file has reasonable content
    if (content.length < 50) {
      warnings.push(`Very short protocol file: ${file} (< 50 chars)`);
    }
    
    // Check for common protocol structure
    if (!content.includes("##")) {
      warnings.push(`Protocol file missing sections: ${file}`);
    }
  }
  
  return { errors, warnings };
}

/**
 * Validates icon.png file meets size and format requirements.
 * 
 * Checks for icon.png (512x512 recommended) or icon-placeholder.svg. Warns if
 * icon is missing, too large (>1MB), or empty. Icons display in Kiro IDE Powers panel.
 * 
 * @param powerPath - Path to power directory (e.g., 'powers/kiro-protocols')
 * @returns Object with errors (critical) and warnings (recommended) arrays
 * 
 * @example
 * ```typescript
 * const result = validateIcon('powers/kiro-protocols');
 * // result.errors: ["Icon file is empty"] or []
 * // result.warnings: ["Using placeholder icon"] or []
 * ```
 */
function validateIcon(powerPath: string): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const iconPath = join(powerPath, "icon.png");
  const placeholderPath = join(powerPath, "icon-placeholder.svg");
  
  if (!existsSync(iconPath)) {
    if (existsSync(placeholderPath)) {
      warnings.push("Using placeholder icon (create icon.png for production)");
    } else {
      warnings.push("No icon found (icon.png recommended)");
    }
    return { errors, warnings };
  }
  
  // Check icon file size
  const stats = statSync(iconPath);
  if (stats.size === 0) {
    errors.push("Icon file is empty");
  } else if (stats.size > 1024 * 1024) {
    warnings.push(`Icon file is large (${Math.round(stats.size / 1024)}KB, recommend < 100KB)`);
  }
  
  return { errors, warnings };
}

/**
 * Validates a single power by running all validation checks.
 * 
 * Orchestrates validation of POWER.md, steering directory, and icon file.
 * Aggregates all errors and warnings into a single result object.
 * 
 * @param powerName - Power directory name (e.g., 'kiro-protocols')
 * @returns ValidationResult with valid flag, errors, and warnings
 * 
 * @example
 * ```typescript
 * const result = validatePower('kiro-protocols');
 * // result.valid: true if no errors
 * // result.errors: ["Missing POWER.md", "No protocol files"]
 * // result.warnings: ["Missing recommended field: keywords"]
 * ```
 */
function validatePower(powerName: string): ValidationResult {
  const powerPath = join("powers", powerName);
  const result: ValidationResult = {
    power: powerName,
    valid: true,
    errors: [],
    warnings: [],
  };
  
  // Check power directory exists
  if (!existsSync(powerPath)) {
    result.valid = false;
    result.errors.push("Power directory not found");
    return result;
  }
  
  // Validate POWER.md
  const powerMdResult = validatePowerMd(powerPath);
  result.errors.push(...powerMdResult.errors);
  result.warnings.push(...powerMdResult.warnings);
  
  // Validate steering directory
  const steeringResult = validateSteering(powerPath);
  result.errors.push(...steeringResult.errors);
  result.warnings.push(...steeringResult.warnings);
  
  // Validate icon
  const iconResult = validateIcon(powerPath);
  result.errors.push(...iconResult.errors);
  result.warnings.push(...iconResult.warnings);
  
  // Set valid flag
  result.valid = result.errors.length === 0;
  
  return result;
}

/**
 * Discovers all power directories in powers/ directory.
 * 
 * Scans powers/ for subdirectories (excluding node_modules). Each directory
 * should contain a POWER.md file to be considered a valid power.
 * 
 * @returns Array of power directory names (e.g., ['kiro-protocols'])
 * 
 * @example
 * ```typescript
 * const powers = discoverPowers();
 * // powers: ['kiro-protocols', 'another-power']
 * ```
 */
function discoverPowers(): string[] {
  const powersDir = "powers";
  
  if (!existsSync(powersDir)) {
    return [];
  }
  
  return readdirSync(powersDir)
    .filter(name => {
      const path = join(powersDir, name);
      return statSync(path).isDirectory() && name !== "node_modules";
    });
}

/**
 * Prints validation results to console with summary and exits on failure.
 * 
 * Displays each power's validation status with errors and warnings. Shows
 * summary statistics and exits with code 1 if any power has errors.
 * 
 * @param results - Array of validation results from validatePower()
 * 
 * @example Output format
 * ```
 * ✅ kiro-protocols
 *   Warnings:
 *     ⚠️  Missing recommended field: keywords
 * 
 * ❌ broken-power
 *   Errors:
 *     ❌ Missing POWER.md
 * 
 * Summary:
 *   Total powers: 2
 *   Valid: 1
 *   Invalid: 1
 * ```
 */
function printResults(results: ValidationResult[]): void {
  console.log("\n📊 Power Validation Results\n");
  
  let totalErrors = 0;
  let totalWarnings = 0;
  
  for (const result of results) {
    const status = result.valid ? "✅" : "❌";
    console.log(`${status} ${result.power}`);
    
    if (result.errors.length > 0) {
      console.log("  Errors:");
      for (const error of result.errors) {
        console.log(`    ❌ ${error}`);
        totalErrors++;
      }
    }
    
    if (result.warnings.length > 0) {
      console.log("  Warnings:");
      for (const warning of result.warnings) {
        console.log(`    ⚠️  ${warning}`);
        totalWarnings++;
      }
    }
    
    console.log();
  }
  
  // Summary
  const validCount = results.filter(r => r.valid).length;
  const invalidCount = results.length - validCount;
  
  console.log("📈 Summary:");
  console.log(`  Total powers: ${results.length}`);
  console.log(`  Valid: ${validCount}`);
  console.log(`  Invalid: ${invalidCount}`);
  console.log(`  Total errors: ${totalErrors}`);
  console.log(`  Total warnings: ${totalWarnings}`);
  
  if (invalidCount > 0) {
    console.log("\n❌ Validation failed!");
    process.exit(1);
  } else {
    console.log("\n✅ All powers valid!");
  }
}

// Main execution
const args = process.argv.slice(2);
const specificPower = args[0];

console.log("🔍 Validating Kiro Powers...\n");

let powersToValidate: string[];

if (specificPower) {
  powersToValidate = [specificPower];
  console.log(`Validating specific power: ${specificPower}\n`);
} else {
  powersToValidate = discoverPowers();
  console.log(`Discovered ${powersToValidate.length} power(s)\n`);
}

if (powersToValidate.length === 0) {
  console.error("❌ No powers found to validate");
  process.exit(1);
}

const results = powersToValidate.map(validatePower);
printResults(results);
