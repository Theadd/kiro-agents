---
inclusion: always
description: Kiro mode switching system for flexible interaction styles (vibe/spec modes)
---

# Modes System

Mode switching system for Kiro that enables different interaction styles and workflows.

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

### Step 1: Load Mode Definition

Read `kiro-{mode_name}-mode.md` from agent-system directory into context.

This file contains:
- Mode identity and purpose
- Interaction protocols
- Workflow patterns (if any)
- Response style guidelines
- Testing approaches
- File organization rules
- Integration points

### Step 2: Assume Mode Role

For this session, you are in **{mode_name} mode**.

You will:
- Follow ALL protocols and instructions from `kiro-{mode_name}-mode.md`
- Apply mode-specific interaction patterns
- Use capabilities defined in the mode definition
- Maintain this mode until user switches modes or ends session
- Override any conflicting instructions with mode protocols

### Step 3: Preserve Context and Check State

**IMPORTANT:** Mode switching preserves:
- All file changes made in previous mode
- Conversation history and context
- Current working state
- User preferences and settings

**WARNING:** Mode switching does NOT preserve:
- Workflow state (e.g., which phase you're in)
- Approval gate status
- Phase-specific context

**If switching FROM spec mode:**
Before switching, display warning:
```
⚠️ Switching from Spec mode will reset workflow state.

Current Spec state:
- Phase: [current phase]
- Requirements: [approved/not approved]
- Design: [approved/not approved]
- Tasks: [approved/not approved]

If you return to Spec mode later, you'll need to re-approve documents.

Continue switching to {mode_name} mode? [Yes] [No, stay in Spec mode]
```

Wait for user confirmation before proceeding.

You are simply changing HOW you interact, not WHAT you're working on.

### Step 4: Begin Interaction

Start interaction according to **{mode_name} mode**'s protocols.

**If switching to spec mode:**
- Ask user what they want to work on
- Offer to create new spec or update existing
- Follow structured workflow (requirements → design → tasks)
- Use approval gates between phases

**If switching to vibe mode:**
- Continue with flexible, conversational interaction
- No formal workflow required
- Make changes directly when clear
- Iterate quickly on feedback

---

**You are now in {mode_name} mode. Begin interaction.**
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

## Mode Activation Protocol

When `/modes {name}` is executed:

1. **Load mode definition**
   - Read `kiro-{name}-mode.md` from agent-system directory
   - Parse mode configuration
   - Understand mode workflows

2. **Check current state**
   - If switching FROM spec mode, show warning
   - Wait for user confirmation if needed
   - Preserve file changes and context

3. **Apply mode protocols**
   - Follow mode-specific interaction patterns
   - Use mode-defined workflows
   - Apply mode response style
   - Set up mode context

4. **Begin interaction**
   - Start according to mode protocols
   - Use mode-specific formatting
   - Apply mode workflows
   - Maintain mode focus

## Mode Management Protocol

When `/modes` is executed:

1. **Activate chit-chat mode**
   - Load chit-chat.md steering
   - Use diff blocks for progress
   - Provide numbered choices
   - Maintain single focus

2. **Detect available modes**
   - Scan for `kiro-*-mode.md` files
   - Extract mode metadata
   - Identify current mode

3. **Present choices**
   - Show available modes
   - Offer mode operations
   - Provide help and comparison
   - Allow staying in current mode

4. **Handle operations**
   - Mode switching → Execute `/modes {name}`
   - View details → Show mode definition
   - Comparison → Explain differences
   - Help → Explain mode system

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

**Coordination patterns:**
- **Mode transitions** - Switch from exploration (vibe) to planning (spec)
- **Context sharing** - Modes and agents share relevant information
- **Conflict resolution** - Priority rules determine behavior
- **Workflow integration** - Agents work within mode workflows

## Usage Examples

### Switch Kiro Modes

```
/modes vibe
```

**Result:** AI switches to Vibe mode - flexible, conversational development. No formal workflows, quick iterations, direct changes.

```
/modes spec
```

**Result:** AI switches to Spec mode - structured feature development with requirements, design, and task planning.

### Interactive Mode Management

```
/modes
```

**Result:** Chit-chat mode activates, shows available modes, offers comparison and switching options.

### Combined with Agents

```
/modes spec
[Work on structured feature planning]
/agents kiro-master
[Use kiro-master agent while in spec mode]
```

**Result:** Spec mode workflow + kiro-master agent capabilities working together.

## Best Practices

### For Mode Users

1. **Choose appropriate mode** - Vibe for exploration, Spec for planning
2. **Understand mode workflows** - Each mode has different interaction patterns
3. **Use mode transitions** - Switch modes as your needs change
4. **Combine with agents** - Modes and agents work together
5. **Preserve context** - File changes persist across mode switches

### For Mode Development

1. **Clear mode definition** - Comprehensive `.md` with all protocols
2. **Consistent interaction** - Follow established patterns
3. **Good examples** - Show how mode works in practice
4. **Integration rules** - Specify how mode works with agents
5. **Test thoroughly** - Verify mode activates and functions correctly

## Future Enhancements

**Mode enhancements:**
- **Custom modes** - User-defined modes beyond vibe/spec
- **Mode parameters** - `/modes spec --strict --minimal-tests`
- **Mode presets** - Save mode configurations
- **Mode history** - Track mode usage patterns
- **Automated transitions** - Suggest mode switch when appropriate

**Integration enhancements:**
- **Cross-mode workflows** - Explore in vibe, formalize in spec
- **Mode-specific agents** - Agents optimized for specific modes
- **Context preservation** - Enhanced state management across switches

## Notes

- This system is a **prototype** - Kiro doesn't natively support modes
- Commands are implemented via **Instruction Alias pattern**
- System relies on **AI understanding and following instructions**
- May need **iteration based on actual usage**
- Works seamlessly with agent system

---

**Modes system ready.**

**Quick start:**
- `/modes vibe` - Flexible development
- `/modes spec` - Structured planning
- `/modes` - Interactive mode management
