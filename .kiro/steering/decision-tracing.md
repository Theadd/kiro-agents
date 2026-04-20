---
inclusion: manual
description: "General-purpose decision tracing system that makes AI reasoning visible, traceable, and auditable"
keywords: ["tracing", "decisions", "reasoning", "transparency", "audit", "explainability"]
---

# Decision Tracing System

Transparent decision tracking that shows how inputs flow through reasoning steps to produce outputs.

## Activation

**Auto-activated when loaded via `#decision-tracing`**

Display activation indicator:
```
[🔍 DECISION_TRACING: ON]
```

## Core Protocol: Trace Every Decision

For each significant decision or reasoning step, provide a trace entry:

**Format:**
```
🔍 TRACE: [Step Name]
├─ INPUT: What information/context triggered this step
├─ REASONING: Why this decision was made
├─ ALTERNATIVES: Other options considered (if any)
├─ CONFIDENCE: High | Medium | Low
├─ SOURCE: Where information came from (training | context | inference)
└─ OUTPUT: What was decided/produced
```

**Example:**
```
🔍 TRACE: [Choose Testing Framework]
├─ INPUT: User requested tests for authentication flow
├─ REASONING: Jest is already in package.json, team familiar with it
├─ ALTERNATIVES: Vitest (faster), Mocha (simpler) - rejected for consistency
├─ CONFIDENCE: High
├─ SOURCE: Context (package.json) + Training (framework knowledge)
└─ OUTPUT: Use Jest with existing configuration
```

## When to Trace

**Always trace:**
- Technology/library selection decisions
- Architecture or pattern choices
- File structure or naming decisions
- Algorithm or approach selection
- Breaking changes or refactoring strategies
- Error handling approaches
- Security or performance tradeoffs

**Optional tracing:**
- Routine implementations following established patterns
- Simple formatting or style choices
- Obvious next steps in clear workflows

## Trace Granularity Levels

**Level 1: High-Level (default)**
- Major decisions only
- One trace per significant choice
- ~3-5 traces per response

**Level 2: Detailed**
- Include intermediate reasoning steps
- Show sub-decisions within major decisions
- ~8-12 traces per response

**Level 3: Exhaustive**
- Every reasoning step traced
- Complete audit trail
- ~15+ traces per response

**User can request level:** "trace at level 2" or "detailed tracing"

## Trace Chain Visualization

For complex multi-step reasoning, show the chain:

```
🔍 TRACE CHAIN: [Task Name]

1️⃣ [Analyze Requirements]
   └─> Identified 3 core features, 2 edge cases

2️⃣ [Choose Architecture]
   └─> Selected layered approach for testability

3️⃣ [Select Technologies]
   └─> React + TypeScript + Jest (team expertise)

4️⃣ [Design File Structure]
   └─> Feature-based folders (scales better)

5️⃣ [Implement Core Logic]
   └─> TDD approach (requirements are clear)
```

## Decision Point Markers

When multiple valid paths exist, mark the decision point:

```
⚠️ DECISION POINT: [Name]

OPTIONS:
A) [Option 1] - Pros: X, Y | Cons: Z
B) [Option 2] - Pros: A, B | Cons: C
C) [Option 3] - Pros: D, E | Cons: F

CHOSEN: B
REASON: Best balance of performance and maintainability
CONFIDENCE: Medium (would need benchmarks to confirm)
```

## Assumption Tracking

Make assumptions explicit within traces:

```
🔍 TRACE: [Design API Endpoint]
├─ INPUT: User wants to fetch user profile data
├─ ASSUMPTIONS:
│  • REST API (not GraphQL) - [ASSUMED: no GraphQL mentioned]
│  • JSON response format - [ASSUMED: standard for REST]
│  • Authentication required - [INFERRED: profile data is sensitive]
├─ REASONING: Standard REST patterns for CRUD operations
├─ CONFIDENCE: Medium (assumptions need validation)
└─ OUTPUT: GET /api/users/:id endpoint design
```

## Confidence Calibration

**High Confidence:**
- Information from context (files, explicit user statements)
- Well-established patterns with clear best practices
- Decisions matching existing codebase conventions

**Medium Confidence:**
- Reasonable inferences from partial information
- Multiple valid approaches with tradeoffs
- Decisions requiring assumptions

**Low Confidence:**
- Significant assumptions or missing information
- Experimental or cutting-edge technologies
- Decisions with unclear requirements

## Source Attribution

**Training:** Knowledge from model training data
**Context:** Information from current conversation/files
**Inference:** Logical deductions from available information
**Assumption:** Educated guesses filling information gaps

## Error Tracing

When errors occur or reasoning fails, trace the failure:

```
❌ TRACE: [Failed Approach]
├─ ATTEMPTED: Implement feature X using pattern Y
├─ REASONING: Pattern Y worked for similar feature Z
├─ FAILURE: Pattern Y doesn't handle edge case A
├─ LEARNED: Need to check for edge case A before applying pattern Y
└─ NEXT: Try pattern W which handles edge case A
```

## Trace Aggregation

At end of complex tasks, provide trace summary:

```
📊 TRACE SUMMARY

DECISIONS MADE: 8
├─ High confidence: 5
├─ Medium confidence: 2
└─ Low confidence: 1 (API authentication method - needs clarification)

KEY DECISION POINTS:
1. Architecture: Layered approach (high confidence)
2. Testing: Jest + React Testing Library (high confidence)
3. State management: Context API vs Redux (medium confidence - chose Context)

ASSUMPTIONS REQUIRING VALIDATION:
• REST API (not GraphQL)
• No real-time updates needed
• Standard authentication flow

ALTERNATIVES CONSIDERED: 6
TRACES GENERATED: 12
```

## Integration with Other Systems

**Works with:**
- Any agent (load via agent definition or on-demand)
- Strict mode (traces help clarify ambiguities)
- Chit-chat protocol (traces appear before numbered choices)
- Reflection system (traces can be captured as insights)

**Conflicts:**
- None - tracing is additive, doesn't override other protocols

## Performance Considerations

**Token overhead:**
- Level 1 (High-Level): ~200-400 tokens per response
- Level 2 (Detailed): ~500-800 tokens per response
- Level 3 (Exhaustive): ~1000+ tokens per response

**When to disable:**
- Simple, routine tasks with clear patterns
- Token budget is constrained
- User explicitly requests "no tracing"

## Commands

**Activation:**
- `#decision-tracing` - Load and activate
- "trace this" - Enable for current task
- "trace at level 2" - Enable with specific granularity

**Deactivation:**
- "stop tracing" - Disable for remainder of session
- "no traces" - Disable for current response only

**Adjustment:**
- "more detailed traces" - Increase granularity
- "fewer traces" - Decrease granularity
- "trace summary only" - Show only aggregated summary

## Best Practices

**DO:**
- Trace significant decisions that affect outcomes
- Show alternatives considered (builds trust)
- Calibrate confidence honestly
- Attribute sources accurately
- Use traces to explain "why" not just "what"

**DON'T:**
- Trace every trivial step (creates noise)
- Inflate confidence to seem certain
- Hide assumptions or uncertainties
- Skip tracing when user explicitly requested it
- Use traces as filler content

## Example: Complete Traced Response

```
[🔍 DECISION_TRACING: ON]

🔍 TRACE: [Analyze User Request]
├─ INPUT: "Add authentication to the app"
├─ REASONING: Need to determine auth type, storage, and flow
├─ ASSUMPTIONS:
│  • Web application (not mobile) - [INFERRED: from context]
│  • JWT-based auth - [ASSUMED: modern standard]
│  • Email/password login - [ASSUMED: no OAuth mentioned]
├─ CONFIDENCE: Medium (assumptions need validation)
└─ OUTPUT: Plan JWT-based email/password authentication

⚠️ DECISION POINT: [Token Storage]

OPTIONS:
A) localStorage - Pros: Simple, persistent | Cons: XSS vulnerable
B) httpOnly cookie - Pros: XSS safe | Cons: CSRF considerations
C) Memory only - Pros: Most secure | Cons: Lost on refresh

CHOSEN: B (httpOnly cookie)
REASON: Best security/UX balance, CSRF mitigated with tokens
CONFIDENCE: High

🔍 TRACE: [Design Auth Flow]
├─ INPUT: JWT + httpOnly cookie decision
├─ REASONING: Standard flow: login → set cookie → validate on requests
├─ ALTERNATIVES: Session-based (rejected: stateful server)
├─ CONFIDENCE: High
├─ SOURCE: Training (auth patterns) + Context (app architecture)
└─ OUTPUT: Stateless JWT flow with refresh tokens

I'll implement JWT authentication with httpOnly cookies for secure token storage.

**What would you like to do?**
1. Implement the auth system as traced
2. Validate assumptions first (auth type, storage, flow)
3. Explore alternative approaches
4. See more detailed traces of implementation steps
```

## Success Metrics

**Effective tracing provides:**
- Clear reasoning chains from input to output
- Visible decision points with alternatives
- Honest confidence calibration
- Accurate source attribution
- Debuggable audit trails
- User trust through transparency

---

**Status:** Active when loaded
**Overhead:** ~200-800 tokens depending on granularity
**Compatibility:** Works with all agents and protocols
