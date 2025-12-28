---
inclusion: manual
description: "Reflection system commands for capturing and managing agent insights"
keywords: ["reflect", "insights", "learning", "reflection"]
---

# Reflection System

Commands for managing the AI reflection system that captures insights, patterns, decisions, and learnings.

## Commands

### /reflect - Enable Reflection for This Session

**Usage:** `/reflect`

**Behavior:**

Enables reflection system for the currently active agent for this session.

**Step 1: Check if agent has Reflections section**

Read the agent definition file: `{{{WS_AGENTS_PATH}}}/{agent-name}.md`

**If agent already has `## Reflections` section:**
- Load capture protocol: `/only-read-protocols reflect-agent-insights.md`
- Show reflection status
- Continue (agent can now capture insights)

**If agent lacks `## Reflections` section:**
- Go to Step 2

**Step 2: Add Reflections section to agent file**

Use `fsAppend` to add the following section to `{{{WS_AGENTS_PATH}}}/{agent-name}.md`:

````markdown

## Reflections

This agent records insights, patterns, and learnings in its dedicated reflection files.

### Universal Insights

#[[file:.ai-storage/reflections/approved/universal.md:insights]]

### Category Insights ({agent-category})

#[[file:.ai-storage/reflections/approved/categories/{agent-category}.md:insights]]

### Agent-Specific Insights

#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md:insights]]

### Project Insights

#[[file:.ai-storage/reflections/approved/project.md:insights]]
````

**Important:** Replace `{agent-category}` and `{agent-name}` with actual values from agent definition frontmatter.

**Step 3: Load capture protocol**

Load the protocol that enables insight capture:

```
/only-read-protocols reflect-agent-insights.md
```

This protocol is loaded **only for this session**. Next session without `/reflect` will not have capture capability.

**Step 4: Show confirmation**

```diff
✅ REFLECTION ENABLED FOR THIS SESSION

Agent: {agent-name}
Category: {agent-category}

Reflections section: Added to agent file (permanent)
Capture protocol: Loaded in context (this session only)

Reflection files:
- Universal: .ai-storage/reflections/approved/universal.md
- Category: .ai-storage/reflections/approved/categories/{agent-category}.md
- Agent: .ai-storage/reflections/approved/agents/{agent-name}.md
- Project: .ai-storage/reflections/approved/project.md

Draft file:
- .ai-storage/reflections/drafts/agents/{agent-name}.md

You can now capture insights during work. Use /reflect review to review drafts.
```

**What "session-only" means:**

- **Reflections section in agent file:** PERMANENT (stays in file)
- **Capture protocol in context:** SESSION-ONLY (not loaded next time)

**Next session behavior:**

- **Without `/reflect`:** Agent reads existing insights but cannot capture new ones
- **With `/reflect`:** Agent reads existing insights AND can capture new ones

**Use case:** Enable reflection on any agent for testing or one-time capture.

---

### /reflect review - Review Draft Insights

**Usage:** `/reflect review`

**Behavior:**

Activates reflection-curator agent and starts draft review workflow.

**Equivalent to:**
```
/agents reflection-curator
```

Then curator agent automatically starts review workflow.

**Use case:** Review pending draft insights and approve them to appropriate tiers.

---

## Reflection System Overview

### Purpose

Enable agents to capture and reuse knowledge across sessions:
- **Insights** - General knowledge, preferences, standards
- **Patterns** - Reusable approaches, workflows, solutions
- **Decisions** - Important choices and their rationale
- **Learnings** - Lessons from successes or failures

### Workflow

1. **Agent captures insight** → Writes to draft file
2. **User reviews drafts** → `/reflect review`
3. **Curator validates** → Checks quality, assigns tier
4. **Insight approved** → Moves to approved file
5. **Agents use insights** → Load via file references

### Insight Tiers

**Universal** - Used by ALL agents  
**Category** - Used by agent type (architects, developers, etc.)  
**Agent-Specific** - Used by one agent only  
**Project** - About this specific project

### Storage Location

```
.ai-storage/reflections/
├── drafts/        - Pending insights
└── approved/      - Approved insights by tier
```

### On-Demand Creation

No initialization required! Files created automatically when:
- Agent records first insight
- Curator approves insight
- Agent loads reflections

## Related Commands

```
/reflect              Enable reflection (session-temporary)
/reflect review       Review draft insights
/agents reflection-curator   Activate curator agent
```

## Learn More

- **README:** `.ai-storage/README.md` - Complete system documentation
- **Curator Agent:** `{{{WS_AGENTS_PATH}}}/reflection-curator.md`
- **Proposal:** `proposals/ai-managed-storage-and-reflection-system-v2.md`

---

**Start capturing insights with `/reflect` and review them with `/reflect review`.**
