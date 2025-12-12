# Protocol Loading with Instruction Aliases

Examples of how to load and use protocols from kiro-protocols power using instruction aliases.

## Basic Protocol Alias

Load any protocol by name:

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
/protocol agent-activation
/protocol agent-management
/protocol mode-switching
```

## Agent Activation Alias

Specific alias for activating agents:

```markdown
<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

You are now activating the **{agent_name}** agent.

**Load and execute activation protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow all steps from the "Agent Activation Steps" section
4. Use `{agent_name}` as the agent identifier throughout the protocol
5. Read `.kiro/agents/{agent_name}.md` into context
6. Assume agent role and begin interaction
  </definition>
</alias>
```

**Usage:**
```
/agents kiro-master
/agents refactor-architect
/agents test-specialist
```

## Agent Management Alias

Interactive agent management without parameters:

```markdown
<alias>
  <trigger>/agents</trigger>
  <definition>
## Agent Management Mode

You are now entering **agent management mode**.

**Load and execute management protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-management.md"
3. Follow all steps from the "Agent Management Steps" section
4. Scan `.kiro/agents/` directory for available agents
5. Present interactive menu with options
6. Handle user selection
  </definition>
</alias>
```

**Usage:**
```
/agents
```

## Mode Switching Alias

Switch between Kiro modes:

```markdown
<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

**Load and execute mode switching protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="mode-switching.md"
3. Follow all steps from the "Mode Switch Steps" section
4. Use `{mode_name}` as the mode identifier throughout the protocol
5. Read `kiro-{mode_name}-mode.md` from agent-system directory into context
6. Preserve context and check workflow state
7. Begin mode interaction
  </definition>
</alias>
```

**Usage:**
```
/modes vibe
/modes spec
```

## Mode Management Alias

Interactive mode management:

```markdown
<alias>
  <trigger>/modes</trigger>
  <definition>
## Mode Management

You are now entering **mode management mode**.

**Load and execute mode management protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="mode-management.md"
3. Follow all steps from the "Mode Management Steps" section
4. Detect available modes
5. Present mode selection menu
6. Handle user choice
  </definition>
</alias>
```

**Usage:**
```
/modes
```

## Conditional Protocol Loading

Load different protocols based on parameters:

```markdown
<alias>
  <trigger>/agent-action {action} {target}</trigger>
  <definition>
## Agent Action: {action} on {target}

**Determine protocol to load:**

If action is "activate":
  1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
  2. Execute activation with target="{target}"

If action is "create":
  1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-creation.md"
  2. Execute creation wizard with name="{target}"

If action is "manage":
  1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-management.md"
  2. Show management interface for agent="{target}"
  </definition>
</alias>
```

**Usage:**
```
/agent-action activate kiro-master
/agent-action create new-agent
/agent-action manage existing-agent
```

## Chained Protocol Loading

Load multiple protocols in sequence:

```markdown
<alias>
  <trigger>/create-and-activate {agent_name}</trigger>
  <definition>
## Create and Activate Agent: {agent_name}

**Execute multi-protocol workflow:**

**Step 1: Create agent**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-creation.md"
3. Follow creation steps with name="{agent_name}"
4. Generate `.kiro/agents/{agent_name}.md`

**Step 2: Activate agent**
1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
2. Follow activation steps with agent_name="{agent_name}"
3. Assume agent role and begin interaction
  </definition>
</alias>
```

**Usage:**
```
/create-and-activate my-new-agent
```

## Protocol with Custom Logic

Extend protocol with custom behavior:

```markdown
<alias>
  <trigger>/smart-agent {agent_name}</trigger>
  <definition>
## Smart Agent Activation: {agent_name}

**Pre-activation checks:**
1. Verify `.kiro/agents/{agent_name}.md` exists
2. Check agent file is valid markdown
3. Validate frontmatter has required fields

**Load protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow all activation steps

**Post-activation actions:**
1. Log activation event to `.kiro/logs/agent-activations.log`
2. Display agent capabilities summary
3. Show quick command reference
4. Begin agent interaction
  </definition>
</alias>
```

**Usage:**
```
/smart-agent kiro-master
```

## Error Handling

Protocol loading with fallback:

```markdown
<alias>
  <trigger>/safe-protocol {protocol_name}</trigger>
  <definition>
## Safe Protocol Load: {protocol_name}

**Attempt protocol loading:**

Try:
  1. Call kiroPowers action="activate" with powerName="kiro-protocols"
  2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{protocol_name}.md"
  3. Follow protocol steps

Catch error:
  1. Display user-friendly error message
  2. Suggest installing kiro-protocols power
  3. Provide manual steps as fallback
  4. Continue with degraded functionality
  </definition>
</alias>
```

**Usage:**
```
/safe-protocol agent-activation
```

## Integration Example

Complete steering document using protocol aliases:

```markdown
---
inclusion: always
description: "Agent system with protocol loading"
---

# Agent System

## Agent Activation Alias

<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

**Load and execute activation protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow all steps with agent_name="{agent_name}"
  </definition>
</alias>

## Agent Management Alias

<alias>
  <trigger>/agents</trigger>
  <definition>
## Agent Management Mode

**Load and execute management protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-management.md"
3. Follow all steps from protocol
  </definition>
</alias>

## Usage

User can now type:
- `/agents` - Interactive management
- `/agents kiro-master` - Activate specific agent
```

## Best Practices

### 1. Load on Demand

```markdown
✅ Good: Load protocol when command is executed
<alias>
  <trigger>/command</trigger>
  <definition>
  [Load protocol here when command runs]
  </definition>
</alias>

❌ Bad: Load protocol upfront in steering document
[Protocol content embedded directly]
```

### 2. Pass Parameters Explicitly

```markdown
✅ Good: Pass parameters to protocol
Use `{agent_name}` as the agent identifier

❌ Bad: Assume parameters from context
Use the agent name from earlier conversation
```

### 3. Handle Errors Gracefully

```markdown
✅ Good: Provide fallback behavior
Try loading protocol, if fails show error and continue

❌ Bad: Fail silently
Protocol not found, do nothing
```

### 4. Document Dependencies

```markdown
✅ Good: State required powers
Requires: kiro-protocols power installed

❌ Bad: Assume power is installed
[No mention of dependencies]
```

## Testing

Test your protocol aliases:

1. **Create test steering file:**
   ```bash
   touch .kiro/steering/test-protocols.md
   ```

2. **Add alias:**
   ```markdown
   <alias>
     <trigger>/test-protocol</trigger>
     <definition>
     [Your protocol loading logic]
     </definition>
   </alias>
   ```

3. **Test in Kiro IDE:**
   ```
   /test-protocol
   ```

4. **Verify:**
   - Protocol loads correctly
   - Parameters substitute properly
   - Steps execute in order
   - Error handling works

## Troubleshooting

### Alias Not Working

**Problem:** Typing `/command` does nothing

**Solutions:**
1. Check alias syntax (XML format)
2. Verify trigger matches exactly
3. Ensure steering file has `inclusion: always` or is loaded
4. Restart Kiro IDE to reload steering

### Protocol Not Loading

**Problem:** Error "Protocol not found"

**Solutions:**
1. Install kiro-protocols power
2. Check protocol name spelling
3. Verify protocol exists in power
4. Update power to latest version

### Parameters Not Substituting

**Problem:** `{parameter}` appears literally

**Solutions:**
1. Check parameter name matches trigger
2. Verify curly brace syntax `{param}`
3. Test with simple parameter first
4. Review instruction alias documentation

---

**More examples:** See [powers/kiro-protocols/USAGE.md](../powers/kiro-protocols/USAGE.md)
