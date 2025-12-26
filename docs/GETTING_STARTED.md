# Getting Started with kiro-agents

Step-by-step guide to installing and using kiro-agents for the first time.

## Installation

Install kiro-agents using npm:

```bash
npx kiro-agents
```

This installs:
- kiro-agents steering files to `~/.kiro/steering/kiro-agents/`
- kiro-protocols Power to `~/.kiro/powers/kiro-protocols/`

The installation is global and works across all your Kiro IDE workspaces.

## First Steps

### 1. Open Kiro IDE

Open any project in Kiro IDE. kiro-agents works in any workspace.

### 2. Start the Agent System

In the Kiro chat, type:

```
/agents
```

On first run, this will:
- Automatically create **kiro-master** (your Kiro management agent)
- Show you the agent management menu with various options

The AI will present options for what you'd like to do. The exact wording and order may vary, but you'll see options like creating agents, activating agents, managing existing agents, and viewing details.

### 3. Create Your First Agent

Look for an option to **create a new agent** and select it.

The AI will present 5 creation methods. While the exact presentation may vary, you'll see these approaches:

**Quick Start** - Choose from predefined templates
- Fastest option
- Common roles ready to use
- Best for: Getting started quickly

**Project-Specific** - AI analyzes your workspace
- Suggests agents relevant to your project
- Analyzes your tech stack and structure
- Best for: Project-specific needs

**Explore Roles** - Browse by domain
- Organized by industry and function
- Expandable role libraries (type "more" for additional options)
- Best for: Discovering possibilities

**Guided Wizard** - Step-by-step creation
- Full control over every aspect
- Define capabilities, workflows, protocols
- Best for: Custom requirements

**Natural Language** - Describe what you need
- "I need help with React performance"
- AI generates complete agent from description
- Best for: Quick, intuitive creation

### 4. Example: Creating a Testing Agent

Let's create a testing agent using Quick Start:

1. Select the option to **create a new agent**
2. Choose **Quick Start** method
3. Browse the templates and look for **Testing Specialist** or similar
4. Decide whether to use as-is or customize the name/description
5. Confirm creation

The agent is now created and ready to use!

### 5. Activate Your Agent

Once created, activate your agent by typing:

```
/agents testing-specialist
```

(Use the actual name you gave your agent)

The agent is now active and will assist you with testing tasks using its specialized knowledge and workflows.

### 6. Using Your Agent

With an agent active, you interact through guided workflows:

- The agent presents options as numbered choices
- You select by typing the number or describing what you want
- The agent guides you through complex tasks step-by-step
- Minimal prompt writing needed

The AI will adapt its responses based on context, so don't expect identical wording each time. Focus on the intent of the options rather than exact phrasing.

### 7. Switch Between Agents

To switch to a different agent, type:

```
/agents {agent-name}
```

Examples:
- `/agents kiro-master` - Switch to Kiro management agent
- `/agents testing-specialist` - Switch to your testing agent

The previous agent deactivates, and the new one becomes active.

## Common Workflows

### Creating Multiple Agents

You can create as many agents as you need:

1. Type `/agents`
2. Look for the option to create a new agent
3. Choose your preferred creation method
4. Repeat for each agent

All agents are saved in `.kiro/agents/` and available across sessions.

### Refining Agents

After creating an agent, you can refine it:

**Via kiro-master (recommended):**
1. Activate kiro-master: `/agents kiro-master`
2. Look for options related to agent management
3. Select the option to manage or modify an existing agent
4. Choose the agent you want to modify
5. Select what aspect to modify (capabilities, workflows, interaction style, etc.)

**Via /agents command:**
1. Type `/agents`
2. Look for the option to manage existing agents
3. Follow the guided workflow

kiro-master provides more creative and detailed modification options.

### Exploring Agent Capabilities

To see what an agent can do:

1. Type `/agents`
2. Look for an option to view agent details
3. Choose the agent you want to inspect
4. Review the complete definition

This shows the agent's responsibilities, capabilities, workflows, and interaction protocols.

## Advanced Features

### Modes

Switch between interaction styles by typing:

```
/modes vibe      # Conversational, flexible
/modes spec      # Structured, formal workflow
/modes as-vibe   # Vibe style, keep current agent tools
/modes as-spec   # Spec style, keep current agent tools
```

Modes change HOW you interact, not WHAT the agent can do.

### Strict Mode

Enable precision mode for critical work:

```
/strict on       # Blocks on ambiguous input
/strict off      # Allows reasonable assumptions
```

Use strict mode for:
- Architectural decisions
- Experimental projects
- Breaking changes
- Debugging complex issues

## Tips for Success

**Focus on Intent, Not Exact Words**
- The AI's responses will vary based on context
- Look for the meaning of options, not specific wording
- If you don't see what you need, describe it directly

**Start Simple**
- Create one agent for your most common task
- Get comfortable with the guided interaction
- Expand to more agents as needed

**Use kiro-master**
- It's your gateway to all Kiro features
- More powerful than direct `/agents` command
- Provides creative suggestions for improvements

**Explore Role Libraries**
- Don't limit yourself to obvious choices
- Type "more" to see additional options
- Mix and match capabilities from different roles

**Refine Over Time**
- Agents can be modified after creation
- Add capabilities as you discover needs
- Perfect workflows based on actual usage

**Leverage Guided Interaction**
- Let the agent guide you through complex tasks
- Select numbered options or describe what you want
- Trust the workflow structure

## Troubleshooting

**Agent not activating?**
- Check the agent name: `/agents {exact-name}`
- Use `/agents` to see available agents
- Verify agent file exists in `.kiro/agents/`

**Want to start over?**
- Type `/agents`
- Look for options to manage or delete agents
- Delete the agent and create a new one

**Need help?**
- Type `/agents` and look for help options
- Or activate kiro-master: `/agents kiro-master`
- Describe what you're trying to do in plain language

## Next Steps

Now that you're set up:

1. **Create agents for your workflow** - Testing, documentation, code review, etc.
2. **Explore the role library** - Discover agents you didn't know you needed
3. **Refine your agents** - Perfect them through kiro-master
4. **Try different modes** - Experiment with vibe and spec modes
5. **Read the docs** - Learn about advanced features and best practices

## Additional Resources

- [Creating Powerful Agents](user-guide/creating-powerful-agents.md) - Understanding layered architecture
- [Architecture Overview](ARCHITECTURE.md) - How kiro-agents works
- [Design Rationale](design/) - Why it's designed this way

---

**Welcome to kiro-agents!** You're now ready to create and use specialized AI agents tailored to your exact needs.
