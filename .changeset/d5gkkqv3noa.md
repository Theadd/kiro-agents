---
"kiro-agents": patch
---

# Fix npm distribution by generating protocols during build

Fixed npm package distribution bug where protocol files were missing. Build system now generates all 16 protocols from source during npm build, ensuring complete package distribution while maintaining protection strategy (gitignore + CI validation).

## Changed
- Build system now generates protocols during npm build via `buildPowersFromSource()` function
- Removed generated files from git tracking (cli.generated.ts and 5 protocol files)

## Fixed
- npm package now includes all 16 protocol files in distribution
- Resolved gitignore paradox where legacy files were tracked but new files ignored

