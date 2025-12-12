---
inclusion: manual
description: "Interactive agent management interface with visual menu for creating, activating, and managing AI agents"
keywords: ["agents", "management", "create", "activate", "interactive"]
---

# Agent Management

## Parameter Detection

**CRITICAL: Check if user provided agent name as parameter**

If the user's message contains `/agents {agent_name}` with a specific agent name (e.g., `/agents kiro-master`):

1. **DO NOT execute the interactive management flow below**
2. **INSTEAD, execute the instruction alias for agent activation:**
   - Read `.kiro/agents/{agent_name}.md` into context
   - Read #[[file:protocols/agent-activation.md]] into context
   - Follow all steps from the "Agent Activation Steps" section in agent-activation.md
   - Use `{agent_name}` as the agent identifier throughout the protocol
3. **Stop processing this document** - The agent activation protocol takes over

**Only continue with interactive management flow below if user typed `/agents` without parameters.**

---

## Interactive Management Mode

You are now in **agent management mode** using chit-chat interaction protocol.

## Agent Management Steps

When entering agent management mode:

### Step 1: Activate Chit-Chat Mode

Load and apply protocols from `chit-chat.md` steering document:

- **Use diff blocks** to show progress and current state
- **Provide numbered choice lists** (4-8 options, up to 16 if needed)
- **Maintain single focus** per message
- **Use visual formatting** (bold, code blocks, lists)
- **Optimize for ADHD-C** (minimal cognitive load)

Begin with a diff block showing:
```diff
  👉 Agent management mode
  ⏳ [Current operation]
```

### Step 2: Scan Agents Directory

**CRITICAL: You MUST execute `listDirectory` tool on `.kiro/agents/` to get the actual list of agents.**

**DO NOT rely on open editor files or context - always scan the directory explicitly.**

Execute `listDirectory` on `.kiro/agents/`:

**If directory doesn't exist OR directory is empty:**
1. **Load agent creation protocol**:
   - Call `kiroPowers` with action="activate", powerName="kiro-protocols"
   - Call `kiroPowers` with action="readSteering", powerName="kiro-protocols", steeringFile="agent-creation.md"
2. Create `.kiro/agents/kiro-master.md` agent automatically using the description from "Initial Agent" section
3. Follow the agent definition structure from agent-creation.md protocol
4. Show diff block indicating setup completion
5. Continue to Step 3 with kiro-master as available agent

**If directory exists with agents:**
1. **Execute `listDirectory` tool** to get complete list of `.md` files
2. Extract agent names from filenames (remove `.md` extension)
3. Read frontmatter metadata for descriptions
4. Categorize by agent type if metadata available
5. **List ALL agents found** - do not filter or assume based on context

### Step 3: Present Agent Selection

Use this response structure:

```diff
  👉 Agent management mode
  ⏳ Agent selection or management
```

**Current Focus**: Agent selection and management

**Available agents in `.kiro/agents/`:**

[List each agent with format:]
- **{agent-name}** - {description from frontmatter or .md}

**What would you like to do?**

1. **Activate agent** - Choose agent to activate immediately
2. **Create new agent** - Start agent creation wizard
3. **Manage existing agent** - Modify agent configuration
4. **View agent details** - Show full agent definition
5. **List all commands** - Show available slash commands
6. **Agent system help** - Explain how agents work
7. **Exit** - Return to normal mode

### Step 4: Handle User Choice

Based on user selection:

#### Option 1 - Activate Agent

- Show numbered list of available agents
- User selects agent by number
- Execute `/agents {selected_agent_name}` command
- Agent activates immediately

#### Option 2 - Create New Agent

- **Load agent creation protocol**:
  - Call `kiroPowers` with action="activate", powerName="kiro-protocols"
  - Call `kiroPowers` with action="readSteering", powerName="kiro-protocols", steeringFile="agent-creation.md"
- Follow all steps from the "Agent Creation Steps" section in agent-creation.md
- Start agent creation workflow with interactive wizard
- Ask for agent type (code-focused, documentation, testing, etc.)
- Collect agent name, description, capabilities
- Generate `.md` file with all agent definition following protocol structure
- Validate agent definition per protocol
- Offer to activate new agent

#### Option 3 - Manage Existing Agent

- **Load agent structure reference**:
  - Call `kiroPowers` with action="activate", powerName="kiro-protocols"
  - Call `kiroPowers` with action="readSteering", powerName="kiro-protocols", steeringFile="agent-creation.md"
- Show numbered list of available agents
- User selects agent to manage
- Offer management options:
  - Modify capabilities
  - Update instructions
  - Change interaction protocol
  - Add/remove integrations
  - Delete agent
- Use agent definition structure from protocol as reference for modifications
- Apply changes to agent `.md` file
- Validate changes against protocol requirements
- Reload agent if currently active

#### Option 4 - View Agent Details

- Show numbered list of available agents
- User selects agent to view
- Display full `.md` content with formatting
- Show agent protocols and capabilities summary
- Offer to activate or manage agent

#### Option 5 - List All Commands

Show all available slash commands in the system:

```
Available Commands:

AGENT COMMANDS
  /agents {name}    Activate specific agent
  /agents           Interactive agent management

MODE COMMANDS (see modes-system.md)
  /modes {name}     Switch Kiro mode (vibe/spec)
  /modes            Interactive mode management
  /strict {state}   Control strict mode (on/off)
  /strict           Interactive strict mode control

Note: Commands are defined in steering documents.
New commands can be added via Instruction Alias pattern.
```

#### Option 6 - Agent System Help

Explain agent system:
- Agent system architecture
- Command usage examples
- Agent file structure
- How to create custom agents
- Best practices for agent usage

#### Option 7 - Exit

- Confirm exit from agent management mode
- Return to normal interaction
- Preserve any changes made

### Step 5: Maintain Chit-Chat Mode

Continue using diff blocks and numbered choices throughout agent management session.

After each action:
- Update diff block with progress
- Show current focus
- Provide next action choices
- Allow going back or canceling

**Context Preservation:**
- Use diff blocks to show progress
- Preserve user decisions
- Allow going back to previous step
- Enable canceling operations

---

**Agent management mode active. Present choices to user.**


## Initial Agent

When auto-setup detects no agents exist, create the initial agent:

**kiro-master** - Interactive Kiro feature management with CRUD operations for MCP servers, hooks, agents, specs, powers, and steering documents. Includes .kiro/ directory maintenance, steering optimization, refactoring, and comprehensive analysis capabilities

This description is used when creating `.kiro/agents/kiro-master.md` during auto-setup.

---

**Quick Commands:**

```
/agents           Interactive agent management

MODE COMMANDS (see modes-system.md)
  /modes {name}     Switch Kiro mode (vibe/spec)
  /modes            Interactive mode management
  /strict {state}   Control strict mode (on/off)
  /strict           Interactive strict mode control
```

Note: Commands are defined in steering documents.
