#!/usr/bin/env bun
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

const results: TestResult[] = [];

function test(name: string, passed: boolean, message: string) {
  results.push({ name, passed, message });
  const icon = passed ? "✅" : "❌";
  console.log(`${icon} ${name}: ${message}`);
}

async function testNpmBuild() {
  console.log("\n📦 Testing npm build...\n");
  
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
