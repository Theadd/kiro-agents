---
"kiro-agents": patch
---

# Fix missing aliases.md installation causing core commands to be unavailable

Fixed critical bug where aliases.md was not being installed to user directory after running `npx kiro-agents`. This caused core system commands like `/agents`, `/modes`, and `/strict` to be unavailable, breaking the fundamental kiro-agents functionality.

## Fixed
- CLI installation now includes aliases.md in steering files, making core commands available after installation
- Test validation now correctly checks power file locations and protocol file structure
- Documentation updated to clarify dual installation architecture and file organization

