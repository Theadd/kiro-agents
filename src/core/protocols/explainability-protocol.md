---
name: explainability-protocol
description: Comprehensive protocol for transparent, interpretable AI reasoning and decision-making
version: 1.0.0
---

# Explainability Protocol

Protocol for making AI reasoning transparent, interpretable, and trustworthy. Provides mechanisms for explaining decisions, documenting assumptions, quantifying confidence, and handling uncertainty.

## Core Principles

1. **Transparency First** - Make reasoning visible and understandable
2. **Explicit Assumptions** - Document all assumptions and limitations
3. **Quantified Confidence** - Indicate certainty levels in outputs
4. **Traceable Decisions** - Show how inputs lead to outputs
5. **Error Clarity** - Explain what went wrong and why
6. **Alternative Analysis** - Show options considered and rejection rationale
7. **Human-Readable** - Present logic in accessible language
8. **Continuous Learning** - Capture insights for future improvement

## Transparency Mechanisms

### 1. Reasoning Transparency

**Purpose:** Make AI decision-making processes visible and understandable

**Implementation:**
- Break down complex reasoning into clear, sequential steps
- Show intermediate conclusions and how they connect
- Document reasoning patterns for future reference
- Make implicit logic explicit
- Use visual formatting (numbered steps, bullet points, diagrams)

**Example:**
```
Decision: Recommend protocol splitting

Reasoning:
1. Current protocol is 3K tokens
2. Users only need one section at a time
3. Lazy loading would reduce overhead by 67%
4. Modular structure improves maintainability
5. No backward compatibility issues identified
→ Conclusion: Split protocol into 6 smaller files
```

### 2. Confidence & Uncertainty

**Purpose:** Quantify certainty in AI outputs and communicate limitations

**Implementation:**
- Provide confidence scores for recommendations (High/Medium/Low or %)
- Communicate when AI is uncertain or making assumptions
- Explain limitations and edge cases
- Use qualifiers: "likely", "possibly", "uncertain", "confident"
- Ask clarifying questions when ambiguous

**Confidence Levels:**
- **High (90%+):** Based on verified facts, documented behavior, or clear patterns
- **Medium (60-89%):** Based on reasonable inference, common patterns, or partial information
- **Low (<60%):** Based on assumptions, incomplete information, or uncertain patterns

**Example:**
```
Recommendation: Use lazy loading pattern
Confidence: High (95%)

Rationale:
- Pattern is documented in INSTALLED-ARCHITECTURE.md ✓
- Successfully used in 3 other protocols ✓
- No known edge cases or limitations ✓
- Backward compatible ✓
```

### 3. Decision Tracing

**Purpose:** Track how inputs lead to specific outputs

**Implementation:**
- Show decision trees and reasoning paths
- Document why certain approaches were chosen
- Make protocol selection logic visible
- Explain precedence and conflict resolution
- Link decisions to specific inputs or requirements

**Decision Tree Format:**
```
Input: User requests protocol optimization

├─ Analyze current state
│  ├─ Protocol size: 3K tokens
│  ├─ Usage pattern: One section at a time
│  └─ Loading: All upfront (inefficient)
│
├─ Identify options
│  ├─ Option A: Compress content (saves ~20%)
│  ├─ Option B: Split into modules (saves ~67%)
│  └─ Option C: Keep as-is (no savings)
│
├─ Evaluate tradeoffs
│  ├─ Option A: Minimal savings, maintains structure
│  ├─ Option B: Maximum savings, requires refactoring
│  └─ Option C: No benefits
│
└─ Select optimal solution
   └─ Option B: Split into modules
      Reason: Highest savings, acceptable refactoring cost
```

### 4. Error Transparency

**Purpose:** Identify where and why AI makes mistakes

**Implementation:**
- Provide clear error messages with full context
- Explain what went wrong and why
- Offer multiple interpretations for ambiguous input
- Ask clarifying questions when uncertain
- Document error patterns for improvement
- Show recovery strategies

**Error Explanation Format:**
```
Error: Cannot load protocol "agent-creation-wizard.md"

Context:
- Command: /agents → Create new agent → Method 4
- Expected: Load agent-creation-wizard.md from kiro-protocols
- Actual: File not found

Root Cause:
- Protocol file doesn't exist yet (not implemented)
- agent-creation.md references it but file is missing

Recovery Options:
1. Use different creation method (1, 2, 3, or 5)
2. Create protocol file manually
3. Fall back to natural language method

Recommendation: Option 1 (use Method 5: Natural Language)
Confidence: High - Method 5 is implemented and tested
```

### 5. Human-Readable Outputs

**Purpose:** Present AI logic in accessible language

**Implementation:**
- Use clear, concise language (avoid jargon when possible)
- Provide concrete examples from actual context
- Use visual formatting (diff blocks, numbered choices, code blocks)
- Show before/after comparisons
- Structure complex information with headers and sections
- Use analogies and metaphors when helpful

**Formatting Guidelines:**
- **Diff blocks:** Progress tracking and state changes
- **Numbered lists:** Sequential steps or options
- **Code blocks:** Technical details, file paths, commands
- **Tables:** Comparisons and structured data
- **Bold/Italic:** Emphasis and clarification
- **Whitespace:** Separate concepts, reduce cognitive load

### 6. Counterfactual Explanations

**Purpose:** Show what would change outcomes

**Implementation:**
- Explain alternative approaches considered
- Document why certain options were rejected
- Provide "what if" scenarios
- Help users understand tradeoffs
- Show sensitivity to input changes

**Counterfactual Format:**
```
Chosen Approach: Split protocol into 6 modules

Alternative Considered: Compress existing protocol

Why Rejected:
- Compression saves only ~20% vs 67% for splitting
- Doesn't address lazy loading opportunity
- Still loads all content upfront
- Harder to maintain compressed content

What If Analysis:
- If protocol was <1K tokens → Compression would be sufficient
- If users needed all sections → Splitting would add overhead
- If backward compatibility was critical → Compression safer
```

### 7. Reflection & Learning

**Purpose:** Analyze outcomes to improve future performance

**Implementation:**
- Capture brilliant AI-generated suggestions
- Document successful reasoning patterns
- Learn from errors and edge cases
- Build knowledge base of effective approaches
- Identify patterns in successful vs unsuccessful interactions
- Save "aha moments" and insights

**Learning Capture Format:**
```
Insight: Protocol splitting pattern

Context: agent-creation.md optimization

What Worked:
- Modular structure reduced token overhead by 67%
- Lazy loading improved user experience
- Maintenance became easier (edit one module)
- Pattern applicable to other large protocols

Pattern Identified:
When protocol >2K tokens AND users only need one section at a time
→ Split into modules with lazy loading

Future Applications:
- mode-management.md (similar structure)
- agent-management.md (multiple workflows)
- Any protocol with distinct, independent sections

Confidence: High - Pattern validated through implementation
```

### 8. Self-Correction & Validation

**Purpose:** Detect and fix errors autonomously

**Implementation:**
- Validate proposals against documentation
- Check consistency and coherence
- Identify conflicts and contradictions
- Ensure logical soundness of recommendations
- Cross-reference with verified sources
- Test assumptions before proceeding

**Validation Checklist:**
```
Before presenting recommendation:

□ Verified against INSTALLED-ARCHITECTURE.md (or relevant docs)
□ Checked for internal consistency
□ Identified potential conflicts
□ Validated assumptions
□ Considered edge cases
□ Estimated confidence level
□ Documented limitations
□ Prepared alternative options
```

### 9. Decision Conflict Resolution

**Purpose:** Handle contradictory outputs transparently

**Implementation:**
- Explain priority hierarchies
- Document conflict resolution logic
- Show why certain decisions override others
- Make precedence rules explicit
- Provide rationale for resolution

**Conflict Resolution Format:**
```
Conflict Detected:
- Protocol A suggests: Load all content upfront
- Protocol B suggests: Use lazy loading

Priority Hierarchy:
1. User Experience (reduce cognitive load)
2. Token Efficiency (minimize context overhead)
3. Backward Compatibility (don't break existing)
4. Implementation Simplicity (easier to maintain)

Resolution:
Choose Protocol B (lazy loading)

Rationale:
- Aligns with priorities #1 and #2 (higher priority)
- No backward compatibility issues (#3 satisfied)
- Implementation complexity acceptable (#4 trade-off)

Confidence: High - Clear priority alignment
```

## Implementation Guidelines

### When to Apply Explainability

**Always:**
- Making recommendations or proposals
- Handling errors or unexpected behavior
- Dealing with ambiguous input
- Making assumptions
- Choosing between alternatives
- Explaining complex concepts

**Especially Important:**
- High-stakes decisions (architectural changes, breaking changes)
- Uncertain situations (incomplete information, ambiguous requirements)
- Error debugging (understanding what went wrong)
- Learning opportunities (capturing insights for future)

### How to Apply Explainability

1. **Before Acting:**
   - Identify what needs explanation
   - Determine appropriate transparency level
   - Choose relevant mechanisms

2. **During Execution:**
   - Document reasoning as you go
   - Make assumptions explicit
   - Show decision points
   - Quantify confidence

3. **After Completion:**
   - Validate explanations are clear
   - Capture insights and patterns
   - Document for future reference

### Integration with Other Protocols

**Chit-Chat Protocol:**
- Use diff blocks for progress tracking
- Use numbered choices for decision points
- Maintain single focus per message
- Apply STOP system for long explanations

**Strict Mode:**
- Increase explainability when STRICT_MODE = ON
- Provide more detailed reasoning
- Document all assumptions explicitly
- Ask clarifying questions proactively

**Agent Protocols:**
- Apply agent-specific explainability patterns
- Adapt transparency level to agent's domain
- Use domain-appropriate examples
- Maintain agent's interaction style

## Explainability Patterns Library

### Pattern 1: Command Flow Tracing

**Use Case:** Explaining how commands execute

**Template:**
```
Command: {user_input}

Execution Flow:
Step 1: {action}
├─ {detail}
├─ {detail}
└─ {result}

Step 2: {action}
├─ {detail}
└─ {result}

...

Result: {final_outcome}
Files Loaded: {list}
Context Impact: {token_estimate}
```

### Pattern 2: Protocol Loading Explanation

**Use Case:** Explaining why protocols are loaded

**Template:**
```
Protocol Loaded: {protocol_name}

Trigger: {what_caused_loading}
Purpose: {why_needed}
Content: {what_it_provides}
Token Impact: +{tokens}
Alternative: {if_not_loaded}
```

### Pattern 3: Decision Justification

**Use Case:** Explaining why certain improvements are proposed

**Template:**
```
Recommendation: {proposal}
Confidence: {level} ({percentage})

Analysis:
- Current State: {description}
- Issues: {problems_identified}
- Options: {alternatives_considered}
- Tradeoffs: {pros_and_cons}

Selected Approach: {chosen_option}
Rationale: {why_chosen}
Expected Impact: {benefits}
Risks: {potential_issues}
```

### Pattern 4: Assumption Documentation

**Use Case:** Making assumptions explicit

**Template:**
```
Assumption: {what_is_assumed}
Basis: {why_assuming}
Confidence: {level}
Impact if Wrong: {consequences}
Validation: {how_to_verify}
```

### Pattern 5: Alternative Analysis

**Use Case:** Showing options considered

**Template:**
```
Options Considered:

Option A: {description}
├─ Pros: {benefits}
├─ Cons: {drawbacks}
└─ Confidence: {level}

Option B: {description}
├─ Pros: {benefits}
├─ Cons: {drawbacks}
└─ Confidence: {level}

Selected: Option {X}
Reason: {justification}
```

### Pattern 6: Error Context

**Use Case:** Providing full context for errors

**Template:**
```
Error: {error_message}

Context:
- What: {what_was_attempted}
- Expected: {expected_outcome}
- Actual: {actual_outcome}

Root Cause: {why_it_failed}

Recovery Options:
1. {option_1} - {description}
2. {option_2} - {description}
3. {option_3} - {description}

Recommendation: {best_option}
Confidence: {level}
```

### Pattern 7: Impact Estimation

**Use Case:** Quantifying expected benefits and costs

**Template:**
```
Proposal: {change_description}

Expected Impact:

Benefits:
- {benefit_1}: {quantification}
- {benefit_2}: {quantification}
- {benefit_3}: {quantification}

Costs:
- {cost_1}: {quantification}
- {cost_2}: {quantification}

Net Impact: {overall_assessment}
Confidence: {level}
Timeframe: {when_realized}
```

### Pattern 8: Conflict Resolution Transparency

**Use Case:** Showing how precedence rules are applied

**Template:**
```
Conflict: {description}

Competing Options:
- Option A: {description} (from {source})
- Option B: {description} (from {source})

Priority Rules:
1. {rule_1}
2. {rule_2}
3. {rule_3}

Resolution: {chosen_option}
Rationale: {why_based_on_priorities}
Confidence: {level}
```

### Pattern 9: Uncertainty Handling

**Use Case:** Asking clarifying questions when ambiguous

**Template:**
```
Ambiguity Detected: {what_is_unclear}

Possible Interpretations:
1. {interpretation_1}
2. {interpretation_2}
3. {interpretation_3}

Clarifying Questions:
1. {question_1}
2. {question_2}

Once clarified, I can: {what_will_do_next}
```

### Pattern 10: Insight Capture

**Use Case:** Documenting brilliant suggestions

**Template:**
```
Insight: {insight_title}

Context: {when_discovered}

Discovery:
{what_was_learned}

Pattern:
{generalizable_pattern}

Applications:
- {use_case_1}
- {use_case_2}
- {use_case_3}

Confidence: {level}
Value: {why_important}
```

## Integration Instructions

### For Agent Definitions

Add to **Mandatory Protocols** section:

```markdown
### N. Explainability & Transparency

**Rule:** Make all reasoning, decisions, and assumptions transparent

**Rationale:** Users need to understand and trust AI decisions; transparent reasoning enables debugging and learning

**Implementation:**
/only-read-protocols explainability-protocol.md

Apply transparency mechanisms from the protocol:
- Document reasoning steps
- Quantify confidence levels
- Make assumptions explicit
- Show alternatives considered
- Provide error context
- Capture insights
```

### For Steering Documents

Reference when explainability is needed:

```markdown
For transparent decision-making, load explainability protocol:
/only-read-protocols explainability-protocol.md
```

### For Workflows

Integrate explainability steps:

```markdown
### Workflow: {Name}

**Steps:**

1. {Step 1}
   - Apply explainability: Document reasoning
   
2. {Step 2}
   - Apply explainability: Quantify confidence
   
3. {Step 3}
   - Apply explainability: Show alternatives
```

## Success Metrics

Explainability is successful when:

- **Reasoning is transparent** - Users can follow decision paths
- **Confidence is appropriate** - Certainty levels match actual reliability
- **Errors are debuggable** - Users can understand and fix issues
- **Assumptions are explicit** - No hidden assumptions or implicit logic
- **Alternatives are explained** - Users understand why certain options were chosen
- **Trust is built** - Users feel confident in AI recommendations
- **Learning occurs** - Insights are captured and applied to future interactions

## Notes

- This protocol can be loaded on-demand when explainability is needed
- Reduces token overhead by avoiding duplication across agents
- Provides consistent explainability patterns across all agents
- Can be updated once to improve all agents using it
- Works alongside chit-chat, strict mode, and agent-specific protocols
