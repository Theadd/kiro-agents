# Protocol Loading Example

This document demonstrates how to use the `/protocols` instruction alias to dynamically load protocols from the kiro-protocols Power.

## Overview

The `/protocols {protocol_name}` command allows you to load protocol workflows on-demand without cluttering the Kiro UI with slash commands. This is perfect for loading step-by-step instructions when needed.

## How It Works

When you type `/protocols {protocol_name}`, the system:

1. **Activates kiro-protocols Power** - Loads the Power context
2. **Reads the protocol file** - Loads `{protocol_name}.md` from the Power's steering directory
3. **Executes the protocol** - Follows the step-by-step instructions in the protocol

## Available Protocols

- **agent-activation** - Protocol for activating and assuming agent roles
- **agent-management** - Interactive agent management workflow
- **agent-creation** - Step-by-step agent creation wizard
- **mode-switching** - Protocol for switching between Kiro modes
- **mode-management** - Interactive mode management workflow

## Usage Examples

### Example 1: Load Agent Creation Protocol

```
/protocols agent-creation
```

**What happens:**
1. kiro-protocols Power is activated
2. agent-creation.md protocol is loaded
3. AI follows the agent creation wizard steps
4. User is guided through creating a new agent

### Example 2: Load Mode Switching Protocol

```
/protocols mode-switching
```

**What happens:**
1. kiro-protocols Power is activated
2. mode-switching.md protocol is loaded
3. AI follows the mode switching steps
4. Mode is switched with proper context preservation

### Example 3: Load Agent Management Protocol

```
/protocols agent-management
```

**What happens:**
1. kiro-protocols Power is activated
2. agent-management.md protocol is loaded
3. AI presents interactive agent management menu
4. User can create, activate, manage, or view agents

## Advantages Over File References

### Old Way (File References)
```markdown
Read #[[file:protocols/agent-creation.md]] into context
```

**Problems:**
- Protocol loaded immediately (increases context)
- Always loaded even if not needed
- No parameter substitution
- Manual path management

### New Way (Instruction Alias)
```
/protocols agent-creation
```

**Benefits:**
- ✅ **On-demand loading** - Protocol only loaded when command executed
- ✅ **Reduced context** - Not loaded until needed
- ✅ **Parameter substitution** - Protocol name is a parameter
- ✅ **Power integration** - Uses kiroPowers tools for proper loading
- ✅ **No UI clutter** - Doesn't show in Kiro slash command menu
- ✅ **Flexible** - Can load from any Power, not just local files

## Integration with Other Systems

### Use in Agent Definitions

Agents can reference protocols using the alias:

```markdown
# my-agent.md

When user requests agent creation:
1. Execute `/protocols agent-creation`
2. Follow the loaded protocol steps
3. Create agent with gathered information
```

### Use in Steering Documents

Steering documents can trigger protocol loading:

```markdown
# workflow.md

When complex workflow needed:
1. Load agent management protocol: `/protocols agent-management`
2. Use interactive chit-chat pattern from protocol
3. Guide user through multi-step process
```

### Use in Mode Definitions

Modes can load protocols as part of their workflow:

```markdown
# kiro-spec-mode.md

When entering spec mode:
1. Load mode switching protocol: `/protocols mode-switching`
2. Execute mode switch steps
3. Begin spec mode interaction
```

## Technical Details

### Instruction Alias Definition

```xml
<alias>
  <trigger>/protocols {protocol_name}</trigger>
  <definition>
## Load Protocol: {protocol_name}

You are now loading the **{protocol_name}** protocol from kiro-protocols Power.

**Execute protocol loading:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{protocol_name}.md"
3. Follow all steps from the loaded protocol
  </definition>
</alias>
```

### Parameter Substitution

- `{protocol_name}` is extracted from user input
- Substituted in both the heading and the steeringFile parameter
- Example: `/protocols agent-creation` → `steeringFile="agent-creation.md"`

### kiroPowers Integration

The alias uses kiroPowers tools:
- `action="activate"` - Activates the kiro-protocols Power
- `action="readSteering"` - Reads the specific protocol file
- `powerName="kiro-protocols"` - Specifies which Power to use
- `steeringFile="{protocol_name}.md"` - Specifies which file to read

## Best Practices

1. **Use for complex workflows** - Protocols are best for multi-step processes
2. **Keep protocols focused** - One protocol, one workflow
3. **Document available protocols** - List protocols in your documentation
4. **Test protocol loading** - Verify protocols load correctly before using in production
5. **Combine with other features** - Use with agents, modes, and steering documents

## Troubleshooting

### Protocol Not Found

**Error:** Protocol file doesn't exist

**Solution:**
1. Verify protocol name spelling (case-sensitive)
2. Check available protocols list
3. Ensure kiro-protocols Power is installed
4. Try: `/protocols agent-creation` (known working protocol)

### Power Not Installed

**Error:** kiro-protocols Power not found

**Solution:**
1. Install kiro-protocols Power from GitHub
2. Verify installation in Kiro Powers panel
3. Reload Kiro IDE if needed

### Protocol Doesn't Execute

**Error:** Protocol loads but doesn't execute steps

**Solution:**
1. Check protocol file format (should have clear steps)
2. Verify protocol has "Protocol Steps" section
3. Ensure AI is following protocol instructions
4. Try reloading the protocol

## Future Enhancements

Possible future improvements:
- Auto-completion for protocol names
- Protocol search/discovery
- Protocol versioning
- Protocol dependencies
- Protocol composition (loading multiple protocols)

---

**This example demonstrates the power and flexibility of the `/protocols` instruction alias for dynamic protocol loading.**
