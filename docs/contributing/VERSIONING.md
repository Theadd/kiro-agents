# Versioning System

AI-powered versioning using Changesets with session snapshots for rich changelog generation.

## Commands

### `/snapshot` - Capture Session Context

Run after each development session to document your work:

```bash
/snapshot
```

Creates snapshot in `.kiro/session-snapshots/` (gitignored) with:
- Purpose and changes
- Findings and decisions
- Git metadata

### `/finalize` - Create Changeset

Run when feature is complete:

```bash
/finalize
```

**Two-phase workflow:**

**Phase 1: Analysis**
- Loads session snapshots
- Shows git diff (source of truth)
- Creates changeset template with TODOs

**Phase 2: AI Updates Changeset**
- AI analyzes diff vs snapshots
- Replaces all TODO placeholders
- Validates against actual file changes

**Phase 3: Commit**
- Validates changeset (no TODOs, no phantom files)
- Commits changeset
- **Automatically squashes all commits into one**
- Suggests push command

Then push:

```bash
git push origin feature/awesome --force-with-lease
```

### `/release` - Publish (Maintainer)

Run on main branch to publish:

```bash
/release
```

Consumes changesets, bumps version, updates CHANGELOG, publishes to npm, creates tag.



## Workflows

**Single session:**
```bash
git checkout -b feature/simple
# ... work ...
/snapshot
/finalize  # Auto-squashes commits
git push origin feature/simple --force-with-lease
```

**Multi-session (AI filters failed experiments):**
```bash
# Session 1
/snapshot
# Session 2
/snapshot
# Session 3 (failed experiment)
/snapshot
# Session 4 (final solution)
/snapshot
/finalize  # AI includes only what made it to final commit, auto-squashes
git push origin feature/multi --force-with-lease
```

**Collaborative (no merge conflicts):**
```bash
# Dev A: /snapshot → /finalize → push --force-with-lease
# Dev B: /snapshot → /finalize → push --force-with-lease
# Maintainer: merge both → /release
```

## Why This System?

**Rich context:** Captures "why" and "how", not just "what"  
**No conflicts:** Snapshots gitignored, changesets merge cleanly  
**Multi-session:** Accumulates context across sessions  
**Smart filtering:** AI excludes temporary/experimental changes

## Directory Structure

```
.changeset/
└── feature-xyz.md       # Final changeset (committed)

.kiro/
└── session-snapshots/   # Session snapshots (gitignored)
```
