# Modes System - Complete Guide

Comprehensive documentation for the mode switching system in Kiro IDE.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Available Modes](#available-modes)
4. [Mode Activation](#mode-activation)
5. [Mode Management](#mode-management)
6. [Usage Examples](#usage-examples)
7. [Mode and Agent Coordination](#mode-and-agent-coordination)
8. [Best Practices](#best-practices)
9. [Creating Custom Modes](#creating-custom-modes)
10. [Troubleshooting](#troubleshooting)
11. [Future Enhancements](#future-enhancements)

## Overview

The Modes System enables switching between different interaction styles and workflows in Kiro IDE. Modes define HOW the AI interacts with you, not WHAT it works on.

**Key Concepts:**
- **Modes** - Different interaction styles (vibe, spec)
- **Mode Switching** - Changing between modes preserves files but resets workflow state
- **Mode Coordination** - Modes work alongside agents and strict mode
- **Mode Protocols** - Each mode has specific interaction patterns and workflows

**Core Commands:**
- `/modes` - Interactive mode management
- `/modes {name}` - Switch to specific mode directly

## Quick Start

### First Time Setup

1. **Install kiro-agents** (if not already installed)
   ```bash
   npx kiro-agents  # or via Kiro Powers panel
   ```

2. **View available modes**
   ```
   /modes
   ```

3. **Switch to a mode**
   ```
   /modes vibe    # Flexible, conversational
   /modes spec    # Structured, formal
   ```

### Common Workflows

**Exploration workflow:**
```
/modes vibe              # Start with flexible mode
[Explore and experiment]
/modes spec              # Switch to structured mode
[Formalize and plan]
```

**Direct mode workflow:**
```
/modes spec              # Start with structured mode
[Work on feature planning]
[Complete planning]
/modes vibe              # Switch to flexible mode
[Implement quickly]
```

## Available Modes

### Vibe Mode

**Purpose:** Flexible, conversational development assistance

**Characteristics:**
- No formal workflows or approval gates
- Quick iterations and direct changes
- Conversational interaction style
- Immediate implementation
- Exploratory and experimental

**Best for:**
- Quick fixes and small changes
- Exploration and discovery
- Rapid prototyping
- Informal discussions
- Learning and experimentation

**Interaction style:**
- Casual and conversational
- Direct responses
- Minimal ceremony
- Fast feedback loops
- Flexible structure

### Spec Mode

**Purpose:** Structured feature development with formal workflow

**Characteristics:**
- Formal workflow: Requirements → Design → Tasks
- Approval gates between phases
- Structured documentation
- Comprehensive planning
- Methodical approach

**Best for:**
- Complex feature development
- Large refactorings
- Team collaboration
- Formal documentation
- Critical systems

**Interaction style:**
- Formal and structured
- Phase-based workflow
- Approval requirements
- Comprehensive documentation
- Systematic approach

**Workflow phases:**
1. **Requirements** - Define what needs to be built
2. **Design** - Plan how to build it
3. **Tasks** - Break down into implementation steps

## Mode Activation

### Activation Process

When you execute `/modes {name}`, the system:

1. **Loads mode definition**
   - Reads `kiro-{name}-mode.md` from agent-system directory
   - Parses mode configuration
   - Understands mode workflows
   - Identifies mode protocols

2. **Checks current state**
   - If switching FROM spec mode, shows warning
   - Waits for user confirmation if needed
   - Preserves file changes and context
   - Resets workflow state

3. **Applies mode protocols**
   - Follows mode-specific interaction patterns
   - Uses mode-defined workflows
   - Applies mode response style
   - Sets up mode context

4. **Begins interaction**
   - Starts according to mode protocols
   - Uses mode-specific formatting
   - Applies mode workflows
   - Maintains mode focus

### What Happens During Activation

**Context Loading:**
- Mode definition file (`kiro-{name}-mode.md`)
- Mode switching protocol (`protocols/mode-switching.md`)
- Any additional steering documents specified by mode

**State Changes:**
- Previous mode context suspended (if any)
- New mode context activated
- Mode-specific protocols take priority
- File changes preserved, workflow state reset

**Mode Behavior:**
- Follows mode's interaction patterns
- Uses mode's response formatting
- Applies mode's workflows
- Maintains mode's focus areas

### State Preservation

**What IS preserved:**
- All file changes made in previous mode
- Conversation history and context
- Current working state
- User preferences and settings

**What is NOT preserved:**
- Workflow state (e.g., which phase you're in)
- Approval gate status
- Phase-specific context
- Mode-specific temporary state

### Spec Mode Warning

When switching FROM spec mode, you'll see:

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

This warning ensures you don't accidentally lose workflow progress.

## Mode Management

### Interactive Management

When you execute `/modes` (without parameters), the system:

1. **Activates chit-chat mode**
   - Loads `chit-chat.md` steering
   - Uses diff blocks for progress tracking
   - Provides numbered choices
   - Maintains single focus per message

2. **Detects available modes**
   - Scans for `kiro-*-mode.md` files
   - Extracts mode metadata from frontmatter
   - Identifies current mode (if any)
   - Categorizes modes by type

3. **Presents choices**
   - Shows available modes with descriptions
   - Offers mode operations (switch, compare, help)
   - Provides mode comparison
   - Allows staying in current mode

4. **Handles operations**
   - **Mode switching** → Executes `/modes {name}`
   - **View details** → Shows mode definition
   - **Comparison** → Explains differences between modes
   - **Help** → Explains mode system

### Management Operations

**View Modes:**
- Lists all available modes
- Shows mode descriptions
- Displays mode characteristics
- Indicates current mode (if any)

**Compare Modes:**
- Side-by-side comparison
- Highlights key differences
- Suggests use cases
- Helps choose appropriate mode

**Switch Mode:**
- Confirms switch if in spec mode
- Loads new mode definition
- Applies mode protocols
- Begins interaction in new mode

**Get Help:**
- Explains mode system
- Shows available commands
- Provides usage examples
- Links to documentation

## Usage Examples

### Example 1: Switch to Vibe Mode

```
/modes vibe
```

**What happens:**
1. System loads `kiro-vibe-mode.md`
2. System loads `protocols/mode-switching.md`
3. AI assumes vibe mode protocols
4. AI begins flexible, conversational interaction

**Result:** AI is now in vibe mode - flexible, conversational development with no formal workflows.

### Example 2: Switch to Spec Mode

```
/modes spec
```

**What happens:**
1. System loads `kiro-spec-mode.md`
2. System loads `protocols/mode-switching.md`
3. AI assumes spec mode protocols
4. AI begins structured workflow interaction

**Result:** AI is now in spec mode - structured feature development with requirements → design → tasks workflow.

### Example 3: Interactive Mode Management

```
/modes
```

**What happens:**
1. Chit-chat mode activates
2. System scans for available modes
3. AI presents numbered list of modes
4. AI offers comparison and switching options
5. User selects option via number

**Result:** Interactive menu with options to view, compare, or switch modes.

### Example 4: Mode Transition Workflow

```
/modes vibe
[Explore problem space]
[Experiment with solutions]
[Identify best approach]

/modes spec
[Formalize requirements]
[Design solution]
[Plan implementation tasks]
```

**Result:** Smooth transition from exploration (vibe) to planning (spec), leveraging strengths of each mode.

### Example 5: Combined with Agents

```
/modes spec
[Work on structured feature planning]
/agents kiro-master
[Use kiro-master agent while in spec mode]
```

**What happens:**
1. Spec mode provides structured workflow
2. kiro-master agent provides Kiro expertise
3. Both contexts active simultaneously
4. Agent follows spec mode workflow

**Result:** Spec mode workflow + kiro-master agent capabilities working together.

## Mode and Agent Coordination

### How They Work Together

**Modes provide the framework:**
- **Vibe mode** - Flexible, conversational interaction
- **Spec mode** - Structured workflow with approval gates

**Agents provide specialized capabilities:**
- **kiro-master** - Feature management and .kiro/ operations
- **Custom agents** - Domain-specific expertise

**Combined behavior:**
- Modes can activate agents: `/modes spec` then `/agents kiro-master`
- Agents inherit mode protocols: Agent in spec mode follows spec workflow
- Context preserved: Switch modes/agents without losing work
- Layered capabilities: Mode + Agent + Strict mode all active simultaneously

### Coordination Patterns

**Mode Transitions:**
```
/modes vibe              # Explore and experiment
[Discovery phase]
/modes spec              # Formalize and plan
[Planning phase]
/modes vibe              # Implement quickly
[Implementation phase]
```

**Agent Integration:**
```
/modes spec              # Structured workflow
/agents refactor-architect  # Refactoring expertise
[Structured refactoring with expert guidance]
```

**Full Stack:**
```
/modes spec              # Structured workflow
/agents kiro-master      # Kiro expertise
/strict on               # Precision mode
[Structured, expert, precise development]
```

### Context Sharing

**Between modes:**
- File changes persist
- Conversation history maintained
- User preferences preserved
- Workflow state resets

**Between modes and agents:**
- Agents inherit mode protocols
- Modes don't override agent capabilities
- Both contexts active simultaneously
- Conflict resolution via priorities

**Between all features:**
- Mode defines interaction style
- Agent defines expertise area
- Strict mode defines precision level
- All work together harmoniously

### Conflict Resolution

**Priority order:**
1. User explicit instructions
2. Agent mandatory protocols
3. Mode protocols
4. Strict mode rules
5. General steering documents

**Example conflicts:**
- Agent requires formal documentation, vibe mode is casual → Agent wins
- Mode requires approval gates, agent wants to proceed → Mode wins
- User says "just do it", mode requires approval → User wins

## Best Practices

### For Mode Users

**Choosing Modes:**
1. **Choose appropriate mode** - Vibe for exploration, Spec for planning
2. **Understand mode workflows** - Each mode has different interaction patterns
3. **Match mode to task** - Consider task complexity and formality needs
4. **Don't over-structure** - Use vibe mode for simple tasks
5. **Don't under-structure** - Use spec mode for complex features

**Using Modes:**
1. **Use mode transitions** - Switch modes as your needs change
2. **Complete phases** - Finish current phase before switching (especially in spec)
3. **Leverage strengths** - Use each mode for what it's best at
4. **Combine with agents** - Modes and agents work together
5. **Preserve context** - File changes persist across mode switches

**Mode Transitions:**
1. **Plan transitions** - Think about when to switch modes
2. **Document state** - Note progress before switching
3. **Understand resets** - Workflow state resets, files preserved
4. **Confirm switches** - Pay attention to spec mode warnings
5. **Smooth handoffs** - Summarize before switching

### For Mode Development

**Mode Definition:**
1. **Clear mode definition** - Comprehensive `.md` with all protocols
2. **Focused purpose** - Define clear mode purpose and use cases
3. **Explicit protocols** - Clear interaction patterns and workflows
4. **Good examples** - Show mode in action with realistic scenarios
5. **Integration rules** - Specify how mode works with agents

**Interaction Design:**
1. **Consistent interaction** - Follow established patterns
2. **Clear formatting** - Use visual hierarchy consistently
3. **Appropriate formality** - Match formality to mode purpose
4. **Progressive disclosure** - Start simple, reveal complexity as needed
5. **User control** - Respect user preferences and decisions

**Testing and Iteration:**
1. **Test thoroughly** - Verify mode activates and functions correctly
2. **Real-world scenarios** - Test with actual use cases
3. **Edge cases** - Test mode transitions and conflicts
4. **User feedback** - Gather feedback from actual users
5. **Iterate based on use** - Improve mode based on real usage patterns

## Creating Custom Modes

### Mode Definition Structure

Custom modes are defined in `kiro-{name}-mode.md` files:

```markdown
---
name: mode-name
type: workflow|style|hybrid
description: Brief description of mode purpose
version: 1.0.0
---

# Mode Name

Brief overview of mode purpose and characteristics.

## Mode Identity

- **Purpose:** What this mode is for
- **Interaction Style:** How AI responds (formal, casual, technical)
- **Workflow:** Structured or flexible
- **Best For:** Use cases where this mode excels

## Interaction Protocols

How this mode responds to user input:

- Response style (formal, casual, technical)
- Formatting preferences (code blocks, lists, tables)
- Confirmation requirements (always, never, when risky)
- Error handling approach

## Workflow Patterns

If mode has structured workflow:

### Phase 1: Phase Name

1. Step 1 description
2. Step 2 description
3. Approval gate (if applicable)

### Phase 2: Phase Name

1. Step 1 description
2. Step 2 description
3. Approval gate (if applicable)

## Response Style Guidelines

- Tone and voice
- Verbosity level
- Technical depth
- Example formatting

## Testing Approaches

How this mode handles testing:

- Test strategy
- Test coverage expectations
- Test documentation requirements

## File Organization Rules

How this mode organizes files:

- Directory structure preferences
- File naming conventions
- Documentation requirements

## Integration Points

### Works With
- Compatible agents
- Compatible steering documents
- Compatible other modes

### Conflicts With
- Incompatible features
- Resolution strategies

## Examples

### Example 1: Scenario Name

**User:** Example user input
**Mode:** Example mode response

### Example 2: Scenario Name

**User:** Example user input
**Mode:** Example mode response
```

### Mode Types

**Workflow Mode:**
- Defines structured workflow with phases
- Has approval gates
- Formal documentation requirements
- Example: spec mode

**Style Mode:**
- Defines interaction style only
- No formal workflow
- Flexible structure
- Example: vibe mode

**Hybrid Mode:**
- Combines workflow and style
- Structured but flexible
- Conditional workflows
- Example: custom modes

### Creating a Mode

1. **Define purpose** - What problem does this mode solve?
2. **Choose type** - Workflow, style, or hybrid?
3. **Design interaction** - How should AI respond?
4. **Define workflows** - What phases or steps (if any)?
5. **Write examples** - Show mode in action
6. **Test thoroughly** - Verify mode works as intended
7. **Document well** - Clear description and use cases

## Troubleshooting

### Mode Not Switching

**Problem:** `/modes {name}` doesn't work

**Possible causes:**
- Mode file doesn't exist
- Filename doesn't match command
- Mode file is malformed
- Steering documents not loaded

**Solutions:**
1. Check file exists: `kiro-{name}-mode.md`
2. Verify filename matches command exactly
3. Check file has valid frontmatter
4. Try `/modes` to see available modes
5. Reload steering documents

### Mode Behaving Incorrectly

**Problem:** Mode doesn't follow expected protocols

**Possible causes:**
- Mode protocols not clear enough
- Conflicting steering documents
- Agent overriding mode protocols
- Missing integration rules

**Solutions:**
1. Review mode definition for clarity
2. Check for conflicting steering
3. Verify agent compatibility
4. Test mode in isolation
5. Add explicit integration rules

### Mode Management Not Working

**Problem:** `/modes` command doesn't activate

**Possible causes:**
- `modes-system.md` not loaded
- Missing `inclusion: always` in frontmatter
- `chit-chat.md` not available
- Steering documents not loaded

**Solutions:**
1. Verify `modes-system.md` location
2. Check frontmatter is correct
3. Verify `chit-chat.md` exists
4. Reload steering documents
5. Check Kiro logs for errors

### Workflow State Lost

**Problem:** Workflow state resets unexpectedly

**Expected behavior:**
- Workflow state resets when switching modes
- File changes are preserved
- This is intentional design

**Solutions:**
1. Complete current phase before switching
2. Document progress before switching
3. Use spec mode warning to confirm
4. Plan mode transitions carefully
5. Accept that workflow resets are normal

## Future Enhancements

### Mode Enhancements

**Custom modes:**
- User-defined modes beyond vibe/spec
- Mode templates for quick creation
- Mode marketplace for sharing

**Mode parameters:**
- Pass configuration to modes
- Example: `/modes spec --strict --minimal-tests`
- Customize mode behavior per session

**Mode presets:**
- Save mode configurations
- Quick access to favorite settings
- Team-shared presets

**Mode history:**
- Track mode usage patterns
- Suggest appropriate mode
- Learn from usage

**Automated transitions:**
- Suggest mode switch when appropriate
- Auto-switch based on context
- Smart mode recommendations

### Integration Enhancements

**Cross-mode workflows:**
- Explore in vibe, formalize in spec
- Seamless transitions
- Workflow continuity

**Mode-specific agents:**
- Agents optimized for specific modes
- Mode-aware agent behavior
- Better coordination

**Context preservation:**
- Enhanced state management
- Workflow checkpoints
- Resume interrupted work

**Multi-mode sessions:**
- Multiple modes active simultaneously
- Mode-specific contexts
- Advanced coordination

## Notes

**System Status:**
- This is a **prototype** system
- Kiro doesn't natively support modes
- Commands implemented via Instruction Alias pattern
- Relies on AI understanding and following instructions

**Limitations:**
- May need iteration based on actual usage
- Mode behavior depends on AI interpretation
- No native IDE integration
- Limited state persistence

**Future:**
- Consider proposing as Kiro feature request
- Potential for native IDE support
- Enhanced mode capabilities
- Better integration with Kiro ecosystem

---

**For quick reference, see the compact version in `modes-system.md` steering document.**
