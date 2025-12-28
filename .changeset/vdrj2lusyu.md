---
"kiro-agents": minor
---

# Fix reflection system enablement clarity and add missing agent management alias

Fixed critical issues with the reflection system's session behavior documentation and added missing `/agents` command alias for interactive management. Clarified that the Reflections section is permanent in agent files while the capture protocol is session-only, eliminating user confusion about what persists between sessions.

## Added
- `/agents` command alias (without parameters) for interactive agent management mode
- Comprehensive reflection system documentation in user guide with workflow details, quality standards, and best practices
- Detailed reflection system section in installed architecture explaining storage structure, on-demand file creation, and integration
- Step-by-step implementation details for `/reflect` command with explicit file modification instructions

## Changed
- Clarified reflection enablement model: Reflections section is permanent in agent files, capture protocol is session-only
- Updated reflection system documentation to explain "next session behavior" with and without `/reflect` command
- Renamed "session-temporary" terminology to "session-only capture" to prevent confusion about persistence
- Expanded `/reflect` command documentation with explicit fsAppend steps for adding Reflections section to agent files

## Fixed
- Fixed false statements about Reflections section being removed when session ends
- Corrected documentation that incorrectly stated agents return to original state after session ends
- Resolved ambiguity in `/reflect` command instructions that prevented AI agents from correctly modifying agent files

## Removed
- Removed misleading "session-temporary" terminology that implied Reflections section was temporary

