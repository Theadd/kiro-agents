---
"kiro-agents": minor
---

# Add role-based modes and optimize chit-chat protocol for neurodivergent accessibility

Introduces as-vibe and as-spec modes enabling "agent superpowers" (combining specialized agent tools with preferred interaction style), optimizes chit-chat.md by 53% while preserving functionality, and adds comprehensive neurodivergent accessibility documentation explaining cross-condition benefits.

## Added
- Role-based modes: `kiro-as-vibe-mode.md` and `kiro-as-spec-mode.md` for combining agent tools with preferred interaction style
- Neurodivergent accessibility guide: `docs/neurodivergent-accessibility.md` explaining benefits for ADHD, autism, dyslexia, executive function disorders, anxiety, and processing differences
- "Working with Numbered Choices" section in accessibility docs explaining flexibility (request more options, filter, state intent directly)
- Agent superpowers concept documentation in workspace steering files

## Changed
- Optimized `chit-chat.md` from ~4,500 to ~2,100 tokens (53% reduction) by condensing examples and removing redundancy while preserving all protocols
- Updated terminology from "ADHD-C Users" to "ADHD Users" with clarification "(in particular, ADHD-C)" for easier typing
- Increased numbered choice count from 4-6 to 6-8 options (up to 16 maximum) across chit-chat protocol
- Updated mode management protocol to include as-vibe/as-spec options and remove auto-detection step
- Refined mode switching protocol with better literal response handling
- Updated workspace steering files to document new mode types and agent superpowers workflow

## Removed
- Verbose examples and redundant explanations from chit-chat.md protocols
- Auto-detection Step 2 from mode management (simplified workflow)
- Anecdotal metrics, implementation notes, and future considerations sections from accessibility docs (focused on core concepts)
