# kiro-agents

Advanced AI agent system for Kiro IDE that enhances your development workflow with minimal cognitive overhead.

## What is kiro-agents?

kiro-agents is a steering document system that extends Kiro IDE with:

- **Agent System** - Create and manage specialized AI agents with `/agent` and `/agents` commands
- **Mode System** - Switch between interaction styles with `/mode` command (vibe/spec modes)
- **Strict Mode** - Precision mode for experimental development with `/strict` command
- **Interactive Workflows** - Choice-based interactions that minimize cognitive load
- **Progressive Enhancement** - Start minimal, add agents as needed

## Installation

### Option 1: Global Installation (npm)

```bash
npx kiro-agents
# or
bunx kiro-agents
```

This installs steering documents to `~/.kiro/steering/` (global, available in all workspaces).

### Option 2: Workspace Installation (Kiro Power)

1. Open Kiro IDE
2. Open Powers panel (Ghosty icon ⚡)
3. Click "Add power from GitHub"
4. Enter: `https://github.com/theadd/kiro-agents`
5. Click Install

This installs to `.kiro/powers/kiro-agents/` (workspace-specific).

**Differences:**
- **npm**: Global installation, available in all workspaces
- **Power**: Workspace-specific, auto-updates, better Kiro integration

## Core Features

### Agent System

Create specialized AI agents for different tasks. Each agent has:

- Defined capabilities and responsibilities
- Custom interaction protocols
- Specific workflows and tools
- Integration with other agents

**Commands:**
- `/agents` - Interactive agent management (visual menu)
- `/agents {name}` - Activate specific agent directly

**Example workflow:**
```
User: /agents
AI: [Shows available agents with numbered choices]
User: 2 (Create new agent)
AI: [Guides through agent creation wizard]
```

Agents are stored in `.kiro/agents/` and can be:
- Created interactively through wizard
- Modified and updated
- Activated on-demand
- Coordinated with other agents

### Mode System

Switch between interaction styles based on your needs:

**Vibe Mode** - Flexible, conversational development
- Quick iterations and prototyping
- Direct code changes
- Exploratory development
- Minimal ceremony

**Spec Mode** - Structured feature development
- Formal requirements (EARS/INCOSE compliant)
- Design with correctness properties
- Task-based implementation
- Property-based testing focus

**Commands:**
- `/modes` - Interactive mode management (visual menu)
- `/modes vibe` - Switch to flexible development
- `/modes spec` - Switch to structured planning

### Strict Mode

Precision mode for experimental or critical development:

- Blocks execution on ambiguous input
- Requires explicit clarification
- Prevents assumption propagation
- Ideal for architectural decisions

**Commands:**
- `/strict` - Interactive control (visual buttons)
- `/strict on` - Activate precision mode
- `/strict off` - Return to normal mode

### Interactive Workflows

All interactions use choice-based patterns:

- Numbered options (typically 4-6, up to 16 when needed)
- Visual progress indicators (diff blocks)
- Single focus per interaction
- Minimal cognitive load

This design reduces decision fatigue and maintains context during long conversations.

## How It Works

kiro-agents provides steering documents that Kiro loads to enhance AI capabilities:

**npm installation:**
- Installs to `~/.kiro/steering/` (global)
- Available in all workspaces
- Manual updates via re-running npx/bunx

**Power installation:**
- Installs to `.kiro/powers/kiro-agents/` (workspace)
- Auto-updates from GitHub
- Better integration with Kiro ecosystem
- Keyword-based activation

Both methods provide:
1. New slash commands (`/agents`, `/modes`, `/strict`)
2. Protocols for AI behavior
3. Agent and mode systems
4. Optimized interactions for reduced cognitive load

The system adds minimal overhead while enabling progressive enhancement.

## File Structure After Installation

**npm installation** (`~/.kiro/steering/`):
```
~/.kiro/steering/
├── agent-system.md
├── modes-system.md
└── agent-system/
    ├── strict-mode.md
    ├── kiro-spec-mode.md
    ├── kiro-vibe-mode.md
    ├── interactions/
    └── tools/
```

**Power installation** (`.kiro/powers/kiro-agents/`):
```
.kiro/powers/kiro-agents/
├── POWER.md                     # Power metadata
├── mcp.json                     # MCP server config (empty for now)
└── steering/
    ├── agent-system.md          # Core system (always loaded)
    ├── agents.md                # Interactive menu (manual)
    ├── modes-system.md          # Core system (always loaded)
    ├── modes.md                 # Interactive menu (manual)
    ├── strict-mode.md           # Core system (always loaded)
    ├── strict.md                # Interactive control (manual)
    ├── interactions/            # Interaction patterns
    └── modes/                   # Mode definitions
```

npm files are read-only after installation. Power files managed by Kiro.

## Usage Examples

### Creating a Custom Agent

```
User: /agents
AI: [Shows agent management options]
User: 2 (Create new agent)
AI: What type of agent? [Shows options]
User: 1 (Code-focused agent)
AI: [Collects name, capabilities, workflows]
AI: Agent created! Activate now? [Yes/No]
```

### Switching Modes

```
User: /modes spec
AI: [Loads spec mode protocols]
AI: What feature do you want to work on?
User: User authentication system
AI: [Guides through requirements → design → tasks]
```

### Using Strict Mode

```
User: /strict on
AI: Strict mode activated
User: Add caching to the API
AI: [Asks clarifying questions about cache strategy, TTL, invalidation, etc.]
```

### Agent Coordination

```
User: /modes spec
[Work on feature planning]
User: /agents kiro-master
[Use kiro-master capabilities while in spec mode]
```

## Key Benefits

**Minimal Initial Overhead**
- Core system adds small context footprint
- Agents created progressively as needed
- Only load what you use

**Reduced Cognitive Load**
- Choice-based interactions
- Visual progress tracking
- Single focus per message
- Clear context maintenance

**Flexible Workflows**
- Switch between modes as needs change
- Combine modes with agents
- Adapt to your working style

**Extensible System**
- Create custom agents for your needs
- Define specialized workflows
- Integrate with existing Kiro features

## Advanced Features

### Agent Coordination

Multiple agents can work together:
- Handoff procedures between agents
- Context sharing across agents
- Conflict resolution protocols
- Collaborative workflows

### Mode + Agent Combinations

Modes and agents work together:
- Agents inherit mode protocols
- Mode workflows use agent capabilities
- Context preserved across switches

## Contributing

This is an experimental system that relies on AI understanding and following instructions. Feedback and improvements welcome!

## License

MIT

## Links

- [GitHub Repository](https://github.com/theadd/kiro-agents)
- [npm Package](https://www.npmjs.com/package/kiro-agents)
- [Kiro IDE](https://kiro.dev)
