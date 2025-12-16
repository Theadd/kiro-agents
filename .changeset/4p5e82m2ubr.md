---
"kiro-agents": minor
---

# Add dev:powers watch mode and fix strict-mode protocol distribution

Added new `dev:powers` watch mode for rapid protocol development iteration with automatic readonly file handling. Fixed missing strict-mode.md protocol in kiro-protocols power distribution. Includes comprehensive documentation updates for the new development workflow.

## Added
- `dev:powers` npm script for watch mode that builds protocols to user's Kiro directory
- `scripts/dev-powers.ts` with automatic readonly file handling and watch mode for protocol changes
- strict-mode protocol to kiro-protocols power distribution (now includes 6 protocols)
- Dev:Powers Mode documentation in structure.md showing new build target and file mappings
- Protocol Files Development workflow section in tech.md with separate guidance for protocol vs steering development

## Changed
- Updated kiro-protocols power to include strict-mode protocol in Core Protocols section
- Test validation now expects 6 protocol files instead of 5
- Documentation paths updated to reflect strict-mode.md location in protocols directory

## Fixed
- strict-mode.md now properly distributed with kiro-protocols power (was missing from protocols array)
