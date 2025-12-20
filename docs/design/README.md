# Design Rationale

Understanding the "why" behind kiro-agents' architecture and interaction patterns.

## Overview

This directory contains documentation explaining the design decisions, principles, and rationale behind kiro-agents. These documents help users and contributors understand not just how the system works, but why it works this way.

## Documents

### [Protocol System Design](protocol-system.md)

**Why layered protocols enable powerful AI agents without limiting capability**

- The core problem with traditional approaches
- How layered architecture solves the dilemma
- WHAT vs HOW principle in AI generation
- Evidence from real-world usage
- Common misconceptions debunked
- Design principles and implementation details

**Key Insight:** Structure the presentation format while preserving full AI capability. This enables consistency without limitation, guidance without constraint, and power without complexity.

### [Interaction Patterns](interaction-patterns.md)

**How kiro-agents reduces cognitive load while preserving flexibility**

- Chit-chat interaction protocol (three-part structure)
- Diff block pattern (external working memory)
- Numbered choice pattern (reduce decision fatigue)
- STOP system (prevent information overload)
- Multi-part navigation (user-controlled pacing)
- Context reference pattern (explicit context)
- Visual formatting pattern (scannable structure)
- Flexibility patterns (more, search, filter, direct statement)

**Key Insight:** Structure the interaction format without limiting capability or freedom. Users get consistency without constraint, guidance without rigidity, and power without complexity.

### [Neurodivergent Accessibility](neurodivergent-accessibility.md)

**How ADHD-C design principles benefit all users**

- Originally designed for ADHD-C accessibility
- Cross-neurodivergent benefits (autism, dyslexia, executive function disorders, anxiety, processing differences)
- Universal design principles
- Pattern effectiveness from cognitive science
- Working with numbered choices (flexibility within structure)

**Key Insight:** Design for the margins, benefit the center. Patterns for neurodivergent users improve all interactions through universal design principles.

## Core Philosophy

**Three Pillars of kiro-agents Design:**

1. **Structure Without Limitation**
   - Consistent presentation format
   - Full AI capability preserved
   - Flexibility within structure

2. **Accessibility as Foundation**
   - Originally designed for ADHD-C
   - Benefits all users (universal design)
   - Reduces cognitive load universally

3. **User Control and Agency**
   - Choose depth and pace
   - Request more or state directly
   - Skip, dive deeper, or ask questions

## Design Principles

### 1. Reduce Cognitive Load
- Structured presentation reduces extraneous load
- Visual formatting aids comprehension
- Explicit context eliminates memory demands

### 2. Preserve Full Capability
- Structure presentation, not content
- Open-ended execution at inner levels
- Full AI knowledge always available

### 3. Enable User Control
- Numbered choices as suggestions, not constraints
- Multiple navigation pathways
- User sets depth and pace

### 4. Maintain Context Explicitly
- Diff blocks (external working memory)
- Explicit references (no orphaned context)
- Progress tracking across sessions

### 5. Universal Applicability
- Design for specific needs (ADHD-C)
- Benefit everyone (universal design)
- Accommodate diverse cognitive styles

## How These Documents Connect

```
Protocol System Design
    ↓
    Explains WHY layered protocols work
    (structured boundaries + open-ended execution)
    ↓
Interaction Patterns
    ↓
    Explains HOW protocols are presented
    (diff blocks, numbered choices, STOP system, etc.)
    ↓
Neurodivergent Accessibility
    ↓
    Explains WHO benefits and WHY it works
    (ADHD-C design, universal benefits, cognitive science)
```

**Together, these documents provide:**
- **Theoretical foundation** - Why the approach works
- **Practical implementation** - How patterns are applied
- **Evidence and validation** - Real-world effectiveness

## For Users

**If you want to understand:**
- Why kiro-agents feels different from other AI tools → Read [Protocol System Design](protocol-system.md)
- How to use the interaction patterns effectively → Read [Interaction Patterns](interaction-patterns.md)
- Why numbered choices don't limit you → Read [Neurodivergent Accessibility](neurodivergent-accessibility.md)

## For Contributors

**If you want to:**
- Understand design decisions → Read all three documents
- Propose new features → Ensure alignment with design principles
- Modify interaction patterns → Understand cognitive load implications
- Add new protocols → Follow layered architecture principles

## Key Takeaways

1. **Protocols structure presentation, not capability** - Consistent interface ≠ limited AI power
2. **Layered architecture enables power** - Structured boundaries + open-ended execution = all-powerful agents
3. **Accessibility benefits everyone** - ADHD-C design principles create better experiences for all users
4. **Flexibility within structure** - Numbered choices are suggestions, not constraints
5. **User control is paramount** - Users set depth, pace, and navigation

## Related Documentation

- **[Creating All-Powerful Agents](../user-guide/creating-powerful-agents.md)** - Practical guide to layered architecture
- **[Agent System Guide](../../src/core/docs/agent-system-guide.md)** - Complete agent system documentation
- **[Aliases Guide](../../src/core/docs/aliases-guide.md)** - Instruction alias system documentation

---

**Questions or feedback?** Open an issue on [GitHub](https://github.com/Theadd/kiro-agents/issues)

**Want to contribute?** See [CONTRIBUTING.md](../../CONTRIBUTING.md)
