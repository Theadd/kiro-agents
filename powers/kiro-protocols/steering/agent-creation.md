# Agent Creation Protocol

This file contains the detailed instructions for creating new agents. It is referenced during agent creation workflow in agent management mode.

## Agent Creation Steps

When creating a new agent:

### Step 1: Initialize Creation Wizard

Use chit-chat mode for the creation process:

```diff
  👉 Agent creation wizard
  ⏳ Gathering agent information
```

**Current Focus**: Creating new agent

### Step 2: Collect Agent Information

Guide user through agent definition with numbered choices:

#### 2.1: Agent Type Selection

**What type of agent would you like to create?**

1. **Specialist** - Focused on specific domain (e.g., refactoring, testing)
   - Deep expertise in narrow area
   - Clear boundaries of responsibility
   - Best for: Specialized tasks requiring domain expertise

2. **Generalist** - Broad capabilities across domains
   - Flexible and adaptable
   - Good for exploration and discovery
   - Best for: General-purpose assistance

3. **Coordinator** - Manages other agents
   - Orchestrates complex workflows
   - Handles agent handoffs
   - Best for: Multi-agent workflows

#### 2.2: Agent Name

**What should we name this agent?**

Requirements:
- Lowercase with hyphens (e.g., `refactor-architect`)
- No spaces or special characters
- Descriptive of agent's purpose
- Must be unique (check `{{{WS_AGENTS_PATH}}}/` directory)

#### 2.3: Agent Description

**Provide a brief description (1-2 sentences):**

This will be shown in agent listings and help users understand when to use this agent.

Example: "Specialized in code refactoring with focus on design patterns, SOLID principles, and maintainability improvements."

#### 2.4: Core Responsibilities

**What are the agent's primary responsibilities? (3-5 items)**

Example:
- Analyze code structure and identify refactoring opportunities
- Apply design patterns appropriately
- Improve code maintainability and readability
- Ensure SOLID principles compliance

#### 2.5: Capabilities

**What specific capabilities should this agent have?**

Group by category. Example:

**Code Analysis:**
- Detect code smells and anti-patterns
- Identify coupling and cohesion issues
- Analyze complexity metrics

**Refactoring:**
- Extract methods and classes
- Apply design patterns
- Simplify conditional logic

#### 2.6: Interaction Protocol

**How should this agent interact with users?**

1. **Formal** - Professional, structured responses
2. **Casual** - Conversational, friendly tone
3. **Technical** - Precise, detailed explanations
4. **Chit-chat mode** - Interactive with diff blocks and numbered choices

**Confirmation requirements:**
- Always confirm before changes
- Never confirm (trusted operations)
- Confirm only risky operations

#### 2.7: Mandatory Protocols

**What rules MUST this agent follow?**

Example:
1. **Always analyze before refactoring** - Never refactor without understanding impact
2. **Preserve functionality** - Ensure tests pass after refactoring
3. **Document changes** - Explain why refactoring was done

#### 2.8: Workflows

**Define step-by-step processes for common tasks:**

Example workflow:

**Refactor Code:**
1. Analyze current code structure
2. Identify refactoring opportunities
3. Propose refactoring plan
4. Get user confirmation
5. Apply refactoring
6. Verify tests pass
7. Document changes

### Step 3: Generate Agent Definition File

Create `{{{WS_AGENTS_PATH}}}/{agent-name}.md` with this structure:

```markdown
---
name: {agent-name}
type: {specialist|generalist|coordinator}
description: {brief description}
version: 1.0.0
---

# {Agent Name}

{Brief overview of agent purpose and capabilities}

## Core Responsibilities

{List of primary responsibilities}

## Capabilities

{Detailed list organized by category}

## Interaction Protocol

{How agent responds to user input}

**Response Style:** {formal|casual|technical|chit-chat}

**Formatting Preferences:**
- {Code blocks, lists, tables, etc.}

**Confirmation Requirements:**
- {Always, never, when risky}

**Error Handling:**
- {How agent handles errors}

## Mandatory Protocols

{Rules agent MUST follow with rationale}

## Workflows

{Step-by-step processes for common tasks}

## Examples

### Example 1: {Scenario Name}

**User:** {Example user input}
**Agent:** {Example agent response}

### Example 2: {Scenario Name}

**User:** {Example user input}
**Agent:** {Example agent response}

## Integration Points

### Required Steering Documents
- `{steering-name}.md` - {Why it's required}

### Optional Steering Documents
- `{steering-name}.md` - {When to load}

## Conflict Priorities

When conflicts arise, this agent prioritizes:

1. User safety and data integrity
2. Agent mandatory protocols
3. Project-specific requirements
4. Performance and efficiency
5. Code style and conventions

## Best Practices

- {Best practice 1 for using this agent}
- {Best practice 2 for using this agent}
- {Best practice 3 for using this agent}

## Advanced Features

- {Advanced feature 1 description}
- {Advanced feature 2 description}

## Error Handling

- **Syntax errors** - {Approach description}
- **Logic errors** - {Approach description}
- **Ambiguous input** - {Approach description}

## Success Metrics

- {Metric 1 description}
- {Metric 2 description}
```

### Step 4: Validate Agent Definition

Check that the generated agent file:

1. **Has valid YAML frontmatter** with required fields
2. **Contains all required sections**:
   - Core Responsibilities
   - Capabilities
   - Interaction Protocol
   - Mandatory Protocols
   - Workflows
   - Examples
3. **Has no syntax errors** in markdown
4. **Follows naming conventions** (lowercase with hyphens)
5. **Is unique** (no existing agent with same name)

### Step 5: Confirm and Finalize

Show summary to user:

```diff
  👉 Agent creation complete
  ✅ Agent definition created
```

**Agent Created:** `{agent-name}`

**Location:** `{{{WS_AGENTS_PATH}}}/{agent-name}.md`

**Summary:**
- Type: {type}
- Responsibilities: {count} defined
- Capabilities: {count} defined
- Workflows: {count} defined

**What would you like to do next?**

1. **Activate this agent** - Start using it immediately
2. **View agent definition** - Review the generated file
3. **Edit agent** - Make modifications
4. **Create another agent** - Start new creation wizard
5. **Return to agent management** - Back to main menu
6. **Exit** - Return to normal mode

### Step 6: Post-Creation Actions

Based on user choice:

- **Activate**: Execute `/agents {agent-name}` command
- **View**: Display full agent definition with formatting
- **Edit**: Open agent file for modifications
- **Create another**: Restart creation wizard
- **Return**: Go back to agent management menu
- **Exit**: Return to normal interaction

---

**Agent creation wizard ready. Begin collecting information.**
