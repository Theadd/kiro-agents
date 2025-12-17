---
"kiro-agents": minor
---

# Centralized manifest system with automatic protocol discovery

Implements a centralized file mapping system in `src/manifest.ts` that serves as single source of truth for all build targets. Replaces scattered hardcoded file mappings with glob pattern support for automatic protocol discovery, ensuring dev mode matches CLI installation exactly.

## Added
- Centralized manifest system (`src/manifest.ts`) with type-safe file mappings
- Glob pattern support for automatic protocol discovery via manifest mappings
- CLI generation from templates with embedded file lists from manifest
- Comprehensive manifest system documentation in workspace steering files
- Validation script (`scripts/validate-manifest.ts`) for build consistency
- Documentation guide (`docs/contributing/MANIFEST-SYSTEM.md`) for contributors

## Changed
- Build system now uses manifest for all file operations instead of hardcoded lists
- Protocol discovery is automatic via glob patterns for core and Kiro-specific protocols
- Dev mode guaranteed to match CLI installation (no more file mismatches)
- Mode definitions moved from `agent-system/` to `protocols/` directory for better organization
- All build scripts updated to use centralized manifest system
- Workspace steering documentation updated to reflect new architecture

## Fixed
- Dev mode file inconsistency where different files were installed vs CLI
- Manual file list maintenance when adding new protocols
- Scattered file mappings across multiple build scripts

