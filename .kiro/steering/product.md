# Product Overview

kiro-agents is a steering document system for Kiro IDE that provides an agent framework, mode switching, and interaction patterns optimized for reduced cognitive load.

## What This Project Is

A **dual-distribution package** that installs steering documents (markdown files with AI instructions) into Kiro IDE:

- **Core System**: Agent activation, mode switching, strict mode control via instruction aliases
- **Distribution**: npm package (global) OR Kiro Power (workspace-specific)
- **No Runtime Code**: Pure markdown steering documents, TypeScript only for build pipeline
- **Progressive Enhancement**: Minimal initial footprint, users create agents as needed

## Product Principles

When working on this codebase, follow these principles:

1. **Steering Documents Are the Product** - The markdown files in `src/` are what users install and interact with
2. **Minimal Context Overhead** - Core system should add minimal tokens to AI context
3. **Progressive Complexity** - Users start with core system, add agents/modes as needed
4. **Cross-IDE Compatibility** - Core features (`src/core/`) work in any AI IDE, Kiro-specific features in `src/kiro/`
5. **Build-Time Processing** - Substitutions and transformations happen during build, not runtime

## Core Features

### 0. Instruction Alias System

**Purpose**: Create custom commands with parameter substitution and literal responses

**Implementation**:
- Defined in `src/core/aliases.md` (compact steering document)
- Complete guide in `src/core/docs/aliases-guide.md`
- Two patterns: parameter substitution and literal response
- Used by agent system, mode system, and user-defined aliases

**Key Behaviors**:
- Parameter aliases substitute values from user input
- Literal response aliases output exact text (for triggering native IDE features)
- Aliases processed before other instructions
- Can be defined in any steering document with `inclusion: always`

### 1. Agent System

**Purpose**: Specialized AI personas with defined capabilities and workflows

**Implementation**:
- Agents defined in `.kiro/agents/{name}.md` files
- Activated via `/agents {name}` command (instruction alias pattern)
- Interactive management via `/agents` command
- Each agent loads its definition and assumes that role completely

**Key Behaviors**:
- Agent definitions contain all protocols, capabilities, and interaction patterns
- Agents can load additional steering documents
- Agents maintain role until user switches or ends session
- Initial agent `kiro-master` created during auto-setup

### 2. Mode System

**Purpose**: Switch between interaction styles based on workflow needs

**Modes**:
- **Vibe Mode**: Flexible, conversational, quick iterations, no formal workflow
- **Spec Mode**: Structured feature development with requirements → design → tasks workflow

**Implementation**:
- Mode definitions in `src/kiro/steering/agent-system/kiro-{mode}-mode.md`
- Activated via `/modes {name}` command
- Interactive management via `/modes` command
- Modes preserve file changes but reset workflow state

**Key Behaviors**:
- Modes define HOW AI interacts, not WHAT it works on
- Modes can be combined with agents
- Switching from spec mode shows warning about workflow state loss

### 3. Strict Mode

**Purpose**: Precision mode that blocks execution on ambiguous input

**Implementation**:
- Defined in `src/core/strict-mode.md`
- Controlled via `/strict {state}` command
- Interactive control via `/strict` command
- Loaded automatically when agents/modes activate

**Key Behaviors**:
- Defaults to OFF, user activates explicitly
- Blocks execution on ambiguity, requires clarification
- Prevents assumption propagation
- Works alongside agents and modes

### 4. Debug Mode

**Purpose**: Development mode that provides detailed tool execution information on errors

**Implementation**:
- Defined in `src/core/debug.md`
- Controlled via `/debug {state}` command
- Interactive control via `/debug` command
- Manual inclusion for development/testing

**Key Behaviors**:
- Defaults to OFF, activated for development/testing
- Shows exact tool parameters and outputs on errors
- Prevents fallback to alternative sources
- Reports all tool failures with full context
- Requires explicit user guidance on errors

## Distribution Strategy

### npm Package (`kiro-agents`)

**Target**: Users who want global installation across all workspaces

**Installation**:
```bash
npx kiro-agents  # or bunx kiro-agents
```

**Behavior**:
- **Dual installation**: Installs both steering files AND kiro-protocols power
- Steering files → `~/.kiro/steering/kiro-agents/`
- Power dependency → `~/.kiro/powers/kiro-protocols/`
- Removes old installations before installing new
- Sets files to read-only after installation
- Cross-platform (Windows, macOS, Linux)
- Single command installs everything

**Build Process**:
1. Build powers: `bun run build:powers` (processes protocols to `powers/kiro-protocols/`)
2. Build npm: `bun run build` (compiles CLI, processes steering, copies power files)
3. CLI installs both steering and power during `npx kiro-agents`

**Why Dual Installation**:
- Protocols discoverable in Kiro Powers UI
- Stable reference paths for protocol files
- Reusable protocols across projects
- Better Kiro ecosystem integration

### Kiro Power (Alternative)

**Target**: Users who want workspace-specific installation with auto-updates

**Installation**: Via Kiro IDE Powers panel from GitHub

**Behavior**:
- Installs to `.kiro/powers/kiro-agents/`
- Auto-updates from GitHub
- Keyword-based automatic loading
- Workspace-specific (not global)

**Note**: Most users should use npm package for global installation with dual setup

## User Workflows

### Initial Setup

1. User installs via npm or Kiro Power
2. Core system files installed (aliases.md with injected mode aliases, etc.)
3. User can immediately use `/agents`, `/modes`, `/strict` commands
4. No agents exist initially (minimal overhead)

### Creating First Agent

1. User types `/agents`
2. Interactive wizard activates (chit-chat mode)
3. User chooses "Create new agent"
4. Wizard guides through agent creation
5. Agent file created in `.kiro/agents/{name}.md`
6. User can activate with `/agents {name}`

### Switching Modes

1. User types `/modes` to see options
2. Or directly: `/modes vibe` or `/modes spec`
3. Mode definition loaded into context
4. AI assumes mode protocols
5. File changes preserved, workflow state reset

### Combining Features

1. User can be in a mode AND use an agent: `/modes spec` then `/agents kiro-master`
2. User can enable strict mode while in agent/mode: `/strict on`
3. User can enable debug mode for development: `/debug on`
4. All features work together, layered capabilities

## Development Conventions

### File Organization

- **Source of Truth**: `src/` directory contains all source files
- **Core vs Kiro**: Core files in `src/core/`, Kiro-specific in `src/kiro/`
- **Build Artifacts**: `build/` (gitignored), `power/` (committed)
- **Configuration**: `src/config.ts` (core), `src/kiro/config.ts` (Kiro-specific)

### Steering Document Rules

1. **Frontmatter Required**: All steering documents need YAML frontmatter with `inclusion` key
2. **Substitutions**: Use `{{{PLACEHOLDER}}}` for build-time substitutions
3. **Instruction Aliases**: Use `<alias><trigger>` pattern for commands
4. **Cross-IDE Compatibility**: Core features should work in any AI IDE

### Cross-IDE Compatibility Rules

**CRITICAL**: Files in `src/core/` MUST be completely IDE-agnostic.

**Prohibited in src/core/**:
- ❌ Mentions of "Kiro" (IDE name)
- ❌ Kiro-specific paths (`.kiro/`)
- ❌ Kiro-specific features (MCP servers, Powers, etc.)
- ❌ Kiro-specific agent names (`kiro-master`)

**Required patterns**:
- ✅ Use substitutions for IDE-specific values: `{{{WS_AGENTS_PATH}}}`, `{{{INITIAL_AGENT_NAME}}}`
- ✅ Generic terminology: "IDE" instead of "Kiro IDE"
- ✅ Generic paths: `.ai-agents/agents` (base) → `.kiro/agents` (Kiro override)
- ✅ Generic names: `project-master` (base) → `kiro-master` (Kiro override)

**Build system architecture**:
- ALL kiro-agents builds use `src/kiro/config.ts` (kiro-agents IS for Kiro IDE)
- `src/config.ts` exists as reference pattern for future IDE-X projects
- npm and power are distribution channels, NOT different products
- Substitutions enable target-aware paths (npm vs power installation locations)

### Build System Rules

1. **Three Build Modes**: npm, power, dev
2. **Deterministic Builds**: Same input = same output
3. **Dynamic Substitutions**: Applied at build time via config functions
4. **File Mapping**: Explicit mapping from `src/` to target directories

### Power Distribution Protection

**Problem**: `power/` is committed to git but should only be modified by maintainers during release to prevent desynchronization between npm and Power distributions.

**Solution**: Multi-layer protection
1. **CI/CD Check**: GitHub Action (`.github/workflows/validate-pr.yml`) fails PRs that modify `power/`
2. **Documentation**: `CONTRIBUTING.md` explains why and how to test Power locally
3. **Warning Comments**: `power/POWER.md` has clear warning at top about auto-generation

**Workflow**:
- **Contributors**: Modify `src/` only, CI prevents `power/` changes in PRs
- **Maintainers**: After merging PR, run `bun run build:power && git commit` to update `power/`
- **Release**: `bun run release` publishes both npm and regenerates `power/` with matching version

**Benefits**:
- Prevents accidental desynchronization between distribution channels
- Contributors can test Power locally without committing changes
- Clear error messages guide contributors to correct workflow
- Maintainers control when Power distribution is updated

### Versioning Rules

1. **Session Snapshots**: Capture rich context after each session (gitignored)
2. **Changesets**: Consolidate snapshots when feature complete (committed)
3. **AI-Powered**: AI analyzes snapshots vs final commit, generates changelog
4. **Slash Commands**: `/snapshot`, `/finalize`, `/release` via Kiro hooks

## Target Users

Developers using Kiro IDE who want:
- Enhanced AI assistance without overwhelming context
- Ability to create specialized agents for different tasks
- Structured workflows for complex features (spec mode)
- Flexible workflows for quick iterations (vibe mode)
- Precision mode for critical development (strict mode)
- Extensible and customizable AI interactions
