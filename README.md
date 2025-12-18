# kiro-agents

AI agent system for Kiro IDE with specialized agents, interaction modes, and protocol-driven workflows.

> **Zero-prompt interaction (default)** — Chit-chat protocol provides numbered choices for all interactions. Agents can be created with or without this interaction style.
>
> **Minimal footprint** — ~0.9K base context, protocols load on-demand.

```bash
npx kiro-agents
```

<div align="center">
  <a href="https://youtu.be/Arccq_JhpFk">
    <img src="docs/resources/animate-kiro.gif" alt="Kiro Agents Demo" width="800">
  </a>
  <p><em>Watch demo (3:52) — Protocol-driven agent creation with zero-prompt interaction</em></p>
</div>

## Features

### Agent System
Create specialized agents with defined capabilities and workflows. Agents are stored as markdown files in `.kiro/agents/` and activated via `/agents {name}`.

**Layered protocol architecture** makes agents all-powerful: structured boundaries at top levels provide clear responsibilities, while open-ended inner levels leverage SOTA model creativity to generate optimal implementations. You specify WHAT (roles, capabilities), the AI determines HOW (architecture, workflows). See [Creating All-Powerful Agents](docs/user-guide/creating-powerful-agents.md) for details.

- **Interactive creation** - Guided wizard with 5 creation methods
- **Domain specialization** - Frontend, backend, testing, DevOps, documentation
- **AI-generated architecture** - Model creates optimal agent structure from your specifications
- **Persistent definitions** - Reusable across sessions and projects

### Mode System
Switch between workflow structures based on development needs:

- **`vibe`** - Flexible, fast-paced development with Kiro tools
- **`spec`** - Structured feature development (requirements → design → tasks) with Kiro tools
- **`as-vibe`** - Vibe workflow, keeps current tools (agent superpowers)
- **`as-spec`** - Spec workflow, keeps current tools (agent superpowers)

Modes preserve file changes but reset workflow state. Combine with agents for specialized tools + preferred workflow structure.

### Strict Mode
Precision mode that blocks execution on ambiguous input. Prevents assumption propagation in experimental or architectural work.

- **Explicit clarification** - Forces questions instead of guesses
- **Assumption prevention** - Stops errors before they spread
- **Optional activation** - Defaults to OFF, enable with `/strict on`

### Chit-Chat Interaction Protocol
Structured interaction optimized for reduced cognitive load (default for all agents):

- **Numbered choices** - Pre-structured options eliminate prompt writing
- **Diff blocks** - Visual progress tracking and context preservation
- **Single focus** - One concept per message prevents overwhelm
- **Full control + simplicity** - Navigate complex workflows without writing prompts
- **ADHD-optimized** - Designed for neurodivergent users, benefits everyone
- **Optional** - Agents can be created with custom interaction styles if needed

## Installation

**Global installation (recommended):**
```bash
npx kiro-agents
```

Installs to `~/.kiro/steering/kiro-agents/` and `~/.kiro/powers/kiro-protocols/` — available in all workspaces.

**What gets installed:**
- Core system files (aliases, protocols, interaction patterns)
- kiro-protocols Power (reusable protocol library)
- Automatic power registration in Kiro IDE

## Quick Start

### 1. Create Your First Agent

```
/agents
```

Interactive wizard with 5 creation methods:
1. **Quick Start** - Predefined templates (frontend, backend, testing, etc.)
2. **Project-Specific** - AI analyzes your codebase
3. **Explore Roles** - Browse domain categories
4. **Guided Wizard** - Step-by-step customization
5. **Natural Language** - Describe in plain English

### 2. Switch Modes

```
/modes vibe      # Flexible, conversational
/modes spec      # Structured workflow
/modes as-vibe   # Vibe style, keep agent tools
/modes as-spec   # Spec style, keep agent tools
```

**Mode comparison:**

| Mode | Tools | Interaction | Workflow | Use Case |
|------|-------|-------------|----------|----------|
| `vibe` | Kiro tools | Conversational | Flexible | Prototyping, debugging, exploration |
| `spec` | Kiro tools | Structured | Requirements → Design → Tasks | Production features, formal development |
| `as-vibe` | Current tools | Conversational | Flexible | Agent tools + vibe flexibility |
| `as-spec` | Current tools | Structured | Requirements → Design → Tasks | Agent tools + spec structure |

### 3. Enable Strict Mode (Optional)

```
/strict on       # Blocks on ambiguity
/strict off      # Allows assumptions
```

Use for architectural decisions, experimental projects, or when precision is critical.

## Commands Reference

### Agent Commands
- `/agents` - Interactive agent management (create, activate, manage)
- `/agents {name}` - Activate specific agent (e.g., `/agents kiro-master`)

### Mode Commands
- `/modes` - Interactive mode management (view, compare, switch)
- `/modes {name}` - Switch to mode (e.g., `/modes vibe`, `/modes as-spec`)

### Strict Mode Commands
- `/strict` - Interactive strict mode control
- `/strict {state}` - Set strict mode (e.g., `/strict on`, `/strict off`)

### Protocol Commands (Advanced)
- `/protocols {filename}` - Load and execute protocol from kiro-protocols Power
- `/only-read-protocols {filename}` - Read protocol into context without executing

## Architecture

### Technical Implementation

**Pure markdown steering documents:**
- No runtime code, only AI instructions
- Stored in `~/.kiro/steering/kiro-agents/`
- Processed at build time with dynamic substitutions

**Protocol-driven interaction:**
- Protocols structure presentation format, not AI capability
- Lazy loading keeps base context minimal (~0.9K tokens)
- Structured via diff blocks and numbered choices
- Optimized for SOTA model generation

**Agent storage:**
- Agents stored as `.md` files in `.kiro/agents/`
- Contain capabilities, workflows, protocols, examples
- Activated via instruction alias system
- Inherit chit-chat interaction protocol

**Mode system:**
- Mode definitions in kiro-protocols Power
- Loaded on-demand via protocol system
- Define interaction style and available tools
- Preserve file changes, reset workflow state

### Build System

**Centralized manifest:**
- Single source of truth in `src/manifest.ts`
- Glob pattern support for automatic file discovery
- Guaranteed consistency between dev mode and CLI installation
- Type-safe with compile-time validation

**Dual distribution:**
- npm package with CLI installer
- kiro-protocols Power for protocol library
- Both installed automatically via `npx kiro-agents`

## Use Cases

### Specialized Development
Create domain-specific agents with specialized knowledge:
- Frontend agent with React/Vue/Angular expertise
- Backend agent with API design and database patterns
- Testing agent with TDD workflows and coverage strategies
- DevOps agent with CI/CD and infrastructure knowledge

### Workflow Flexibility
Adapt interaction style to task requirements:
- Vibe mode for rapid prototyping and exploration
- Spec mode for production features with formal requirements
- Role modes (`as-vibe`, `as-spec`) for agent superpowers

### Agent Superpowers (Experimental)
Combine specialized agent tools with preferred interaction style using role modes:
- `/agents frontend-specialist` then `/modes as-vibe` = React expertise + conversational flow
- `/agents api-architect` then `/modes as-spec` = API design tools + structured workflow
- **Spec + Vibe combo**: `/modes spec` then `/modes as-vibe` = Spec tools + vibe interaction (recently added, testing in progress)

### Precision Work
Enable strict mode for critical development:
- Architectural decisions that propagate throughout codebase
- Experimental projects with cutting-edge technologies
- Breaking changes affecting multiple systems
- Debugging propagated errors from incorrect assumptions

## Documentation

- **[Getting Started](docs/GETTING-STARTED.md)** - Step-by-step onboarding guide
- **[User Guide](docs/user-guide/)** - Agents, modes, commands, workflows, examples
- **[Developer Guide](docs/developer-guide/)** - Contributing, versioning, build system, testing
- **[Design Rationale](docs/design/)** - Neurodivergent accessibility, protocol system, interaction patterns
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and component relationships
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Development workflow
- Build commands
- Testing guidelines
- Versioning system (AI-powered with Changesets)
- Cross-IDE compatibility rules

**Important:** Do not modify `powers/*/steering/` directories directly. These are auto-generated from `src/` during build. PRs modifying these files will fail CI.

## Links

- [npm Package](https://www.npmjs.com/package/kiro-agents)
- [GitHub Repository](https://github.com/Theadd/kiro-agents)
- [Kiro IDE](https://kiro.dev)
- [Demo Video](https://youtu.be/Arccq_JhpFk) (3:52)

## License

MIT
