#!/usr/bin/env bun
import { readdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";
import * as readline from "readline";

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

async function analyzeFinal(snapshots: SessionSnapshot[], finalCommit: ReturnType<typeof getSquashedCommit>): Promise<FinalAnalysis> {
  console.log("🤖 AI analyzing final changes vs session snapshots...\n");
  
  const prompt = `
Analyze the final changes and determine what from the session snapshots made it to the final commit.

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
6. Include relevant findings and decisions from snapshots

**Output JSON:**
{
  "type": "major|minor|patch",
  "summary": "One-line summary for changelog",
  "description": "Detailed description (2-3 sentences)",
  "details": {
    "added": ["User-facing feature X"],
    "changed": ["Behavior Y now does Z"],
    "fixed": ["Bug W no longer occurs"],
    "removed": ["Deprecated feature V"]
  },
  "findings": ["Important discovery A that users should know"],
  "decisions": ["Chose approach B because C (affects usage)"]
}

**Example:**
{
  "type": "minor",
  "summary": "Add AI-powered versioning system",
  "description": "Implemented hybrid AI + Changesets versioning system with session snapshots for better changelog generation.",
  "details": {
    "added": [
      "Session snapshot system for capturing development context",
      "/snapshot command for incremental documentation",
      "/finalize command for consolidating changes"
    ],
    "changed": [],
    "fixed": [],
    "removed": []
  },
  "findings": [
    "Session context provides more value than git diffs alone"
  ],
  "decisions": [
    "Separated snapshot (incremental) from finalize (consolidation) for better workflow"
  ]
}
`;

  console.log("📋 AI Agent Prompt:");
  console.log("─".repeat(60));
  console.log(prompt);
  console.log("─".repeat(60));
  console.log("\n⚠️  This script requires AI agent interaction.");
  console.log("💡 The AI agent should analyze snapshots + final commit and provide JSON output.\n");
  
  // Placeholder - In real usage, the AI agent will provide this
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

async function promptUser(question: string, options: string[]): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    console.log(`\n${question}\n`);
    options.forEach((opt, i) => {
      console.log(`  ${i + 1}. ${opt}`);
    });
    console.log();

    rl.question("Enter your choice (1-" + options.length + "): ", (answer) => {
      rl.close();
      const choice = parseInt(answer.trim());
      if (choice >= 1 && choice <= options.length) {
        resolve(options[choice - 1]!);
      } else {
        console.log("❌ Invalid choice, defaulting to 'Review first'");
        resolve(options[1]!); // Default to review
      }
    });
  });
}

function commitChangeset(changesetFile: string): void {
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

function autoSquashCommits(): void {
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
    
    // 3. Get the first commit message for the squashed commit
    const firstCommitMsg = execSync(`git log --format=%B -n 1 HEAD~${commitCount - 1}`, { encoding: "utf-8" }).trim();
    
    // 4. Soft reset to main
    execSync("git reset --soft main", { stdio: "inherit" });
    
    // 5. Create single commit with descriptive message
    const squashMsg = `feat: implement AI-powered versioning system

${firstCommitMsg}

Squashed ${commitCount} commits from feature branch.`;
    
    execSync(`git commit -m "${squashMsg.replace(/"/g, '\\"')}"`, { stdio: "inherit" });
    
    console.log("✅ Commits squashed successfully!");
    
    // 6. Restore stashed changes if any
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

async function main() {
  console.log("🎯 Finalize Changes\n");
  
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
  
  // Analyze and create changeset
  const analysis = await analyzeFinal(snapshots, finalCommit);
  const changesetFile = createChangeset(analysis);
  
  // Cleanup snapshots
  cleanupSnapshots();
  
  // Automatic workflow
  console.log("\n🚀 Starting automatic finalization workflow...");
  
  // 1. Commit changeset
  commitChangeset(changesetFile);
  
  // 2. Auto-squash commits
  autoSquashCommits();
  
  // 3. Done!
  console.log("\n✨ Finalization complete!");
  console.log("\n💡 Next steps:");
  console.log("1. Review the squashed commit: git log -1");
  console.log("2. Push to remote: git push origin <branch> --force-with-lease");
  console.log("\n💡 When ready to release (maintainer):");
  console.log("   bun run release");
}

main();
