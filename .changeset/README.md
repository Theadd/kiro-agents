# Changesets

This directory contains changeset files for the AI-powered versioning system.

## Workflow

### During Development

**1. Work on your feature** (multiple sessions, frequent commits)
```bash
git checkout -b feature/awesome
# ... work with AI agent ...
git commit -m "wip: progress"
# ... more work ...
git commit -m "wip: more progress"
```

**2. Capture session context** (before ending each session)
```bash
/snapshot
```

This creates a snapshot in `.changeset/snapshots/` (gitignored) that captures:
- Purpose of the session
- Changes made (added/modified/removed/attempted)
- Findings and discoveries
- Limitations encountered
- Design decisions

**3. Continue working** (repeat steps 1-2 as needed)

### When Feature is Complete

**4. Finalize and create changeset**
```bash
/finalize
```

This:
- Analyzes all session snapshots
- Compares with final git diff
- Determines what made it to the final commit
- Generates consolidated changeset
- Cleans up snapshots
- **Prompts for next action**

You'll see:
```
✅ Changeset created successfully! What would you like to do?

  1. ✅ Commit changeset now
  2. 📝 Review changeset first
  3. ❌ Cancel (keep changeset, don't commit)

Enter your choice (1-3):
```

**5. Squash and push**
```bash
# Squash your WIP commits
git rebase -i main

# Push your branch
git push origin feature/awesome
```

**Note**: If you chose option 2 (review first), commit manually:
```bash
git add .changeset/
git commit -m "chore: add changeset"
```

### Release (Maintainer Only)

**6. Merge feature branches**
```bash
git checkout main
git merge feature/awesome
git merge feature/other
```

**7. Release**
```bash
/release
```

This:
- Consumes all changesets
- Bumps version in package.json
- Updates CHANGELOG.md
- Builds the package
- Publishes to npm
- Creates git tag
- Pushes to GitHub

## Directory Structure

```
.changeset/
├── config.json           # Changesets configuration
├── README.md            # This file
├── snapshots/           # Session snapshots (gitignored)
│   ├── session-abc.json
│   └── session-def.json
└── feature-xyz.md       # Final changeset (committed)
```

## AI-Powered Features

### Session Snapshots

Captures rich context that git commits don't:
- **Purpose**: What you were trying to achieve
- **Findings**: Important discoveries
- **Limitations**: Blockers encountered
- **Decisions**: Why you chose approach X over Y
- **Attempted**: Things that didn't work

### Smart Consolidation

The `/finalize` command:
- Compares snapshots with final git diff
- Identifies what actually made it to the final commit
- Ignores temporary/experimental changes
- Generates user-facing changelog entries
- Includes relevant findings and decisions

## Commands

- `/snapshot` - Capture current session context
- `/finalize` - Consolidate snapshots and create changeset
- `/release` - Publish new version (maintainer only)

## Benefits

✅ **Rich documentation** - Captures "why" not just "what"  
✅ **No merge conflicts** - Snapshots are gitignored  
✅ **Multi-session features** - Accumulate context across sessions  
✅ **Smart filtering** - Only includes what made it to final commit  
✅ **Collaborative** - Multiple devs can work in parallel  
✅ **AI-powered** - Minimal manual effort  

## Learn More

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Keep a Changelog](https://keepachangelog.com/)
- [Semantic Versioning](https://semver.org/)
