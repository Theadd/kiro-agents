# Kiro Protocols - Usage Guide

Quick reference for loading and using protocols in your steering documents, agents, and powers.

## Loading Protocols

### Method 1: Direct Load (Recommended)

Use Kiro's built-in `kiroPowers` tool to load protocols on-demand:

```markdown
**When user requests agent activation:**

1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow all steps from the loaded protocol
4. Use agent name as parameter throughout
```

**Benefits:**
- ✅ Loads only when needed (minimal context)
- ✅ Uses Kiro's native power system
- ✅ Automatic updates when power updates
- ✅ Clear dependency on kiro-protocols power

### Method 2: Instruction Alias

Create reusable command aliases that load protocols:

```markdown
<alias>
  <trigger>/protocol {protocol_name}</trigger>
  <definition>
## Load Protocol: {protocol_name}

**Execute protocol loading:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{protocol_name}.md"
3. Follow all steps from the loaded protocol
  </definition>
</alias>
```

**Usage:**
```
User: /protocol agent-activation
AI: [Loads agent-activation.md and follows steps]
```

**Benefits:**
- ✅ User-friendly command syntax
- ✅ Reusable across multiple contexts
- ✅ Parameter substitution support
- ✅ Can be extended with custom logic

### Method 3: Conditional Load

Load protocols only when specific conditions are met:

```markdown
**When user types `/agents {name}`:**

If agent name provided:
  1. Load agent-activation protocol
  2. Execute with agent name parameter
  
If no agent name:
  1. Load agent-management protocol
  2. Show interactive menu
```

**Benefits:**
- ✅ Smart loading based on context
- ✅ Reduces unnecessary protocol loads
- ✅ Better user experience
- ✅ Optimized context usage

## Available Protocols

### Agent System

#### agent-activation.md
**Purpose:** Activate and assume agent role

**When to use:**
- User types `/agents {name}`
- Switching to specific agent
- Loading agent definition

**Parameters:**
- `agent_name` - Name of agent to activate

**Example:**
```markdown
When user types `/agents kiro-master`:
1. Load agent-activation protocol
2. Pass "kiro-master" as agent_name
3. Read `.kiro/agents/kiro-master.md`
4. Assume agent role and begin interaction
```

#### agent-management.md
**Purpose:** Interactive agent management interface

**When to use:**
- User types `/agents` (no parameter)
- Managing existing agents
- Creating new agents
- Viewing agent details

**Features:**
- Chit-chat mode interface
- Directory scanning
- CRUD operations
- Interactive wizard

**Example:**
```markdown
When user types `/agents`:
1. Load agent-management protocol
2. Scan `.kiro/agents/` directory
3. Present interactive menu
4. Handle user selection
```

#### agent-creation.md
**Purpose:** Step-by-step agent creation wizard

**When to use:**
- User selects "Create new agent"
- Building custom agent
- Guided agent setup

**Workflow:**
1. Gather agent information
2. Collect capabilities
3. Define interaction protocol
4. Generate agent file
5. Validate and offer activation

**Example:**
```markdown
When user chooses "Create new agent":
1. Load agent-creation protocol
2. Start interactive wizard
3. Collect agent details
4. Generate `.kiro/agents/{name}.md`
5. Offer to activate new agent
```

### Mode System

#### mode-switching.md
**Purpose:** Switch between Kiro modes (vibe/spec)

**When to use:**
- User types `/modes {mode}`
- Changing interaction style
- Switching workflows

**Parameters:**
- `mode_name` - Name of mode (vibe/spec)

**Workflow:**
1. Load mode definition
2. Preserve context
3. Check workflow state
4. Execute mode switch
5. Begin mode interaction

**Example:**
```markdown
When user types `/modes spec`:
1. Load mode-switching protocol
2. Pass "spec" as mode_name
3. Read `kiro-spec-mode.md`
4. Warn about workflow state
5. Switch to spec mode
```

#### mode-management.md
**Purpose:** Interactive mode management interface

**When to use:**
- User types `/modes` (no parameter)
- Exploring available modes
- Comparing modes
- Getting mode help

**Features:**
- Mode selection menu
- Mode comparison
- Detailed mode information
- Help and guidance

**Example:**
```markdown
When user types `/modes`:
1. Load mode-management protocol
2. Detect available modes
3. Present selection menu
4. Handle user choice
```

## Integration Patterns

### Pattern 1: Agent System Integration

```markdown
# agents.md (steering document)

---
inclusion: manual
description: "Interactive agent management"
---

# Agent Management

## Parameter Detection

If user provides agent name (e.g., `/agents kiro-master`):
1. Load agent-activation protocol from kiro-protocols
2. Pass agent name as parameter
3. Execute activation steps

If no agent name (e.g., `/agents`):
1. Load agent-management protocol from kiro-protocols
2. Show interactive menu
3. Handle user selection

## Protocol Loading

**Activation:**
```
Call kiroPowers action="readSteering" 
  with powerName="kiro-protocols", 
  steeringFile="agent-activation.md"
```

**Management:**
```
Call kiroPowers action="readSteering"
  with powerName="kiro-protocols",
  steeringFile="agent-management.md"
```
```

### Pattern 2: Mode System Integration

```markdown
# modes.md (steering document)

---
inclusion: manual
description: "Interactive mode management"
---

# Mode Management

## Parameter Detection

If user provides mode name (e.g., `/modes spec`):
1. Load mode-switching protocol from kiro-protocols
2. Pass mode name as parameter
3. Execute switch steps

If no mode name (e.g., `/modes`):
1. Load mode-management protocol from kiro-protocols
2. Show mode selection menu
3. Handle user choice

## Protocol Loading

**Switching:**
```
Call kiroPowers action="readSteering"
  with powerName="kiro-protocols",
  steeringFile="mode-switching.md"
```

**Management:**
```
Call kiroPowers action="readSteering"
  with powerName="kiro-protocols",
  steeringFile="mode-management.md"
```
```

### Pattern 3: Custom Power Integration

```markdown
# my-power/steering/workflow.md

When complex workflow needed:

**Step 1: Load base protocol**
```
Call kiroPowers action="readSteering"
  with powerName="kiro-protocols",
  steeringFile="agent-management.md"
```

**Step 2: Apply custom logic**
- Use chit-chat interaction pattern from protocol
- Add power-specific steps
- Maintain protocol structure

**Step 3: Execute workflow**
- Follow protocol steps
- Inject custom functionality
- Preserve protocol benefits
```

## Best Practices

### For Protocol Consumers

1. **Load on-demand** - Don't load protocols upfront
   ```markdown
   ❌ Bad: Load all protocols at start
   ✅ Good: Load protocol when user triggers action
   ```

2. **Pass parameters explicitly** - Make dependencies clear
   ```markdown
   ❌ Bad: Assume agent name from context
   ✅ Good: Pass agent_name as explicit parameter
   ```

3. **Follow protocol steps** - Don't skip or reorder
   ```markdown
   ❌ Bad: Jump to Step 3 directly
   ✅ Good: Execute Step 1 → Step 2 → Step 3
   ```

4. **Handle errors gracefully** - Protocols include error guidance
   ```markdown
   ✅ If protocol load fails, show user-friendly error
   ✅ Suggest installing kiro-protocols power
   ✅ Provide fallback behavior
   ```

### For Protocol Authors

1. **Keep protocols focused** - One workflow per protocol
2. **Use clear step numbers** - Sequential, easy to follow
3. **Include examples** - Show expected inputs/outputs
4. **Document parameters** - List all required/optional params
5. **Test thoroughly** - Verify protocol works in isolation

## Troubleshooting

### Protocol Not Loading

**Error:** "Protocol not found: agent-activation.md"

**Causes:**
- kiro-protocols power not installed
- Power outdated
- Incorrect protocol name

**Solutions:**
1. Install kiro-protocols power in Kiro IDE
2. Update power to latest version
3. Check protocol name spelling (case-sensitive)
4. Verify protocol exists in available list

### Context Overflow

**Error:** "Context limit exceeded"

**Causes:**
- Too many protocols loaded at once
- Loading protocols upfront instead of on-demand
- Large protocol files

**Solutions:**
1. Load protocols only when needed
2. Unload unused protocols from context
3. Use conditional loading patterns
4. Consider splitting large protocols

### Parameter Not Substituted

**Error:** Protocol references `{agent_name}` literally

**Causes:**
- Parameter not passed to protocol
- Incorrect parameter name
- Protocol doesn't support parameters

**Solutions:**
1. Pass parameters explicitly when loading
2. Check parameter name matches protocol expectation
3. Review protocol documentation for parameter support

## Examples

### Example 1: Simple Agent Activation

```markdown
User: /agents kiro-master

AI executes:
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow protocol steps with agent_name="kiro-master"
4. Read `.kiro/agents/kiro-master.md`
5. Assume kiro-master role
6. Begin interaction as kiro-master
```

### Example 2: Interactive Agent Management

```markdown
User: /agents

AI executes:
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-management.md"
3. Scan `.kiro/agents/` directory
4. Present interactive menu with options
5. Wait for user selection
6. Handle selection (activate, create, manage, etc.)
```

### Example 3: Mode Switching with Warning

```markdown
User: /modes spec

AI executes:
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="mode-switching.md"
3. Check current mode (if in spec mode, warn about state loss)
4. Load `kiro-spec-mode.md` definition
5. Preserve file changes and context
6. Reset workflow state
7. Begin spec mode interaction
```

## Advanced Usage

### Chaining Protocols

Load multiple protocols in sequence:

```markdown
**Complex workflow:**

1. Load agent-management protocol
   - Show interactive menu
   - User selects "Create new agent"

2. Load agent-creation protocol
   - Run creation wizard
   - Generate agent file

3. Load agent-activation protocol
   - Activate newly created agent
   - Begin agent interaction
```

### Conditional Protocol Selection

Choose protocol based on context:

```markdown
**Smart protocol loading:**

If user is in spec mode:
  Load mode-switching protocol with warning
Else:
  Load mode-switching protocol without warning

If agent directory empty:
  Load agent-creation protocol (auto-create initial agent)
Else:
  Load agent-management protocol (show existing agents)
```

### Custom Protocol Extensions

Extend protocols with custom logic:

```markdown
**Extended agent activation:**

1. Load agent-activation protocol (base behavior)
2. Add custom pre-activation checks:
   - Verify agent file exists
   - Check agent version compatibility
   - Validate agent dependencies
3. Execute protocol steps
4. Add custom post-activation actions:
   - Log activation event
   - Update agent usage stats
   - Notify user of agent capabilities
```

---

**Need help?** Open an issue: https://github.com/Theadd/kiro-agents/issues
