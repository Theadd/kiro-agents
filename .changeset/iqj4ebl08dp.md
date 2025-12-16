---
"kiro-agents": minor
---

# Automatic power registration with symbolic links

The kiro-protocols power now appears immediately as "installed" in Kiro Powers UI after running `npx kiro-agents`. The CLI creates symbolic links in the installed directory and registers the power following Kiro IDE's exact pattern, eliminating the need for manual activation.

## Added
- Automatic symbolic link creation in installed directory pointing to actual power files
- Automatic power registration following Kiro's exact registry pattern
- Platform-specific symlink handling (Windows: junction for directories, symlink for files; Unix: symlink for both)
- New `createSymbolicLinks()` function in CLI for cross-platform symlink creation
- Documentation file `AUTOMATIC_REGISTRATION_FIX.md` with implementation details and testing results

## Changed
- Power registration now uses stable repoId instead of timestamp-based ID to prevent conflicts on reinstall
- Registry structure updated to match Kiro's pattern with separate install and source paths
- Power source type changed from "local" to "repo" for proper Powers UI integration
- Installation flow now includes symlink creation and registry registration steps with graceful error handling
- CLI documentation updated to reflect enabled automatic registration
- Steering documentation updated to document automatic registration and symlink capabilities

## Fixed
- Power no longer requires manual activation via Powers panel after npm installation
- Registry conflicts on reinstall eliminated by using stable repo ID instead of timestamps

