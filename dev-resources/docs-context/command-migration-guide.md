# Command Migration Guide

## Overview

This guide explains how to migrate from the current instruction alias system to the optimized Power-compatible command structure.

## The ENTER Key Problem

**Current Issue**: Commands without parameters get captured by Kiro's native slash command system, preventing ENTER from sending the message.

**Root Cause**: Kiro's UI intercepts slash commands for autocomplete/selection.

**Solution**: Split commands by parameter presence:
- **No parameters** → Native slash commands (steering with `inclusion: manual`)
- **With parameters** → Instruction aliases (work as normal text after space)

## Command Migration Map

### Agent Commands

| Current | New | Type | Notes |
|---------|-----|------|-------|
| `/agents` | `/agents` | Native slash command | Interactive UI, no parameters |
| `/agent {name}` | `/agents {name}` | Instruction alias | Same command + space + param, ENTER works |

### Mode Commands

| Current | New | Type | Notes |
|---------|-----|------|-------|
| `/modes` | `/modes` | Native slash command | Interactive UI, no parameters |
| `/mode {name}` | `/modes {name}` | Instruction alias | Same command + space + param, ENTER works |

### Strict Mode Commands

| Current | New | Type | Notes |
|---------|-----|------|-------|
| N/A | `/strict` | Native slash command | Interactive userInput with buttons |
| `/strict {state}` | `/strict {state}` | Instruction alias | Same command + space + param, ENTER works |

## File Structure Changes

### Before

```
.kiro/steering/
├── agent-system.md           # Contains both /agents and /agent {name}
└── modes-system.md           # Contains both /modes and /mode {name}
```

### After

```
.kiro/steering/
├── agent-system.md           # inclusion: always, contains /agents {name} alias
├── agents.md                 # inclusion: manual, interactive interface
├── modes-system.md           # inclusion: always, contains /modes {name} alias
├── modes.md                  # inclusion: manual, interactive interface
├── strict-mode.md            # inclusion: always, contains /strict {state} alias
└── strict.md                 # inclusion: manual, interactive userInput interface
```

## Implementation Steps

### Step 1: Extract Management Commands

**Create `agents.md`:**

```markdown
---
inclusion: manual
---

# Agent Management

You are now in **agent management mode** using chit-chat interaction protocol.

## Step 1: Load Chit-Chat Mode
[... existing /agents logic ...]

## Step 2: Scan Agents Directory
[... existing logic ...]

## Step 3: Present Agent Selection
[... existing logic ...]
```

**Create `modes.md`:**

```markdown
---
inclusion: manual
---

# Mode Management

You are now in **mode management** using chit-chat interaction protocol.

## Step 1: Load Chit-Chat Mode
[... existing /modes logic ...]

## Step 2: Detect Available Modes
[... existing logic ...]

## Step 3: Present Mode Selection
[... existing logic ...]
```

**Create `strict.md`:**

```markdown
---
inclusion: manual
---

# Strict Mode Control

Interactive control for STRICT_MODE using userInput tool.

## Current State

Check current STRICT_MODE state and present options.

## Present Options

Use userInput tool to show interactive buttons:

\`\`\`typescript
userInput({
  question: "# Strict Mode Control\n\nStrict mode blocks execution on ambiguous input and requires explicit clarification.",
  options: [
    {
      title: "🟢 Enable Strict Mode",
      description: "Activate precision mode for critical development",
      recommended: STRICT_MODE === false
    },
    {
      title: "🔴 Disable Strict Mode",
      description: "Return to normal mode with assumption handling",
      recommended: STRICT_MODE === true
    },
    {
      title: "ℹ️ Learn More",
      description: "Understand when and how to use strict mode"
    }
  ],
  reason: "strict-mode-control"
})
\`\`\`

Handle user selection and update STRICT_MODE accordingly.
```

### Step 2: Update Core System Files

**Update `agent-system.md`:**

```markdown
---
inclusion: always
---

# Agent System

[... documentation ...]

## Agent Commands

### Command 1: Activate Specific Agent

<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

You are now activating the **{agent_name}** agent.

[... existing logic ...]
  </definition>
</alias>

### Command 2: Interactive Agent Management

For interactive agent management, use the `/agents` slash command (without parameters).
This provides a visual interface for:
- Viewing all available agents
- Creating new agents
- Managing existing agents
- Viewing agent details

**Usage:**
- Interactive: `/agents` (no parameters)
- Direct: `/agents {name}` (with agent name)

[... remove the full /agents alias definition ...]
```

**Update `modes-system.md`:**

```markdown
---
inclusion: always
---

# Modes System

[... documentation ...]

## Mode Commands

### Command 1: Switch Kiro Mode

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

[... existing logic ...]
  </definition>
</alias>

### Command 2: Interactive Mode Management

For interactive mode management, use the `/modes` slash command (without parameters).
This provides a visual interface for:
- Viewing available modes
- Comparing modes
- Switching modes
- Getting help

**Usage:**
- Interactive: `/modes` (no parameters)
- Direct: `/modes {name}` (with mode name)

[... remove the full /modes alias definition ...]
```

**Update `strict-mode.md`:**

```markdown
---
inclusion: always
---

# Strict Mode

[... documentation ...]

## Strict Mode Commands

### Command 1: Direct State Change

<alias>
  <trigger>/strict {state}</trigger>
  <definition>
## Strict Mode: {state}

Setting STRICT_MODE to **{state}**.

[... existing logic ...]
  </definition>
</alias>

### Command 2: Interactive Control

For interactive strict mode control, use the `/strict` slash command (without parameters).
This provides a visual interface with buttons to:
- Enable strict mode
- Disable strict mode
- Learn more about strict mode

**Usage:**
- Interactive: `/strict` (no parameters, shows userInput buttons)
- Direct: `/strict on` or `/strict off` (with state)

[... add logic for interactive control ...]
```

### Step 3: Update Documentation

**Update POWER.md:**

```markdown
## Available Commands

### Agent Commands
- `/agent-management` - Interactive agent management (native slash command)
- `/agent {name}` - Activate specific agent (type and press ENTER)

### Mode Commands
- `/mode-management` - Interactive mode management (native slash command)
- `/mode {name}` - Switch to specific mode (type and press ENTER)

### Strict Mode
- `/strict {state}` - Control strict mode (type and press ENTER)

## Usage Examples

### Interactive Workflow
```
/agent-management
[Visual menu appears]
[Select option with arrow keys or click]
```

### Fast Workflow
```
/agent kiro-master [ENTER]
/mode spec [ENTER]
/strict on [ENTER]
```
```

## Testing Checklist

### Native Slash Commands (No Parameters)

- [ ] Type `/agents` in chat (no parameters)
- [ ] Verify it appears in slash command menu
- [ ] Select it from menu
- [ ] Verify interactive interface loads
- [ ] Test all menu options

- [ ] Type `/modes` in chat (no parameters)
- [ ] Verify it appears in slash command menu
- [ ] Select it from menu
- [ ] Verify interactive interface loads
- [ ] Test all menu options

- [ ] Type `/strict` in chat (no parameters)
- [ ] Verify it appears in slash command menu
- [ ] Select it from menu
- [ ] Verify userInput buttons appear
- [ ] Test enabling/disabling strict mode via buttons

### Parameterized Commands (With Parameters)

- [ ] Type `/agents kiro-master` in chat
- [ ] Press ENTER
- [ ] Verify agent activates immediately
- [ ] Test with different agent names

- [ ] Type `/modes vibe` in chat
- [ ] Press ENTER
- [ ] Verify mode switches immediately
- [ ] Test with different mode names

- [ ] Type `/strict on` in chat
- [ ] Press ENTER
- [ ] Verify strict mode activates
- [ ] Test `/strict off`

### Edge Cases

- [ ] Type `/agents` (no parameter) + ENTER
  - Should load interactive interface
- [ ] Type `/modes` (no parameter) + ENTER
  - Should load interactive interface
- [ ] Type `/strict` (no parameter) + ENTER
  - Should show userInput buttons
- [ ] Type `/agents extra-text` + ENTER
  - Should try to activate agent named "extra-text"
- [ ] Type partial command like `/age`
  - Should show `/agents` in autocomplete

## Backward Compatibility

### For npm Package Users

The npm package installs to `~/.kiro/steering/` globally. Users will see:

**New commands available:**
- `/agent-management` (new native slash command)
- `/mode-management` (new native slash command)

**Existing commands still work:**
- `/agent {name}` (unchanged)
- `/mode {name}` (unchanged)
- `/strict {state}` (unchanged)

**Deprecated (but documented):**
- `/agents` → Use `/agent-management` instead
- `/modes` → Use `/mode-management` instead

### For Power Users

Power users get the optimized structure automatically:
- Native slash commands for interactive interfaces
- Parameterized aliases for direct commands
- Best UX out of the box

## Migration Timeline

### Phase 1: Create New Files (Week 1)
- Create `agent-management.md`
- Create `mode-management.md`
- Test locally

### Phase 2: Update Core Files (Week 1)
- Update `agent-system.md`
- Update `modes-system.md`
- Update documentation

### Phase 3: Test & Validate (Week 2)
- Test all command variations
- Verify ENTER works for parameterized commands
- Verify native slash commands appear in menu
- Test in both npm and Power distributions

### Phase 4: Release (Week 2)
- Update npm package
- Create Power version
- Publish to GitHub
- Update documentation

### Phase 5: Deprecation (Future)
- Mark old command names as deprecated
- Provide migration guide
- Eventually remove old aliases (optional)

## Benefits Summary

### For Users

1. **Better UX**: Choose interactive menu OR fast typing
2. **ENTER works**: No more frustration with parameterized commands
3. **Discoverable**: Native slash commands appear in Kiro's menu
4. **Flexible**: Use the method that fits your workflow

### For Developers

1. **Cleaner code**: Separation of concerns
2. **Easier maintenance**: Each command type in appropriate file
3. **Better organization**: Clear file structure
4. **Power compatible**: Works perfectly with Kiro Powers system

### For the Ecosystem

1. **Standard pattern**: Other power developers can follow
2. **Best practices**: Demonstrates optimal command structure
3. **Documentation**: Clear examples for community
4. **Compatibility**: Works in both npm and Power distributions

## Troubleshooting

### Command Not Appearing in Menu

**Problem**: `/agent-management` doesn't show in slash command menu

**Solutions**:
- Verify `inclusion: manual` in frontmatter
- Check file is in correct location
- Reload Kiro IDE
- Check for syntax errors in frontmatter

### ENTER Not Working

**Problem**: Pressing ENTER after `/agent kiro-master` doesn't work

**Solutions**:
- Ensure there's a space after the command
- Verify it's not being captured as native slash command
- Check the alias is defined correctly
- Test with different agent names

### Both Commands Showing

**Problem**: Both `/agents` and `/agent-management` appear in menu

**Solutions**:
- Remove old `/agents` alias from `agent-system.md`
- Keep only the reference to `/agent-management`
- Clear Kiro cache if needed

## FAQ

**Q: Why split the commands?**
A: Kiro's native slash command system captures commands without parameters, preventing ENTER from working. Splitting by parameter presence solves this elegantly.

**Q: Do I need to update my existing agents?**
A: No, existing agents continue to work. The change only affects how you invoke the management interfaces.

**Q: Can I still use the old command names?**
A: For now, yes. But we recommend migrating to the new names for better UX.

**Q: Will this work in both npm and Power distributions?**
A: Yes! The structure is designed to work perfectly in both.

**Q: What if I prefer the old way?**
A: You can continue using parameterized commands like `/agent {name}` which work exactly as before.

## Resources

- [Kiro Slash Commands Documentation](https://kiro.dev/docs/chat/slash-commands)
- [Kiro Steering Documentation](https://kiro.dev/docs/steering)
- [Kiro Powers Documentation](https://kiro.dev/docs/powers)
- [GitHub Repository](link-to-repo)

---

**Summary**: This migration optimizes command structure by using native slash commands for interactive interfaces and instruction aliases for parameterized commands, solving the ENTER key problem while improving overall UX.
