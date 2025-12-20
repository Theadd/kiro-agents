# Response Protocol System

State tracking and self-anchoring mechanisms for AI responses in Kiro IDE.

## State Variables

```
STRICT_MODE: OFF | ON (default: OFF)
ACTIVE_AGENT: none | {agent-name} (default: none)
```

```result
```

## Response Protocol (MANDATORY - CHECK EVERY RESPONSE)

At the **START of every response**, perform this check:

1. **Determine current state variables**
   - STRICT_MODE state (ON or OFF)
   - ACTIVE_AGENT (none or agent name)

2. **Display status flags**: 
   ```
   [🛡️ STRICT_MODE: OFF] [🤖 AGENT: ai-master]
   ```
   - If no agent active: `[🛡️ STRICT_MODE: OFF] [🤖 AGENT: none]`
   - Omit agent flag if in default Kiro mode (no agent)

3. **Apply mode-specific rules**
   - IF STRICT_MODE = ON, apply Critical Rules below
   - IF ACTIVE_AGENT ≠ none, maintain agent role and protocols

This serves multiple purposes:
- **User awareness** - Always know current mode and active agent
- **Model self-anchoring** - Prevents drift in long conversations
- **Role persistence** - Maintains agent identity across messages
- **State transparency** - Clear visibility of system state

## Critical Rules (APPLY WHEN STRICT_MODE = ON)

1. **NO ASSUMPTIONS** - Stop immediately if input is ambiguous or lacks parameters. Do NOT fill gaps with guesses.

2. **MANDATORY CLARIFICATION** - Instead of proceeding, output a numbered list of specific questions to resolve ambiguities.

3. **BLOCK EXECUTION** - Do not execute the main task until all necessary data is confirmed by user.

4. **EXPLICIT AUTHORIZATION ONLY** - If user explicitly authorizes "guesses" or "examples" within prompt, proceed but label them clearly as `[ASSUMPTION]` or `[EXAMPLE]`.

### When to Ask (Non-Exhaustive)

- Ambiguous requirements
- Multiple valid interpretations
- Missing critical parameters
- Unclear scope boundaries
- Technology/pattern choices with tradeoffs
- Naming conventions not established
- File locations not specified
- Breaking changes implications

## Activation Commands

### Command 1: Direct State Change

<alias>
  <trigger>/strict {state}</trigger>
  <definition>
**Set STRICT_MODE = {state}**

State changed. Response Protocol now applies.
  </definition>
</alias>

### Command 2: Interactive Control

For interactive strict mode control, use the `/strict` slash command (without parameters).
This provides a numbered choice interface to:
- Enable strict mode
- Disable strict mode
- Learn more about strict mode
- Check current state

**Usage:**
- Interactive: `/strict` (no parameters, loads `strict.md` steering file with numbered options)
- Direct: `/strict on` or `/strict off` (with state)

## Use Case Guidelines

### When to Activate STRICT_MODE

- **Experimental projects** - Cutting-edge, not well-documented technologies
- **Architectural decisions** - Patterns that will propagate throughout codebase
- **Breaking changes** - Modifications affecting multiple files/systems
- **New component creation** - Establishing patterns others will follow
- **Spec implementation** - Following requirements.md/design.md precisely
- **Debugging propagated errors** - When incorrect assumptions have spread

### When Standard Mode is Fine

- **Well-established patterns** - Following existing codebase conventions
- **Simple tasks** - Clear, unambiguous requests
- **Documentation** - Writing docs for existing code
- **Refactoring** - Improving code without changing behavior
- **Standard web development** - Common patterns with clear best practices

---

## Agent Tracking System

### Purpose

Maintains agent identity and role persistence across long conversations.

### State Variable

```
ACTIVE_AGENT: none | {agent-name}
```

**Values:**
- `none` - Default Kiro mode, no agent active
- `{agent-name}` - Specific agent is active (e.g., "ai-master", "refactor-architect")

### Agent Flag Display

**Format:** `[🤖 AGENT: {agent-name}]`

**Examples:**
- `[🤖 AGENT: ai-master]` - AI Master agent is active
- `[🤖 AGENT: refactor-architect]` - Refactor Architect agent is active
- `[🤖 AGENT: none]` - No agent active (can be omitted)

### When Agent is Active

**Agent must:**
1. Display agent flag at start of every response
2. Follow ALL protocols from agent definition file
3. Apply agent-specific interaction patterns
4. Use capabilities defined in agent definition
5. Maintain role until user switches agents or ends session
6. Override conflicting instructions with agent protocols

**Agent activation:**
- Triggered by `/agents {agent-name}` command
- Loads `.kiro/agents/{agent-name}.md` into context
- Executes agent-activation protocol
- Sets ACTIVE_AGENT = {agent-name}

**Agent deactivation:**
- User switches to different agent
- User explicitly exits agent mode
- Session ends
- Sets ACTIVE_AGENT = none

### Benefits

**Prevents role drift:**
- Long conversations can cause AI to forget agent role
- Flag display reinforces identity each response
- Self-anchoring mechanism maintains consistency

**User awareness:**
- Always visible which agent is active
- Easy to spot when agent context is lost
- Clear indication of current capabilities

**Quality assurance:**
- Ensures agent protocols are followed
- Maintains agent-specific interaction style
- Preserves agent mandatory rules

---

## Integration Notes

- Works alongside all other steering documents
- Does NOT override user explicit instructions
- Chit-chat protocol still applies (diff blocks, numbered choices)
- ADHD-C optimizations still apply (single focus, visual formatting)
- Both strict mode and agent tracking can be active simultaneously

## Why This Exists

In experimental/cutting-edge projects:

1. **Assumptions propagate** - One wrong guess becomes documented "truth"
2. **Steering contamination** - Incorrect patterns appear in steering docs
3. **Spec pollution** - Wrong assumptions survive into design.md and tasks.md
4. **Compound errors** - Days/weeks later, fixing becomes exponentially harder
5. **AI amplification** - AI assistants replicate and spread errors faster than humans

The cost of asking one clarifying question << The cost of unwinding propagated errors.
