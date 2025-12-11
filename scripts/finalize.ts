#!/usr/bin/env bun
/**
 * AI-powered changeset finalization with validation safeguards.
 * 
 * Two-phase workflow prevents phantom changelog entries by validating against actual git diff:
 * 1. **analyze** - Loads snapshots, shows diff, creates changeset with TODOs
 * 2. **commit** - Validates changeset, cleans snapshots, commits and squashes
 * 
 * @example Phase 1: Analysis
 * ```bash
 * bun run finalize:analyze
 * # Displays: snapshots, git diff, file list, AI instructions
 * # Creates: .changeset/{id}.md with TODO placeholders
 * ```
 * 
 * @example Phase 2: AI Updates Changeset
 * AI must:
 * - Use git diff as source of truth (not snapshots)
 * - Verify each item exists in actual file changes
 * - Replace ALL TODO placeholders
 * - Follow validation checklist
 * 
 * @example Phase 3: Commit
 * ```bash
 * bun run finalize:commit
 * # Validates: No TODOs, no phantom file references
 * # Commits: Changeset file
 * # Squashes: All commits into one with descriptive message
 * ```
 * 
 * **Validation Safeguards:**
 * - Checks for TODO placeholders (prevents incomplete changesets)
 * - Validates file references against git diff (prevents phantom entries)
 * - Extracts path patterns and cross-references with actual changed files
 * - Fails fast with clear error messages
 * 
 * **Critical Distinction:** Session snapshots provide context about what was attempted,
 * but only the git diff determines what goes in the changelog. This prevents documenting
 * experimental work, gitignored files, or features that didn't make the final commit.
 */
import { readdirSync, readFileSync, writeFileSync, rmSync } from "fs";
import { execSync } from "child_process";
import { join } from "path";

/**
 * Session snapshot captured by `/snapshot` command.
 * 
 * Contains rich context about development session including purpose, findings,
 * and decisions that git commits don't capture. Used for context during changeset
 * generation but NOT as source of truth for changelog content.
 */
interface SessionSnapshot {
  /** Unique snapshot identifier */
  id: string;
  /** ISO timestamp of snapshot creation */
  timestamp: string;
  /** Git branch name */
  branch: string;
  /** Commit SHAs included in session */
  commits: string[];
  /** High-level purpose of the session */
  purpose: string;
  /** Categorized changes made during session */
  changes: {
    /** New features/files added */
    added: string[];
    /** Existing features/files modified */
    modified: string[];
    /** Features/files removed */
    removed: string[];
    /** Things attempted but not completed (important: may not be in final commit) */
    attempted: string[];
  };
  /** Important discoveries during session */
  findings: string[];
  /** Blockers or constraints encountered */
  limitations: string[];
  /** Design decisions and rationale */
  decisions: string[];
  /** Files changed in session */
  filesChanged: string[];
  /** Lines added in session */
  linesAdded: number;
  /** Lines removed in session */
  linesRemoved: number;
}

/**
 * Placeholder analysis structure for changeset creation.
 * 
 * Contains TODO placeholders that AI must replace with actual content
 * based on git diff analysis. Used only during Phase 1 (analyze).
 */
interface FinalAnalysis {
  /** Semantic version bump type */
  type: "major" | "minor" | "patch";
  /** One-line summary */
  summary: string;
  /** 2-3 sentence description */
  description: string;
  /** Categorized changelog entries */
  details: {
    /** New user-facing features */
    added: string[];
    /** Modified behaviors */
    changed: string[];
    /** Bug fixes */
    fixed: string[];
    /** Removed features */
    removed: string[];
  };
  /** Key findings (optional) */
  findings: string[];
  /** Design decisions (optional) */
  decisions: string[];
}

/**
 * Loads all session snapshots from `.changeset/snapshots/` directory.
 * 
 * Snapshots are gitignored and accumulate across development sessions.
 * Sorted chronologically to show development progression.
 * 
 * @returns Array of session snapshots sorted by timestamp (oldest first)
 */
function loadSnapshots(): SessionSnapshot[] {
  const snapshotsDir = ".changeset/snapshots";
  const files = readdirSync(snapshotsDir).filter(f => f.endsWith(".json"));
  
  return files.map(file => {
    const content = readFileSync(join(snapshotsDir, file), "utf-8");
    return JSON.parse(content) as SessionSnapshot;
  }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Gets final commit state by comparing current branch against main.
 * 
 * This is the SOURCE OF TRUTH for changelog generation. Only changes
 * present in this diff should appear in the changeset, regardless of
 * what's in session snapshots.
 * 
 * @returns Object containing commit messages, full diff, and changed file list
 * 
 * @example
 * ```typescript
 * const { files, diff } = getSquashedCommit();
 * // files: ['README.md', 'package.json']
 * // diff: 'diff --git a/README.md b/README.md\n...'
 * ```
 */
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

/**
 * Displays AI analysis prompt with snapshots, diff, and validation instructions.
 * 
 * **Critical Design:** File list is shown FIRST (before snapshots) to emphasize
 * that git diff is the source of truth. Snapshots provide context but should NOT
 * be used as changelog content unless verified against the file list.
 * 
 * **Validation Checklist:** Explicit checklist prevents common failure mode where
 * AI includes experimental/gitignored content from snapshots that didn't make the
 * final commit (e.g., `docs/__internal/` that's gitignored).
 * 
 * @param snapshots - Session snapshots for context
 * @param finalCommit - Git diff and file list (source of truth)
 */
function displayAIPrompt(snapshots: SessionSnapshot[], finalCommit: ReturnType<typeof getSquashedCommit>): void {
  console.log("🤖 AI Agent: Please analyze and provide changeset content\n");
  
  const prompt = `
📋 AI Analysis Required
${"─".repeat(60)}

**FILES IN FINAL COMMIT (SOURCE OF TRUTH):**
${finalCommit.files.map(f => `  ✓ ${f}`).join("\n")}

**Session Snapshots (context only - verify against files above):**
${JSON.stringify(snapshots, null, 2)}

**Git Diff (what actually changed):**
${finalCommit.diff.slice(0, 3000)}

**CRITICAL INSTRUCTIONS:**
1. **ONLY use the git diff below as source of truth** - snapshots provide context but NOT changelog content
2. **Cross-reference**: For each item in snapshots, verify it exists in the diff's file list
3. **Strict validation**: If a file/feature is NOT in the diff, it MUST NOT be in the changeset
4. **Determine semantic version type**:
   - **major**: Breaking changes, API changes, architectural changes
   - **minor**: New features, new capabilities, backwards-compatible additions
   - **patch**: Bug fixes, documentation, refactoring, minor improvements
5. **Write user-facing changelog** based ONLY on what's in the diff
6. **Update changeset file** in .changeset/ (replace all TODO placeholders)
7. **Run**: bun run finalize:commit

**VALIDATION CHECKLIST:**
- [ ] Every "Added" item corresponds to a new file in diff
- [ ] Every "Changed" item corresponds to a modified file in diff
- [ ] No references to files/directories not in the diff
- [ ] No references to gitignored content

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

/**
 * Creates placeholder analysis with TODO markers for AI to replace.
 * 
 * Used during Phase 1 (analyze) to create changeset template. AI must
 * replace ALL TODO placeholders before Phase 2 (commit) will succeed.
 * 
 * @returns FinalAnalysis with TODO placeholders
 */
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

/**
 * Phase 1: Analysis - Loads snapshots, shows diff, creates changeset template.
 * 
 * **Workflow:**
 * 1. Loads all session snapshots from `.changeset/snapshots/`
 * 2. Gets git diff from main to current branch (source of truth)
 * 3. Displays AI prompt with file list, snapshots, and diff
 * 4. Creates changeset file with TODO placeholders
 * 5. Exits and waits for AI to update changeset
 * 
 * **Critical:** This phase only prepares data. AI must analyze and update
 * the changeset file before Phase 2 (commit) can proceed.
 */
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
  createChangeset(analysis);
  
  console.log("\n✅ Phase 1 complete!");
  console.log("💡 AI agent should now:");
  console.log("   1. Analyze the snapshots and diff above");
  console.log("   2. Update the changeset file with real content");
  console.log("   3. Execute: bun run finalize:commit");
}

/**
 * Validates changeset content against actual git diff to prevent phantom entries.
 * 
 * **Critical Safeguard:** Prevents the failure mode where AI includes content from
 * session snapshots that didn't make the final commit (experimental work, gitignored
 * files, attempted features that were reverted).
 * 
 * **How It Works:**
 * 1. Extracts all path-like patterns from changeset (e.g., `docs/__internal/`, `.kiro/agents/`)
 * 2. Gets actual changed files from git diff
 * 3. Cross-references each path against actual files
 * 4. Reports any paths that don't exist in the commit
 * 
 * **Pattern Matching:**
 * - Matches: `path/to/file` (backtick-wrapped) or path/to/file (plain text)
 * - Skips: URLs (http://), npm packages (@scope/package)
 * - Validates: Only paths with slashes (likely file/directory references)
 * 
 * @param changesetFile - Path to changeset file to validate
 * @returns Validation result with errors array
 * 
 * @example Validation Failure
 * ```typescript
 * // Changeset mentions: "Added docs/__internal/ directory"
 * // Git diff shows: README.md, package.json (no docs/__internal/)
 * // Result: { valid: false, errors: ['Referenced path not in commit: docs/__internal/'] }
 * ```
 */
function validateChangesetAgainstDiff(changesetFile: string): { valid: boolean; errors: string[] } {
  const content = readFileSync(changesetFile, "utf-8");
  const actualFiles = execSync("git diff --name-only main...HEAD", { encoding: "utf-8" })
    .trim()
    .split("\n")
    .filter(Boolean);
  
  const errors: string[] = [];
  
  // Extract all file/directory references from changeset
  // Look for common patterns: `path/to/file`, docs/__internal/, .kiro/agents/, etc.
  const pathPattern = /`([^`]+\/[^`]+)`|([a-zA-Z0-9_-]+\/[a-zA-Z0-9_\/-]+)/g;
  const matches = content.matchAll(pathPattern);
  
  for (const match of matches) {
    const path = match[1] || match[2];
    if (!path) continue;
    
    // Skip common non-file references
    if (path.includes("://") || path.startsWith("http")) continue;
    if (path.includes("@") || path.includes("npm")) continue;
    
    // Check if this path or any file under it exists in actualFiles
    const pathExists = actualFiles.some(f => 
      f === path || 
      f.startsWith(path + "/") || 
      path.startsWith(f + "/")
    );
    
    if (!pathExists && path.includes("/")) {
      errors.push(`Referenced path not in commit: ${path}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Phase 2: Commit - Validates changeset, cleans snapshots, commits and squashes.
 * 
 * **Validation Steps:**
 * 1. Checks for TODO placeholders (ensures AI completed the changeset)
 * 2. Validates file references against git diff (prevents phantom entries)
 * 3. Fails fast with clear error messages if validation fails
 * 
 * **Workflow:**
 * 1. Finds most recent changeset file
 * 2. Validates content (no TODOs, no phantom files)
 * 3. Cleans up session snapshots
 * 4. Commits changeset with "chore: add changeset" message
 * 5. Auto-squashes all commits into one with descriptive message
 * 
 * **Critical Safeguards:**
 * - TODO check prevents incomplete changesets from being committed
 * - Path validation prevents documenting files that don't exist in commit
 * - Both checks must pass before any git operations occur
 * 
 * @example Validation Failure
 * ```bash
 * bun run finalize:commit
 * # ❌ Changeset validation failed:
 * #    - Referenced path not in commit: docs/__internal/
 * # 💡 The changeset references files/paths not in the actual commit
 * ```
 */
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
  
  // Validate changeset against actual diff
  const validation = validateChangesetAgainstDiff(changesetFile);
  if (!validation.valid) {
    console.error("\n❌ Changeset validation failed:");
    validation.errors.forEach(err => console.error(`   - ${err}`));
    console.error("\n💡 The changeset references files/paths not in the actual commit");
    console.error("   Please review and update the changeset file");
    console.error(`   File: ${changesetFile}`);
    process.exit(1);
  }
  
  console.log("✅ Changeset validated against git diff");
  
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
