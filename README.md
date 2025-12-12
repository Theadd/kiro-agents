# kiro-agents

AI agent system for Kiro IDE. Create specialized agents, switch interaction modes, and reduce cognitive load during development.

> For just <kbd>~0.9K</kbd> of **base context** overheat

```bash
npx kiro-agents
```

## Features

- **Agents** - Specialized AI personas with defined capabilities (`/agents`)
- **Modes** - Switch between vibe (flexible) and spec (structured) workflows (`/modes`)
- **Strict Mode** - Precision mode that blocks on ambiguity (`/strict`)
- **Zero Config** - Works immediately after installation ⇨ <kbd>/agents</kbd>

## Installation

**Global (npm):**
```bash
npx kiro-agents
```
Installs to `~/.kiro/steering/kiro-agents/` - available in all workspaces.

**Kiro Powers (recommended):**

This repository provides multiple Kiro Powers that can be installed independently:

1. **kiro-protocols** - Reusable protocol library for AI agents
   - Install via Kiro IDE Powers panel
   - Add repository: `https://github.com/theadd/kiro-agents`
   - Select "Kiro Protocols" power

See [powers/README.md](powers/README.md) for detailed power documentation.

## Quick Start

**Create an agent:**
```
/agents
→ Choose "Create new agent"
→ Follow wizard
```

**Switch modes:**
```
/modes spec    # Structured feature development
/modes vibe    # Flexible, conversational coding
```

**Enable precision mode:**
```
/strict on     # Blocks on ambiguous input
```

## How It Works

kiro-agents installs steering documents (markdown files with AI instructions) that extend Kiro's capabilities:

- **Agents** - Stored in `.kiro/agents/{name}.md`, activated via `/agents {name}`
- **Modes** - Define interaction style (vibe = flexible, spec = structured)
- **Strict Mode** - Requires explicit clarification before execution

All interactions use numbered choices to reduce cognitive load.

## Use Cases

**Specialized Development:**
- Create agents for frontend, backend, testing, DevOps
- Each agent has domain-specific knowledge and workflows
- Switch agents based on current task

**Workflow Flexibility:**
- Vibe mode for prototyping and exploration
- Spec mode for production features with formal requirements
- Combine modes with agents for maximum control

**Precision Work:**
- Enable strict mode for architectural decisions
- Prevents AI from making assumptions
- Forces explicit clarification on ambiguous requests

## Why kiro-agents?

Traditional AI assistants overwhelm you with context and options. kiro-agents:
- Starts minimal, grows with your needs
- Uses numbered choices instead of open-ended questions
- Maintains single focus per interaction
- Reduces decision fatigue during long sessions

## Links

- [npm Package](https://www.npmjs.com/package/kiro-agents)
- [GitHub](https://github.com/Theadd/kiro-agents)
- [Kiro IDE](https://kiro.dev)

## License

MIT

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Important**: Do not modify files in `power/` directory. This is auto-generated during release. See contributing guide for details.

## License

MIT
