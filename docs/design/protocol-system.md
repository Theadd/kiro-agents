# Protocol System Design

Understanding why kiro-agents uses layered protocols and how they enable powerful AI agents without limiting capability.

## Table of Contents

- [The Core Problem](#the-core-problem)
- [The Protocol Solution](#the-protocol-solution)
- [Layered Architecture](#layered-architecture)
- [WHAT vs HOW Principle](#what-vs-how-principle)
- [Why This Works](#why-this-works)
- [Evidence from Real-World Usage](#evidence-from-real-world-usage)
- [Common Misconceptions](#common-misconceptions)
- [Design Principles](#design-principles)
- [Implementation Details](#implementation-details)

---

## The Core Problem

### Traditional Approaches to AI Assistance

**Fully Open-Ended (No Structure):**
- User must formulate every request from scratch
- Inconsistent responses across sessions
- High cognitive load for decision-making
- Difficult to maintain context in long sessions
- No guidance for complex workflows

**Fully Predefined (Rigid Scripts):**
- Limited to what protocol author anticipated
- Cannot adapt to context-specific situations
- Misses creative solutions
- Requires constant protocol updates
- Constrains AI model capabilities

**The Dilemma:**
- Structure provides consistency but limits flexibility
- Freedom enables creativity but lacks guidance
- Users need both, but traditional approaches force a choice

---

## The Protocol Solution

### Layered Protocol Architecture

kiro-agents solves this dilemma through **layered protocols** that separate concerns:

**Top 1-2 Levels (Structured Boundaries):**
- Provide clear responsibilities and scope
- Present consistent interface with numbered choices
- Guide navigation and workflow structure
- Reduce decision fatigue
- Maintain context across sessions

**Inner Levels (Open-Ended Execution):**
- NOT predefined at all
- Leverage SOTA model's knowledge and creativity
- Generate context-specific solutions
- Adapt to user's unique situation
- Produce diverse, effective approaches

**Key Insight:** Structure the PRESENTATION FORMAT while preserving full AI CAPABILITY.

---

## Layered Architecture

### How It Works

```
┌─────────────────────────────────────────┐
│  Level 1: User Interface (Structured)   │
│  - Numbered choices                     │
│  - Clear navigation                     │
│  - Consistent format                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Level 2: Workflow Guidance (Structured)│
│  - Step-by-step process                 │
│  - Progress tracking                    │
│  - Context preservation                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Level 3+: Execution (Open-Ended)       │
│  - AI generates optimal approach        │
│  - Context-aware solutions              │
│  - Creative problem-solving             │
│  - Adapts to specific needs             │
└─────────────────────────────────────────┘
```

### Example: Agent Creation

**Structured Boundary (Level 1):**
```
What type of agent would you like to create?
1. Quick Start (predefined templates)
2. Project-Specific (AI analyzes codebase)
3. Explore Roles (domain browser)
4. Guided Wizard (step-by-step)
5. Natural Language (describe in plain English)
```

**Open-Ended Execution (Level 3+):**
- User selects "Project-Specific"
- AI analyzes codebase structure
- Generates optimal agent architecture for THIS project
- Suggests capabilities based on actual code patterns
- Proposes workflows tailored to tech stack
- Creates agent definition better than manual specification

**Result:** Consistent interface + context-specific implementation = All-powerful agent

---

## WHAT vs HOW Principle

### The Fundamental Distinction

**Users Specify WHAT:**
- Roles and responsibilities
- Capabilities needed
- Objectives to achieve
- Problems to solve
- Constraints and requirements

**AI Determines HOW:**
- Optimal architecture
- Implementation approach
- Workflow structure
- Integration patterns
- Edge case handling

### Why This Matters

**Manual Specification (Traditional):**
- User must define every detail
- Takes 1-3 days for complex agents
- Limited by user's knowledge
- Often misses better approaches
- Requires expertise in agent design

**AI Generation (kiro-agents):**
- User defines objectives and scope
- Takes 3-5 minutes with wizard
- Leverages model's vast knowledge
- Discovers optimal approaches
- No agent design expertise needed

**Evidence:** Agent creation wizard produces better results in 3-5 minutes than 1-3 days of manual specification.

---

## Why This Works

### Cognitive Science Foundations

**1. Cognitive Load Theory**
- **Intrinsic load:** Complexity of the task itself (unavoidable)
- **Extraneous load:** Unnecessary complexity from poor design (reducible)
- **Germane load:** Mental effort for learning and understanding (desirable)

**Layered protocols:**
- Reduce extraneous load (consistent interface, clear navigation)
- Preserve germane load (actual problem-solving)
- Don't increase intrinsic load (full AI capability available)

**2. Working Memory Limitations**
- Humans can hold 4-7 items in working memory
- Structured choices reduce memory demands
- Diff blocks provide external memory
- Context preservation prevents memory overload

**3. Decision Fatigue**
- Every decision depletes mental resources
- Pre-structured options reduce decision overhead
- Numbered choices enable quick action
- Flexibility available when needed

### AI Model Optimization

**SOTA Models Generate Better When:**
- Given clear objectives (WHAT) rather than rigid steps (HOW)
- Provided context and constraints
- Allowed to leverage full knowledge base
- Enabled to adapt to specific situations

**Layered protocols provide:**
- Clear objectives at top levels
- Context through structured interaction
- Freedom at execution levels
- Adaptation through open-ended generation

---

## Evidence from Real-World Usage

### Agent Creation Protocol

**Observation:** Users creating agents via wizard consistently report:
- Faster than manual specification (3-5 min vs 1-3 days)
- Better results than they could design manually
- Agents handle situations not explicitly programmed
- Surprised by AI's creative suggestions

**Why:** Structured wizard guides WHAT (roles, capabilities), AI generates optimal HOW (architecture, workflows).

### Agent Modification Protocol

**Observation:** Modification protocol is MORE open-ended than creation:
- Less consistent between uses
- Much more creative in suggestions
- Original and effective approaches
- So powerful it replaced other prepared protocols

**Why:** Experienced users benefit from AI creativity. Open-ended execution at inner levels produces context-specific solutions.

### Copy-Paste Pattern Discovery

**Observation:** Users naturally developed pattern:
1. AI suggests brilliant approach in open-ended response
2. User copies suggestion text
3. Saves for future reference
4. Pastes when facing similar situations

**Why:** Captures AI creativity without constraining future responses. Users build personal libraries of effective patterns.

### Chit-Chat Flexibility

**Observation:** Users discovered flexibility within structure:
- Type `more` for additional options
- Type `search {keyword}` to filter
- State desires directly in plain language
- Numbered choices are suggestions, not limitations

**Why:** Structured presentation doesn't limit capability. AI understands intent whether user picks number or describes need.

---

## Common Misconceptions

### "Structured protocols limit AI capability"

**False.** Protocols limit PRESENTATION FORMAT, not CONTENT CAPABILITY.

**Analogy:** A restaurant menu structures how dishes are presented, but doesn't limit the chef's culinary skills. The chef can still create amazing food, and you can still request off-menu items.

**Reality:**
- Structured interface = Consistent, navigable presentation
- Open-ended execution = Full AI capability
- Result = Best of both worlds

### "I need to specify every detail"

**False.** Specify WHAT you need, let AI determine HOW.

**Example:**
- ❌ "Create agent with these 47 specific capabilities, using this exact workflow structure, following these 23 rules..."
- ✅ "I need a testing agent for my React + TypeScript project"

**Result:** AI generates optimal testing agent for YOUR project, better than manual specification.

### "Predefined protocols are more reliable"

**False.** Fully predefined protocols miss context-specific opportunities.

**Comparison:**
- Predefined: "Always do X, then Y, then Z"
- Layered: "Achieve objective A (AI determines optimal approach)"

**Reality:** Layered protocols adapt to context, predefined protocols don't.

### "Numbered choices restrict my options"

**False.** Numbered choices are suggestions that reduce decision fatigue.

**Reality:**
- Choices predict most likely needs
- Users can request more options
- Users can state desires directly
- AI understands intent either way

---

## Design Principles

### 1. Structure Presentation, Not Capability

**Principle:** Consistent interface format ≠ Limited content capability

**Implementation:**
- Structured top levels (navigation, choices)
- Open-ended inner levels (execution, solutions)
- Full AI capability always available

**Benefit:** Reduces cognitive load without reducing AI power

### 2. Optimize for WHAT, Not HOW

**Principle:** Users specify objectives, AI determines implementation

**Implementation:**
- Wizard asks for roles, capabilities, objectives
- AI generates optimal architecture and workflows
- Context-specific solutions, not generic templates

**Benefit:** Better results in less time, no expertise required

### 3. Progressive Disclosure

**Principle:** Start simple, provide depth on demand

**Implementation:**
- Minimal base context (~0.9K tokens)
- Protocols load on-demand (lazy loading)
- Multi-part explanations with navigation
- Users control depth and pace

**Benefit:** Prevents information overload, maintains clarity

### 4. Flexibility Within Structure

**Principle:** Structured suggestions, not rigid constraints

**Implementation:**
- Numbered choices as predictions
- `more`, `search`, `filter` options
- Direct statement of desires
- AI understands intent either way

**Benefit:** Reduces decision fatigue while preserving freedom

### 5. Context Preservation

**Principle:** Maintain context explicitly across sessions

**Implementation:**
- Diff blocks (external working memory)
- Explicit context references
- Progress tracking
- Suspended task handling

**Benefit:** Survives interruptions, reduces cognitive load

### 6. Universal Applicability

**Principle:** Design for specific needs, benefit everyone

**Implementation:**
- Originally designed for ADHD-C accessibility
- Patterns benefit all users (universal design)
- Reduces cognitive load universally

**Benefit:** Accessibility as foundation, not afterthought

---

## Implementation Details

### Protocol Types in kiro-agents

**Agent Creation Protocol:**
- MORE structured (for new users)
- Consistent, predictable options
- Guided step-by-step process
- AI generates agent architecture

**Agent Modification Protocol:**
- MORE open-ended (for experienced users)
- Creative, context-specific suggestions
- Less consistent between uses
- Leverages AI creativity fully

**Agent Activation Protocol:**
- Loads agent definition
- Applies agent-specific protocols
- Maintains role until switched

**Mode Switching Protocol:**
- Loads mode definition
- Preserves file changes
- Resets workflow state
- Handles context preservation

### Technical Architecture

**Centralized Manifest System:**
- Single source of truth (`src/manifest.ts`)
- Glob pattern auto-discovery
- Type-safe file mappings
- Guaranteed consistency

**Build-Time Processing:**
- Dynamic substitutions
- Protocol injection
- Multi-pass resolution
- Target-aware paths

**Lazy Loading:**
- Minimal base context
- On-demand protocol loading
- Progressive enhancement
- Scales with user needs

### Cross-IDE Compatibility

**Core Layer (`src/core/`):**
- IDE-agnostic protocols
- Generic terminology
- Substitution placeholders
- Universal patterns

**IDE-Specific Layer (`src/kiro/`):**
- Kiro-specific features
- IDE-specific paths
- Platform integrations
- Substitution overrides

---

## Conclusion

The layered protocol architecture is the key innovation that makes kiro-agents effective:

**Structured Boundaries:**
- Consistent interface
- Clear navigation
- Reduced cognitive load
- Decision fatigue prevention

**Open-Ended Execution:**
- Full AI capability
- Context-specific solutions
- Creative problem-solving
- Optimal implementations

**Result:**
- All-powerful agents
- Better than manual specification
- Faster than traditional approaches
- Accessible to all users

**Key Takeaway:** Structure the presentation format while preserving full AI capability. This enables consistency without limitation, guidance without constraint, and power without complexity.

---

**See Also:**
- [Interaction Patterns](interaction-patterns.md) - How protocols are presented to users
- [Neurodivergent Accessibility](neurodivergent-accessibility.md) - Why chit-chat protocol works
- [Creating All-Powerful Agents](../user-guide/creating-powerful-agents.md) - Practical guide to layered architecture

**Document version:** 1.0.0  
**Last updated:** December 20, 2025  
**Maintained by:** kiro-agents project
