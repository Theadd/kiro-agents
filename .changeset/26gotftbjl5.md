---
"kiro-agents": minor
---

# Automatic conversation transfer state restoration

Implements automatic detection and restoration of STRICT_MODE and ACTIVE_AGENT state when Kiro IDE generates conversation summaries due to context limits. The system scans conversation summaries for state indicators and restores the previous session state without user intervention when possible.

## Added
- Conversation Transfer State Restoration system that automatically detects and restores STRICT_MODE and ACTIVE_AGENT state from conversation summaries
- Detection patterns for scanning conversation summaries to identify active agents and strict mode status
- Three restoration cases: agent detected (restore both), STRICT_MODE ON without agent (confirm with user), no restoration needed
- Override behavior to allow state restoration to request user input even when "Do not ask for clarification" instruction is present
- Documentation section in ARCHITECTURE.md explaining the conversation transfer state restoration system

## Changed
- Renamed `{{{KIRO_MODE_ALIASES}}}` substitution to `{{{ADDITIONAL_ALIASES}}}` to better reflect expanded scope beyond mode aliases
- Moved Protocol Loading Alias and Protocol Reading Alias from `src/core/aliases.md` to `src/kiro/shared-aliases.md` for centralized Kiro-specific alias management
- Updated `{{{ADDITIONAL_ALIASES}}}` substitution to extract four sections: protocol loading, protocol reading, mode system, and conversation transfer state restoration
- Reorganized `src/kiro/shared-aliases.md` with logical section ordering: protocol loading, protocol reading, mode system, conversation transfer
- Updated `src/core/aliases.md` to use `{{{ADDITIONAL_ALIASES}}}` substitution instead of inline protocol aliases
- Enhanced tech.md documentation with complete `{{{ADDITIONAL_ALIASES}}}` substitution example showing all four section extractions
- Updated ARCHITECTURE.md Key Aliases section to include protocol loading aliases with Kiro-specific notation

