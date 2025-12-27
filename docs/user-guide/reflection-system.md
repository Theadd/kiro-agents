# Reflection System

The reflection system enables AI agents to capture and reuse knowledge across conversations, building institutional memory over time.

## What Is Reflection?

**The Problem:** AI agents forget everything when a conversation ends. They repeat mistakes, forget your preferences, and can't learn from experience.

**The Solution:** A smart memory system where agents automatically capture insights during work, you review them for quality, and approved insights become available to all agents.

## How It Works

```
1. Agent discovers insight during work
   ↓
2. Agent writes to draft file immediately
   ↓
3. You review drafts with reflection-curator agent
   ↓
4. Approved insights move to appropriate tier
   ↓
5. All agents automatically use approved insights
```

## Quick Start

### Enable Reflection (Session-Temporary)

```
/reflect
```

This enables reflection for your current agent for this session only. The agent will capture insights as it works.

### Review Draft Insights

```
/reflect review
```

This activates the reflection-curator agent to review pending drafts. The curator will:
- Show each draft insight
- Validate quality
- Ask which tier to approve to
- Move approved insights to the right place

### Permanent Enablement

To permanently enable reflection on an agent:

1. Activate reflection-curator: `/agents reflection-curator`
2. Use the manager workflow to enable multiple agents at once
3. Choose permanent enablement when prompted

## Insight Tiers

The reflection system organizes insights into 4 tiers based on scope:

### 1. Universal Insights

**Used by:** ALL agents  
**File:** `.ai-storage/reflections/approved/universal.md`

**Examples:**
- Markdown formatting preferences
- Approval protocols before file changes
- Team-wide coding standards
- General best practices

**When to use:** Insight applies to every agent without exception

### 2. Category Insights

**Used by:** Agents of specific type (architects, developers, analysts, etc.)  
**Files:** `.ai-storage/reflections/approved/categories/{category}.md`

**Examples:**
- Architecture patterns (for architect agents)
- Testing conventions (for developer agents)
- Analysis techniques (for analyst agents)
- Code review standards (for reviewer agents)

**When to use:** Insight applies to all agents of a specific type

### 3. Agent-Specific Insights

**Used by:** One specific agent only  
**Files:** `.ai-storage/reflections/approved/agents/{agent-name}.md`

**Examples:**
- Agent-specific workflow preferences
- Learned behaviors from past sessions
- Agent-unique capabilities
- Personal interaction patterns

**When to use:** Insight only makes sense for one particular agent

### 4. Project Insights

**Used by:** All agents working on this project  
**File:** `.ai-storage/reflections/approved/project.md`

**Examples:**
- "This project uses Bun for package management"
- "Build system uses centralized manifest in src/manifest.ts"
- "Authentication is in the auth/ directory"
- "API endpoints are documented in docs/api.md"

**When to use:** Insight is about this specific project's structure or conventions

## Storage Structure

```
.ai-storage/
└── reflections/
    ├── drafts/              # Pending insights awaiting review
    │   ├── universal.md
    │   ├── project.md
    │   ├── categories/
    │   │   └── {category}.md
    │   └── agents/
    │       └── {agent-name}.md
    └── approved/            # Approved insights by tier
        ├── universal.md
        ├── project.md
        ├── categories/
        │   └── {category}.md
        └── agents/
            └── {agent-name}.md
```

**Note:** This directory is created automatically when the first insight is recorded. No initialization required!

## Insight Types

Each reflection file has 4 subsections for different types of knowledge:

### Insights

General knowledge, preferences, and standards

**Example:**
```markdown
- Markdown: Use 4 backticks for outer blocks, 3 for inner blocks when 
  showing nested code examples. This prevents premature block closure.
```

### Patterns

Reusable approaches, workflows, and solutions

**Example:**
```markdown
- Workspace Detection: Always check for development files (src/, package.json) 
  before implementation. External workspaces require proposal-only mode.
```

### Decisions

Important choices made and their rationale

**Example:**
```markdown
- Protocol Organization: Use 4-tier hierarchy (Universal, Category, Agent, 
  Project) instead of flat structure. Rationale: Better scalability and 
  clearer separation of concerns.
```

### Learnings

Lessons from successes or failures

**Example:**
```markdown
- Build Validation: `bun run dev` with 5-second timeout is sufficient for 
  validation. Full test suite not needed for quick iteration cycles.
```

## Workflow Details

### Phase 1: Agent Captures Insight

**When:** Agent discovers something worth remembering during work

**What happens:**
1. Agent determines appropriate tier (Universal, Category, Agent, Project)
2. Agent checks if draft file exists
3. If first time: Creates draft file with all subsections
4. If exists: Appends to appropriate subsection
5. Agent continues working

**Result:** Insight saved to draft file, waiting for review

**User sees:**
```
💡 Insight captured in drafts (pending curator review)
```

### Phase 2: Curator Reviews Drafts

**When:** You run `/reflect review`

**What happens:**
1. Curator loads all draft files
2. For each draft insight:
   - Shows insight content
   - Validates quality (specific, contextual, concise, useful)
   - Asks which tier to approve to
   - Options: Universal, Category, Agent-Specific, Project, Reject, Skip
3. Moves approved insights to appropriate tier
4. Removes from draft file

**Result:** High-quality insights moved to approved tiers

### Phase 3: Agents Use Approved Insights

**When:** Agent with Reflections section loads

**What happens:**
1. Agent definition contains file references to all 4 tiers
2. File references resolve to actual approved insights
3. Agent reads and applies insights during work
4. Cycle repeats (agent discovers new insights → draft → review → approved)

## Enablement Levels

### Level 1: Session-Temporary

**Command:** `/reflect`

**Behavior:**
- Adds Reflections section to current agent for this session only
- Reflection active while using this agent
- Removed when session ends or agent changes
- Next session: agent returns to original state

**Use case:** Quick testing, one-off reflection capture

### Level 2: Permanent

**How:** Via reflection-curator agent with manager workflow

**Behavior:**
- Reflections section added to agent definition file
- Persists between sessions
- Always active when agent is loaded
- Requires explicit removal to disable

**Use case:** Agents that should always capture insights

### Level 3: Workspace-Wide

**How:** Via reflection-curator agent with batch operations

**Behavior:**
- Enable multiple agents at once
- Mix of temporary and permanent enablement
- Selective ranges: "1, 4, 10" or "1-5, 10, 15-16"

**Use case:** Migrating existing workspaces to reflection system

## Quality Standards

Good insights are:

✅ **Specific and actionable** - Can be applied immediately  
✅ **Include context** - Explain why it matters  
✅ **Concise but complete** - Brief yet comprehensive  
✅ **Useful for future** - Valuable long-term

Avoid:

❌ Vague statements ("be careful")  
❌ Obvious facts ("files have names")  
❌ Temporary information ("bug in line 42")  
❌ Personal opinions without rationale

## Commands Reference

```
/reflect              Enable reflection (session-temporary)
/reflect review       Review draft insights
/agents reflection-curator   Activate curator agent for batch operations
```

## Benefits

### For Individual Developers

**Persistent Memory:**
- AI remembers your preferences across conversations
- No need to repeat yourself
- Consistent behavior across sessions

**Learning Over Time:**
- AI gets better at your project
- Learns from mistakes
- Adapts to your workflow

**Time Savings:**
- Less correcting the AI
- Fewer repeated explanations
- Faster iterations

### For Teams

**Shared Knowledge:**
- Everyone's AI learns from everyone
- Consistent AI behavior across team
- Best practices captured automatically

**Onboarding:**
- New team members' AI starts smart
- Project conventions already known
- Less ramp-up time

**Quality:**
- Curator ensures high-quality insights
- No noise or bad advice
- Only valuable insights shared

### For Projects

**Documentation:**
- Patterns documented automatically
- Conventions captured as discovered
- Living knowledge base

**Consistency:**
- All AI agents follow same patterns
- Reduces confusion and conflicts
- Maintains code quality

## Privacy and Control

### What's Private (Not in Git)

**Drafts:**
- Your personal AI working area
- Not shared until you approve
- Can reject anything you don't like

### What's Shared (In Git)

**Approved Insights:**
- Only what you explicitly approve
- High-quality, reviewed content
- Benefits entire team

### You're Always in Control

- Review every insight before sharing
- Reject anything you don't like
- Edit insights before approval
- Turn system off anytime
- Delete insights anytime

## Troubleshooting

### No Insights Being Captured

**Check:**
- Is reflection enabled? Run `/reflect` to enable
- Is agent working? Insights captured during active work
- Are you using an agent with Reflections section?

**Solution:** Enable reflection with `/reflect` command

### Draft Files Not Appearing

**Check:**
- Has agent captured any insights yet?
- Is `.ai-storage/reflections/drafts/` directory present?

**Solution:** Files created on-demand when first insight is recorded. Work with agent normally.

### Approved Insights Not Loading

**Check:**
- Does agent definition have Reflections section?
- Do approved files exist in `.ai-storage/reflections/approved/`?
- Are file references correct in agent definition?

**Solution:** Review drafts with `/reflect review` to create approved files

### Too Many Low-Quality Insights

**Check:**
- Is curator validating properly?
- Are quality standards being followed?

**Solution:** Use curator's refinement suggestions, reject low-quality insights

## Best Practices

### Capture Insights Immediately

Don't wait until end of session. Capture insights as you discover them.

### Review Regularly

Review drafts periodically (weekly or after major work sessions) to keep approved insights current.

### Be Selective

Not every observation needs to be an insight. Focus on truly valuable knowledge.

### Use Appropriate Tiers

Choose the right tier based on scope. When in doubt, start narrow (Agent-Specific) and promote to broader tiers if useful.

### Maintain Quality

Use curator's quality checklist. Reject vague or obvious insights.

### Keep It Current

Periodically review approved insights and remove outdated information.

## Advanced Usage

### Batch Enablement

Enable reflection on multiple agents at once:

1. Activate curator: `/agents reflection-curator`
2. Use manager workflow
3. Select agents by range ("1-5, 10") or category
4. Choose permanent or temporary enablement

### Selective Review

Skip insights during review to process later. Curator preserves skipped insights in draft files.

### Insight Refinement

Curator can suggest improvements to vague insights. Accept refinements or reject entirely.

### Category Management

Create custom agent categories in agent definitions to organize category-tier insights.

## Learn More

- **Curator Agent:** `.kiro/agents/reflection-curator.md` - Full agent definition
- **Protocols:** `~/.kiro/powers/kiro-protocols/steering/reflect-*.md` - Detailed workflows
- **Proposal:** `proposals/ai-managed-storage-and-reflection-system-v2.md` - Design rationale

---

**Start capturing insights today with `/reflect` and build your AI's institutional memory!**
