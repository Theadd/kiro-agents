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

AI analyzes snapshots vs final commit, generates changeset, prompts for commit:

```
✅ Changeset created successfully! What would you like to do?

  1. ✅ Commit changeset now
  2. 📝 Review changeset first
  3. ❌ Cancel (keep changeset, don't commit)
```

Then squash commits and push:

```bash
git rebase -i main
git push origin feature/awesome
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
/finalize
git rebase -i main && git push
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
/finalize  # AI includes only what made it to final commit
```

**Collaborative (no merge conflicts):**
```bash
# Dev A: /snapshot → /finalize → push
# Dev B: /snapshot → /finalize → push
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
