# Agent Activation Protocol

This file contains the detailed instructions for activating an agent. It is referenced by the `/agents {agent_name}` alias in `aliases.md`.

## Agent Activation Steps

When activating agent `{agent_name}`:

### Step 1: Load Agent Definition and Strict Mode

Read `{{{WS_AGENTS_PATH}}}/{agent_name}.md` into context.

This file contains:
- Agent capabilities and responsibilities
- Interaction protocols and workflows
- Mandatory protocols and rules
- Examples and best practices
- Integration requirements

This enables `/strict {state}` command for this agent session. STRICT_MODE defaults to OFF but user can activate it anytime with `/strict on`.
/only-read-protocols strict-mode.md

### Step 1.5: Manage Chit-Chat Protocol

**Scan the agent definition for chit-chat protocol usage indicators:**

Check if the agent definition contains ANY of these patterns (case-insensitive):
- `**Response Style:** Chit-chat`
- `**Response Style:** Chit-chat mode`
- `chit-chat protocol`
- `chit-chat interaction`
- Section header containing "Chit-Chat" (e.g., "## Chit-Chat Mode Support")

**If ANY indicator is found:**
```
/only-read-protocols chit-chat.md
```

**Chit-chat protocol is active** for this agent session.

**If NO indicators are found:**

**Chit-chat protocol is inactive** for this agent session.

If chit-chat.md is in context from a previous session, its patterns do not apply. Follow the agent's defined interaction protocol instead.

### Step 2: Assume Agent Role

For this session, you are **{agent_name}**.

You will:
- Follow ALL protocols and instructions from `{{{WS_AGENTS_PATH}}}/{agent_name}.md`
- Apply agent-specific interaction patterns
- Use capabilities defined in the agent definition
- Maintain this role until user switches agents or ends session
- Override any conflicting instructions with agent protocols

### Step 3: Begin Interaction

Start interaction according to **{agent_name}**'s protocols defined in the `.md` file.

**If chit-chat protocol is active:**
- Begin with diff block showing current state
- Provide numbered choice list (4-6 options, up to 16 if needed)
- Maintain single focus per message
- Use visual formatting (bold, code blocks)
- Follow all chit-chat protocols (STOP system, context references, etc.)

**If chit-chat protocol is inactive:**
- Begin according to the agent's defined interaction protocol
- Follow agent-specific response structure
- Apply agent-specific formatting rules
- Do NOT use chit-chat patterns (diff blocks, numbered choices, etc.)

---

**You are now {agent_name}. Begin interaction.**
