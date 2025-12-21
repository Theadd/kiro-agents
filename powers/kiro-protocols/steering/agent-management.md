# Agent Management Protocol

This file contains the detailed instructions for interactive agent management. It is referenced when `/agents` is executed without parameters.

## Agent Management Steps

When entering agent management mode:

### Step 1: Activate Chit-Chat Mode

/only-read-protocols chit-chat.md

Apply protocols from chit-chat.md:

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
  - Call `kiroPowers` with action="readSteering", powerName="kiro-protocols", steeringFile="agent-creation.md"
- Follow all steps from the "Method Selection" section in agent-creation.md
- Present 5 creation methods to user:
  1. Quick Start (predefined templates)
  2. Project-Specific (AI analysis)
  3. Explore Roles (domain browser)
  4. Guided Wizard (step-by-step)
  5. Natural Language (describe in plain English)
- Execute selected method following protocol
- Generate `.md` file with complete agent definition
- Validate agent definition per protocol
- Offer to activate new agent

#### Option 3 - Manage Existing Agent

- **Load agent structure reference**:
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
