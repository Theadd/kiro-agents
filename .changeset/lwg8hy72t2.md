---
"kiro-agents": minor
---

# Consolidate agent and mode systems with protocol injection pattern

Refactored agent and mode systems to use protocol injection pattern, eliminating redundant steering documents and reducing AI context overhead by ~220 lines. Protocols now live in separate files and are injected at build time, with Kiro-specific aliases injected into core aliases via substitutions.

## Added
- Mode switching protocol in Kiro-specific location
- Mode management protocol with interactive workflow
- User-facing agent commands reference documentation
- User-facing mode commands reference documentation
- KIRO_PROTOCOLS_PATH substitution for Kiro-specific protocol paths
- KIRO_MODE_ALIASES substitution to inject mode aliases at build time
- MODE_MANAGEMENT_PROTOCOL substitution for protocol injection
- Custom path support in protocol injection function

## Changed
- Core aliases now include injected Kiro-specific aliases via substitution
- Mode management simplified to use protocol injection
- Protocol injection function supports custom directory paths
- Build script updated with new protocol file mappings
- Test script updated to remove obsolete file validations
- CLI installer updated to remove obsolete files from installation
- Project structure documentation reflects new architecture
- Product documentation references injected aliases instead of system files
- Versioning documentation reorganized into contributing subdirectory

## Removed
- Agent system steering document after consolidating content
- Mode system steering document after consolidating content
