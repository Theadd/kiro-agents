# Protocol: Reflection Manager Workflow

This protocol enables batch enablement of reflection system across multiple agents in a workspace.

## When to Use This Protocol

- User wants to enable reflection on multiple agents at once
- Migrating existing workspace to reflection system
- Selective enablement based on agent type or role
- Workspace-wide reflection activation

## Manager Workflow

### Step 1: List All Agents

**Scan agent directory:**

```
{{{WS_AGENTS_PATH}}}/
├── agent-1.md
├── agent-2.md
├── agent-3.md
└── ...
```

**For each agent file:**
1. Read agent definition
2. Check if Reflections section exists
3. Build agent list with status

**Display:**

```diff
📋 AGENT REFLECTION STATUS

# | Agent Name                    | Reflections
--|-------------------------------|------------
1 | kiro-master                   | ✅ Enabled
2 | kiro-external-product-architect| ❌ Disabled
3 | reflection-curator            | ✅ Enabled
4 | custom-agent-1                | ❌ Disabled
5 | custom-agent-2                | ❌ Disabled
...

Total: {count} agents
Enabled: {enabled-count}
Disabled: {disabled-count}
```

### Step 2: Get User Selection

**Ask user which agents to enable:**

```
Which agents should have reflection enabled?

Options:
1. **All disabled agents** - Enable all agents without Reflections
2. **By range** - Enable agents by number (e.g., "2-5, 10, 15-16")
3. **By list** - Enable specific agents (e.g., "1, 4, 10")
4. **Cancel** - Exit without changes

Enter your choice:
```

### Step 3: Parse User Input

**Option 1 (All disabled):**
- Select all agents with ❌ Disabled status
- Proceed to Step 4

**Option 2 (By range):**
- Parse range syntax: "2-5, 10, 15-16"
- Expand ranges: 2, 3, 4, 5, 10, 15, 16
- Select agents by numbers
- Proceed to Step 4

**Option 3 (By list):**
- Parse list syntax: "1, 4, 10"
- Select agents by numbers
- Proceed to Step 4

**Option 4 (Cancel):**
- Exit workflow
- No changes made

### Step 4: Determine Enablement Type

**Ask user:**

```
How should reflection be enabled?

1. **Permanent** - Add Reflections section to agent definitions
2. **Temporary** - Enable for current session only
3. **Mixed** - Ask for each agent individually

Enter your choice:
```

**Apply user choice to selected agents.**

### Step 5: Enable Reflection on Selected Agents

For each selected agent:

#### 5a. Read Agent Definition

```
Read: {{{WS_AGENTS_PATH}}}/{agent-name}.md
```

#### 5b. Check Current State

**If Reflections section already exists:**
- Skip this agent (already enabled)
- Log: "Agent {name} already has Reflections enabled"

**If Reflections section doesn't exist:**
- Proceed to 5c

#### 5c. Add Reflections Section

**For Permanent enablement:**

Use `fsAppend` to add to agent definition:

````markdown

## Reflections

This agent records insights, patterns, and learnings in its dedicated reflection files.

### Universal Insights

#[[file:.ai-storage/reflections/approved/universal.md]]

### Agent-Specific Insights

#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md]]

### Project Insights

#[[file:.ai-storage/reflections/approved/project.md]]
````

**For Temporary enablement:**
- Add to session context only (not to file)
- Log: "Reflections enabled temporarily for {agent-name}"

#### 5d. Log Result

```
✅ Enabled reflection for: {agent-name} ({enablement-type})
```

### Step 6: Report Results

```diff
✅ REFLECTION ENABLEMENT COMPLETE

Processed: {total} agents
├─ Enabled (Permanent): {permanent-count}
├─ Enabled (Temporary): {temporary-count}
├─ Already Enabled: {already-count}
└─ Skipped: {skipped-count}

Modified agent definitions:
- {{{WS_AGENTS_PATH}}}/{agent-1}.md
- {{{WS_AGENTS_PATH}}}/{agent-2}.md
- {{{WS_AGENTS_PATH}}}/{agent-3}.md
...

Next steps:
1. Activate an enabled agent: /agents {agent-name}
2. Record insights during work
3. Review drafts: /reflect review
```

## Range Syntax

### Valid Range Formats

**Single number:**
```
5
```
Result: Agent #5

**Range:**
```
2-5
```
Result: Agents #2, #3, #4, #5

**List:**
```
1, 4, 10
```
Result: Agents #1, #4, #10

**Mixed:**
```
1-3, 7, 10-12
```
Result: Agents #1, #2, #3, #7, #10, #11, #12

### Parsing Algorithm

1. Split input by comma: `["1-3", "7", "10-12"]`
2. For each segment:
   - If contains "-": Parse as range (start-end)
   - If single number: Parse as single selection
3. Expand all ranges to individual numbers
4. Remove duplicates
5. Sort numerically
6. Validate all numbers are within agent count
7. Return list of agent indices

## Category Detection

**Note:** Category tier has been removed. Reflection system now uses 3 tiers:
- Universal (all agents)
- Agent-Specific (one agent)
- Project (this project)

This section is deprecated and kept for reference only.

## Enablement Types

### Permanent

**Behavior:**
- Modifies agent definition file
- Adds Reflections section with file references
- Persists between sessions
- Requires explicit removal to disable

**Use case:**
- Agents that should always capture insights
- Production agents
- Long-term learning

### Temporary

**Behavior:**
- Adds Reflections to session context only
- Does not modify agent definition file
- Removed when session ends or agent changes
- Next session: agent returns to original state

**Use case:**
- Testing reflection system
- One-off insight capture
- Experimental agents

### Mixed

**Behavior:**
- Ask user for each agent individually
- Some permanent, some temporary
- Maximum flexibility

**Use case:**
- Selective enablement
- Different agents have different needs
- Gradual rollout

## Validation

### Before Enabling

**Load quality checklist:**
```
/only-read-protocols reflect-curator-checklist.md
```

**Check:**
- Agent definition file exists
- Agent definition is valid markdown
- Agent definition has proper frontmatter
- No syntax errors in agent definition

**If validation fails:**
- Skip agent
- Log error
- Continue with next agent

### After Enabling

**Verify:**
- Reflections section added correctly
- File references are properly formatted
- No duplicate sections
- Agent definition still valid

**If verification fails:**
- Revert changes
- Log error
- Report to user

## Error Handling

### File Read Errors

**If agent definition cannot be read:**
- Log error: "Cannot read {agent-name}.md"
- Skip agent
- Continue with next agent

### File Write Errors

**If agent definition cannot be modified:**
- Log error: "Cannot modify {agent-name}.md"
- Skip agent
- Continue with next agent

### Invalid Range

**If user provides invalid range:**
- Show error: "Invalid range: {input}"
- Show valid format examples
- Ask user to try again

### No Agents Selected

**If selection results in empty list:**
- Show warning: "No agents selected"
- Ask user to try again or cancel

## Integration Points

### Reflection Curator Agent

Curator agent loads this protocol when user needs batch enablement.

### Agent Definitions

Modified agent definitions immediately gain reflection capabilities.

### File References

Added file references resolve to approved insights (or blank if files don't exist yet).

---

**Use this protocol to efficiently enable reflection across multiple agents.**
