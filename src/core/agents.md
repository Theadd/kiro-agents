---
inclusion: manual
description: "Interactive agent management interface with visual menu for creating, activating, and managing AI agents"
keywords: ["agents", "management", "create", "activate", "interactive"]
---

# Agent Management

## Parameter Detection

**CRITICAL: Check if user provided agent name as parameter**

If the user's message contains `/agents {agent_name}` with a specific agent name (e.g., `/agents kiro-master`):

1. **DO NOT execute the interactive management flow below**
2. **INSTEAD, execute the instruction alias for agent activation:**
   - Read `{{{WS_AGENTS_PATH}}}/{agent_name}.md` into context
   - /protocols agent-activation.md
   - Follow all steps from the "Agent Activation Steps" section in agent-activation.md
   - Use `{agent_name}` as the agent identifier throughout the protocol
3. **Stop processing this document** - The agent activation protocol takes over

**Only continue with interactive management flow below if user typed `/agents` without parameters.**

---

## Interactive Management Mode

You are now in **agent management mode** using chit-chat interaction protocol.

{{{AGENT_MANAGEMENT_PROTOCOL}}}

## Initial Agent

When auto-setup detects no agents exist, create the initial agent:

{{{INITIAL_AGENT_DESCRIPTION}}}

This description is used when creating `{{{WS_AGENTS_PATH}}}/{{{INITIAL_AGENT_NAME}}}.md` during auto-setup.

---

**Quick Commands:**

```
/agents           Interactive agent management

{{{MODE_COMMANDS}}}
```

Note: Commands are defined in steering documents.
