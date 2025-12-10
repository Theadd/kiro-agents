---
"kiro-agents": patch
---

# Documentation consistency improvements and workspace steering setup

Standardized command syntax across all documentation and source files, resolved architectural inconsistencies, and added comprehensive workspace steering documents for better development experience.

## Added
- Workspace steering documents (product.md, structure.md, tech.md) providing comprehensive project context
- .changeset/snapshots/ to .gitignore for session snapshot management

## Changed
- Standardized command syntax from `/agent` to `/agents` throughout README and documentation
- Standardized command syntax from `/mode` to `/modes` for consistency
- Removed strict-mode.md loading from modes-system.md to eliminate duplicate loading when combining modes and agents

## Fixed
- Command inconsistencies between README.md (singular) and source implementation (plural)
- Architectural coupling where modes-system.md unnecessarily loaded strict-mode.md
- Documentation clarity in MODE-SWITCHING-GUIDE.md and QUICK-REFERENCE.md

