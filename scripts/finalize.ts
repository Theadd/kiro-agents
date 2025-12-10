#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

interface SessionSnapshot {
  id: string;
  timestamp: string;
  branch: string;
  commits: string[];
  purpose: string;
  changes: {
    added: string[];
    modified: string[];
    removed: string[];
    attempted: string[];
  };
  findings: string[];
  limitations: string[];
  decisions: string[];
  filesChanged: string[];
  linesAdded: number;
  linesRemoved: number;
}

interface FinalAnalysis {
  type: "major" | "minor" | "patch";
  summary: string;
  description: string;
  details: {
    added: string[];
    changed: string[];
    fixed: string[];
    removed: string[];
  };
  findings: string[];
  decisions: string[];
}

function loadSnapshots(): SessionSnapshot[] {
  const snapshotsDir = ".changeset/snapshots";
  const files = readdirSync(snapshotsDir).filter(f => f.endsWith(".json"));
  
  return files.map(file => {
    const content = readFileSync(join(snapshotsDir, file), "utf-8");
    return JSON.parse(content) as SessionSnapshot;
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function getSquashedCommit(): { message: string; diff: string; files: string[] } {
  // Get the final state vs main
  const diff = execSync("git diff main...HEAD", { encoding: "utf-8" });
  const files = execSync("git diff --name-only main...HEAD", { encoding: "utf-8" })
    .trim()
    .split("\n")
    .filter(Boolean);
  
  // Get all commit messages (will be squashed)
  const messages = execSync("git log main..HEAD --format=%B", { encoding: "utf-8" });
  
  return { message: messages, diff, files };
}

function displayAIPrompt(snapshots: SessionSnapshot[], finalCommit: ReturnType<typeof getSquashedCommit>): void {
  console.log("🤖 AI Agent: Please analyze and provide changeset content\n");
  
  const prompt = `
📋 AI Analysis Required
${"─".repeat(60)}

**Session Snapshots (${snapshots.length} sessions):**
${JSON.stringify(snapshots, null, 2)}

**Final Commit:**
Files changed: ${finalCommit.files.join(", ")}

Diff (truncated):
${finalCommit.diff.slice(0, 3000)}

**Instructions:**
1. Compare snapshots with final commit
2. Identify what from snapshots is present in final commit
3. Ignore temporary/removed changes that didn't make it to final
4. Determine semantic version type:
   - **major**: Breaking changes, API changes, architectural changes
   - **minor**: New features, new capabilities, backwards-compatible additions
   - **patch**: Bug fixes, documentation, refactoring, minor improvements
5. Write user-facing changelog entry (not technical implementation details)
6. Update the changeset file in .changeset/ (replace all TODO placeholders)
7. Run: bun run finalize:commit

**Changeset Format:**
---
"kiro-agents": major|minor|patch
---

# One-line summary

Detailed description (2-3 sentences)

## Added
- User-facing feature X

## Changed
- Behavior Y now does Z

## Fixed
- Bug W no longer occurs

## Removed
- Deprecated feature V

${"─".repeat(60)}
`;

  console.log(prompt);
}

function createPlaceholderAnalysis(): FinalAnalysis {
  return {
    type: "minor",
    summary: "TODO: AI agent should provide summary",
    description: "TODO: AI agent should provide description",
    details: {
      added: ["TODO: AI agent should list additions"],
      changed: ["TODO: AI agent should list changes"],
      fixed: ["TODO: AI agent should list fixes"],
      removed: ["TODO: AI agent should list removals"]
    },
    findings: ["TODO: AI agent should list findings"],
    decisions: ["TODO: AI agent should list decisions"]
  };
}

function createChangeset(analysis: FinalAnalysis): string {
  let changesetContent = `---
"${getPackageName()}": ${analysis.type}
---

# ${analysis.summary}

${analysis.description}

`;

  // Add details
  if (analysis.details.added.length) {
    changesetContent += `## Added\n${analysis.details.added.map(i => `- ${i}`).join("\n")}\n\n`;
  }
  if (analysis.details.changed.length) {
    changesetContent += `## Changed\n${analysis.details.changed.map(i => `- ${i}`).join("\n")}\n\n`;
  }
  if (analysis.details.fixed.length) {
    changesetContent += `## Fixed\n${analysis.details.fixed.map(i => `- ${i}`).join("\n")}\n\n`;
  }
  if (analysis.details.removed.length) {
    changesetContent += `## Removed\n${analysis.details.removed.map(i => `- ${i}`).join("\n")}\n\n`;
  }
  
  // Add findings and decisions if they exist
  if (analysis.findings.length && !analysis.findings[0]!.startsWith("TODO")) {
    changesetContent += `## Key Findings\n${analysis.findings.map(f => `- ${f}`).join("\n")}\n\n`;
  }
  if (analysis.decisions.length && !analysis.decisions[0]!.startsWith("TODO")) {
    changesetContent += `## Design Decisions\n${analysis.decisions.map(d => `- ${d}`).join("\n")}\n\n`;
  }
  
  const filename = `.changeset/${generateId()}.md`;
  writeFileSync(filename, changesetContent);
  
  console.log(`✅ Changeset created: ${filename}`);
  console.log("\n📝 Content:");
  console.log("─".repeat(60));
  console.log(changesetContent);
  console.log("─".repeat(60));
  
  return filename;
}

function cleanupSnapshots(): void {
  const snapshotsDir = ".changeset/snapshots";
  const files = readdirSync(snapshotsDir);
  
  files.forEach(file => {
    rmSync(join(snapshotsDir, file));
  });
  
  console.log(`\n🧹 Cleaned up ${files.length} snapshots`);
}

function getPackageName(): string {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
  return pkg.name;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}



function commitChangeset(): void {
  try {
    console.log("\n📝 Committing changeset...");
    execSync("git add .changeset/*.md", { stdio: "inherit" });
    execSync('git commit -m "chore: add changeset"', { stdio: "inherit" });
    console.log("✅ Changeset committed successfully!");
  } catch (error) {
    console.error("❌ Failed to commit changeset:", error);
    process.exit(1);
  }
}

function parseChangeset(changesetFile: string): { type: string; summary: string; sections: { added: string[]; changed: string[]; fixed: string[]; removed: string[] } } {
  const content = readFileSync(changesetFile, "utf-8");
  
  // Extract type from frontmatter
  const typeMatch = content.match(/^---\n"[^"]+": (major|minor|patch)\n---/m);
  const type: string = typeMatch ? typeMatch[1]! : "minor";
  
  // Extract summary (first # heading after frontmatter)
  const summaryMatch = content.match(/^# (.+)$/m);
  const summary: string = summaryMatch ? summaryMatch[1]! : "Update";
  
  // Extract sections
  const sections = {
    added: extractSection(content, "## Added"),
    changed: extractSection(content, "## Changed"),
    fixed: extractSection(content, "## Fixed"),
    removed: extractSection(content, "## Removed")
  };
  
  return { type, summary, sections };
}

function extractSection(content: string, heading: string): string[] {
  const regex = new RegExp(`${heading}\\n([\\s\\S]*?)(?=\\n## |$)`, "m");
  const match = content.match(regex);
  if (!match) return [];
  
  return match[1]!
    .split("\n")
    .filter(line => line.trim().startsWith("-"))
    .map(line => line.trim().substring(2));
}

function autoSquashCommits(changesetFile: string): void {
  try {
    console.log("\n🔄 Auto-squashing commits...");
    
    // 1. Stash any unstaged changes
    const hasUnstaged = execSync("git diff --quiet || echo 'has-changes'", { encoding: "utf-8" }).trim();
    if (hasUnstaged === "has-changes") {
      console.log("📦 Stashing unstaged changes...");
      execSync("git stash push -u -m 'finalize: temporary stash'", { stdio: "inherit" });
    }
    
    // 2. Count commits since main
    const commitCount = parseInt(execSync("git rev-list --count main..HEAD", { encoding: "utf-8" }).trim());
    
    if (commitCount <= 1) {
      console.log("ℹ️  Only 1 commit, no squash needed");
      if (hasUnstaged === "has-changes") {
        console.log("📦 Restoring stashed changes...");
        execSync("git stash pop", { stdio: "inherit" });
      }
      return;
    }
    
    console.log(`🎯 Squashing ${commitCount} commits into 1...`);
    
    // 3. Parse changeset to generate descriptive commit message
    const { type, summary, sections } = parseChangeset(changesetFile);
    
    // 4. Build commit message
    const commitType = type === "major" ? "feat!" : type === "minor" ? "feat" : "fix";
    let commitMsg = `${commitType}: ${summary.toLowerCase()}`;
    
    // Add bullet points for each section
    const bullets: string[] = [];
    sections.added.forEach(item => bullets.push(`- ${item}`));
    sections.changed.forEach(item => bullets.push(`- ${item}`));
    sections.fixed.forEach(item => bullets.push(`- ${item}`));
    sections.removed.forEach(item => bullets.push(`- ${item}`));
    
    if (bullets.length > 0) {
      commitMsg += "\n\n" + bullets.join("\n");
    }
    
    // 5. Soft reset to main
    execSync("git reset --soft main", { stdio: "inherit" });
    
    // 6. Create single commit with descriptive message
    execSync(`git commit -m "${commitMsg.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
    
    console.log("✅ Commits squashed successfully!");
    
    // 7. Restore stashed changes if any
    if (hasUnstaged === "has-changes") {
      console.log("📦 Restoring stashed changes...");
      execSync("git stash pop", { stdio: "inherit" });
    }
    
  } catch (error) {
    console.error("❌ Failed to squash commits:", error);
    console.log("\n💡 You can manually squash with: git rebase -i main");
    process.exit(1);
  }
}

async function analyzePhase() {
  console.log("🎯 Finalize Changes - Phase 1: Analysis\n");
  
  // Load snapshots
  const snapshots = loadSnapshots();
  if (snapshots.length === 0) {
    console.error("❌ No snapshots found");
    console.error("💡 Run /snapshot first to capture session context");
    process.exit(1);
  }
  
  console.log(`📸 Found ${snapshots.length} session snapshot(s):`);
  snapshots.forEach((s, i) => {
    console.log(`   ${i + 1}. ${s.timestamp.split("T")[0]} - ${s.purpose}`);
  });
  console.log();
  
  // Get final commit state
  const finalCommit = getSquashedCommit();
  console.log(`📦 Final commit affects ${finalCommit.files.length} files\n`);
  
  // Display AI prompt
  displayAIPrompt(snapshots, finalCommit);
  
  // Create changeset with TODOs
  const analysis = createPlaceholderAnalysis();
  const changesetFile = createChangeset(analysis);
  
  console.log("\n✅ Phase 1 complete!");
  console.log("💡 AI agent should now:");
  console.log("   1. Analyze the snapshots and diff above");
  console.log("   2. Update the changeset file with real content");
  console.log("   3. Execute: bun run finalize:commit");
}

async function commitPhase() {
  console.log("🎯 Finalize Changes - Phase 2: Commit\n");
  
  // Find the most recent changeset file
  const changesetFiles = readdirSync(".changeset")
    .filter(f => f.endsWith(".md") && f !== "README.md")
    .sort();
  
  if (changesetFiles.length === 0) {
    console.error("❌ No changeset found");
    console.error("💡 Run 'bun run finalize:analyze' first");
    process.exit(1);
  }
  
  const changesetFile = `.changeset/${changesetFiles[changesetFiles.length - 1]}`;
  
  // Verify changeset was updated
  const content = readFileSync(changesetFile, "utf-8");
  if (content.includes("TODO")) {
    console.error("❌ Changeset still contains TODO placeholders");
    console.error("💡 Please update the changeset file before committing");
    console.error(`   File: ${changesetFile}`);
    process.exit(1);
  }
  
  console.log("✅ Changeset verified (no TODOs)");
  
  // Cleanup snapshots
  cleanupSnapshots();
  
  // Commit and squash
  console.log("\n🚀 Starting automatic finalization...");
  commitChangeset();
  autoSquashCommits(changesetFile);
  
  console.log("\n✨ Finalization complete!");
  console.log("\n💡 Next steps:");
  console.log("1. Review: git log -1");
  console.log("2. Push: git push origin <branch> --force-with-lease");
  console.log("\n💡 When ready to release (maintainer):");
  console.log("   bun run release");
}

async function main() {
  const command = process.argv[2] || "analyze";
  
  if (command === "analyze") {
    await analyzePhase();
  } else if (command === "commit") {
    await commitPhase();
  } else {
    console.error("❌ Unknown command:", command);
    console.error("Usage: bun run finalize [analyze|commit]");
    process.exit(1);
  }
}

main();
