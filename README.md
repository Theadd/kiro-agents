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
- 🧠 **Reflection System** - Agents learn from experience with persistent memory across sessions

## Installation

```bash
npx kiro-agents
```

Installs kiro-agents and the kiro-protocols Power. Run the same command to update to the latest version.

## Quick Start

### 1. Start Agent System

```
/agents
```

On first run, this automatically creates **kiro-master** (your Kiro management agent) and shows you the agent menu.

### 2. Create Your First Custom Agent

From the agent menu, choose **"Create new agent"** and pick a creation method:

- **Quick Start** - Choose from templates
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

**Simple Markdown Files**
kiro-agents uses plain markdown files with AI instructions—no code to run, no dependencies to install. These files guide how Kiro IDE responds to your commands.

**kiro-protocols Power**
Automatically installed alongside kiro-agents, this Power provides protocols (agent creation, mode switching, strict mode) that load on-demand when needed.

**On-Demand Loading**
Protocols load only when needed, keeping your context clean. Base system uses just 1.35K tokens.

**Your Agents, Your Files**
Agents you create are saved as `.md` files in `.kiro/agents/`. Edit them like any document, version control them with git, reuse them across projects.

## Documentation

- **[Getting Started](docs/GETTING_STARTED.md)** - Step-by-step onboarding guide
- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design and component relationships
- **[Creating Powerful Agents](docs/user-guide/creating-powerful-agents.md)** - Layered architecture guide
- **[Reflection System](docs/user-guide/reflection-system.md)** - Persistent memory for agents
- **[Design Rationale](docs/design/)** - Protocol system, interaction patterns, neurodivergent accessibility
- **[Contributing](CONTRIBUTING.md)** - Development workflow, build system, testing, versioning

## Contributing

Contributions welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Links

- [npm Package](https://www.npmjs.com/package/kiro-agents)
- [GitHub Repository](https://github.com/Theadd/kiro-agents)
- [Kiro IDE](https://kiro.dev)
