# Installed Product Architecture

Complete documentation of kiro-agents as it exists in the user's system after installation. This document focuses on the **runtime architecture** from the user's perspective, complementing [ARCHITECTURE.md](ARCHITECTURE.md) which covers the build system and source organization.

## Table of Contents

- [Overview](#overview)
- [Installation Locations](#installation-locations)
- [Directory Structure](#directory-structure)
- [Context Loading Mechanism](#context-loading-mechanism)
- [Command Execution Flow](#command-execution-flow)
- [Component Interaction](#component-interaction)
- [User Experience Flows](#user-experience-flows)
- [Protocol Loading System](#protocol-loading-system)
- [Reflection System](#reflection-system)
- [Registry Integration](#registry-integration)
- [File Permissions](#file-permissions)
- [Troubleshooting](#troubleshooting)

---

## Overview

### What Gets Installed

When a user runs `npx kiro-agents`, the system performs a **dual installation**:

1. **Steering files** → `~/.kiro/steering/kiro-agents/` (core system)
2. **kiro-protocols Power** → `~/.kiro/powers/kiro-protocols/` (protocol library)

Both installations work together to provide the complete kiro-agents experience.

### Key Concepts

**Steering Documents:**
- Markdown files with AI instructions
- Loaded automatically or manually by Kiro IDE
- Define system behavior and commands
- Located in `~/.kiro/steering/kiro-agents/`

**Protocols:**
- Reusable workflow definitions
- Loaded on-demand via `kiroPowers` tool
- Minimize context overhead
- Located in `~/.kiro/powers/kiro-protocols/steering/`

**Agents:**
- User-created specialized AI roles
- Stored in workspace `.kiro/agents/` directory
- Activated via `/agents {name}` command
- Load protocols and steering documents as needed

---

## Installation Locations

### Primary Directories


```
~/.kiro/                                    # Kiro IDE user directory
├── steering/kiro-agents/                   # Core system files (always loaded)
│   ├── aliases.md                          # Instruction alias system (inclusion: always)
│   ├── agents.md                           # Agent management interface (inclusion: manual)
│   ├── modes.md                            # Mode management interface (inclusion: manual)
│   ├── strict.md                           # Strict mode control (inclusion: manual)
│   └── reflect.md                          # Reflection system commands (inclusion: always)
│
├── powers/kiro-protocols/                  # Protocol library (actual files)
│   ├── POWER.md                            # Power metadata
│   ├── mcp.json                            # MCP configuration (empty)
│   ├── icon.png                            # Power icon (512x512)
│   └── steering/                           # Protocol files (loaded on-demand)
│       ├── agent-activation.md
│       ├── agent-management.md
│       ├── agent-creation.md
│       ├── chit-chat.md
│       ├── strict-mode.md
│       ├── mode-switching.md
│       ├── mode-management.md
│       ├── kiro-spec-mode.md
│       ├── kiro-vibe-mode.md
│       ├── kiro-as-spec-mode.md
│       ├── kiro-as-vibe-mode.md
│       ├── reflect-agent-insights.md
│       ├── reflect-review-workflow.md
│       ├── reflect-curator-checklist.md
│       └── reflect-manager-workflow.md
│
├── powers/installed/kiro-protocols/        # Symbolic links (Kiro UI integration)
│   ├── POWER.md -> ../../kiro-protocols/POWER.md
│   ├── mcp.json -> ../../kiro-protocols/mcp.json
│   ├── icon.png -> ../../kiro-protocols/icon.png
│   └── steering/ -> ../../kiro-protocols/steering/
│
└── powers/registry.json                    # Power registry (automatic registration)

{workspace}/.kiro/                          # Workspace-specific directory
└── agents/                                 # User-created agents
    ├── kiro-master.md                      # Auto-created on first use
    ├── reflection-curator.md               # Reflection system manager
    └── {custom-agents}.md                  # User-created agents

{workspace}/.ai-storage/                    # AI-managed storage (on-demand)
└── reflections/                            # Reflection system storage
    ├── drafts/                             # Pending insights
    │   ├── universal.md
    │   ├── project.md
    │   ├── categories/
    │   └── agents/
    └── approved/                           # Approved insights
        ├── universal.md
        ├── project.md
        ├── categories/
        └── agents/
```

### Why Two Power Directories?

**`~/.kiro/powers/kiro-protocols/`** (Actual Files)
- Contains the real power files
- Where CLI installs the power
- Source of truth for power content

**`~/.kiro/powers/installed/kiro-protocols/`** (Symbolic Links)
- Contains symlinks pointing to actual files
- Used by Kiro IDE Powers UI
- Follows Kiro's pattern for local power installations
- Enables proper "installed" status in UI

**Why this pattern?**
- Kiro IDE expects installed powers in `installed/` directory
- Allows separation between power source and UI integration
- Enables proper registry tracking and UI display

---

## Directory Structure

### Steering Files (`~/.kiro/steering/kiro-agents/`)

**Purpose:** Core system files that define kiro-agents behavior


| File | Inclusion | Purpose | When Loaded |
|------|-----------|---------|-------------|
| `aliases.md` | `always` | Instruction alias system with command definitions | Automatically by Kiro IDE |
| `agents.md` | `manual` | Interactive agent management interface | When user types `/agents` |
| `modes.md` | `manual` | Interactive mode management interface | When user types `/modes` |
| `strict.md` | `manual` | Interactive strict mode control | When user types `/strict` |
| `reflect.md` | `manual` | Reflection system commands and documentation | When user types `/reflect` |

**Key Characteristics:**
- All files are **read-only** after installation
- Contain YAML frontmatter with `inclusion` metadata
- Processed with substitutions during build (runtime values embedded)
- Small file sizes (minimize context overhead)

### Protocol Files (`~/.kiro/powers/kiro-protocols/steering/`)

**Purpose:** Reusable workflow definitions loaded on-demand

| Protocol | Category | Purpose | Loaded By |
|----------|----------|---------|-----------|
| `agent-activation.md` | Agent System | Steps to activate and assume agent role | `/agents {name}` alias |
| `agent-management.md` | Agent System | Interactive agent management workflow | `agents.md` |
| `agent-creation.md` | Agent System | Step-by-step agent creation wizard | Agent management flow |
| `chit-chat.md` | Interaction | Numbered choice interaction protocol | Agent definitions (conditional) |
| `strict-mode.md` | System | Precision mode rules and behavior | Agent activation, mode switching |
| `mode-switching.md` | Mode System | Steps to switch between modes | `/modes {name}` alias |
| `mode-management.md` | Mode System | Interactive mode management workflow | `modes.md` |
| `kiro-spec-mode.md` | Mode Definition | Spec mode documentation (native mode) | Reference only |
| `kiro-vibe-mode.md` | Mode Definition | Vibe mode documentation (native mode) | Reference only |
| `kiro-as-spec-mode.md` | Mode Definition | Spec workflow, keeps current tools | `/modes as-spec` command |
| `kiro-as-vibe-mode.md` | Mode Definition | Vibe workflow, keeps current tools | `/modes as-vibe` command |
| `reflect-agent-insights.md` | Reflection System | How agents capture insights during work | Agent definitions (reference) |
| `reflect-review-workflow.md` | Reflection System | Draft review and approval process | reflection-curator agent |
| `reflect-curator-checklist.md` | Reflection System | Quality validation criteria | reflection-curator agent |
| `reflect-manager-workflow.md` | Reflection System | Batch agent enablement | reflection-curator agent |

**Key Characteristics:**
- Loaded **on-demand** via `kiroPowers` tool
- Not in AI context until explicitly requested
- Minimize base context overhead
- Can be loaded multiple times if needed

### Agent Files (`.kiro/agents/`)

**Purpose:** User-created specialized AI agents

**Location:** Workspace-specific (`.kiro/agents/` in each project)

**Structure:**
```markdown
---
name: agent-name
type: specialist
description: Agent description
version: 1.0.0
---

# Agent Name

## Core Responsibilities
...

## Capabilities
...

## Interaction Protocol
...
```

**Lifecycle:**
1. Created via `/agents` command (agent-creation.md protocol)
2. Stored in workspace `.kiro/agents/` directory
3. Activated via `/agents {name}` command
4. Modified via agent management interface

---

## Context Loading Mechanism

### Automatic Loading (Always in Context)


**Files with `inclusion: always` frontmatter:**

```yaml
---
inclusion: always
description: "File description"
---
```

**Currently:**
- `aliases.md` - Instruction alias system

**Behavior:**
- Loaded automatically by Kiro IDE at session start
- Always present in AI context
- Minimal token overhead (~1.35K tokens total base context)
- Defines available commands and aliases

### Manual Loading (On-Demand)

**Files with `inclusion: manual` frontmatter:**

```yaml
---
inclusion: manual
description: "File description"
keywords: ["keyword1", "keyword2"]
---
```

**Currently:**
- `agents.md` - Agent management interface
- `modes.md` - Mode management interface
- `strict.md` - Strict mode control

**Behavior:**
- NOT loaded automatically
- Loaded when user invokes specific command
- Loaded via `#File` context key in Kiro IDE
- Keywords help with discovery (not used for automatic loading)

**How Manual Loading Works:**

1. User types command (e.g., `/agents`)
2. AI detects instruction alias in `aliases.md`
3. Alias definition references file (e.g., "Read `agents.md`")
4. AI uses Kiro's context system to load file
5. File content becomes available in context
6. AI executes instructions from loaded file

### Protocol Loading (Lazy Loading)

**Protocols in `~/.kiro/powers/kiro-protocols/steering/`:**

**Behavior:**
- NOT loaded automatically
- Loaded via `kiroPowers` tool with `readSteering` action
- Invoked by instruction aliases or agent definitions
- Can be loaded multiple times if needed

**Loading Pattern:**

```markdown
**In steering document or agent definition:**

/only-read-protocols agent-activation.md

**This expands to:**
1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
2. Protocol content loaded into context
```

**kiroPowers Tool Parameters:**
- `action: "readSteering"` - Read protocol file
- `powerName: "kiro-protocols"` - Power identifier
- `steeringFile: "agent-activation.md"` - Protocol filename

**Path Resolution:**
- Kiro IDE resolves to `~/.kiro/powers/kiro-protocols/steering/agent-activation.md`
- No need to specify full path in commands
- Power system handles path resolution

---

## Command Execution Flow

### Example 1: `/agents` (Interactive Management)


```
User types: /agents

Step 1: Alias Detection
├─ AI has aliases.md in context (inclusion: always)
├─ AI detects NO parameter provided
└─ AI reads agents.md instruction (manual inclusion)

Step 2: Parameter Detection Check
├─ agents.md checks: "Did user provide {agent_name}?"
├─ Answer: NO (user typed just "/agents")
└─ Continue with interactive management flow

Step 3: Load Interactive Interface
├─ AI loads agents.md content into context
└─ agents.md contains: "/only-read-protocols chit-chat.md"

Step 4: Load Protocols
├─ AI calls kiroPowers tool:
│   ├─ action: "readSteering"
│   ├─ powerName: "kiro-protocols"
│   └─ steeringFile: "chit-chat.md"
├─ Kiro IDE loads: ~/.kiro/powers/kiro-protocols/steering/chit-chat.md
└─ Chit-chat protocol now in context

Step 5: Load Management Protocol
├─ agents.md contains: "/protocols agent-management.md"
├─ AI calls kiroPowers tool:
│   ├─ action: "readSteering"
│   ├─ powerName: "kiro-protocols"
│   └─ steeringFile: "agent-management.md"
└─ Agent management protocol now in context

Step 6: Scan Workspace
├─ AI scans .kiro/agents/ directory
├─ Finds existing agents (e.g., kiro-master.md)
└─ Builds list of available agents

Step 7: Present Interface
├─ AI uses chit-chat protocol patterns:
│   ├─ Diff block showing current state
│   ├─ Numbered choices (4-6 options)
│   └─ Visual formatting
└─ Presents agent management menu to user

Step 8: User Selection
├─ User types number (e.g., "2" for "Create new agent")
├─ AI follows agent-management.md workflow
└─ Loads agent-creation.md protocol if needed
```

**Files in Context (in order):**
1. `aliases.md` (always loaded)
2. `agents.md` (loaded by alias)
3. `chit-chat.md` (loaded by agents.md)
4. `agent-management.md` (loaded by agents.md)
5. `agent-creation.md` (loaded if user selects create)

**Total Context:** ~1.35K (base) + ~2-3K (protocols) = ~3-4K tokens

### Example 2: `/agents kiro-master` (Direct Activation)

```
User types: /agents kiro-master

Step 1: Alias Detection
├─ AI has aliases.md in context (inclusion: always)
├─ AI detects parameter: "kiro-master"
└─ AI executes alias definition with parameter

Step 2: Alias Execution
├─ Alias definition:
│   "Read .kiro/agents/{agent_name}.md into context"
├─ AI reads: .kiro/agents/kiro-master.md
└─ Agent definition now in context

Step 3: Load Activation Protocol
├─ Alias definition: "/only-read-protocols agent-activation.md"
├─ AI calls kiroPowers tool:
│   ├─ action: "readSteering"
│   ├─ powerName: "kiro-protocols"
│   └─ steeringFile: "agent-activation.md"
└─ Agent activation protocol now in context

Step 4: Follow Activation Steps
├─ agent-activation.md defines steps:
│   ├─ Step 1: Load agent definition ✓ (already done)
│   ├─ Step 1.5: Check for chit-chat protocol
│   ├─ Step 2: Assume agent role
│   └─ Step 3: Begin interaction
└─ AI follows each step sequentially

Step 5: Load Strict Mode Protocol
├─ agent-activation.md contains: "/only-read-protocols strict-mode.md"
├─ AI calls kiroPowers tool
└─ Strict mode protocol loaded (enables /strict command)

Step 6: Check Chit-Chat Indicator
├─ AI scans kiro-master.md for chit-chat indicators:
│   ├─ "**Response Style:** Chit-chat"
│   ├─ "chit-chat protocol"
│   └─ Section header with "Chit-Chat"
├─ If found: Load chit-chat.md protocol
└─ If not found: Skip chit-chat protocol

Step 7: Assume Agent Role
├─ AI reads: "You are now kiro-master"
├─ AI adopts agent's:
│   ├─ Capabilities
│   ├─ Interaction protocol
│   ├─ Mandatory protocols
│   └─ Workflows
└─ Agent role active for session

Step 8: Begin Interaction
├─ If chit-chat active:
│   ├─ Start with diff block
│   ├─ Present numbered choices
│   └─ Follow chit-chat patterns
└─ If chit-chat inactive:
    └─ Follow agent's defined interaction protocol
```

**Files in Context (in order):**
1. `aliases.md` (always loaded)
2. `.kiro/agents/kiro-master.md` (loaded by alias)
3. `agent-activation.md` (loaded by alias)
4. `strict-mode.md` (loaded by activation protocol)
5. `chit-chat.md` (loaded if agent uses it)

**Total Context:** ~1.35K (base) + ~1K (agent) + ~2-3K (protocols) = ~4-5K tokens

### Example 3: `/modes spec` (Mode Switching)


```
User types: /modes spec

Step 1: Alias Detection
├─ AI has aliases.md in context (inclusion: always)
├─ AI detects parameter: "spec"
└─ AI executes mode switching alias

Step 2: Check for Literal Response Pattern
├─ Mode alias checks if mode_name is "spec" or "vibe"
├─ If yes: Output literal text "spec" (triggers Kiro native mode)
├─ If no: Continue with protocol loading
└─ In this case: Output "spec" and STOP

Step 3: Kiro IDE Native Mode
├─ Kiro IDE receives literal "spec" response
├─ Activates native spec mode tools
└─ Spec mode now active with Kiro tools
```

**Special Case: Literal Response**
- `/modes spec` and `/modes vibe` trigger Kiro's native modes
- AI outputs ONLY the mode name (no explanation)
- Kiro IDE interprets this as mode activation command
- Native tools loaded by Kiro IDE (not via protocols)

**Alternative: Role Modes**

```
User types: /modes as-spec

Step 1: Alias Detection
├─ AI detects parameter: "as-spec"
└─ NOT a literal response pattern (not "spec" or "vibe")

Step 2: Load Mode Definition
├─ Alias definition: "/only-read-protocols kiro-as-spec-mode.md"
├─ AI calls kiroPowers tool
└─ Mode definition loaded

Step 3: Load Mode Switching Protocol
├─ Alias definition: "/only-read-protocols mode-switching.md"
├─ AI calls kiroPowers tool
└─ Mode switching protocol loaded

Step 4: Follow Mode Switching Steps
├─ mode-switching.md defines steps:
│   ├─ Load mode definition ✓ (already done)
│   ├─ Preserve context (files, conversation)
│   ├─ Reset workflow state
│   └─ Begin mode-specific workflow
└─ AI follows each step

Step 5: Load Strict Mode Protocol
├─ mode-switching.md contains: "/only-read-protocols strict-mode.md"
└─ Strict mode protocol loaded (enables /strict command)

Step 6: Apply Mode Workflow
├─ kiro-as-spec-mode.md defines:
│   ├─ Interaction style (structured, formal)
│   ├─ Workflow phases (requirements → design → tasks)
│   └─ Response patterns
├─ AI adopts spec workflow structure
└─ KEEPS current tools (agent tools if agent active)
```

**Files in Context:**
1. `aliases.md` (always loaded)
2. `kiro-as-spec-mode.md` (loaded by alias)
3. `mode-switching.md` (loaded by alias)
4. `strict-mode.md` (loaded by mode switching)

---

## Component Interaction

### Steering Files + Protocols

**Pattern:** Steering files are "shells" that load protocols on-demand

**Example: `agents.md`**
```markdown
---
inclusion: manual
---

# Agent Management

/only-read-protocols chit-chat.md
/protocols agent-management.md

[Rest of file contains minimal instructions]
```

**Why this pattern?**
- Steering files stay small (minimal context)
- Protocols contain detailed workflows
- Single source of truth for reusable workflows
- Protocols can be shared across multiple steering files

### Agents + Modes

**Interaction:** Agents and modes can be combined


**Scenario 1: Agent First, Then Mode**
```
User: /agents frontend-specialist
AI: [Activates agent with React/TypeScript tools]

User: /modes as-vibe
AI: [Keeps React/TypeScript tools, adopts vibe workflow]

Result: Specialized tools + flexible workflow
```

**Scenario 2: Mode First, Then Agent**
```
User: /modes spec
AI: [Activates spec mode with Kiro tools]

User: /agents api-architect
AI: [Replaces Kiro tools with API design tools, keeps spec workflow]

Result: Specialized tools + structured workflow
```

**Key Rules:**
- **Full modes** (`spec`, `vibe`) replace tools
- **Role modes** (`as-spec`, `as-vibe`) keep current tools
- **Agents** always replace tools (unless using role mode after)
- **Workflow state** resets when switching modes
- **File changes** always preserved

### Agents + Strict Mode

**Interaction:** Strict mode can be enabled with any agent

```
User: /agents kiro-master
AI: [Agent active, STRICT_MODE = OFF by default]

User: /strict on
AI: [Agent still active, STRICT_MODE = ON]

Behavior:
- Agent capabilities: ACTIVE
- Agent workflows: ACTIVE
- Strict mode rules: ACTIVE (blocks on ambiguity)
```

**Precedence:**
1. Strict mode rules (when ON) - blocks execution on ambiguity
2. Agent protocols - defines capabilities and workflows
3. Base AI behavior - fills in gaps

### Modes + Strict Mode

**Interaction:** Strict mode can be enabled with any mode

```
User: /modes spec
AI: [Spec mode active, STRICT_MODE = OFF by default]

User: /strict on
AI: [Spec mode still active, STRICT_MODE = ON]

Behavior:
- Spec workflow: ACTIVE
- Spec tools: ACTIVE
- Strict mode rules: ACTIVE (blocks on ambiguity)
```

### Precedence Rules

**When multiple components are active:**

1. **Strict Mode** (if ON) - Highest precedence
   - Blocks execution on ambiguous input
   - Requires explicit clarification
   - Overrides all other behaviors when ambiguity detected

2. **Agent Protocols** (if agent active)
   - Defines capabilities and tools
   - Defines interaction patterns
   - Defines mandatory protocols

3. **Mode Protocols** (if mode active)
   - Defines workflow structure
   - Defines interaction style
   - May define tools (full modes only)

4. **Base AI Behavior**
   - Fills in gaps not covered by protocols
   - Provides general knowledge and reasoning
   - Adapts to context

**Conflict Resolution:**
- Agent protocols override mode protocols for tools (unless role mode)
- Mode protocols override agent protocols for workflow structure
- Strict mode overrides everything when ambiguity detected
- Explicit user instructions override all protocols

---

## User Experience Flows

### First-Time Setup

```
User installs: npx kiro-agents

Step 1: Installation
├─ CLI installs steering files to ~/.kiro/steering/kiro-agents/
├─ CLI installs kiro-protocols power to ~/.kiro/powers/kiro-protocols/
├─ CLI creates symbolic links in ~/.kiro/powers/installed/kiro-protocols/
├─ CLI registers power in ~/.kiro/powers/registry.json
└─ Installation complete

Step 2: First Command
├─ User opens Kiro IDE in a project
├─ User types: /agents
└─ AI detects no agents exist in .kiro/agents/

Step 3: Auto-Setup
├─ agents.md detects empty .kiro/agents/ directory
├─ AI automatically creates kiro-master agent:
│   ├─ Name: kiro-master
│   ├─ Description: "Interactive Kiro feature management..."
│   └─ File: .kiro/agents/kiro-master.md
└─ AI shows agent management menu with kiro-master listed

Step 4: User Interaction
├─ User sees numbered choices:
│   1. Activate existing agent
│   2. Create new agent
│   3. Manage existing agent
│   4. View agent details
│   5. Delete agent
│   6. Help & documentation
│   7. Return to conversation
└─ User can now manage agents or create new ones
```

**Key Points:**
- kiro-master created automatically on first `/agents` use
- No manual setup required
- User can start creating agents immediately
- kiro-master provides access to agent management protocols

### Daily Usage Pattern


```
Morning: Start Work
├─ User opens Kiro IDE
├─ User types: /agents frontend-specialist
├─ AI activates agent with React/TypeScript expertise
└─ User works on frontend features

Afternoon: Switch Context
├─ User types: /agents api-architect
├─ AI switches to API design agent
├─ Previous agent deactivated
└─ User works on API design

Evening: Quick Iteration
├─ User types: /modes as-vibe
├─ AI keeps API design tools, adopts vibe workflow
├─ Faster iteration, less structure
└─ User prototypes new endpoints

End of Day: Precision Work
├─ User types: /strict on
├─ AI enables strict mode
├─ Blocks on ambiguous input
└─ User makes critical architectural decisions
```

**Key Points:**
- Agents can be switched anytime
- Modes can be combined with agents
- Strict mode can be enabled when needed
- All features work together seamlessly

### Agent Creation Workflow

```
User: /agents

AI: [Shows agent management menu]

User: 2 (Create new agent)

AI: [Loads agent-creation.md protocol]
    [Shows 5 creation methods]

User: 3 (Explore Roles)

AI: [Shows 8 initial domains]
    1. 💻 Software Development
    2. 🎨 Creative & Design
    3. 💼 Business & Finance
    [...]

User: 1 (Software Development)

AI: [Shows 8 initial roles]
    1. Frontend Specialist
    2. Backend Engineer
    [...]
    [Type 'more' for additional roles]

User: more

AI: [Shows 9 additional roles]
    9. Database Expert
    10. Technical Writer
    [...]

User: 10 (Technical Writer)

AI: [Shows customization options]
    1. Use as-is
    2. Customize name
    3. Customize description
    4. Customize capabilities
    5. Start over

User: 1 (Use as-is)

AI: [Generates agent definition]
    [Writes to .kiro/agents/technical-writer.md]
    [Shows summary]
    
    Agent created: technical-writer
    
    Would you like to:
    1. Activate this agent now
    2. Create another agent
    3. Return to agent management
    4. Return to conversation

User: 1 (Activate now)

AI: [Executes /agents technical-writer]
    [Agent activated and ready]
```

**Key Points:**
- Guided workflow with numbered choices
- Multiple creation methods available
- Expandable role libraries (type "more")
- Immediate activation option
- Fast creation (3-5 minutes typical)

---

## Protocol Loading System

### kiroPowers Tool

**Purpose:** Load protocols from kiro-protocols Power on-demand

**Tool Name:** `kiroPowers` (provided by Kiro IDE)

**Actions:**
- `readSteering` - Read protocol file from power

### Loading Pattern

**In Steering Documents or Agent Definitions:**

```markdown
/only-read-protocols protocol-name.md
```

**This expands to (via instruction alias):**

```markdown
1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="protocol-name.md"
```

**Actual Tool Call:**

```typescript
kiroPowers({
  action: "readSteering",
  powerName: "kiro-protocols",
  steeringFile: "protocol-name.md"
})
```

**Path Resolution:**
- Kiro IDE resolves `steeringFile` to full path
- Looks in `~/.kiro/powers/kiro-protocols/steering/`
- Returns protocol content to AI
- Protocol loaded into context

### Protocol Loading Aliases

**Defined in `aliases.md` (via `{{{ADDITIONAL_ALIASES}}}` substitution):**

**1. Protocol Loading (Load and Execute)**
```xml
<alias>
  <trigger>/protocols {filename}</trigger>
  <definition>
## Load Protocol: {filename}

1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{filename}"
2. Follow all steps in the {filename} protocol
  </definition>
</alias>
```

**Usage:** `/protocols agent-creation.md`
- Loads protocol
- Executes protocol steps immediately

**2. Protocol Reading (Load Only)**
```xml
<alias>
  <trigger>/only-read-protocols {filename}</trigger>
  <definition>
## Read Protocol: {filename}

1. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{filename}"
2. Do NOT follow instructions until explicitly stated
  </definition>
</alias>
```

**Usage:** `/only-read-protocols chit-chat.md`
- Loads protocol into context
- Does NOT execute steps
- Makes protocol available for reference

### Error Handling

**Protocol Not Found:**
```
User: /protocols nonexistent.md

AI attempts: kiroPowers readSteering
Result: Error - file not found

AI response:
"Protocol 'nonexistent.md' not found in kiro-protocols power.

Available protocols:
- agent-activation.md
- agent-management.md
- agent-creation.md
[...]

Please check the protocol name and try again."
```

**Power Not Installed:**
```
User: /protocols agent-creation.md

AI attempts: kiroPowers readSteering
Result: Error - power not found

AI response:
"kiro-protocols power not found.

Please install kiro-agents:
  npx kiro-agents

This will install both steering files and the kiro-protocols power."
```

---

## Reflection System

### Overview

The reflection system enables agents to capture and reuse knowledge across sessions. Agents record insights, patterns, decisions, and learnings during work, which are then reviewed by a curator agent and organized into a 4-tier hierarchy for reuse.

**Key Features:**
- On-demand initialization (no setup required)
- Draft → Approved workflow with quality validation
- 4-tier insight hierarchy (Universal, Category, Agent, Project)
- Batch agent enablement
- File reference-driven architecture

### Storage Location

```
.ai-storage/
└── reflections/
    ├── drafts/              # Pending insights awaiting review
    │   ├── universal.md
    │   ├── project.md
    │   ├── categories/
    │   │   ├── architects.md
    │   │   ├── developers.md
    │   │   └── ...
    │   └── agents/
    │       ├── {agent-name}.md
    │       └── ...
    └── approved/            # Approved insights by tier
        ├── universal.md     # Used by ALL agents
        ├── project.md       # About this project
        ├── categories/      # Used by agent type
        │   ├── architects.md
        │   ├── developers.md
        │   └── ...
        └── agents/          # Used by specific agent
            ├── {agent-name}.md
            └── ...
```

**On-Demand Creation:**
- No initialization required
- Files created automatically when first insight is recorded
- Directories created automatically by fsWrite tool
- Clean repository (no empty files)

### Insight Tiers

**1. Universal Insights** (`.ai-storage/reflections/approved/universal.md`)
- Used by ALL agents
- Examples: Markdown preferences, approval protocols, team standards

**2. Category Insights** (`.ai-storage/reflections/approved/categories/{category}.md`)
- Used by agents of specific type (architects, developers, analysts)
- Examples: Architecture patterns, testing conventions, code style

**3. Agent-Specific Insights** (`.ai-storage/reflections/approved/agents/{agent-name}.md`)
- Used by one specific agent only
- Examples: Agent-specific preferences, learned behaviors

**4. Project Insights** (`.ai-storage/reflections/approved/project.md`)
- About this specific project
- Examples: Project structure, conventions, key files

### Workflow: Draft → Approved

```
Step 1: Agent Captures Insight
├─ Agent discovers pattern during work
├─ Records to .ai-storage/reflections/drafts/agents/{agent-name}.md
├─ Uses fsWrite (first time) or fsAppend (subsequent)
└─ Continues working

Step 2: User Reviews Drafts
├─ User types: /reflect review
├─ Activates reflection-curator agent
├─ Curator loads all draft files
└─ Curator starts review workflow

Step 3: Curator Validates Quality
├─ For each draft insight:
│   ├─ Display insight content
│   ├─ Validate against quality checklist
│   │   ├─ Specificity (concrete, actionable)
│   │   ├─ Context (explains why it matters)
│   │   ├─ Conciseness (brief but complete)
│   │   └─ Usefulness (valuable for future)
│   └─ Suggest refinements if needed
└─ Ask user which tier to approve to

Step 4: User Assigns Tier
├─ Options:
│   1. Universal (all agents)
│   2. Category (agent type)
│   3. Agent-Specific (one agent)
│   4. Project (project-wide)
│   5. Reject (not useful)
│   6. Skip (review later)
└─ Curator moves insight to appropriate approved file

Step 5: Agents Use Approved Insights
├─ Agents with Reflections section load insights via file references
├─ File references resolve to actual content
└─ Agents apply insights during work
```

### Commands

**Enable Reflection (For This Session):**
```
/reflect
```
- Adds Reflections section to agent file (permanent)
- Loads capture protocol in context (this session only)
- Next session: Agent reads insights but cannot capture (unless `/reflect` used again)
- Use case: Enable reflection on any agent for testing or one-time capture

**Review Draft Insights:**
```
/reflect review
```
- Activates reflection-curator agent
- Starts draft review workflow
- Use case: Review pending insights and approve them

**Enable Reflection (Permanent):**
```
/agents reflection-curator
```
Then use manager workflow to permanently enable reflection on selected agents.

### Agent Integration

Agents with Reflections section automatically load approved insights:

```markdown
## Reflections

### Universal Insights
#[[file:.ai-storage/reflections/approved/universal.md:insights]]

### Category Insights ({agent-category})
#[[file:.ai-storage/reflections/approved/categories/{agent-category}.md:insights]]

### Agent-Specific Insights
#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md:insights]]

### Project Insights
#[[file:.ai-storage/reflections/approved/project.md:insights]]
```

**File Reference Behavior:**
- Working reference (file exists) → Resolves to actual content
- Broken reference (file doesn't exist) → Shows blank or just syntax
- Agent detects blank and uses fsWrite to create file on first insight

### Reflection Protocols

**Located in:** `~/.kiro/powers/kiro-protocols/steering/`

| Protocol | Purpose | Loaded By |
|----------|---------|-----------|
| `reflect-agent-insights.md` | How agents capture insights during work | Agent definitions (reference) |
| `reflect-review-workflow.md` | Draft review and approval process | reflection-curator agent |
| `reflect-curator-checklist.md` | Quality validation criteria | reflection-curator agent |
| `reflect-manager-workflow.md` | Batch agent enablement | reflection-curator agent |

### Reflection Curator Agent

**File:** `.kiro/agents/reflection-curator.md`

**Responsibilities:**
- Review draft insights from all agents
- Validate insight quality
- Assign insights to appropriate tiers
- Enable reflection on multiple agents (batch operations)
- Generate reflection statistics
- Archive old/outdated insights

**Activation:**
```
/agents reflection-curator
```

**Primary Workflows:**
1. Review Drafts - Process pending insights
2. Enable Agents - Batch enablement (ranges, lists, categories)
3. Generate Statistics - Insight metrics and trends
4. Maintenance - Archive, consolidate, update

### Enablement Levels

**Level 1: Session-Temporary**
- Command: `/reflect`
- Adds Reflections section temporarily
- Removed when session ends
- Use case: Quick testing

**Level 2: Permanent**
- Via reflection-curator manager workflow
- Modifies agent definition file
- Persists between sessions
- Use case: Agents that should always capture insights

**Level 3: Workspace-Wide**
- Via reflection-curator manager workflow
- Batch enable multiple agents at once
- Selective ranges: "1, 4, 10" or "1-5, 10, 15-16"
- Use case: Migrating existing workspaces

### Quality Standards

**Good insights are:**
- ✅ Specific and actionable
- ✅ Include context (why it matters)
- ✅ Concise but complete
- ✅ Useful for future reference

**Avoid:**
- ❌ Vague statements ("be careful")
- ❌ Obvious facts ("files have names")
- ❌ Temporary information ("bug in line 42")
- ❌ Personal opinions without rationale

### Example Usage

**Enable reflection on current agent:**
```
User: /reflect

AI: ✅ REFLECTION ENABLED (Session-Temporary)

Agent: kiro-external-product-architect
Category: architect

Reflection files:
- Universal: .ai-storage/reflections/approved/universal.md
- Category: .ai-storage/reflections/approved/categories/architect.md
- Agent: .ai-storage/reflections/approved/agents/kiro-external-product-architect.md
- Project: .ai-storage/reflections/approved/project.md

You can now capture insights during work.
```

**Review draft insights:**
```
User: /reflect review

AI: [Activates reflection-curator agent]

📝 DRAFT INSIGHT #1

Source: .ai-storage/reflections/drafts/agents/kiro-external-product-architect.md
Type: Patterns

Content:
Workspace Detection Pattern: Always check for development files before implementation.

Quality Check:
✅ Specificity - Concrete steps provided
✅ Context - Explains why it matters
✅ Conciseness - Brief but complete
✅ Usefulness - Valuable for future work

Where should this insight be approved to?

1. Universal - All agents use this
2. Category: Architect - All architect agents use this
3. Agent-Specific - Only this agent uses this
4. Project - Project-wide insight
5. Reject - Not useful
6. Skip - Review later
```

### Documentation

**User Guide:** `docs/user-guide/reflection-system.md`
- Complete system documentation
- Workflow explanations
- Quality standards
- Getting started guide

**Steering:** `~/.kiro/steering/kiro-agents/reflect.md`
- Command definitions
- System overview
- Related commands

**Protocols:** `~/.kiro/powers/kiro-protocols/steering/reflect-*.md`
- Detailed workflow instructions
- Quality checklists
- Manager workflows

---

## Registry Integration

### Registry File Location

**Path:** `~/.kiro/powers/registry.json`

**Purpose:** Track installed powers for Kiro IDE Powers UI

### Registry Structure

```json
{
  "version": "1.0.0",
  "powers": {
    "kiro-protocols": {
      "name": "kiro-protocols",
      "displayName": "Kiro Protocols",
      "description": "Reusable protocol library for AI agents...",
      "mcpServers": [],
      "author": "R. Beltran",
      "keywords": ["protocols", "workflows", "agents", "modes"],
      "installed": true,
      "installedAt": "2024-12-26T10:30:00.000Z",
      "installPath": "~/.kiro/powers/installed/kiro-protocols",
      "source": {
        "type": "repo",
        "repoId": "local-kiro-protocols",
        "repoName": "~/.kiro/powers/kiro-protocols"
      },
      "sourcePath": "~/.kiro/powers/kiro-protocols"
    }
  },
  "repoSources": {
    "local-kiro-protocols": {
      "name": "~/.kiro/powers/kiro-protocols",
      "type": "local",
      "enabled": true,
      "addedAt": "2024-12-26T10:30:00.000Z",
      "path": "~/.kiro/powers/kiro-protocols",
      "lastSync": "2024-12-26T10:30:00.000Z",
      "powerCount": 1
    }
  },
  "lastUpdated": "2024-12-26T10:30:00.000Z"
}
```

### Registry Fields Explained

**Power Entry:**
- `installed: true` - Power is installed and ready to use
- `installPath` - Points to symlink directory (for UI)
- `sourcePath` - Points to actual power files
- `source.type: "repo"` - Treated as repository source (not "local")
- `source.repoId` - Stable identifier (no timestamp)

**Repo Source Entry:**
- `type: "local"` - Local filesystem source
- `path` - Full path to power directory
- `powerCount: 1` - Number of powers in this source

### Why This Structure?

**Stable repoId:**
- Uses `"local-kiro-protocols"` (no timestamp)
- Prevents duplicate entries on reinstall
- Matches Kiro's pattern for local powers

**Two Paths:**
- `installPath` - Where Kiro UI looks (symlinks)
- `sourcePath` - Where actual files are (source of truth)

**source.type: "repo":**
- Ensures proper UI integration
- Power appears as "installed" in Powers panel
- Enables proper power management

---

## File Permissions

### After Installation

**All installed files are read-only:**

```bash
# Steering files
~/.kiro/steering/kiro-agents/*.md  # r--r--r-- (444)

# Power files
~/.kiro/powers/kiro-protocols/**/*  # r--r--r-- (444)
```

**Why read-only?**
- Prevents accidental modification
- Ensures consistency across installations
- Users can't break system by editing files

### Modifying Files

**To modify installed files:**

1. **Change permissions:**
   ```bash
   chmod u+w ~/.kiro/steering/kiro-agents/aliases.md
   ```

2. **Edit file:**
   ```bash
   code ~/.kiro/steering/kiro-agents/aliases.md
   ```

3. **Restore read-only (optional):**
   ```bash
   chmod u-w ~/.kiro/steering/kiro-agents/aliases.md
   ```

**Better approach: Reinstall**
```bash
npx kiro-agents
```
- Removes old installation
- Installs latest version
- Restores all files to read-only

---

## Troubleshooting

### Protocol Not Found

**Symptom:**
```
Error loading protocol: agent-creation.md not found
```

**Causes:**
1. kiro-protocols power not installed
2. Protocol file missing from power
3. Incorrect protocol filename

**Solutions:**
1. **Reinstall kiro-agents:**
   ```bash
   npx kiro-agents
   ```

2. **Check power installation:**
   ```bash
   ls ~/.kiro/powers/kiro-protocols/steering/
   ```

3. **Verify protocol name:**
   - Check available protocols in POWER.md
   - Ensure correct spelling (case-sensitive)

### Agent Not Found

**Symptom:**
```
Agent 'my-agent' not found in .kiro/agents/
```

**Causes:**
1. Agent file doesn't exist
2. Wrong workspace directory
3. Agent file has wrong extension

**Solutions:**
1. **Check agent directory:**
   ```bash
   ls .kiro/agents/
   ```

2. **Verify workspace:**
   - Ensure you're in correct project directory
   - Check if `.kiro/agents/` exists

3. **Create agent:**
   ```
   /agents
   → Select "Create new agent"
   ```

### Mode Not Switching

**Symptom:**
```
Mode command not working, AI doesn't change behavior
```

**Causes:**
1. Incorrect mode name
2. Mode protocol not loaded
3. Kiro native mode not triggered

**Solutions:**
1. **Use correct mode names:**
   - `/modes spec` or `/modes vibe` (native modes)
   - `/modes as-spec` or `/modes as-vibe` (role modes)

2. **Check aliases.md loaded:**
   - Should be automatic (inclusion: always)
   - Restart Kiro IDE if needed

3. **Verify mode protocol exists:**
   ```bash
   ls ~/.kiro/powers/kiro-protocols/steering/kiro-*-mode.md
   ```

### Strict Mode Not Working

**Symptom:**
```
/strict on doesn't enable strict mode
```

**Causes:**
1. Strict mode protocol not loaded
2. Agent/mode didn't load strict-mode.md
3. Command not recognized

**Solutions:**
1. **Activate agent or mode first:**
   ```
   /agents kiro-master
   → Then: /strict on
   ```

2. **Check strict-mode.md exists:**
   ```bash
   ls ~/.kiro/powers/kiro-protocols/steering/strict-mode.md
   ```

3. **Manually load protocol:**
   ```
   /protocols strict-mode.md
   ```

### Registry Issues

**Symptom:**
```
Power not showing as installed in Kiro Powers UI
```

**Causes:**
1. Registry not updated
2. Symbolic links missing
3. Registry corrupted

**Solutions:**
1. **Reinstall kiro-agents:**
   ```bash
   npx kiro-agents
   ```
   - Automatically updates registry
   - Recreates symbolic links

2. **Check registry file:**
   ```bash
   cat ~/.kiro/powers/registry.json
   ```
   - Look for "kiro-protocols" entry
   - Verify `installed: true`

3. **Manual registry fix (advanced):**
   - Delete registry.json
   - Reinstall kiro-agents
   - Registry recreated automatically

---

## Related Documentation

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Build system and source organization
- **[Protocol System Design](design/protocol-system.md)** - Why layered protocols work
- **[Creating All-Powerful Agents](user-guide/creating-powerful-agents.md)** - Practical guide
- **[Manifest System](contributing/MANIFEST-SYSTEM.md)** - Centralized file mappings
- **[Testing](contributing/TESTING.md)** - Build validation

---

**Document version:** 1.0.0  
**Last updated:** December 26, 2025  
**Maintained by:** kiro-agents project
