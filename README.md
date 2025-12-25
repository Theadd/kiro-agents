# kiro-agents

AI agent system for Kiro IDE. Create custom AI agents tailored to your exact needs—easily and interactively, with minimal prompt writing.

Build agents for any domain: development, design, business, research, or anything else. Choose from templates, explore role libraries, describe what you need in plain language, or craft agents step-by-step. Once created, refine them to perfection through kiro-master, the management agent created automatically on first use.

## Features

**Core Capabilities:**
- 🎯 **Guided Agent Creation** - Multiple creation methods: templates, role explorer, natural language, or step-by-step wizard
- 🔧 **Powerful Refinement** - Modify and perfect agents through kiro-master, the auto-created management agent
- 💬 **Interactive by Default** - Guided workflows with minimal prompt writing for both creating and using agents
- 🌐 **Unlimited Domains** - Build agents for any field: development, design, business, research, or anything else
- 📦 **Minimal Footprint** - 1.35K base context (<0.7% of Kiro's 200K), protocols load on-demand

**Additional Features:**
- 🔄 **Flexible Modes** - Switch between vibe (conversational) and spec (structured) workflows
- 🎯 **Strict Mode** - Precision mode that blocks execution on ambiguous input

## Installation

```bash
npx kiro-agents
```

Installs globally to `~/.kiro/` and works in all workspaces.

## Quick Start

### 1. Start Agent System

```
/agents
```

On first run, this automatically creates **kiro-master** (your Kiro management agent) and shows you the agent menu.

### 2. Create Your First Custom Agent

From the agent menu, choose **"Create new agent"** and pick a creation method:

- **Quick Start** - Choose from templates (frontend, backend, testing, etc.)
- **Explore Roles** - Browse agents by domain
- **Natural Language** - Just describe what you need
- **Project-Specific** - AI analyzes your codebase
- **Guided Wizard** - Step-by-step customization

### 3. Activate Any Agent

```
/agents {name}
```

Example:
- `/agents kiro-master` - Activate the Kiro management agent

The agent stays active until you switch to another or end the session.

## Demo

<div align="center">
  <a href="https://youtu.be/Arccq_JhpFk">
    <img src="docs/resources/animate-kiro.gif" alt="Kiro Agents Demo" width="800">
  </a>
  <p><em>Watch demo (3:52) — Custom agent optimizing steering document instructions</em></p>
</div>

## How It Works

**Markdown-Based System**
kiro-agents consists entirely of markdown steering documents—AI instructions with no runtime code. These files are installed to `~/.kiro/steering/kiro-agents/` and guide how Kiro IDE responds to your commands.

**Protocol Library**
Reusable protocols (agent creation, mode switching, strict mode) are distributed via the kiro-protocols Power. They load on-demand, keeping base context minimal at 1.35K tokens.

**Agent Storage**
When you create agents, they're saved as `.md` files in `.kiro/agents/`. Each agent definition contains capabilities, workflows, and interaction protocols. Activate them with `/agents {name}` to assume that specialized role.

**Instruction Aliases**
Commands like `/agents`, `/modes`, and `/strict` are instruction aliases—XML patterns that trigger specific protocols. You can create custom commands using the same pattern.

## Documentation

- **[Getting Started](docs/GETTING-STARTED.md)** - Step-by-step onboarding guide
- **[User Guide](docs/user-guide/)** - Agents, modes, commands, workflows, examples
- **[Developer Guide](docs/developer-guide/)** - Contributing, versioning, build system, testing
- **[Design Rationale](docs/design/)** - Neurodivergent accessibility, protocol system, interaction patterns
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and component relationships
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Links

- [npm Package](https://www.npmjs.com/package/kiro-agents)
- [GitHub Repository](https://github.com/Theadd/kiro-agents)
- [Kiro IDE](https://kiro.dev)
- [Demo Video](https://youtu.be/Arccq_JhpFk) (3:52)

## License

MIT
