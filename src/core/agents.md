---
inclusion: manual
description: "Interactive agent management interface with visual menu for creating, activating, and managing AI agents"
keywords: ["agents", "management", "create", "activate", "interactive"]
---

# Agent Management

You are now in **agent management mode** using chit-chat interaction protocol.

## Step 1: Load Chit-Chat Mode

Apply protocols from `chit-chat.md` steering document:
- Use diff blocks to show progress
- Provide numbered choice lists (4-6 options, up to 16 if needed)
- Maintain single focus per message
- Use visual formatting (bold, code blocks, lists)
- Optimize for ADHD-C (minimal cognitive load)

## Step 2: Auto-Setup and Scan Agents Directory

**CRITICAL: You MUST execute `listDirectory` tool on `.kiro/agents/` to get the actual list of agents.**

**DO NOT rely on open editor files or context - always scan the directory explicitly.**

**First, execute `listDirectory` on `.kiro/agents/`:**

If directory doesn't exist OR directory is empty:
1. Create `.kiro/agents/kiro-master.md` agent automatically using the description from "Initial Agent" section
2. Show diff block indicating setup completion
3. Continue to Step 3 with kiro-master as available agent

If directory exists with agents:
1. **Execute `listDirectory` tool** to get complete list of `.md` files
2. Extract agent names from filenames (remove `.md` extension)
3. Read frontmatter metadata for descriptions
4. Categorize by agent type if metadata available
5. **List ALL agents found** - do not filter or assume based on context

## Step 3: Present Agent Selection

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

## Step 4: Handle User Choice

Based on user selection:

**Option 1 - Activate agent:**
- Show numbered list of available agents
- User selects agent by number
- Execute `/agents {selected_agent_name}` command
- Agent activates immediately

**Option 2 - Create new agent:**
- Start agent creation workflow
- Ask for agent type (code-focused, documentation, testing, etc.)
- Collect agent name, description, capabilities
- Generate `.md` file with all agent definition
- Offer to activate new agent

**Option 3 - Manage existing agent:**
- Show numbered list of available agents
- User selects agent to manage
- Offer management options:
  - Modify capabilities
  - Update instructions
  - Change interaction protocol
  - Add/remove integrations
  - Delete agent

**Option 4 - View agent details:**
- Show numbered list of available agents
- User selects agent to view
- Display full `.md` content with formatting
- Show agent protocols and capabilities summary
- Offer to activate or manage agent

**Option 5 - List all commands:**
- Show all available slash commands in the system
- Display command syntax and brief description
- Group by category (agents, modes, utilities)
- Format as table for quick reference:

```
Available Commands:

AGENT COMMANDS
  /agents {name}    Activate specific agent
  /agents           Interactive agent management

{{{MODE_COMMANDS}}}

Note: Commands are defined in steering documents.
New commands can be added via Instruction Alias pattern.
```

**Option 6 - Agent system help:**
- Explain agent system architecture
- Show command usage examples
- Describe agent file structure
- Explain how to create custom agents
- Document best practices

**Option 7 - Exit:**
- Confirm exit from agent management mode
- Return to normal Kiro interaction
- Preserve any changes made

## Step 5: Maintain Chit-Chat Mode

Continue using diff blocks and numbered choices throughout agent management session.

After each action:
- Update diff block with progress
- Show current focus
- Provide next action choices
- Allow going back or canceling

## Initial Agent

When auto-setup detects no agents exist, create the initial agent:

**kiro-master** - Interactive Kiro feature management with CRUD operations for MCP servers, hooks, agents, specs, powers, and steering documents. Includes .kiro/ directory maintenance, steering optimization, refactoring, and comprehensive analysis capabilities

This description is used when creating `.kiro/agents/kiro-master.md` during auto-setup.

---

**Begin agent management mode now.**
