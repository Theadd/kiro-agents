---
"kiro-agents": minor
---

# Dual installation system for steering files and power dependency

Implemented dual installation architecture where npm package installs both steering files and kiro-protocols power simultaneously. Users now get single-command installation with discoverable protocols via Kiro Powers UI.

## Added
- Dual installation system in CLI installs steering files and kiro-protocols power simultaneously
- Comprehensive documentation of dual installation architecture
- Power file copying function in build system
- Power files now included in published npm package

## Changed
- CLI installation function accepts flexible source and destination paths
- CLI installs to both steering and powers directories
- Build system includes power file copying step
- GitHub workflow validates test powers not committed

## Removed
- Old build:power script replaced by build:powers for multi-power architecture
- Old power build implementation replaced by dedicated build-powers script
- Obsolete analysis and planning documents

