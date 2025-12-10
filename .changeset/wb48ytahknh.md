---
"kiro-agents": minor
---

# Add AI-powered versioning system with interactive workflows

Implemented hybrid AI + Changesets versioning system with session snapshots, interactive confirmation prompts, and Kiro slash command hooks. The system captures rich development context across multiple sessions and consolidates it into user-facing changelogs.

## Added
- Session snapshot system (/snapshot) for capturing development context
- Interactive finalize workflow (/finalize) with 3-option confirmation prompt
- Release automation (/release) with prerequisites and monitoring
- Kiro hook files (.kiro.hook format) for slash commands
- Comprehensive versioning documentation in docs/VERSIONING.md
- AI-powered changeset consolidation from multiple sessions

## Changed
- Hook format from .json to proper .kiro.hook files via Kiro UI
- Finalize workflow now includes interactive commit/review/cancel options
- Snapshot workflow enhanced with explicit AI auto-update instructions

## Removed
- Old .json hook files (replaced with .kiro.hook format)

## Key Findings
- Kiro hooks require .kiro.hook files created via UI, not programmatic .json files
- Console prompts using readline work universally across all contexts
- Session snapshots capture 'why' decisions were made, not just 'what' changed

## Design Decisions
- Chose console prompts over userInput tool for universal compatibility
- Implemented 3-option confirmation for flexibility: commit now, review first, or cancel
- Separated snapshot (incremental) from finalize (consolidation) for better workflow

