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
2. **INSTEAD, execute the instruction alias:**
   ```
   /agents {agent_name}
   ```
3. **Stop processing this document** - The agent activation protocol takes over

**Only continue with interactive management flow below if user typed `/agents` without parameters.**

---

## Interactive Management Mode

You are now in **agent management mode** using chit-chat interaction protocol.

/only-read-protocols chit-chat.md

/protocols agent-management.md

## Initial Agent

When auto-setup detects no agents exist:

1. **Load agent definition structure:**
   ```
   /only-read-protocols agent-creation.md
   ```

2. **Create `{{{WS_AGENTS_PATH}}}/{{{INITIAL_AGENT_NAME}}}.md`** using the agent definition structure from agent-creation.md Step 3, with:
   
   {{{INITIAL_AGENT_DESCRIPTION}}}

3. **Validate** the created agent file has:
   - Valid YAML frontmatter
   - All required sections from agent-creation.md Step 3
   - Proper markdown formatting

This ensures the initial agent follows the standard agent definition structure.

---

**Quick Commands:**

```
/agents           Interactive agent management

{{{MODE_COMMANDS}}}
```

Note: Commands are defined in steering documents.
