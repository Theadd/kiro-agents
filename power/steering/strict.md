---
inclusion: manual
description: "Interactive strict mode control with visual buttons for enabling/disabling precision mode"
keywords: ["strict", "precision", "mode", "control"]
---

# Strict Mode Control

Interactive control for STRICT_MODE using userInput tool.

## Current State Check

First, determine the current STRICT_MODE state from context.

## Present Interactive Options

Use userInput tool to show interactive buttons:

```typescript
userInput({
  question: `# Strict Mode Control

**Current State**: STRICT_MODE = ${current_state}

Strict mode blocks execution on ambiguous input and requires explicit clarification. Use it for:
- Experimental projects with cutting-edge technologies
- Architectural decisions that propagate throughout codebase
- Breaking changes affecting multiple files/systems
- New component creation establishing patterns
- Debugging propagated errors from incorrect assumptions

**What would you like to do?**`,
  options: [
    {
      title: "🟢 Enable Strict Mode",
      description: "Activate precision mode - blocks execution on ambiguous input, requires explicit clarification",
      recommended: current_state === "OFF"
    },
    {
      title: "🔴 Disable Strict Mode",
      description: "Return to normal mode - allows reasonable assumptions, faster iteration",
      recommended: current_state === "ON"
    },
    {
      title: "ℹ️ Learn More",
      description: "Understand when and how to use strict mode effectively"
    },
    {
      title: "📊 Check Current State",
      description: "Show current strict mode configuration and status"
    }
  ],
  reason: "strict-mode-control"
})
```

## Handle User Selection

Based on user's choice:

**Enable Strict Mode:**
- Set STRICT_MODE = ON
- Confirm activation
- Show brief reminder of strict mode rules
- Return to conversation with strict mode active

**Disable Strict Mode:**
- Set STRICT_MODE = OFF
- Confirm deactivation
- Return to normal conversation mode

**Learn More:**
- Explain strict mode purpose and benefits
- Show examples of when to use it
- Describe the critical rules (no assumptions, mandatory clarification, block execution)
- Provide use case guidelines
- Offer to enable/disable after explanation

**Check Current State:**
- Display current STRICT_MODE value
- Show when it was last changed (if tracked)
- Explain current behavior
- Offer to change state

## Quick Reference

**Strict Mode Rules (when ON)**:
1. **NO ASSUMPTIONS** - Stop immediately if input is ambiguous
2. **MANDATORY CLARIFICATION** - Ask specific questions to resolve ambiguities
3. **BLOCK EXECUTION** - Do not execute main task until data is confirmed
4. **EXPLICIT AUTHORIZATION ONLY** - Proceed only with user confirmation

**When to Use**:
- Experimental/cutting-edge projects
- Architectural decisions
- Breaking changes
- New component patterns
- Debugging propagated errors

**When Standard Mode is Fine**:
- Well-established patterns
- Simple, clear tasks
- Documentation work
- Standard refactoring
- Common web development patterns

---

**Strict mode control ready.**
