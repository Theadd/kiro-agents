---
"kiro-agents": minor
---

# Add reflection system and fix agent creation protocol

This release introduces a complete reflection system enabling agents to capture and reuse insights across sessions with persistent memory, quality validation, and a 4-tier hierarchy. It also fixes critical agent creation issues by establishing proper protocol loading order and eliminating instruction duplication.

## Added
- Reflection system with 4 protocols (agent insights, review workflow, curator checklist, manager workflow)
- Reflection steering document (`reflect.md`) with `/reflect` and `/reflect review` commands
- Reflection curator agent for reviewing and validating insights
- AI-managed storage infrastructure (`.ai-storage/` directory with self-documenting `.gitignore`)
- Comprehensive reflection system documentation (user guide and technical design)
- Explainability protocol demonstrating error analysis and decision transparency

## Changed
- Agent creation now loads `agent-creation.md` protocol before creating agents (fixes protocol violations)
- Agent activation instructions consolidated to single delegation pattern (eliminates ~100 token duplication)
- Initial agent creation transformed to structured 3-step process with validation checklist
- Reflection system added as Core Feature #4 in product documentation
- Updated architecture documentation to include reflection system components and workflows
- CLI installation now includes reflection steering document

## Fixed
- Agent creation protocol violations caused by missing protocol loading step
- Instruction duplication in `agents.md` breaking single source of truth principle
- Ambiguous agent creation instructions that caused AI to improvise structure

## Removed
- Duplicated agent activation instructions from Parameter Detection section in `agents.md`

