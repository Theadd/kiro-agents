---
inclusion: always
description: Generic agent activation system with instruction commands for seamless agent management
---

# Agent System

Generic agent activation and management system for Kiro using instruction commands with parameter support.

## Agent Commands

**Note:** This system uses the Instruction Alias pattern defined in `aliases.md`. See that document for details on parameter substitution and literal response patterns.

### Command 1: Activate Specific Agent

<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

You are now activating the **{agent_name}** agent.

### Step 1: Load Agent Definition and Strict Mode

Read `.kiro/agents/{agent_name}.md` into context.

This file contains:
- Agent capabilities and responsibilities
- Interaction protocols and workflows
- Mandatory protocols and rules
- Examples and best practices
- Integration requirements

**Also load `strict-mode.md` steering document** to enable `/strict {state}` command for this agent session. STRICT_MODE defaults to OFF but user can activate it anytime with `/strict on`.

### Step 2: Assume Agent Role

For this session, you are **{agent_name}**.

You will:
- Follow ALL protocols and instructions from `.kiro/agents/{agent_name}.md`
- Apply agent-specific interaction patterns
- Use capabilities defined in the agent definition
- Maintain this role until user switches agents or ends session
- Override any conflicting instructions with agent protocols

### Step 3: Begin Interaction

Start interaction according to **{agent_name}**'s protocols defined in the `.md` file.

If the agent uses **chit-chat mode**:
- Begin with diff block showing current state
- Provide numbered choice list (4-6 options, up to 16 if needed)
- Maintain single focus per message
- Use visual formatting (bold, code blocks)

Otherwise:
- Begin according to the agent's defined interaction protocol
- Follow agent-specific response structure
- Apply agent-specific formatting rules

---

**You are now {agent_name}. Begin interaction.**
  </definition>
</alias>

### Command 2: Interactive Agent Management

For interactive agent management, use the `/agents` slash command (without parameters).
This provides a visual interface for:
- Viewing all available agents
- Creating new agents
- Managing existing agents
- Viewing agent details

**Usage:**
- Interactive: `/agents` (no parameters, loads `agents.md` steering file)
- Direct: `/agents {name}` (with agent name, uses alias above)

## Agent Activation Protocol

When `/agents {name}` is executed:

1. **Discover agent file**
   - Check `.kiro/agents/{name}.md` exists
   - If file missing, show error and suggest `/agents` command

2. **Load agent definition**
   - Read `.kiro/agents/{name}.md` into context
   - **Load `strict-mode.md`** steering document (enables `/strict` commands)
   - Parse frontmatter metadata
   - Understand agent capabilities and workflows
   - Identify mandatory protocols
   - Note interaction patterns
   - Check integration requirements

3. **Apply protocols**
   - Follow all mandatory protocols from definition
   - Load required steering documents
   - Apply agent-specific overrides
   - Set up agent context

4. **Assume role**
   - Become the agent completely
   - Maintain role until user switches agents
   - Apply agent personality and style
   - Use agent-specific tools and workflows

5. **Begin interaction**
   - Start according to agent's interaction protocol
   - Use agent's response structure
   - Apply agent's formatting rules
   - Maintain agent's focus and priorities

## Agent Management Protocol

When `/agents` is executed:

1. **Activate chit-chat mode**
   - Load chit-chat.md steering
   - Use diff blocks for progress
   - Provide numbered choices
   - Maintain single focus

2. **Scan agents directory**
   - List all `.md` files in `.kiro/agents/`
   - Exclude `.instructions.md` files
   - Extract agent metadata
   - Categorize agents by type

3. **Present choices**
   - Show available agents with descriptions
   - Offer management operations
   - Provide help and documentation
   - Allow exit to normal mode

4. **Handle operations**
   - Agent activation → Execute `/agents {name}`
   - Agent creation → Start creation wizard
   - Agent management → Modify agent files
   - Agent viewing → Display agent details
   - Help → Explain agent system
   - Exit → Return to normal mode

5. **Maintain context**
   - Use diff blocks to show progress
   - Preserve user decisions
   - Allow going back
   - Enable canceling operations

## Agent Directory Structure

```
.kiro/agents/
└── {agent-name}.md              # Complete agent definition
    ├── Frontmatter metadata
    ├── Core responsibilities
    ├── Capabilities and workflows
    ├── Interaction protocols
    ├── Mandatory protocols
    ├── Examples and best practices
    ├── Integration rules
    └── Conflict priorities
```

### Agent Definition File (.md)

**Required sections:**
- Frontmatter with name, type, metadata
- Core Responsibilities
- Capabilities (detailed list)
- Interaction Protocol (how agent responds)
- Mandatory Protocols (rules agent must follow)
- Workflows (step-by-step processes)
- Examples (interaction patterns)

**Recommended sections:**
- Best Practices
- Integration Points (with other agents/steering)
- Conflict Priorities (ordered list)
- Advanced Features
- Error Handling
- Success Metrics

## Initial Agent

When auto-setup detects no agents exist, it creates the initial agent:

**kiro-master** - Interactive Kiro feature management with CRUD operations for MCP servers, hooks, agents, specs, powers, and steering documents. Includes .kiro/ directory maintenance, steering optimization, refactoring, and comprehensive analysis capabilities

This description is used when creating `.kiro/agents/kiro-master.md` during auto-setup.

## Usage Examples

### Activate Specific Agent

```
/agents refactor-architect
```

**Result:** AI immediately assumes refactor-architect role, loads agent files, applies protocols, and begins interaction according to agent's style.

### Interactive Agent Management

```
/agents
```

**Result:** Chit-chat mode activates, shows available agents, offers management options with numbered choices.

### Switch Between Agents

```
/agents kiro-master
```

**Result:** Switch from current agent (e.g., refactor-architect) to kiro-master. Previous agent context is suspended, new agent context is loaded.

### Create New Agent

```
/agents
[Choose option 2: Create new agent]
[Follow wizard prompts]
```

**Result:** Interactive agent creation wizard guides through agent setup, generates files, offers activation.

## Integration with Existing System

### Compatibility

- **Works alongside steering documents** - Agents can load additional steering
- **Compatible with chit-chat mode** - Agents can use chit-chat protocols
- **Preserves ADHD-C optimizations** - Single focus, visual formatting maintained
- **Maintains language rules** - Spanish chat, English files
- **Respects user preferences** - Confirmation before changes, choice-based interaction
{{{EXTRA_COMPATIBILITY}}}

### Steering Document Loading

Agents can specify required steering documents in their `.md` definition file:

```markdown
## Integration Points

### Required Steering Documents
- `[steering-name].md` - Always loaded when agent is active
- `[another-steering].md` - Core rules for agent behavior

### Optional Steering Documents
- `[conditional-steering].md` - Loaded based on file context
- `[manual-steering].md` - Loaded when explicitly needed
```

### Agent Coordination

**Multiple agents can coordinate through:**
- **Handoff procedures** - Agent A passes control to Agent B
- **Context sharing** - Agents share relevant information
- **Conflict resolution** - Priority rules determine behavior
- **Collaborative workflows** - Agents work together on complex tasks

## Best Practices

### For Agent Users

1. **Use `/agents` for discovery** - See what agents are available
2. **Use `/agents {name}` for direct activation** - When you know which agent you need
3. **Let agents maintain focus** - Don't switch agents mid-task unless necessary
4. **Provide clear context** - Help agents understand your needs
5. **Use agent capabilities** - Leverage agent-specific tools and workflows

### For Agent Creators

1. **Clear agent definition** - Comprehensive `.md` with all capabilities and protocols
2. **Focused protocols** - Clear mandatory protocols section within `.md` file
3. **Consistent interaction** - Follow established patterns (chit-chat mode, etc.)
4. **Good examples** - Show how agent works in practice
5. **Integration rules** - Specify required steering documents

### For Agent Development

1. **Start with template** - Use existing agents as reference
2. **Test thoroughly** - Verify agent activates and functions correctly
3. **Document well** - Clear descriptions and examples
4. **Keep it simple** - Don't overcomplicate agent protocols
5. **Iterate based on use** - Improve agent based on actual usage

## Troubleshooting

### Agent Not Activating

**Problem:** `/agents {name}` doesn't work
**Solutions:**
- Check agent files exist in `.kiro/agents/`
- Verify filename matches command (case-sensitive)
- Ensure `.md` file contains all required sections
- Try `/agents` to see available agents

### Agent Behaving Incorrectly

**Problem:** Agent doesn't follow expected protocols
**Solutions:**
- Review agent `.md` file for clarity in Mandatory Protocols section
- Check for conflicting steering documents
- Verify mandatory protocols are clear and comprehensive
- Test agent in isolation

### Agent Management Not Working

**Problem:** `/agents` command doesn't activate
**Solutions:**
- Verify `agent-system.md` is in `.kiro/steering/`
- Check `inclusion: always` in frontmatter
- Ensure `chit-chat.md` exists
- Try reloading steering documents

## Future Enhancements

Potential improvements to agent system:

**Agent enhancements:**
- **Agent parameters** - `/agents refactor-architect --mode=strict`
- **Agent chaining** - `/agents kiro-master then refactor-architect`
- **Agent templates** - Quick agent creation from templates
- **Agent marketplace** - Share agents with community
- **Agent versioning** - Track agent changes over time
- **Agent testing** - Automated agent validation
{{{INTEGRATION_ENHANCEMENTS}}}

## Notes

- This system is a **prototype** - Kiro doesn't natively support agents
- Commands are implemented via **Instruction Alias pattern**
- System relies on **AI understanding and following instructions**
- May need **iteration based on actual usage**
- Consider **proposing as Kiro feature request** if successful

---

**Agent system ready. Use `/agents` to begin or `/agents {name}` to activate specific agent.**
