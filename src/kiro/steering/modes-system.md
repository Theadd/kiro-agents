---
inclusion: always
description: Kiro mode switching system for flexible interaction styles (vibe/spec modes)
---

# Modes System

Mode switching system for Kiro that enables different interaction styles and workflows.

**For complete documentation, examples, and troubleshooting, see `docs/modes-system-guide.md`**

## Available Modes

- **vibe** - Flexible, conversational development assistance
- **spec** - Structured feature development with requirements, design, and tasks

## Mode Commands

### Command 1: Switch Kiro Mode

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

**Load and execute mode switching protocol:**
1. Read `kiro-{mode_name}-mode.md` from agent-system directory into context
2. Read `{{{PROTOCOLS_PATH}}}/mode-switching.mdx` into context
3. Follow all steps from the "Mode Switch Steps" section in mode-switching.mdx
4. Use `{mode_name}` as the mode identifier throughout the protocol
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
- Interactive: `/modes` (no parameters, loads `modes.md` steering file)
- Direct: `/modes {name}` (with mode name, uses alias above)

## Quick Reference

### Activation Protocol Summary

When `/modes {name}` is executed:

1. **Load** - Read mode definition and parse configuration
2. **Check** - If from spec mode, show warning and confirm
3. **Apply** - Follow mode protocols, set up context
4. **Begin** - Start interaction per mode's protocol

### Management Protocol Summary

When `/modes` is executed:

1. **Activate chit-chat** - Load chit-chat.md, use diff blocks
2. **Detect modes** - Scan for `kiro-*-mode.md` files
3. **Present choices** - Show modes, offer operations
4. **Handle operations** - Switching, viewing, comparison, help

## Mode and Agent Coordination

**Modes provide the framework:**
- Vibe mode: Flexible, conversational interaction
- Spec mode: Structured workflow with approval gates

**Agents provide specialized capabilities:**
- kiro-master: Feature management and .kiro/ operations
- Custom agents: Domain-specific expertise

**They work together:**
- Modes can activate agents: `/modes spec` then `/agents kiro-master`
- Agents inherit mode protocols: Agent in spec mode follows spec workflow
- Context preserved: Switch modes/agents without losing work
- Layered capabilities: Mode + Agent + Strict mode all active simultaneously

## System Notes

- Prototype system using Instruction Alias pattern
- Relies on AI understanding and following instructions
- Works seamlessly with agent system

---

**Modes system ready.**

**Quick start:**
- `/modes vibe` - Flexible development
- `/modes spec` - Structured planning
- `/modes` - Interactive mode management
