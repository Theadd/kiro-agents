# AI-Powered Versioning System

Hybrid AI + Changesets versioning system with session snapshots for rich changelog generation.

## Overview

This system combines:
- **AI analysis** - Extracts context from development sessions
- **Changesets** - Coordinates multi-developer releases
- **Session snapshots** - Captures "why" not just "what"
- **Smart consolidation** - Filters out temporary changes

## Quick Start

### 1. During Development

Work on your feature with frequent commits:

```bash
git checkout -b feature/awesome
# ... work with AI agent ...
git commit -m "wip: initial work"
```

After each session, capture context:

```bash
/snapshot
```

The AI agent will analyze your session and create a snapshot with:
- Purpose of the session
- Changes made (added/modified/removed/attempted)
- Findings and discoveries
- Limitations encountered
- Design decisions

### 2. When Feature is Complete

Consolidate all snapshots into a changeset:

```bash
/finalize
```

The AI agent will:
- Analyze all session snapshots
- Compare with final git diff
- Determine what made it to the final commit
- Generate consolidated changeset
- Clean up snapshots
- **Prompt you for next action**

You'll see an interactive prompt:

```
✅ Changeset created successfully! What would you like to do?

  1. ✅ Commit changeset now
  2. 📝 Review changeset first
  3. ❌ Cancel (keep changeset, don't commit)

Enter your choice (1-3):
```

**Option 1 - Commit now**: Automatically commits the changeset  
**Option 2 - Review first**: Shows commands to review and commit manually  
**Option 3 - Cancel**: Keeps changeset but doesn't commit

After committing (manually or automatically):

```bash
# Squash your WIP commits
git rebase -i main

# Push
git push origin feature/awesome
```

### 3. Release (Maintainer Only)

After merging feature branches:

```bash
git checkout main
/release
```

This will:
- Consume all changesets
- Bump version in package.json
- Update CHANGELOG.md
- Build the package
- Publish to npm
- Create git tag
- Push to GitHub

## Commands

### `/snapshot`

**Purpose**: Capture current session context

**When to use**: After each development session

**What it does**:
- Prompts AI agent to analyze the session
- Creates snapshot in `.changeset/snapshots/` (gitignored)
- Captures rich context (purpose, findings, decisions)
- Tracks git metadata (commits, files, lines)

**Example**:
```bash
# After working on a feature
/snapshot

# Output:
# 📸 Session snapshot created: .changeset/snapshots/session-abc123.json
# 📝 Captured:
#    Purpose: Implement AI-powered versioning
#    Changes: 4 items
#    Findings: 2 items
#    Commits: 3 commits
```

### `/finalize`

**Purpose**: Consolidate snapshots and create changeset

**When to use**: When feature is complete and you're satisfied with changes

**What it does**:
- Loads all session snapshots
- Gets final git diff vs main
- Prompts AI agent to analyze and consolidate
- Creates changeset file
- Cleans up snapshots
- **Prompts for next action** (commit now, review first, or cancel)

**Example**:
```bash
# When feature is done
/finalize

# Output:
# 📸 Found 3 session snapshots
# 📦 Final commit affects 12 files
# 🤖 AI analyzing final changes...
# ✅ Changeset created: .changeset/xyz.md
# 🧹 Cleaned up 3 snapshots
#
# ✅ Changeset created successfully! What would you like to do?
#
#   1. ✅ Commit changeset now
#   2. 📝 Review changeset first
#   3. ❌ Cancel (keep changeset, don't commit)
#
# Enter your choice (1-3): 1
# 📝 Committing changeset...
# ✅ Changeset committed successfully!
```

### `/release`

**Purpose**: Publish new version

**When to use**: When ready to release (maintainer only)

**What it does**:
- Checks you're on main branch
- Consumes all changesets
- Bumps version
- Updates CHANGELOG.md
- Builds package
- Publishes to npm
- Creates git tag
- Pushes to GitHub

**Example**:
```bash
# On main branch after merging PRs
/release

# Output:
# 📦 Found 2 changeset(s) to consume
# 📌 Current version: 1.0.2
# ✅ Version bumped: 1.0.2 → 1.1.0
# ✅ Build completed
# ✅ Published to npm
# ✨ Release v1.1.0 completed successfully!
```

## Workflow Examples

### Single Session Feature

```bash
# Start feature
git checkout -b feature/simple
# ... work ...
git commit -m "feat: add simple feature"

# Capture session
/snapshot

# Finalize
/finalize

# Review and commit
git add .changeset/
git commit -m "chore: add changeset"
git push origin feature/simple
```

### Multi-Session Feature

```bash
# Session 1
git checkout -b feature/complex
# ... work ...
git commit -m "wip: initial work"
/snapshot

# Session 2 (new day, new context window)
# ... more work ...
git commit -m "wip: progress"
/snapshot

# Session 3 (experiment that fails)
# ... try something ...
git commit -m "wip: trying approach X"
/snapshot
# ... doesn't work, revert ...
git commit -m "wip: reverted approach X"

# Session 4 (final solution)
# ... correct implementation ...
git commit -m "feat: complex feature done"
/snapshot

# Finalize (AI filters out failed experiments)
/finalize

# Squash and commit
git rebase -i main
git add .changeset/
git commit -m "chore: add changeset"
git push origin feature/complex
```

### Collaborative Development

```bash
# Developer A
git checkout -b feature/a
# ... work ...
/snapshot
/finalize
git push origin feature/a

# Developer B (in parallel)
git checkout -b feature/b
# ... work ...
/snapshot
/finalize
git push origin feature/b

# Maintainer
git checkout main
git merge feature/a  # Changeset A added
git merge feature/b  # Changeset B added (no conflicts!)
/release             # Both changesets consumed
```

## AI Prompts

### Snapshot Prompt

The AI agent receives this prompt during `/snapshot`:

```
Analyze this development session and document it for future reference.

Instructions:
1. Purpose: What were you trying to achieve in this session?
2. Changes: What was added, modified, removed, or attempted?
3. Findings: Important discoveries, insights, or learnings
4. Limitations: Constraints, blockers, or issues encountered
5. Decisions: Design decisions made and why

Be specific and detailed - this will be used to generate the final changelog.
Include context that git commits don't capture (the "why" and "how").

Output JSON:
{
  "purpose": "...",
  "changes": { "added": [...], "modified": [...], ... },
  "findings": [...],
  "limitations": [...],
  "decisions": [...]
}
```

### Finalize Prompt

The AI agent receives this prompt during `/finalize`:

```
Analyze the final changes and determine what from the session snapshots 
made it to the final commit.

Session Snapshots: [all snapshots]
Final Commit: [git diff]

Instructions:
1. Compare snapshots with final commit
2. Identify what from snapshots is present in final commit
3. Ignore temporary/removed changes
4. Determine semantic version type (major/minor/patch)
5. Write user-facing changelog entry
6. Include relevant findings and decisions

Output JSON:
{
  "type": "major|minor|patch",
  "summary": "...",
  "description": "...",
  "details": { "added": [...], "changed": [...], ... },
  "findings": [...],
  "decisions": [...]
}
```

## Benefits

### Rich Documentation

Captures context that git commits don't:
- **Purpose**: Why you made the changes
- **Findings**: What you discovered
- **Limitations**: What blocked you
- **Decisions**: Why you chose approach X over Y

### No Merge Conflicts

- Snapshots are gitignored (temporary)
- Only final changeset is committed
- Multiple developers can work in parallel
- Changesets merge cleanly

### Multi-Session Features

- Accumulate context across sessions
- Handle context window limitations
- Track evolution of feature
- Filter out failed experiments

### Smart Filtering

- AI compares snapshots with final commit
- Ignores temporary/experimental changes
- Only includes what made it to final
- Generates clean, user-facing changelog

### Collaborative

- Multiple devs create changesets independently
- Maintainer consolidates all changesets
- Single release command
- Coordinated version bumping

## Technical Details

### Directory Structure

```
.changeset/
├── config.json              # Changesets configuration
├── README.md               # Changesets documentation
├── snapshots/              # Session snapshots (gitignored)
│   ├── session-abc.json    # Snapshot from session 1
│   └── session-def.json    # Snapshot from session 2
└── feature-xyz.md          # Final changeset (committed)
```

### Snapshot Schema

```typescript
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
```

### Changeset Format

```markdown
---
"kiro-agents": minor
---

# Add AI-powered versioning system

Implemented hybrid AI + Changesets versioning system with session snapshots.

## Added
- Session snapshot system for capturing development context
- /snapshot command for incremental documentation
- /finalize command for consolidating changes

## Key Findings
- Session context provides more value than git diffs alone

## Design Decisions
- Separated snapshot (incremental) from finalize (consolidation)
```

## Troubleshooting

### No snapshots found

**Problem**: `/finalize` says "No snapshots found"

**Solution**: Run `/snapshot` first to capture session context

### AI not responding

**Problem**: Scripts show "TODO: AI agent should..."

**Solution**: These scripts require AI agent interaction in Kiro IDE. The AI agent should analyze the conversation and provide structured JSON output.

### Changeset version failed

**Problem**: `changeset version` command fails

**Solution**: Make sure `@changesets/cli` is installed:
```bash
bun add -D @changesets/cli
```

### Publish failed

**Problem**: `changeset publish` fails

**Solution**: Make sure you're logged in to npm:
```bash
npm login
```

## Learn More

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
