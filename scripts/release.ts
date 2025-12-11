#!/usr/bin/env bun
/**
 * Automated release workflow for publishing to npm and GitHub.
 * 
 * Consumes changesets, bumps version, updates CHANGELOG, publishes to npm,
 * and pushes tags to GitHub. Must be run from main branch by maintainers.
 * 
 * **Prerequisites:**
 * - On main/master branch
 * - Changesets exist in `.changeset/` (from merged feature branches)
 * - Logged into npm (`npm login`)
 * - Git remote configured
 * 
 * **Workflow:**
 * 1. Validates branch and changesets
 * 2. Consumes changesets and bumps version
 * 3. Builds package (npm mode without cleanup)
 * 4. Commits version bump
 * 5. Publishes to npm
 * 6. Pushes to GitHub with tags
 * 
 * @example
 * ```bash
 * # Via npm script
 * bun run release
 * 
 * # Via Kiro hook
 * /release
 * 
 * # Direct execution
 * bun run scripts/release.ts
 * ```
 * 
 * **Critical Distinction:** This is for maintainers only. Contributors use
 * `/finalize` to create changesets, maintainers use `/release` to publish.
 * 
 * @see scripts/finalize.ts - For creating changesets from feature branches
 * @see docs/VERSIONING.md - Complete versioning workflow documentation
 */
import { execSync } from "child_process";
import { readFileSync } from "fs";

/**
 * Main release workflow execution.
 * 
 * Orchestrates the complete release process with validation at each step.
 * Exits with code 1 on any failure to prevent partial releases.
 */
async function main() {
  console.log("🚀 Release Process\n");
  
  // Check if on main branch (disable pager for non-interactive execution)
  const branch = execSync("git --no-pager branch --show-current", { encoding: "utf-8" }).trim();
  if (branch !== "main" && branch !== "master") {
    console.error("❌ Release must be run from main branch");
    console.error(`   Current branch: ${branch}`);
    process.exit(1);
  }
  
  // Check if there are changesets to consume
  try {
    const { readdirSync } = await import("fs");
    const changesets = readdirSync(".changeset")
      .filter(f => f.endsWith(".md") && f !== "README.md");
    
    if (changesets.length === 0) {
      console.error("❌ No changesets found");
      console.error("💡 Merge feature branches with changesets first");
      process.exit(1);
    }
    
    console.log(`📦 Found ${changesets.length} changeset(s) to consume\n`);
  } catch {
    console.error("❌ No changesets found");
    console.error("💡 Merge feature branches with changesets first");
    process.exit(1);
  }
  
  // Get current version
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const currentVersion = pkg.version;
  console.log(`📌 Current version: ${currentVersion}\n`);
  
  // Step 1: Version bump + changelog update
  console.log("📝 Step 1: Consuming changesets and updating version...");
  try {
    execSync("bunx changeset version", { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Changeset version failed");
    console.error("💡 Make sure @changesets/cli is installed: bun add -D @changesets/cli");
    process.exit(1);
  }
  
  // Get new version
  const newPkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const newVersion = newPkg.version;
  console.log(`\n✅ Version bumped: ${currentVersion} → ${newVersion}\n`);
  
  // Step 2: Build (without cleanup for npm publish)
  console.log("🔨 Step 2: Building package...");
  try {
    // Build npm package with npm-no-clean mode (preserves artifacts for npm publish)
    execSync("bun run scripts/build.ts npm-no-clean", { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Build failed");
    process.exit(1);
  }
  console.log("✅ Build completed\n");
  
  // Step 3: Commit version bump
  console.log("📝 Step 3: Committing version bump...");
  try {
    execSync("git add .", { stdio: "inherit" });
    execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Commit failed");
    process.exit(1);
  }
  console.log("✅ Version bump committed\n");
  
  // Step 4: Publish to npm
  console.log("📤 Step 4: Publishing to npm...");
  try {
    execSync("bunx changeset publish", { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Publish failed");
    console.error("💡 Make sure you're logged in to npm: npm login");
    process.exit(1);
  }
  console.log("✅ Published to npm\n");
  
  // Step 5: Push to GitHub
  console.log("🚀 Step 5: Pushing to GitHub...");
  try {
    execSync("git push --follow-tags", { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Push failed");
    process.exit(1);
  }
  console.log("✅ Pushed to GitHub\n");
  
  console.log("─".repeat(60));
  console.log(`✨ Release v${newVersion} completed successfully!`);
  console.log("─".repeat(60));
  console.log(`\n📦 Package: https://www.npmjs.com/package/${pkg.name}`);
  console.log(`🏷️  Tag: v${newVersion}`);
  console.log(`\n💡 Verify:`);
  console.log(`   npm view ${pkg.name} version`);
  console.log(`   npx ${pkg.name}@latest`);
}

main();
