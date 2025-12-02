---
inclusion: manual
---

# Available Interaction Styles
 
## 1. Chit-Chat Mode (Interactive)
 
**Best for**: ADHD-C users, complex workflows, step-by-step guidance
 
**Characteristics**:
 
- Diff blocks showing progress at start of each response
- Numbered choice lists (4-6 options, up to 16 max)
- Single focus per message
- Visual formatting (bold, code blocks)
- Context recovery system

**Example agents**: kiro-manager
 
**When to use**:

- Multi-step workflows
- Decision-heavy processes
- User needs guidance through options
- Complex feature management

---
 
## 2. Direct Execution Mode
 
**Best for**: Code-focused agents, quick tasks, minimal interaction
 
**Characteristics**:

- Executes immediately without asking
- Provides results and brief explanation
- Minimal back-and-forth
- Assumes user knows what they want

**Example use cases**: Refactoring agent, formatter agent, linter agent
 
**When to use**:

- Clear, unambiguous tasks
- Automated processes
- Expert users who know exactly what they need

---
 
## 3. Consultative Mode
 
**Best for**: Architecture decisions, design reviews, analysis
 
**Characteristics**:

- Asks clarifying questions first
- Provides recommendations with rationale
- Explains tradeoffs
- Waits for user approval before acting

**Example use cases**: API designer, architecture reviewer, security auditor
 
**When to use**:

- High-impact decisions
- Multiple valid approaches exist
- User needs expert guidance
- Tradeoffs need discussion

---
 
## 4. Wizard Mode (Step-by-Step)
 
**Best for**: Setup processes, configuration, scaffolding
 
**Characteristics**:

- Linear progression through steps
- Collects information incrementally
- Shows progress indicator
- Validates each step before proceeding

**Example use cases**: Project setup agent, configuration wizard, onboarding agent
 
**When to use**:

- Multi-step setup processes
- Information gathering needed
- Order matters
- Validation at each step

---
 
## 5. Hybrid Mode
 
**Best for**: Flexible agents that adapt to context
 
**Characteristics**:

- Combines multiple styles
- Adapts based on task complexity
- Simple tasks → Direct execution
- Complex tasks → Chit-chat or consultative

**Example agents**: kiro-manager-hybrid
 
**When to use**:

- Agent handles diverse tasks
- Task complexity varies
- Want flexibility

---
 
## 6. Documentation Mode
 
**Best for**: Writing, explaining, teaching
 
**Characteristics**:

- Comprehensive explanations
- Examples and code snippets
- Structured output (headers, sections)
- Progressive disclosure for long content

**Example use cases**: Documentation writer, tutorial creator, explainer agent
 
**When to use**:

- Creating documentation
- Teaching concepts
- Explaining complex topics

---
 
## Mixing Styles
 
You can combine elements from different styles:
 
**Example**: Consultative + Chit-Chat

- Ask clarifying questions (consultative)
- Use diff blocks and numbered choices (chit-chat)
- Single focus per message (chit-chat)

**Example**: Direct Execution + Documentation

- Execute task immediately (direct)
- Provide detailed explanation after (documentation)

---
 
## Choosing the Right Style
 
**Consider**:

1. **Task complexity** - Simple → Direct, Complex → Chit-chat/Wizard
2. **User expertise** - Expert → Direct, Beginner → Wizard/Consultative
3. **Decision impact** - High → Consultative, Low → Direct
4. **Interaction frequency** - Many steps → Chit-chat, One-shot → Direct
5. **Cognitive load** - High → Chit-chat (ADHD-optimized), Low → Any
