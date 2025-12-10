---
inclusion: manual
description: Opt-in precision mode for experimental development - loaded automatically when any agent is activated
---

# Strict Mode System

Opt-in precision mode for experimental/cutting-edge development where assumptions are dangerous.

## State Variable

```
STRICT_MODE: OFF | ON (default: OFF)
```

## Response Protocol (MANDATORY - CHECK EVERY RESPONSE)

At the **START of every response**, perform this check:

1. **Determine current STRICT_MODE state**
2. **Display status flag**: `[🛡️ STRICT_MODE: ON]` or `[🛡️ STRICT_MODE: OFF]`
3. **IF STRICT_MODE = ON**, apply Critical Rules below before proceeding

This serves dual purpose:
- **User awareness** - Always know current mode
- **Model self-anchoring** - Prevents drift in long conversations

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
This provides a visual interface with buttons to:
- Enable strict mode
- Disable strict mode
- Learn more about strict mode

**Usage:**
- Interactive: `/strict` (no parameters, loads `strict.md` steering file with userInput buttons)
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

## Integration Notes

- Works alongside all other steering documents
- Does NOT override user explicit instructions
- Chit-chat mode still applies (diff blocks, numbered choices)
- ADHD-C optimizations still apply (single focus, visual formatting)

## Why This Exists

In experimental/cutting-edge projects:

1. **Assumptions propagate** - One wrong guess becomes documented "truth"
2. **Steering contamination** - Incorrect patterns appear in steering docs
3. **Spec pollution** - Wrong assumptions survive into design.md and tasks.md
4. **Compound errors** - Days/weeks later, fixing becomes exponentially harder
5. **AI amplification** - AI assistants replicate and spread errors faster than humans

The cost of asking one clarifying question << The cost of unwinding propagated errors.
