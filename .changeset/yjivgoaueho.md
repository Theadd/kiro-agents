---
"kiro-agents": patch
---

# Fix protocol file loading outside workspace with File References

Migrated protocol files from .mdx to .md and replaced absolute path references with Kiro File References syntax. This fixes the critical issue where protocol files couldn't be loaded when kiro-agents is installed in the global user directory because Kiro's file reading tools cannot access files outside the workspace.

## Added
- Debug mode steering document for development and testing
- File References syntax for all protocol file references
- Missing protocol files (agent-management.md, agent-creation.md) to npm build mappings

## Changed
- Renamed all protocol files from .mdx to .md extension (5 files: agent-activation, agent-management, agent-creation, mode-switching, mode-management)
- Updated all protocol references to use File References syntax instead of absolute paths
- Updated build configuration to map all protocol files correctly in both npm and power distributions
- Updated documentation to reflect new file extensions and reference patterns

## Fixed
- Protocol files can now be loaded correctly when installed outside workspace directory
- npm build now includes all protocol files (previously missing agent-management and agent-creation)
- File References work correctly with relative paths from current file location
