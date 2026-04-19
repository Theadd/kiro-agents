---
"kiro-agents": major
---

# Fix kiro-protocols power installation to be compatible with current Kiro IDE versions

The previous CLI installer used symlinks and wrote to `registry.json`, which Kiro IDE no longer uses to determine installed custom powers. The installer now replicates exactly what Kiro IDE does when a user installs a power via "Add Custom Power" UI: physical file copy and registration in the correct manifest files. **Existing installations are broken and require running `npx kiro-agents` again to reinstall.**

## Changed
- `bin/cli.template.ts`: rewritten power installation — physical file copy replaces symlinks, correct Kiro IDE registry files are now written
- `docs/contributing/DUAL_INSTALLATION.md`: updated to document new two-directory power installation architecture and correct registry file locations
- `docs/INSTALLED-ARCHITECTURE.md`: updated directory structure, registry integration, and file permissions sections
- `docs/contributing/TESTING.md`: updated verification commands to reflect new registry files

## Fixed
- `bin/cli.template.ts`: power no longer silently fails to appear in Kiro Powers UI after running `npx kiro-agents`
- `bin/cli.template.ts`: EPERM error on Windows caused by read-only source files during Kiro IDE's internal copy operation

## Removed
- `bin/cli.template.ts`: symlink-based installation removed — `createSymbolicLinks()` function deleted
- `bin/cli.template.ts`: `registry.json` registration removed — `registerPowerInRegistry()` function deleted
