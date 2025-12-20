---
"kiro-agents": minor
---

# Migrate chit-chat protocol to kiro-protocols Power with smart activation

Moved chit-chat.md from global steering to kiro-protocols Power for on-demand loading, reducing base context overhead. Implemented smart detection in agent-activation.md to automatically load and activate chit-chat protocol only for agents that use it, preventing protocol leakage when switching between agents with different interaction styles.

## Added
- Smart chit-chat detection in agent-activation.md that scans agent definitions for chit-chat indicators (Response Style, protocol mentions, section headers)
- Conditional chit-chat loading: protocol loads only when agent needs it, with explicit state declaration
- Flexible control via natural language instructions in chit-chat.md activation section

## Changed
- Moved chit-chat.md from interactions directory to protocols directory (now distributed via kiro-protocols Power instead of global steering)
- Updated chit-chat.md activation section to allow control via protocol instructions, not just user requests
- Updated manifest.ts to remove chit-chat.md from STEERING_MAPPINGS (now auto-discovered by PROTOCOL_SOURCE_MAPPINGS glob pattern)
- Updated agent-activation.md with Step 1.5 for chit-chat state management and Step 3 with explicit behavior for both states
- Updated 28+ documentation files to use "chit-chat protocol" terminology and correct file paths
- Updated test.ts to reflect chit-chat.md now in kiro-protocols Power (11 protocol files total)
- Updated workspace steering files (product.md, structure.md) to reflect new chit-chat location and terminology

## Fixed
- Agent activation via `/agents {name}` now correctly loads chit-chat.md when agent specifies chit-chat protocol
- Chit-chat patterns no longer persist inappropriately when switching from chit-chat agent to non-chit-chat agent
- Non-chit-chat agents no longer forced to use diff blocks and numbered choices when chit-chat.md is in context from previous session
