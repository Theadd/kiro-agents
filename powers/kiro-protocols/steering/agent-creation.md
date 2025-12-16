# Agent Creation Protocol

This file contains the detailed instructions for creating new agents. It is referenced during agent creation workflow in agent management mode.

## Creation Methods

When creating a new agent, offer multiple methods based on user experience level:

1. **Quick Start** - Choose from predefined templates (fastest)
2. **Project-Specific** - AI-suggested agents for current workspace
3. **Explore Roles** - Browse agents by domain and role
4. **Guided Wizard** - Step-by-step interactive creation (full control)
5. **Natural Language** - Describe agent in plain English (most intuitive)

## Method Selection

When user initiates agent creation:

### Step 1: Present Creation Methods

Use chit-chat mode for the creation process:

```diff
  👉 Agent Creation
  ⏳ Choose creation method
```

**How would you like to create your agent?**

1. **Quick Start** - Choose from predefined agent templates
   → Fastest, no configuration needed
   → Best for: Common use cases, getting started quickly

2. **Project-Specific** - AI suggests agents for your workspace
   → Analyzes your project and recommends relevant agents
   → Best for: Project-specific needs, contextual recommendations

3. **Explore Roles** - Browse agents by domain and role
   → Discover what's possible, organized by industry/function
   → Best for: Exploring options, learning about agent types

4. **Guided Wizard** - Step-by-step interactive creation
   → Full control, guided process
   → Best for: Custom agents, specific requirements

5. **Natural Language** - Describe what you need
   → "I need an agent that helps with React performance"
   → Best for: Quick creation, intuitive interface

6. **Cancel** - Exit without creating agent

**Choose a number (1-6):**

### Step 2: Execute Selected Method

Based on user choice, execute the appropriate creation method:

---

## Method 1: Quick Start (Predefined Templates)

### Step 2.1: Load Template List

Read predefined templates from embedded list:

**Predefined Agent Templates:**

1. **Full-Stack Developer**
   "Expert in complete web development stack including frontend (React, Vue), backend (Node.js, Python), databases (PostgreSQL, MongoDB), and deployment (Docker, CI/CD)."

2. **Code Reviewer**
   "Specialized in code review with focus on code quality, security vulnerabilities, performance issues, best practices, and maintainability. Provides constructive feedback with actionable suggestions."

3. **API Architect**
   "Expert in designing and implementing RESTful and GraphQL APIs with focus on scalability, security, documentation (OpenAPI), versioning, and best practices."

4. **Frontend Specialist**
   "Specialized in modern frontend development with React, TypeScript, state management, CSS/styling, accessibility (WCAG), and performance optimization (Core Web Vitals)."

5. **DevOps Engineer**
   "Expert in containerization (Docker), orchestration (Kubernetes), CI/CD pipelines (GitHub Actions, GitLab CI), infrastructure as code (Terraform), and monitoring (Prometheus, Grafana)."

6. **Testing Specialist**
   "Specialized in comprehensive testing strategies including unit tests (Jest, pytest), integration tests, E2E tests (Playwright, Cypress), test-driven development (TDD), and test automation."

7. **Database Expert**
   "Expert in database design, optimization, migrations, query performance, indexing strategies, and working with both SQL (PostgreSQL, MySQL) and NoSQL (MongoDB, Redis) databases."

8. **Security Auditor**
   "Specialized in application security with focus on OWASP Top 10, vulnerability assessment, secure coding practices, authentication/authorization, and security testing (SAST, DAST)."

9. **Technical Writer**
   "Expert in creating clear technical documentation including API references, user guides, tutorials, README files, architecture documentation, and maintaining documentation systems."

10. **Performance Optimizer**
    "Specialized in application performance optimization including profiling, bottleneck identification, caching strategies, database optimization, and frontend performance (bundle size, loading times)."

11. **UI/UX Designer**
    "Expert in user interface and experience design with focus on user research, wireframing, prototyping (Figma), design systems, accessibility, and usability testing."

12. **Data Analyst**
    "Specialized in data analysis, visualization (charts, dashboards), SQL queries, statistical analysis, reporting, and deriving actionable insights from data."

### Step 2.2: Present Templates

```diff
  👉 Agent Creation - Quick Start
  ⏳ Choose template
```

**Choose from predefined agent templates:**

[Display templates 1-12 with numbers]

**Type number to select template, or 'back' to choose different method:**

### Step 2.3: Confirm and Customize

User selects template (e.g., "4" for Frontend Specialist).

```diff
  👉 Agent Creation - Quick Start
  ⏳ Customize template
```

**Selected template:** Frontend Specialist

**Default name:** `frontend-specialist`
**Description:** "Specialized in modern frontend development with React, TypeScript, state management, CSS/styling, accessibility (WCAG), and performance optimization (Core Web Vitals)."

**Customize? (optional)**

1. **Use as-is** - Create agent with default settings
2. **Change name** - Customize agent name
3. **Edit description** - Modify description
4. **Back** - Choose different template

### Step 2.4: Generate Agent

Use the template's description to generate complete agent definition following the standard agent structure (see Step 3 below).

---

## Method 2: Project-Specific (AI Analysis)

### Step 2.1: Analyze Workspace

```diff
  👉 Agent Creation - Project Analysis
  ⏳ Analyzing your workspace...
```

**Analyzing project structure and technologies...**

Execute analysis:
1. Read `package.json`, `requirements.txt`, `Cargo.toml`, etc.
2. Scan directory structure (src/, tests/, docs/, etc.)
3. Identify frameworks and libraries
4. Read README.md and documentation
5. Check for CI/CD configs, Docker files, etc.

### Step 2.2: Generate Recommendations

Based on analysis, generate 5-8 relevant agent suggestions.

```diff
  👉 Agent Creation - Project Analysis
  ⏳ Recommendations
```

**Based on your project (React + TypeScript + Node.js + PostgreSQL):**

**Recommended agents:**

1. ⭐ **React TypeScript Specialist**
   "Expert in React with TypeScript, hooks, component patterns, and type-safe development."

2. ⭐ **API Developer**
   "Specialized in Node.js backend development, RESTful APIs, Express, and database integration."

3. ⭐ **Database Expert**
   "Expert in PostgreSQL schema design, query optimization, migrations, and ORMs."

4. **Testing Engineer**
   "Specialized in Jest, React Testing Library, and E2E testing with Playwright."

5. **DevOps Engineer**
   "Expert in Docker, CI/CD, and deployment automation for Node.js applications."

**Type number to select, or 'back' to choose different method:**

### Step 2.3: Customize and Generate

Follow same customization flow as Quick Start (Step 2.3-2.4 above).

---

## Method 3: Explore Roles (Domain Browser)

### Step 2.1: Present Domains

```diff
  👉 Agent Creation - Explore Roles
  ⏳ Choose domain
```

**Explore agent roles by domain:**

1. 💻 **Software Development**
   Frontend, Backend, DevOps, Testing, Security

2. 🎨 **Creative & Design**
   UI/UX, Content Writing, Branding, Video Production

3. 💼 **Business & Finance**
   Marketing, Sales, Strategy, Finance, HR

4. 🏥 **Healthcare & Medicine**
   Clinical, Research, Administration, Public Health

5. 🔬 **Science & Research**
   Data Science, Research Methods, Lab Management

6. ⚖️ **Legal & Compliance**
   Legal Research, Contract Review, Compliance

7. 🏗️ **Engineering & Architecture**
   Civil, Mechanical, Electrical, Architecture

8. 🌾 **Agriculture & Food**
   Farming, Food Science, Culinary

[More domains available - type 'more' to see all]

**Type number to explore domain, or 'back' to choose different method:**

### Step 2.2: Present Roles in Domain

User selects domain (e.g., "1" for Software Development).

```diff
  👉 Agent Creation - Explore Roles
  ⏳ Software Development roles
```

**Software Development agent roles:**

1. **Frontend Developer**
   "Expert in modern frontend: React, Vue, Angular, TypeScript, CSS, accessibility, performance."

2. **Backend Developer**
   "Specialized in server-side: APIs, databases, authentication, microservices, serverless."

3. **Full-Stack Developer**
   "Complete web development: frontend, backend, databases, deployment."

4. **DevOps Engineer**
   "Expert in: Docker, Kubernetes, CI/CD, infrastructure as code, monitoring."

5. **Mobile Developer**
   "Specialized in: React Native, Flutter, iOS (Swift), Android (Kotlin)."

6. **QA/Testing Specialist**
   "Expert in: test strategies, automation, unit/integration/E2E testing, TDD."

7. **Security Engineer**
   "Specialized in: application security, vulnerability assessment, secure coding, penetration testing."

8. **Data Engineer**
   "Expert in: data pipelines, ETL, data warehousing, big data technologies."

**Type number to select role, or 'back' to choose different domain:**

### Step 2.3: Customize and Generate

Follow same customization flow as Quick Start (Step 2.3-2.4 above).

---

## Method 4: Guided Wizard (Current System)

### Step 2.1: Agent Type Selection

**Current system - full control over agent definition.**

Follow existing wizard steps (2.1 through 2.8 below).

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
- Must be unique (check `.kiro/agents/` directory)

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

---

## Method 5: Natural Language (AI Generation)

### Step 2.1: Collect Description

```diff
  👉 Agent Creation - Natural Language
  ⏳ Describe your agent
```

**Describe what you need in plain English:**

**Examples:**
- "I need help optimizing React performance"
- "An agent that reviews my Python code for security issues"
- "Someone who can help me write technical documentation"
- "Expert in PostgreSQL query optimization"
- "Help me with Docker and Kubernetes deployment"

**Your description:**

### Step 2.2: Analyze and Generate Proposal

User provides description (e.g., "I need help optimizing React performance").

```diff
  👉 Agent Creation - Natural Language
  ⏳ Analyzing your request...
```

**AI analyzes the description and extracts:**
- Agent type (specialist/generalist/coordinator)
- Primary domain and focus area
- Key capabilities needed
- Suggested name
- Generated description

**Present proposal:**

```diff
  👉 Agent Creation - Natural Language
  ⏳ Review proposal
```

**I understand you need:**

**Agent Type:** Specialist
**Primary Domain:** Software Development → Frontend
**Focus Area:** React Performance Optimization

**Suggested Capabilities:**
- React profiling and debugging (React DevTools, Profiler API)
- Performance optimization techniques (memoization, lazy loading)
- Bundle size optimization (code splitting, tree shaking)
- Rendering performance (virtual DOM, reconciliation)
- Core Web Vitals improvement (LCP, FID, CLS)
- Memory leak detection and prevention

**Suggested Name:** `react-performance-optimizer`

**Generated Description:**
"Specialized in React performance optimization with expertise in profiling, bundle optimization, rendering performance, and Core Web Vitals improvement. Helps identify bottlenecks and implement performance best practices."

**Does this match what you need?**

1. **Yes, create it** - Generate agent with these capabilities
2. **Modify name** - Change agent name
3. **Modify description** - Edit description
4. **Add more details** - Provide additional context to refine
5. **Start over** - Try different description
6. **Back** - Choose different creation method

### Step 2.3: Refine if Needed

If user chooses to modify or add details, iterate on the proposal.

### Step 2.4: Generate Agent

Once confirmed, generate complete agent definition using the AI-analyzed capabilities and description.

---

## Step 3: Generate Agent Definition File

Create `.kiro/agents/{agent-name}.md` with this structure:

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

**Location:** `.kiro/agents/{agent-name}.md`

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
