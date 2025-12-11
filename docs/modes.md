# Modes

## Available Modes

- **vibe** - Flexible, conversational development assistance
- **spec** - Structured feature development with requirements, design, and tasks

## Commands

**Usage:**
- Interactive: `/modes` (no parameters, loads `modes.md` steering file)
- Direct: `/modes {name}` (with mode name, uses alias above)

### Switch Kiro Mode
The `/modes {mode_name}` command is defined in `aliases.md` and switches 
to a specific mode by loading its definition and switching protocol.
**Usage:** `/modes {name}` (e.g., `/modes vibe`, `/modes spec`)

### Interactive Mode Management
For interactive mode management, use the `/modes` slash command (without parameters).
This provides a visual interface for:
- Viewing available modes
- Comparing modes
- Switching modes
- Getting help

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

## Context Preservation

**What's preserved when switching modes:**
- All file changes
- Conversation history
- Current working state
- User preferences

**What's NOT preserved:**
- Workflow state (e.g., spec phase)
- Approval gate status
- Phase-specific context

## See Also

- [Mode System Guide](MODE-SWITCHING-GUIDE.md) - Complete documentation
- [Agent Commands](AGENT-COMMANDS.md) - Agent system reference
- [Quick Reference](QUICK-REFERENCE.md) - All commands
