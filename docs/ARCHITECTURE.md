# Architecture Overview

System design and component relationships for kiro-agents.

## Table of Contents

- [System Overview](#system-overview)
- [Core Components](#core-components)
- [Layered Protocol Architecture](#layered-protocol-architecture)
- [Build System](#build-system)
- [Distribution Architecture](#distribution-architecture)
- [Agent System](#agent-system)
- [Mode System](#mode-system)
- [Conversation Transfer State Restoration](#conversation-transfer-state-restoration)
- [Instruction Alias System](#instruction-alias-system)
- [File Organization](#file-organization)
- [Data Flow](#data-flow)

---

## System Overview

kiro-agents is a pure markdown steering document system that provides an agent framework, mode switching, and interaction patterns for Kiro IDE. The system uses no runtime code - only AI instructions processed at build time.

### Key Characteristics

- **Pure Markdown** - No runtime code, only AI instructions
- **Build-Time Processing** - Dynamic substitutions and transformations during build
- **Dual Distribution** - npm package + kiro-protocols Power
- **Layered Protocols** - Structured boundaries + open-ended execution
- **Progressive Enhancement** - Minimal base context (~0.9K tokens), lazy loading
- **Cross-IDE Compatible** - Core features work in any AI IDE

### Architecture Principles

1. **Separation of Concerns** - Core (cross-IDE) vs Kiro-specific layers
2. **Single Source of Truth** - Centralized manifest system for all file mappings
3. **Build-Time Injection** - Protocol content injected into steering documents
4. **Lazy Loading** - Protocols load on-demand to minimize context
5. **Type Safety** - TypeScript for build scripts and configuration

---

## Core Components

### 1. Steering Documents

**Location:** `src/core/` and `src/kiro/steering/`

**Purpose:** AI instruction files that define system behavior

**Types:**
- **Interactive interfaces** - `agents.md`, `modes.md`, `strict.md`, `reflect.md`
- **System configuration** - `aliases.md` (instruction alias definitions)
- **Interaction patterns** - Available via kiro-protocols Power

**Processing:**
- Loaded into AI context at runtime
- Contain instruction aliases, protocols, and interaction patterns
- Processed with dynamic substitutions at build time

### 2. Protocol Files

**Location:** `src/core/protocols/` and `src/kiro/steering/protocols/`

**Purpose:** Reusable workflow definitions loaded on-demand

**Types:**
- **Agent protocols** - `agent-activation.md`, `agent-creation.md`, `agent-management.md`
- **Mode protocols** - `mode-switching.md`, `kiro-spec-mode.md`, `kiro-vibe-mode.md`
- **System protocols** - `strict-mode.md`

**Distribution:**
- Built to `powers/kiro-protocols/steering/` (auto-generated)
- Installed to `~/.kiro/powers/kiro-protocols/`
- Loaded via `kiroPowers` tool with `readSteering` action

### 3. Build System

**Location:** `scripts/` and `src/manifest.ts`

**Components:**
- **Centralized Manifest** - `src/manifest.ts` (single source of truth)
- **Build Scripts** - `build.ts`, `build-powers.ts`, `dev.ts`, `dev-powers.ts`
- **Configuration** - `src/config.ts` (core), `src/kiro/config.ts` (Kiro-specific)
- **Utilities** - `src/utils/markdown-extractor.ts`

**Process:**
1. Manifest defines all file mappings with glob patterns
2. Build scripts process files with dynamic substitutions
3. Protocols auto-discovered via glob patterns
4. Output to distribution targets (npm, power, dev)

### 4. CLI Tool

**Location:** `bin/cli.template.ts` (source), `bin/cli.generated.ts` (build artifact)

**Purpose:** Dual installation system for steering documents and kiro-protocols Power

**Process:**
1. Generated from `bin/cli.template.ts` with embedded file lists
2. Compiled to JavaScript for Node.js compatibility
3. Installs steering files to `~/.kiro/steering/kiro-agents/`
4. Installs kiro-protocols Power to `~/.kiro/powers/kiro-protocols/`
5. Creates symbolic links and registers power automatically

---

## Layered Protocol Architecture

### Conceptual Model

```
┌─────────────────────────────────────────┐
│  Level 1: User Interface (Structured)   │
│  - Numbered choices                     │
│  - Clear navigation                     │
│  - Consistent format                    │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Level 2: Workflow Guidance (Structured)│
│  - Step-by-step process                 │
│  - Progress tracking                    │
│  - Context preservation                 │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│  Level 3+: Execution (Open-Ended)       │
│  - AI generates optimal approach        │
│  - Context-aware solutions              │
│  - Creative problem-solving             │
└─────────────────────────────────────────┘
```

### Implementation

**Structured Boundaries (Top Levels):**
- Defined in steering documents and protocol files
- Provide consistent interface with numbered choices
- Guide navigation and workflow structure
- Reduce decision fatigue

**Open-Ended Execution (Inner Levels):**
- NOT predefined in protocols
- Leverage SOTA model's knowledge and creativity
- Generate context-specific solutions
- Adapt to user's unique situation

**Key Insight:** Structure the PRESENTATION FORMAT while preserving full AI CAPABILITY.

See [Protocol System Design](design/protocol-system.md) for detailed explanation.

---

## Build System

### Centralized Manifest System

**File:** `src/manifest.ts`

**Purpose:** Single source of truth for all file mappings across build targets

**Key Features:**
- Glob pattern support for automatic file discovery
- Type-safe file mapping definitions
- Target filtering (npm, dev, cli, power)
- Guaranteed consistency between dev mode and CLI installation

**Key Mappings:**

```typescript
// Core system files
STEERING_MAPPINGS: FileMapping[]

// Power files
POWER_MAPPINGS: FileMapping[]

// Protocol source files (auto-discovery)
PROTOCOL_SOURCE_MAPPINGS: FileMapping[]
```

**Glob Patterns:**
```typescript
'core/protocols/*.md'           // Auto-discovers all core protocols
'kiro/steering/protocols/*.md'  // Auto-discovers Kiro-specific protocols
```

### Build Pipeline

**Two-Stage Build:**

**Stage 1: Powers Build** (`bun run build:powers`)
- MUST run FIRST
- Uses `PROTOCOL_SOURCE_MAPPINGS` from manifest
- Auto-discovers protocols via glob patterns
- Processes with substitutions
- Outputs to `powers/*/steering/` (auto-generated, NOT committed)

**Stage 2: npm Build** (`bun run build`)
- Generates CLI from template with embedded file lists
- Compiles CLI to JavaScript
- Processes steering files via `STEERING_MAPPINGS`
- Copies pre-built power files from `powers/`
- Cleans `build/npm/` after completion

**Build Targets:**
- **npm** - Production package for distribution
- **dev** - Direct build to `~/.kiro/steering/kiro-agents/` (watch mode)
- **dev:powers** - Direct build to `~/.kiro/powers/kiro-protocols/` (watch mode)

### Dynamic Substitutions

**Configuration:** `src/config.ts` (core), `src/kiro/config.ts` (Kiro-specific)

**Process:**
1. Build system loads substitution functions
2. Processes markdown files iteratively (max 10 passes)
3. Replaces `{{{PLACEHOLDER}}}` with generated content
4. Supports nested substitutions (recursive processing)

**Common Substitutions:**
- `{{{VERSION}}}` - Package version from package.json
- `{{{COMMANDS_LIST}}}` - Auto-generated command list
- `{{{AGENT_LIST}}}` - List of available agents
- `{{{PROTOCOLS_PATH}}}` - Path to protocols directory (target-aware)
- `{{{ADDITIONAL_ALIASES}}}` - Injects protocol loading, mode system, conversation transfer from shared-aliases.md
- `{{{AGENT_MANAGEMENT_PROTOCOL}}}` - Injects agent-management.md content

---

## Distribution Architecture

### Dual Installation

**Installation Command:**
```bash
npx kiro-agents  # or bunx kiro-agents
```

**Installation Targets:**

**1. Steering Files** → `~/.kiro/steering/kiro-agents/`
- Core system files (aliases.md)
- Interactive interfaces (agents.md, modes.md, strict.md, reflect.md)

**Note:** Only 4 files in STEERING_MAPPINGS. Protocols (including mode definitions) are distributed exclusively via kiro-protocols Power, not as steering files.

**2. kiro-protocols Power** → `~/.kiro/powers/kiro-protocols/`
- Power metadata (POWER.md, mcp.json, icon.png)
- Protocol files in steering/ subdirectory
- Symbolic links in `~/.kiro/powers/installed/kiro-protocols/`
- Automatic registration in `~/.kiro/powers/registry.json`

**Why Dual Installation:**
- Protocols discoverable in Kiro Powers UI
- Stable reference paths for protocol files
- Reusable protocols across projects
- Better Kiro ecosystem integration
- Single command installs everything

### File Flow

```
Source Files (src/)
    ↓
Build System (scripts/)
    ↓
Distribution Artifacts
    ├── npm package (build/npm/)
    │   ├── bin/cli.js (compiled CLI)
    │   ├── dist/ (steering files)
    │   └── power/ (kiro-protocols files)
    │
    └── Powers (powers/)
        └── kiro-protocols/
            ├── POWER.md
            ├── mcp.json
            ├── icon.png
            └── steering/ (auto-generated protocols)
    ↓
User Installation
    ├── ~/.kiro/steering/kiro-agents/ (steering files)
    └── ~/.kiro/powers/kiro-protocols/ (protocol library)
```

---

## Agent System

### Architecture

**Agent Definition Files:** `.kiro/agents/{name}.md`

**Components:**
1. **Frontmatter** - Metadata (name, type, description, version)
2. **Core Responsibilities** - What the agent does
3. **Capabilities** - Specific skills and knowledge
4. **Interaction Protocol** - How the agent communicates
5. **Mandatory Protocols** - Rules the agent must follow
6. **Workflows** - Step-by-step processes
7. **Examples** - Usage demonstrations

### Agent Lifecycle

**1. Creation**
- User invokes `/agents` (interactive) or `/agents {name}` (direct)
- Agent management protocol loads
- User selects creation method (Quick Start, Project-Specific, etc.)
- AI generates agent definition based on user input
- Agent file saved to `.kiro/agents/{name}.md`

**2. Activation**
- User invokes `/agents {name}`
- Agent activation protocol loads
- Agent definition file read into context
- Strict mode protocol loaded (enables `/strict` command)
- AI assumes agent role completely

**3. Modification**
- User invokes `/agents` then selects "Manage existing agent"
- Agent management protocol loads
- AI analyzes current agent definition
- Suggests context-specific modifications
- Updates agent file with changes

**4. Deactivation**
- User switches to different agent
- User explicitly exits agent mode
- Session ends

### Agent Protocol Loading

**Instruction Alias Pattern:**
```xml
<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
1. Read `.kiro/agents/{agent_name}.md` into context
2. /only-read-protocols agent-activation.md
3. Follow agent activation steps
  </definition>
</alias>
```

**Protocol Loading:**
- Uses `kiroPowers` tool with `readSteering` action
- Loads from kiro-protocols Power
- On-demand loading (lazy loading)
- Minimal base context overhead

---

## Mode System

### Architecture

**Mode Definition Files:** `src/kiro/steering/protocols/kiro-{mode}-mode.md`

**Four Modes:**
1. **vibe** - Flexible, fast-paced development WITH Kiro tools
2. **spec** - Structured feature development WITH Kiro tools
3. **as-vibe** - Vibe workflow, KEEPS current tools (agent superpowers)
4. **as-spec** - Spec workflow, KEEPS current tools (agent superpowers)

### Mode Types

**Full Modes (vibe, spec):**
- Change both tools AND workflow
- Load Kiro-specific tools
- Define interaction style
- Establish workflow structure

**Role Modes (as-vibe, as-spec):**
- Change workflow only
- Keep current tools (e.g., agent tools)
- Define interaction style
- Establish workflow structure

### Mode Switching

**Instruction Alias Pattern:**
```xml
<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
1. /only-read-protocols kiro-{mode_name}-mode.md
2. /only-read-protocols mode-switching.md
3. Follow mode switching steps
  </definition>
</alias>
```

**Context Preservation:**
- File changes preserved
- Conversation history preserved
- Workflow state reset (e.g., spec phase)

### Agent Superpowers

**Concept:** Combine specialized agent tools with preferred workflow structure

**Examples:**
- `/agents frontend-specialist` then `/modes as-vibe` = React expertise + vibe workflow
- `/agents api-architect` then `/modes as-spec` = API design tools + spec workflow

**Implementation:**
- Role modes (as-vibe, as-spec) keep current tools
- Only change workflow structure and interaction style
- Enables flexible combinations

---

## Conversation Transfer State Restoration

### Purpose

Automatically restore STRICT_MODE and ACTIVE_AGENT state when Kiro IDE generates conversation summaries due to context limit.

### Problem

When conversations exceed context limits, Kiro generates automatic summaries with "CONTEXT TRANSFER:" prefix. Critical session state (STRICT_MODE, ACTIVE_AGENT) is lost, causing:
- Agent role forgotten
- Strict mode rules not applied
- Workflow disruption

### Solution

**Detection-based restoration** in `aliases.md` (always loaded):

1. **Detect** - Check for "CONTEXT TRANSFER:" in initial context
2. **Scan** - Search summary for state indicators (agent names, STRICT_MODE mentions)
3. **Restore** - Reactivate agent and/or STRICT_MODE based on findings
4. **Verify** - Display Response Protocol flags confirming restoration

### Implementation

**Location:** `src/kiro/shared-aliases.md` → injected into `aliases.md` via `{{{ADDITIONAL_ALIASES}}}`

**Execution:** Before generating first response in session

**Detection Patterns:**
- Agent: `/agents {name}`, `activated {name} agent`, `ACTIVE_AGENT: {name}`
- STRICT_MODE: `STRICT_MODE: ON`, `/strict on`, `activated STRICT_MODE`

**Restoration Logic:**

**Case 1: Agent detected**
1. Execute `/agents {agent_name}` (loads agent definition and protocols)
2. Override STRICT_MODE if explicitly mentioned (ON or OFF)
3. If not mentioned, use agent's default STRICT_MODE

**Case 2: No agent, STRICT_MODE ON**
1. Ask user: "Was an agent active? If so, which one?"
2. Wait for response
3. Activate agent if provided, then apply STRICT_MODE

**Case 3: No agent, STRICT_MODE OFF/unknown**
1. Continue normally (no restoration needed)

**Override Behavior:**
- Ignores "Do not ask for clarification" instruction from summary when Case 2 applies
- State restoration takes precedence over summary instructions

### Benefits

- **Automatic** - No manual intervention required
- **Intelligent** - Scans summary content for state clues
- **Fallback** - Asks user when state is ambiguous
- **Always active** - Loaded via `aliases.md` in every session

---

## Instruction Alias System

### Purpose

Create custom commands with parameter substitution and literal response patterns.

### Architecture

**Definition Location:** `src/core/aliases.md`

**Two Patterns:**

**1. Parameter Substitution**
```xml
<alias>
  <trigger>COMMAND {param1} {param2}</trigger>
  <definition>
    Instructions with {param1} and {param2} placeholders
  </definition>
</alias>
```

**2. Literal Response**
```xml
<alias>
  <trigger>command</trigger>
  <definition>
Respond with exactly:
```
literal_text
```
  </definition>
</alias>
```

### Processing

**Runtime:**
1. AI detects `<alias>` XML structure
2. Extracts parameter names from `<trigger>`
3. Matches user command against trigger pattern
4. Extracts parameter values from user input
5. Replaces placeholders in `<definition>`
6. Executes resulting instructions

**Build-Time:**
- Aliases defined in source files
- Processed with substitutions
- Distributed in steering documents

### Key Aliases

**Agent System:**
- `/agents` - Interactive agent management
- `/agents {agent_name}` - Activate specific agent

**Protocol Loading:**
- `/protocols {filename}` - Load and execute protocol from kiro-protocols Power
- `/only-read-protocols {filename}` - Load protocol without executing (read-only)

**Mode System:**
- `/modes` - Interactive mode management
- `/modes {mode_name}` - Switch to mode

**Strict Mode:**
- `/strict` - Interactive strict mode control
- `/strict {state}` - Set strict mode (on/off)

**Note:** Protocol loading aliases are Kiro-specific (use `kiroPowers` tool) and defined in `src/kiro/shared-aliases.md`.

---

## File Organization

### Source Structure

```
src/
├── manifest.ts               # Centralized file manifest
├── config.ts                 # Core substitutions
├── core/                     # Cross-IDE compatible
│   ├── aliases.md
│   ├── agents.md
│   ├── strict.md
│   ├── protocols/            # Auto-discovered
│   │   ├── agent-activation.md
│   │   ├── agent-creation.md
│   │   ├── agent-management.md
│   │   ├── chit-chat.md
│   │   └── strict-mode.md
│   ├── interactions/
│   │   └── interaction-styles.md
│   └── docs/
│       ├── agent-system-guide.md
│       └── aliases-guide.md
├── kiro/                     # Kiro-specific
│   ├── POWER.md
│   ├── config.ts
│   ├── shared-aliases.md     # Protocol loading, mode system, conversation transfer
│   └── steering/
│       ├── modes.md
│       └── protocols/        # Auto-discovered
│           ├── mode-switching.md
│           ├── kiro-spec-mode.md
│           ├── kiro-vibe-mode.md
│           ├── kiro-as-spec-mode.md
│           └── kiro-as-vibe-mode.md
└── utils/
    └── markdown-extractor.ts
```

### Distribution Structure

```
User Installation:

~/.kiro/steering/kiro-agents/
├── aliases.md                # Includes protocol loading, mode system, conversation transfer
├── agents.md
├── modes.md
└── strict.md

~/.kiro/powers/kiro-protocols/
├── POWER.md
├── mcp.json
├── icon.png
└── steering/
    ├── agent-activation.md
    ├── agent-creation.md
    ├── agent-management.md
    ├── strict-mode.md
    ├── mode-switching.md
    ├── kiro-spec-mode.md
    ├── kiro-vibe-mode.md
    ├── kiro-as-spec-mode.md
    └── kiro-as-vibe-mode.md

Workspace-Specific:

{workspace}/.kiro/agents/
└── {user-created-agents}.md
```

---

## Data Flow

### Agent Creation Flow

```
User: /agents
    ↓
AI detects: Instruction alias in aliases.md (always loaded)
    ↓
AI loads: ~/.kiro/steering/kiro-agents/agents.md (manual inclusion)
    ↓
AI detects: No parameter, interactive mode
    ↓
AI loads: chit-chat.md protocol (via kiroPowers)
    ↓
AI loads: agent-management.md protocol (via kiroPowers)
    ↓
AI scans: .kiro/agents/ directory
    ↓
AI presents: Numbered choices (create, activate, manage, etc.)
    ↓
User selects: "Create new agent"
    ↓
AI loads: agent-creation.md protocol (via kiroPowers)
    ↓
AI presents: 5 creation methods
    ↓
User selects: Method (e.g., "Project-Specific")
    ↓
AI executes: Open-ended generation
    ├── Analyzes codebase
    ├── Generates optimal agent architecture
    └── Creates agent definition
    ↓
AI writes: .kiro/agents/{name}.md
    ↓
AI offers: Activate new agent?
```

### Agent Activation Flow

```
User: /agents {agent_name}
    ↓
AI detects: Instruction alias in aliases.md (always loaded)
    ↓
AI detects: Parameter provided, activation mode
    ↓
AI loads: .kiro/agents/{agent_name}.md
    ↓
AI loads: agent-activation.md protocol (via kiroPowers)
    ↓
AI loads: strict-mode.md protocol (via kiroPowers)
    ↓
AI checks: Agent definition for chit-chat indicators
    ↓
AI loads: chit-chat.md protocol if needed (via kiroPowers)
    ↓
AI assumes: Agent role completely
    ↓
AI begins: Interaction according to agent protocols
```

### Mode Switching Flow

```
User: /modes {mode_name}
    ↓
AI detects: Instruction alias in aliases.md (always loaded)
    ↓
AI checks: Is mode_name "spec" or "vibe"?
    ├─ YES: Output literal "{mode_name}" (triggers Kiro native mode)
    └─ NO: Continue with protocol loading
    ↓
AI loads: kiro-{mode_name}-mode.md (via kiroPowers)
    ↓
AI loads: mode-switching.md protocol (via kiroPowers)
    ↓
AI loads: strict-mode.md protocol (via kiroPowers)
    ↓
AI preserves: File changes, conversation history
    ↓
AI resets: Workflow state (e.g., spec phase)
    ↓
AI begins: Mode-specific workflow
```

### Protocol Loading Flow

```
User: /protocols {filename}
    ↓
AI detects: Instruction alias in aliases.md (always loaded)
    ↓
AI extracts: Parameter value (filename)
    ↓
AI calls: kiroPowers tool
    ├── action: "readSteering"
    ├── powerName: "kiro-protocols"
    └── steeringFile: "{filename}"
    ↓
Kiro IDE: Loads protocol from ~/.kiro/powers/kiro-protocols/steering/
    ↓
AI receives: Protocol content
    ↓
AI executes: Protocol instructions
```

### Build Flow

```
Source Files (src/)
    ↓
Stage 1: Powers Build
    ├── Load manifest (src/manifest.ts)
    ├── Auto-discover protocols (glob patterns)
    ├── Process with substitutions
    └── Output to powers/*/steering/
    ↓
Stage 2: npm Build
    ├── Generate CLI from template
    ├── Compile CLI to JavaScript
    ├── Process steering files (via manifest)
    ├── Copy power files from powers/
    └── Output to build/npm/
    ↓
Distribution
    ├── npm package (build/npm/)
    └── Powers (powers/kiro-protocols/)
    ↓
User Installation (npx kiro-agents)
    ├── Install steering files → ~/.kiro/steering/kiro-agents/
    ├── Install power → ~/.kiro/powers/kiro-protocols/
    ├── Create symbolic links
    └── Register power in registry.json
```

---

## Cross-IDE Compatibility

### Design Rules

**Files in `src/core/` MUST be IDE-agnostic:**

❌ **Prohibited:**
- Mentions of "Kiro" (IDE name)
- Kiro-specific paths (`.kiro/`)
- Kiro-specific features (MCP servers, Powers)
- Kiro-specific agent names (`kiro-master`)

✅ **Required:**
- Use substitutions: `{{{WS_AGENTS_PATH}}}`, `{{{INITIAL_AGENT_NAME}}}`
- Generic terminology: "IDE" instead of "Kiro IDE"
- Generic paths: `.ai-agents/agents` (base) → `.kiro/agents` (Kiro override)
- Generic names: `project-master` (base) → `kiro-master` (Kiro override)

### Build System Architecture

**Important:** ALL kiro-agents builds use `src/kiro/config.ts` (kiro-agents IS for Kiro IDE).

- `src/config.ts` exists as reference pattern for future IDE-X projects
- npm and power are distribution channels, NOT different products
- Substitutions enable target-aware paths (npm vs power installation locations)

---

## Security Considerations

### File Permissions

**After Installation:**
- Steering files set to read-only
- Prevents accidental modification
- Users can modify via reinstallation

### Build-Time Processing

**Substitutions:**
- All substitutions processed at build time
- No runtime code execution
- Pure markdown output

### Distribution

**npm Package:**
- No dependencies (production)
- TypeScript and Bun for development only
- Cross-platform compatible (Windows, macOS, Linux)

---

## Performance Characteristics

### Context Overhead

**Base Context:** ~1.35K tokens
- Minimal initial footprint
- Core system files only (aliases.md)
- No protocols loaded initially

**Lazy Loading:**
- Protocols load on-demand
- Only when explicitly invoked
- Reduces context overhead

**Progressive Enhancement:**
- Starts simple
- Grows with user needs
- Scales efficiently

### Build Performance

**Powers Build:**
- Auto-discovery via glob patterns
- Parallel processing possible
- Fast iteration with watch mode

**npm Build:**
- CLI compilation (one-time)
- File processing (parallel)
- Clean after completion

---

## Extensibility

### Adding New Protocols

1. Create `.md` file in `src/core/protocols/` or `src/kiro/steering/protocols/`
2. Manifest glob patterns automatically discover it
3. Run `bun run build:powers` (auto-discovers and regenerates)
4. No configuration changes needed

### Adding New Agents

1. User creates agent via `/agents` command
2. Agent file saved to `.kiro/agents/{name}.md`
3. Immediately available for activation
4. No system changes needed

### Adding New Modes

1. Create mode definition in `src/kiro/steering/protocols/`
2. Add mode alias to `src/kiro/shared-aliases.md`
3. Run `bun run build:powers` to regenerate
4. Mode immediately available

### Adding New Aliases

1. Add `<alias>` definition to `src/core/aliases.md` or `src/kiro/shared-aliases.md`
2. Run `bun run build` to process
3. Alias immediately available after installation

---

## Related Documentation

- **[Installed Product Architecture](INSTALLED-ARCHITECTURE.md)** - Runtime architecture from user perspective
- **[Protocol System Design](design/protocol-system.md)** - Why layered protocols work
- **[Interaction Patterns](design/interaction-patterns.md)** - How patterns reduce cognitive load
- **[Neurodivergent Accessibility](design/neurodivergent-accessibility.md)** - ADHD-C design principles
- **[Creating All-Powerful Agents](user-guide/creating-powerful-agents.md)** - Practical guide
- **[Manifest System](contributing/MANIFEST-SYSTEM.md)** - Centralized file mappings
- **[Versioning](contributing/VERSIONING.md)** - AI-powered versioning system
- **[Testing](contributing/TESTING.md)** - Build validation

---

**Document version:** 1.1.0  
**Last updated:** December 26, 2025  
**Maintained by:** kiro-agents project
