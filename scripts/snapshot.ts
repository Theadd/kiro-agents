#!/usr/bin/env bun
import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from "fs";
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

async function analyzeSession(): Promise<Omit<SessionSnapshot, "id" | "timestamp" | "branch" | "commits" | "filesChanged" | "linesAdded" | "linesRemoved">> {
  console.log("🤖 AI analyzing current session...\n");
  
  // This function is called in the context of Kiro IDE with AI agent
  // The AI agent will analyze the conversation and provide structured output
  
  const prompt = `
Analyze this development session and document it for future reference.

**Instructions:**
Document what was accomplished in THIS session, including:

1. **Purpose**: What were you trying to achieve in this session?
2. **Changes**: What was added, modified, removed, or attempted (but didn't work)?
3. **Findings**: Important discoveries, insights, or learnings
4. **Limitations**: Constraints, blockers, or issues encountered
5. **Decisions**: Design decisions made and why

**Be specific and detailed** - this will be used to generate the final changelog.
Include context that git commits don't capture (the "why" and "how").

**Important**: Focus on THIS session only, not previous sessions.

**Output JSON:**
{
  "purpose": "What this session aimed to accomplish",
  "changes": {
    "added": ["New feature X", "New file Y"],
    "modified": ["Updated Z to support W"],
    "removed": ["Deleted temporary file T"],
    "attempted": ["Tried approach A but failed due to B"]
  },
  "findings": [
    "Discovered that X requires Y",
    "Found limitation in Z library"
  ],
  "limitations": [
    "Cannot do X because Y",
    "Performance issue with Z"
  ],
  "decisions": [
    "Chose approach A over B because C",
    "Decided to use X pattern for Y reason"
  ]
}
`;

  console.log("📋 AI Agent Prompt:");
  console.log("─".repeat(60));
  console.log(prompt);
  console.log("─".repeat(60));
  console.log("\n⚠️  This script requires AI agent interaction.");
  console.log("💡 The AI agent should analyze the conversation and provide JSON output.\n");
  
  // Placeholder - In real usage, the AI agent will provide this
  // For now, return a template that the AI should fill
  return {
    purpose: "TODO: AI agent should describe session purpose",
    changes: {
      added: ["TODO: AI agent should list additions"],
      modified: ["TODO: AI agent should list modifications"],
      removed: ["TODO: AI agent should list removals"],
      attempted: ["TODO: AI agent should list failed attempts"]
    },
    findings: ["TODO: AI agent should list findings"],
    limitations: ["TODO: AI agent should list limitations"],
    decisions: ["TODO: AI agent should list decisions"]
  };
}

function getGitMetadata() {
  const branch = execSync("git --no-pager branch --show-current", { encoding: "utf-8" }).trim();
  
  // Get commits since last snapshot or since branch creation
  let commits: string[];
  let baseRef: string;
  
  try {
    const lastSnapshot = getLastSnapshotCommit();
    baseRef = lastSnapshot;
  } catch {
    baseRef = "main";
  }
  
  try {
    commits = execSync(`git --no-pager log --no-color ${baseRef}..HEAD --oneline`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch {
    commits = [];
  }
  
  // Get changed files
  let filesChanged: string[];
  try {
    filesChanged = execSync(`git --no-pager diff --name-only --no-color ${baseRef}...HEAD`, { encoding: "utf-8" })
      .trim()
      .split("\n")
      .filter(Boolean);
  } catch {
    filesChanged = [];
  }
  
  // Get line changes
  let linesAdded = 0;
  let linesRemoved = 0;
  try {
    const stats = execSync(`git --no-pager diff --shortstat --no-color ${baseRef}...HEAD`, { encoding: "utf-8" }).trim();
    linesAdded = parseInt(stats.match(/(\d+) insertion/)?.[1] || "0");
    linesRemoved = parseInt(stats.match(/(\d+) deletion/)?.[1] || "0");
  } catch {
    // No changes yet
  }
  
  return { branch, commits, filesChanged, linesAdded, linesRemoved };
}

function getLastSnapshotCommit(): string {
  const snapshotsDir = ".changeset/snapshots";
  
  if (!existsSync(snapshotsDir)) {
    throw new Error("No snapshots directory");
  }
  
  const files = readdirSync(snapshotsDir).filter(f => f.endsWith(".json"));
  
  if (files.length === 0) {
    throw new Error("No previous snapshots");
  }
  
  // Get the most recent snapshot
  const snapshots = files.map(file => {
    const content = readFileSync(join(snapshotsDir, file), "utf-8");
    return JSON.parse(content) as SessionSnapshot;
  });
  
  snapshots.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  const lastSnapshot = snapshots[0];
  
  // Return the last commit from the last snapshot
  if ((lastSnapshot?.commits.length ?? 0) > 0) {
    return lastSnapshot!.commits[0]!.split(" ")[0] ?? ""; // Get commit hash
  }
  
  throw new Error("No commits in last snapshot");
}

async function createSnapshot(analysis: Awaited<ReturnType<typeof analyzeSession>>): Promise<void> {
  const gitMeta = getGitMetadata();
  
  const snapshot: SessionSnapshot = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    branch: gitMeta.branch,
    commits: gitMeta.commits,
    filesChanged: gitMeta.filesChanged,
    linesAdded: gitMeta.linesAdded,
    linesRemoved: gitMeta.linesRemoved,
    ...analysis
  };
  
  // Ensure snapshots directory exists
  const snapshotsDir = ".changeset/snapshots";
  if (!existsSync(snapshotsDir)) {
    mkdirSync(snapshotsDir, { recursive: true });
  }
  
  // Write snapshot
  const filename = join(snapshotsDir, `session-${snapshot.id}.json`);
  writeFileSync(filename, JSON.stringify(snapshot, null, 2));
  
  console.log(`✅ Session snapshot created: ${filename}`);
  console.log("\n📝 Captured:");
  console.log(`   Purpose: ${snapshot.purpose}`);
  console.log(`   Changes: ${Object.values(snapshot.changes).flat().length} items`);
  console.log(`   Findings: ${snapshot.findings.length} items`);
  console.log(`   Commits: ${snapshot.commits.length} commits`);
  console.log(`   Files: ${snapshot.filesChanged.length} files`);
  console.log(`   Lines: +${snapshot.linesAdded} -${snapshot.linesRemoved}`);
  console.log("\n💡 Continue working. Run /snapshot again after next session.");
  console.log("💡 When satisfied with all changes, run /finalize");
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

async function main() {
  console.log("📸 Session Snapshot\n");
  
  // Check if on feature branch
  const branch = execSync("git --no-pager branch --show-current", { encoding: "utf-8" }).trim();
  if (branch === "main" || branch === "master") {
    console.error("❌ Cannot create snapshot on main branch");
    console.error("💡 Create a feature branch first");
    process.exit(1);
  }
  
  // Analyze session
  const analysis = await analyzeSession();
  
  // Create snapshot
  await createSnapshot(analysis);
}

main();
