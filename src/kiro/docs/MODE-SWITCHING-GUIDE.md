---
inclusion: manual
---

# Kiro Mode Switching Guide

## Overview

This system enables seamless switching between Kiro's Vibe and Spec modes within a single conversation session, using the same instruction alias pattern that powers the agent system.

## The Problem We Solved

Previously, switching between Vibe mode (flexible development) and Spec mode (structured planning) required starting a new Kiro conversation, losing all context and conversation history.

## The Solution

By extracting the mode-specific protocols into steering documents and using instruction aliases, we can now switch modes via natural language commands while preserving:

- All file changes
- Conversation history
- Current working state
- User preferences

## How It Works

### Mode Definitions

**Vibe Mode** (`kiro-vibe-mode.md`):
- Flexible, conversational interaction
- No formal workflows or approval gates
- Quick iterations and direct changes
- Pragmatic testing approach
- Perfect for exploration, debugging, quick fixes

**Spec Mode** (`kiro-spec-mode.md`):
- Structured workflow: Requirements → Design → Tasks
- EARS/INCOSE compliant requirements
- Correctness properties for property-based testing
- Mandatory approval gates between phases
- Perfect for complex features, formal planning

### Commands

```bash
# Switch modes directly
/modes vibe          # Switch to flexible development mode
/modes spec          # Switch to structured planning mode

# Interactive mode management
/modes              # See available modes, compare, and switch

# Works with other commands
/strict on          # Enable precision mode (works in any mode)
/agents kiro-master  # Activate agent (works in any mode)
```

### Command Flow

When user types `/modes spec`:

1. **Extract parameter**: `mode_name = "spec"`
2. **Load mode definition**: Read `kiro-spec-mode.md`
3. **Load strict mode**: Enable `/strict` commands
4. **Assume mode role**: Follow spec mode protocols
5. **Preserve context**: Keep all files and history
6. **Begin interaction**: Start with spec mode style

## Architecture

### File Structure

```
agent-system/
├── kiro-vibe-mode.md      # Vibe mode protocols
├── kiro-spec-mode.md      # Spec mode protocols
├── strict-mode.md         # Strict mode (works with both)
├── chit-chat.md           # Chit-chat interaction style
└── MODE-SWITCHING-GUIDE.md # This file

agent-system.md             # Main system with mode commands
```

### Integration Points

**Mode system integrates with:**

1. **Agent system** - Agents can be activated in any mode
2. **Strict mode** - Precision protocols work in any mode
3. **Chit-chat mode** - Interactive choices available in any mode
4. **Steering documents** - Additional steering loads as needed

**Layered capabilities example:**
```
Base: Vibe mode (flexible interaction)
+ Agent: kiro-master (feature management)
+ Strict mode: ON (precision protocols)
= Flexible feature management with precision
```

## Key Differentiators

### Vibe Mode vs Spec Mode

| Aspect | Vibe Mode | Spec Mode |
|--------|-----------|-----------|
| **Workflow** | Flexible, conversational | Structured phases |
| **Requirements** | Natural language | EARS/INCOSE compliant |
| **Testing** | Pragmatic, flexible | PBT with correctness properties |
| **Approval** | No gates | Mandatory gates between phases |
| **Documentation** | As needed | Formal requirements/design/tasks |
| **Best for** | Quick fixes, exploration | Complex features, formal planning |

## Usage Examples

### Example 1: Exploration to Formalization

```
User: /modes vibe
[Explore feature idea, prototype code]

User: This is working well, let's formalize it
User: /modes spec
[Create requirements, design, task list]
[All prototype code still available]
```

### Example 2: Spec to Implementation

```
User: /modes spec
[Create requirements.md, design.md, tasks.md]

User: Let's implement this quickly
User: /modes vibe
[Implement tasks without formal ceremony]
[Spec documents still available for reference]
```

### Example 3: Combined with Agents

```
User: /modes spec
User: /agents kiro-master
User: /strict on
[Structured feature planning with kiro-master's capabilities and precision]

User: /modes vibe
[kiro-master still active, now in flexible mode]
```

## Implementation Details

### What Gets Preserved

✅ **Preserved across mode switches:**
- All file changes (code, docs, configs)
- Conversation history
- Current working directory
- User preferences
- Active agents (if any)
- Strict mode state

❌ **Not preserved (intentionally):**
- Mode-specific workflow state
- Approval gate status
- Phase progression in spec mode

### Mode Detection

The AI determines current mode by:
1. Checking most recent `/modes {name}` command
2. Analyzing active protocols in context
3. Defaulting to mode from conversation start

### Context Preservation Mechanism

Mode switching works because:
1. **Modes are protocols, not state** - They define HOW to interact, not WHAT you're working on
2. **Files persist** - All file operations are permanent
3. **Conversation continues** - History remains in context
4. **Instructions layer** - New mode instructions overlay previous ones

## Benefits

### For Users

1. **No context loss** - Switch modes without losing work
2. **Flexibility** - Use right mode for current task
3. **Seamless transitions** - Explore → Formalize → Implement
4. **Single session** - No need to start new conversations

### For Development Workflow

1. **Exploration phase** - Use vibe mode to prototype
2. **Planning phase** - Switch to spec mode to formalize
3. **Implementation phase** - Use either mode as appropriate
4. **Iteration** - Switch back and forth as needed

### For Complex Projects

1. **Start structured** - Spec mode for initial planning
2. **Quick fixes** - Vibe mode for urgent changes
3. **Back to structure** - Spec mode for new features
4. **Maintain both** - Formal docs + flexible development

## Advanced Patterns

### Pattern 1: Hybrid Development

```
1. /modes spec - Create formal requirements
2. /modes vibe - Prototype quickly
3. /modes spec - Update design based on prototype
4. /modes vibe - Implement with flexibility
5. /modes spec - Create final task list
```

### Pattern 2: Agent-Enhanced Modes

```
1. /modes spec - Structured planning
2. /agents kiro-master - Add feature management
3. [Work on specs with kiro-master's capabilities]
4. /modes vibe - Switch to flexible implementation
5. [kiro-master still active, now in vibe mode]
```

### Pattern 3: Precision When Needed

```
1. /modes vibe - Start flexible
2. /strict on - Add precision for critical section
3. [Work with precision protocols]
4. /strict off - Return to flexible
5. /modes spec - Formalize if needed
```

## Troubleshooting

### Mode Not Switching

**Problem:** `/modes {name}` doesn't work

**Solutions:**
- Verify mode file exists: `kiro-{name}-mode.md`
- Check filename matches command exactly
- Try `/modes` to see available modes
- Ensure agent-system.md is loaded

### Mode Behavior Unclear

**Problem:** Not sure which mode is active

**Solutions:**
- Ask: "Which mode am I in?"
- Use `/modes` to see current mode
- Check for mode-specific indicators (approval gates = spec mode)

### Context Seems Lost

**Problem:** Previous work not available after mode switch

**Solutions:**
- Files persist - check file system
- Conversation history preserved - scroll up
- Mode switch doesn't delete anything
- May need to re-read files into context

## Future Enhancements

### Planned Improvements

1. **Mode indicators** - Visual indicator of current mode
2. **Mode history** - Track mode switches in session
3. **Custom modes** - User-defined modes beyond vibe/spec
4. **Mode presets** - Save mode configurations
5. **Auto-suggestions** - AI suggests mode switch when appropriate

### Task Session System

**Goal:** Agents create sub-tasks with own context

**Concept:**
```
User: /agents kiro-master
Agent: I'll create 3 sub-tasks for this feature
Agent: Each task will have its own session with:
  - Initial context from current session
  - Task-specific instructions
  - Continuation guide
  - Results feed back to main session
```

**Benefits:**
- Parallel task execution
- Isolated contexts prevent interference
- Automatic context population
- Session continuation support

**Status:** Conceptual - needs Kiro API support

## Technical Notes

### Why This Works

The mode switching system works because:

1. **Instruction alias pattern** - Same mechanism as agent system
2. **Protocol-based design** - Modes are instructions, not state
3. **Context preservation** - File system and history persist
4. **Layered architecture** - Instructions overlay without conflict

### Limitations

1. **No native Kiro support** - Relies on AI following instructions
2. **Context window** - Very long sessions may lose early context
3. **No visual indicators** - Mode not shown in UI
4. **Manual switching** - No automatic mode detection

### Comparison to Agent System

**Similarities:**
- Both use instruction alias pattern
- Both load steering documents
- Both preserve context
- Both can be combined

**Differences:**
- Modes are broader (interaction style)
- Agents are narrower (specific capabilities)
- Modes are mutually exclusive (vibe OR spec)
- Agents can stack (multiple agents possible)

## Conclusion

The mode switching system successfully enables seamless transitions between Kiro's Vibe and Spec modes within a single conversation session. By extracting mode-specific protocols into steering documents and using instruction aliases, we've created a flexible system that preserves context while changing interaction styles.

This opens up new workflows:
- Explore in vibe mode, formalize in spec mode
- Plan in spec mode, implement in vibe mode
- Switch modes as project needs evolve
- Combine with agents and strict mode for layered capabilities

The system is production-ready and can be extended with custom modes, mode presets, and eventually task session support.

---

**Ready to use:**
- `/modes vibe` - Flexible development
- `/modes spec` - Structured planning
- `/modes` - Interactive mode management
