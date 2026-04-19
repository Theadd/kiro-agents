---
"kiro-agents": major
---

# Migrate agent definitions directory to avoid conflict with Kiro Subagents

Kiro IDE's official Subagents feature uses the same directory as kiro-agents for custom agent definitions, causing Kiro models to fail when listing or reading Subagents due to incompatible file formats. The agent storage path has been updated across the build system, protocols, and all documentation to resolve this conflict. **Existing users must manually move their agent files from `.kiro/agents/` to `.kiro/kiro-agents/`.**

## Added
- New `{{{GLOBAL_AGENTS_PATH}}}` substitution key in `src/config.ts` and `src/kiro/config.ts` for global user-level agent path

## Changed
- `src/kiro/config.ts`: updated `{{{WS_AGENTS_PATH}}}` substitution and `getAgentList()` to use new agent directory
- `src/core/protocols/strict-mode.md`: replaced hardcoded agent path with `{{{WS_AGENTS_PATH}}}` substitution
- Documentation updated across `README.md`, `CONTRIBUTING.md`, `docs/ARCHITECTURE.md`, `docs/GETTING_STARTED.md`, `docs/INSTALLED-ARCHITECTURE.md`, `docs/design/reflection-architecture.md`, `docs/user-guide/reflection-system.md`

## Fixed
- Conflict with Kiro IDE's official Subagents feature that caused model failures when scanning for custom subagents
