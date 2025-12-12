#!/usr/bin/env bun
/**
 * Build validation test suite for kiro-agents package.
 * 
 * Validates npm and Power distributions by checking file existence, substitution
 * processing, frontmatter validity, and structural integrity. Automatically builds
 * npm distribution in no-clean mode to preserve artifacts for inspection.
 * 
 * **Test Coverage:**
 * - npm build: CLI compilation, file mappings, substitution processing
 * - Power build: POWER.md structure, mcp.json validity, steering frontmatter
 * - Dev mode: Optional check for user directory installation
 * 
 * **Usage:**
 * ```bash
 * bun run test
 * # Builds npm distribution, validates both npm and Power builds
 * ```
 * 
 * **Exit Codes:**
 * - 0: All tests passed
 * - 1: Build failed or tests failed
 * 
 * @see scripts/build.ts - Build system that creates artifacts tested here
 */
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";
import { spawnSync } from "bun";

/**
 * Test result record for validation tracking.
 * 
 * @property name - Test name displayed in output (e.g., 'CLI compiled')
 * @property passed - Whether test passed validation
 * @property message - Detailed result message (e.g., 'All 8 files present')
 */
interface TestResult {
  /** Test name displayed in output (e.g., 'CLI compiled') */
  name: string;
  /** Whether test passed validation */
  passed: boolean;
  /** Detailed result message (e.g., 'All 8 files present') */
  message: string;
}

/** Global test results accumulator for summary reporting */
const results: TestResult[] = [];

/**
 * Records test result and logs formatted output.
 * 
 * Adds result to global results array and prints formatted line with icon.
 * Used by all test functions to maintain consistent reporting.
 * 
 * @param name - Test name (e.g., 'CLI compiled')
 * @param passed - Whether test passed
 * @param message - Result details (e.g., 'CLI found at build/npm/bin/cli.js')
 * 
 * @example
 * ```typescript
 * test('CLI compiled', true, 'CLI found at build/npm/bin/cli.js');
 * // Logs: ✅ CLI compiled: CLI found at build/npm/bin/cli.js
 * ```
 */
function test(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${name}: ${message}`);
}

/**
 * Validates npm distribution build artifacts.
 * 
 * Automatically builds npm distribution in no-clean mode (preserves artifacts),
 * then validates CLI compilation, file mappings, and substitution processing.
 * Skips validation if build fails.
 * 
 * **Validation Steps:**
 * 1. Build npm distribution with `npm-no-clean` target
 * 2. Check CLI exists at `build/npm/bin/cli.js`
 * 3. Verify all expected dist files present
 * 4. Scan for unprocessed substitutions (e.g., `{{{VERSION}}}`)
 * 
 * **Expected Files:**
 * - CLI: `build/npm/bin/cli.js`
 * - Steering: `build/npm/dist/*.md`
 * - Protocols: `build/npm/dist/protocols/*.md`
 * - Interactions: `build/npm/dist/interactions/*.md`
 * - Modes: `build/npm/dist/modes/*.md`
 * 
 * @example
 * ```typescript
 * await testNpmBuild();
 * // Builds npm distribution, validates CLI and files
 * ```
 * 
 * @see scripts/build.ts - Build system with npm-no-clean target
 */
async function testNpmBuild() {
  console.log("\n📦 Testing npm build...\n");
  
  // Build with npm-no-clean to preserve artifacts for testing
  console.log("🔨 Building npm distribution (no-clean mode)...\n");
  const buildResult = spawnSync(["bun", "run", "scripts/build.ts", "npm-no-clean"]);
  
  if (buildResult.exitCode !== 0) {
    console.log("❌ Build failed, skipping npm tests\n");
    test("npm build", false, "Build process failed");
    return;
  }
  
  console.log("✅ Build completed\n");
  
  // Check CLI exists
  const cliPath = "build/npm/bin/cli.js";
  test(
    "CLI compiled",
    existsSync(cliPath),
    existsSync(cliPath) ? "CLI found at build/npm/bin/cli.js" : "CLI not found"
  );
  
  // Check dist files exist
  const distFiles = [
    "build/npm/dist/strict-mode.md",
    "build/npm/dist/agents.md",
    "build/npm/dist/modes.md",
    "build/npm/dist/strict.md",
    "build/npm/dist/interactions/chit-chat.md",
    "build/npm/dist/interactions/interaction-styles.md",
    "build/npm/dist/modes/kiro-spec-mode.md",
    "build/npm/dist/modes/kiro-vibe-mode.md",
  ];
  
  let missingFiles = 0;
  for (const file of distFiles) {
    if (!existsSync(file)) {
      missingFiles++;
      console.log(`   ⚠️  Missing: ${file}`);
    }
  }
  
  test(
    "npm dist files",
    missingFiles === 0,
    missingFiles === 0 
      ? `All ${distFiles.length} files present` 
      : `${missingFiles} files missing`
  );
  
  // Check for unprocessed substitutions in npm files
  let unprocessedCount = 0;
  for (const file of distFiles) {
    if (existsSync(file)) {
      const content = await Bun.file(file).text();
      if (content.includes("{{{") && content.includes("}}}")) {
        unprocessedCount++;
        console.log(`   ⚠️  Unprocessed substitutions in: ${file}`);
      }
    }
  }
  
  test(
    "npm substitutions applied",
    unprocessedCount === 0,
    unprocessedCount === 0
      ? "All substitutions processed"
      : `${unprocessedCount} files with unprocessed substitutions`
  );
}

/**
 * Validates Kiro Power distribution artifacts.
 * 
 * Checks Power-specific files including POWER.md frontmatter, mcp.json validity,
 * steering file structure, and frontmatter completeness. Assumes Power build
 * already exists (run `bun run build:power` first).
 * 
 * **Validation Steps:**
 * 1. Check POWER.md exists and has valid frontmatter
 * 2. Verify mcp.json is valid JSON
 * 3. Validate all steering files present
 * 4. Check for unprocessed substitutions
 * 5. Verify frontmatter in all steering files
 * 
 * **Expected Structure:**
 * - `power/POWER.md` - Power metadata with frontmatter
 * - `power/mcp.json` - Valid JSON structure
 * - `power/steering/*.md` - Steering files with frontmatter
 * - `power/steering/protocols/*.md` - Protocol files
 * 
 * @example
 * ```typescript
 * await testPowerBuild();
 * // Validates power/ directory structure and content
 * ```
 */
async function testPowerBuild() {
  console.log("\n⚡ Testing Power build...\n");
  
  // Check POWER.md exists
  const powerMdPath = "power/POWER.md";
  test(
    "POWER.md exists",
    existsSync(powerMdPath),
    existsSync(powerMdPath) ? "POWER.md found" : "POWER.md not found"
  );
  
  // Check mcp.json exists and is valid JSON
  const mcpJsonPath = "power/mcp.json";
  let mcpValid = false;
  if (existsSync(mcpJsonPath)) {
    try {
      const content = await Bun.file(mcpJsonPath).text();
      JSON.parse(content);
      mcpValid = true;
    } catch (e) {
      mcpValid = false;
    }
  }
  
  test(
    "mcp.json valid",
    mcpValid,
    mcpValid ? "mcp.json is valid JSON" : "mcp.json invalid or missing"
  );
  
  // Check steering files exist
  const steeringFiles = [
    "power/steering/agents.md",
    "power/steering/modes.md",
    "power/steering/strict-mode.md",
    "power/steering/strict.md",
    "power/steering/interactions/chit-chat.md",
    "power/steering/interactions/interaction-styles.md",
    "power/steering/modes/kiro-spec-mode.md",
    "power/steering/modes/kiro-vibe-mode.md",
  ];
  
  let missingFiles = 0;
  for (const file of steeringFiles) {
    if (!existsSync(file)) {
      missingFiles++;
      console.log(`   ⚠️  Missing: ${file}`);
    }
  }
  
  test(
    "Power steering files",
    missingFiles === 0,
    missingFiles === 0
      ? `All ${steeringFiles.length} files present`
      : `${missingFiles} files missing`
  );
  
  // Check for unprocessed substitutions in POWER.md
  if (existsSync(powerMdPath)) {
    const content = await Bun.file(powerMdPath).text();
    const hasUnprocessed = content.includes("{{{") && content.includes("}}}");
    
    test(
      "POWER.md substitutions",
      !hasUnprocessed,
      hasUnprocessed
        ? "Unprocessed substitutions found"
        : "All substitutions processed"
    );
    
    // Check POWER.md has required frontmatter
    const hasFrontmatter = content.startsWith("---");
    const hasName = content.includes('name: "kiro-agents"');
    const hasKeywords = content.includes("keywords:");
    
    test(
      "POWER.md frontmatter",
      hasFrontmatter && hasName && hasKeywords,
      hasFrontmatter && hasName && hasKeywords
        ? "Frontmatter complete"
        : "Frontmatter incomplete"
    );
  }
  
  // Check frontmatter in steering files
  let invalidFrontmatter = 0;
  for (const file of steeringFiles) {
    if (existsSync(file)) {
      const content = await Bun.file(file).text();
      if (!content.startsWith("---")) {
        invalidFrontmatter++;
        console.log(`   ⚠️  Missing frontmatter: ${file}`);
      } else if (!content.includes("inclusion:")) {
        invalidFrontmatter++;
        console.log(`   ⚠️  Missing inclusion field: ${file}`);
      }
    }
  }
  
  test(
    "Steering frontmatter",
    invalidFrontmatter === 0,
    invalidFrontmatter === 0
      ? "All steering files have valid frontmatter"
      : `${invalidFrontmatter} files with invalid frontmatter`
  );
}

/**
 * Validates dev mode installation in user directory (optional check).
 * 
 * Checks if dev mode has been run by looking for files in user's Kiro directory.
 * This is an optional test - passes even if directory doesn't exist (user may
 * not have run `bun run dev` yet).
 * 
 * **Validation:**
 * - Checks `~/.kiro/steering/kiro-agents/` exists
 * - Counts files if directory present
 * - Always passes (informational only)
 * 
 * @example
 * ```typescript
 * await testDevMode();
 * // Checks ~/.kiro/steering/kiro-agents/ if exists
 * ```
 */
async function testDevMode() {
  console.log("\n🔧 Testing dev mode (optional)...\n");
  
  const { homedir } = await import("os");
  const devPath = join(homedir(), ".kiro", "steering", "kiro-agents");
  
  if (existsSync(devPath)) {
    test(
      "Dev directory exists",
      true,
      "Dev mode directory found in user home"
    );
    
    const files = await readdir(devPath, { recursive: true });
    test(
      "Dev files present",
      files.length > 0,
      `${files.length} files in dev directory`
    );
  } else {
    test(
      "Dev directory (optional)",
      true,
      "Not found (run 'bun run dev' to create)"
    );
  }
}

/**
 * Main test orchestrator and summary reporter.
 * 
 * Executes all test suites (npm, Power, dev), collects results, and prints
 * summary. Exits with code 1 if any tests fail, 0 if all pass.
 * 
 * **Test Flow:**
 * 1. Check if any build exists (build/ or power/)
 * 2. Run npm build tests (builds automatically)
 * 3. Run Power build tests (assumes already built)
 * 4. Run dev mode tests (optional)
 * 5. Print summary with pass/fail counts
 * 6. Exit with appropriate code
 * 
 * **Exit Codes:**
 * - 0: All tests passed
 * - 1: No build found or tests failed
 * 
 * @example
 * ```typescript
 * await runTests();
 * // Runs all tests, prints summary, exits with status code
 * ```
 */
async function runTests() {
  console.log("🧪 Running build validation tests...\n");
  
  // Check if build exists
  if (!existsSync("build") && !existsSync("power")) {
    console.log("❌ No build found. Run 'bun run build' first.\n");
    process.exit(1);
  }
  
  // Run tests
  await testNpmBuild();
  await testPowerBuild();
  await testDevMode();
  
  // Summary
  console.log("\n" + "=".repeat(50));
  console.log("📊 Test Summary\n");
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  const total = results.length;
  
  console.log(`Total: ${total}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  
  if (failed > 0) {
    console.log("\n⚠️  Some tests failed. Review the output above.");
    process.exit(1);
  } else {
    console.log("\n✨ All tests passed!");
    process.exit(0);
  }
}

// Run tests
runTests();
