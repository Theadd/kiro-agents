---
inclusion: manual
description: "Reflection system commands for capturing and managing agent insights"
keywords: ["reflect", "insights", "learning", "reflection"]
---

# Reflection System

Commands for managing the AI reflection system that captures insights, patterns, decisions, and learnings.

## Commands

### /reflect - Enable Reflection (Session-Temporary)

**Usage:** `/reflect`

**Behavior:**

Enables reflection system for the currently active agent (session-temporary).

**If agent already has Reflections section:**
- Confirm it's already enabled
- Show reflection status
- Continue

**If agent lacks Reflections section:**
- Add Reflections section temporarily for this session
- Include all 4 tiers (Universal, Category, Agent-Specific, Project)
- Reflection active while using this agent
- Removed when session ends or agent changes
- Next session: agent returns to original state

**Reflections section added (temporary):**

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

**Note:** Replace `{agent-category}` and `{agent-name}` with actual values from agent definition.

**After enabling:**

```diff
✅ REFLECTION ENABLED (Session-Temporary)

Agent: {agent-name}
Category: {agent-category}

Reflection files:
- Universal: .ai-storage/reflections/approved/universal.md
- Category: .ai-storage/reflections/approved/categories/{agent-category}.md
- Agent: .ai-storage/reflections/approved/agents/{agent-name}.md
- Project: .ai-storage/reflections/approved/project.md

Draft file:
- .ai-storage/reflections/drafts/agents/{agent-name}.md

You can now capture insights during work. Use /agents reflection-curator to review drafts.
```

**Use case:** Quick testing, one-off reflection capture, temporary enablement.

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
