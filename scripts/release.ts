#!/usr/bin/env bun
import { execSync } from "child_process";
import { readFileSync } from "fs";

async function main() {
  console.log("🚀 Release Process\n");
  
  // Check if on main branch
  const branch = execSync("git branch --show-current", { encoding: "utf-8" }).trim();
  if (branch !== "main" && branch !== "master") {
    console.error("❌ Release must be run from main branch");
    console.error(`   Current branch: ${branch}`);
    process.exit(1);
  }
  
  // Check if there are changesets to consume
  try {
    const changesets = execSync("ls .changeset/*.md 2>/dev/null | grep -v README", { encoding: "utf-8" }).trim();
    if (!changesets) {
      console.error("❌ No changesets found");
      console.error("💡 Merge feature branches with changesets first");
      process.exit(1);
    }
    
    const changesetCount = changesets.split("\n").length;
    console.log(`📦 Found ${changesetCount} changeset(s) to consume\n`);
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
    execSync("changeset version", { stdio: "inherit" });
  } catch (error) {
    console.error("\n❌ Changeset version failed");
    console.error("💡 Make sure @changesets/cli is installed: bun add -D @changesets/cli");
    process.exit(1);
  }
  
  // Get new version
  const newPkg = JSON.parse(readFileSync("package.json", "utf-8"));
  const newVersion = newPkg.version;
  console.log(`\n✅ Version bumped: ${currentVersion} → ${newVersion}\n`);
  
  // Step 2: Build
  console.log("🔨 Step 2: Building package...");
  try {
    execSync("bun run build", { stdio: "inherit" });
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
    execSync("changeset publish", { stdio: "inherit" });
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
