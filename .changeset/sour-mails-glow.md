---
"kiro-agents": patch
---

Reorganize session snapshots to .kiro directory structure

Move session snapshots from `.changeset/snapshots/` to `.kiro/session-snapshots/` for better organization and consistency with other workspace configuration. This change consolidates all kiro-agents workspace data under the `.kiro/` directory, making the project structure cleaner and more intuitive.

### Changed
- Moved session snapshots directory from `.changeset/snapshots/` to `.kiro/session-snapshots/`
- Updated `.gitignore` to reflect new snapshot location
- Updated all documentation references in `.changeset/README.md`, `CONTRIBUTING.md`, and steering documents
- Updated hook prompts in `finalize.kiro.hook` and `snapshot.kiro.hook` to reference new location
- Enhanced snapshot script with better error handling and validation
