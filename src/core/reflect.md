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

#[[file:.ai-storage/reflections/approved/universal.md]]

### Agent-Specific Insights

#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md]]

### Project Insights

#[[file:.ai-storage/reflections/approved/project.md]]

### Pending Review

Insights captured in previous sessions, awaiting user review via `/reflect review`.

#[[file:.ai-storage/reflections/drafts/agents/{agent-name}.md]]
````

**Important:** Replace `{agent-name}` with actual value from agent definition frontmatter.

**Step 3: Load capture protocol**

Load the protocol that enables insight capture:

```
/only-read-protocols reflect-agent-insights.md
```

This protocol is loaded **only for this session**. Next session without `/reflect` will not have capture capability.

**Step 4: Capture Previous Insights**

Immediately scan the current conversation for insights discovered before reflection was enabled.

**Process:**

1. **Review conversation history** - Look for:
   - Patterns you identified
   - Decisions you made
   - Learnings you discovered
   - Important insights you mentioned
   - User preferences you learned
   - Technical discoveries you made

2. **If insights found:**
   - For each insight:
     - Determine type (INSIGHT, PATTERN, DECISION, LEARNING)
     - Determine tier (Universal, Agent-Specific, Project)
     - Format according to protocol in reflect-agent-insights.md
   - Write to draft file:
     - Use the recording process from reflect-agent-insights.md protocol
     - File: `.ai-storage/reflections/drafts/agents/{agent-name}.md`
     - If first insight: Use fsWrite to create file with all sections
     - If file exists: Use fsAppend to add insights
   - Count insights by type:
     - Total insights captured
     - Breakdown by type (Insights, Patterns, Decisions, Learnings)
   - Proceed to Step 5 with capture summary

3. **If no insights found:**
   - Skip file creation (no draft file needed yet)
   - Proceed to Step 5 with "no insights" message

**Then proceed to Step 5 with appropriate message.**

**Step 5: Show confirmation**

**If previous insights were captured:**

```diff
✅ REFLECTION ENABLED FOR THIS SESSION

Agent: {agent-name}

Reflections section: Added to agent file (permanent)
Capture protocol: Loaded in context (this session only)

💡 INSIGHTS CAPTURED FROM CONVERSATION

Total: {count} insights
├─ Insights: {insights-count}
├─ Patterns: {patterns-count}
├─ Decisions: {decisions-count}
└─ Learnings: {learnings-count}

Written to: .ai-storage/reflections/drafts/agents/{agent-name}.md

Reflection files:
- Universal: .ai-storage/reflections/approved/universal.md
- Agent: .ai-storage/reflections/approved/agents/{agent-name}.md
- Project: .ai-storage/reflections/approved/project.md

Next steps:
1. Continue working - I'll capture new insights as they arise
2. Review drafts - Use /reflect review when ready
```

**If no previous insights found:**

```diff
✅ REFLECTION ENABLED FOR THIS SESSION

Agent: {agent-name}

Reflections section: Added to agent file (permanent)
Capture protocol: Loaded in context (this session only)

No previous insights found in conversation.

Reflection files:
- Universal: .ai-storage/reflections/approved/universal.md
- Agent: .ai-storage/reflections/approved/agents/{agent-name}.md
- Project: .ai-storage/reflections/approved/project.md

Draft file:
- .ai-storage/reflections/drafts/agents/{agent-name}.md

I'll capture insights as we continue working. Use /reflect review to review drafts.
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
