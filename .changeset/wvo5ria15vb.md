---
"kiro-agents": patch
---

# Fix CLI build system to eliminate redundant file and prevent desynchronization

Removed redundant `bin/cli.ts` file that contained hardcoded file lists out of sync with the manifest system. The build system now generates CLI with correct file lists from manifest during build process. This ensures `npx kiro-agents` installs the same protocol files as `bun run dev`.

## Changed
- CLI build flow now generates temporary build artifact with file lists from manifest
- Updated documentation across 4 files to reflect new CLI generation pattern

## Fixed
- Fixed potential CLI installation mismatch where hardcoded file lists could become outdated
- Eliminated redundancy that caused desynchronization risk between build system and CLI

## Removed
- Removed `bin/cli.ts` (618 lines) - redundant file with hardcoded STEERING_FILES and POWER_FILES constants
