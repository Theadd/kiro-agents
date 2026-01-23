---
"kiro-agents": patch
---

# Fix CLI installation failures on Windows without admin privileges

Resolves three critical issues: EPERM symlink failures on standard Windows accounts, missing protocol files in published package, and misleading success messages despite errors. CLI now falls back to file copying when symlinks fail and provides accurate installation status.

## Fixed
- CLI installation now works on Windows without admin privileges by falling back to file copying when symlink creation fails
- All 16 protocol files now correctly included in npm package (previously only 11 were embedded)
- Installation status messages now accurately reflect actual outcome instead of always showing success

