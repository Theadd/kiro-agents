---
inclusion: always
description: Generic agent activation system with instruction commands for seamless agent management
---

# Agent System

Generic agent activation and management system for Kiro using instruction commands with parameter support.

**For complete documentation, examples, and troubleshooting, see `docs/agent-system-guide.md`**

## Agent Commands

**Note:** This system uses the Instruction Alias pattern defined in `aliases.md`.

### Command 1: Activate Specific Agent

<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

You are now activating the **{agent_name}** agent.

**Load and execute activation protocol:**
1. Read `.kiro/agents/{agent_name}.md` into context
2. Read `~/.kiro/powers/installed/kiro-agents/steering/protocols/agent-activation.mdx` into context
3. Follow all steps from the "Agent Activation Steps" section in agent-activation.mdx
4. Use `{agent_name}` as the agent identifier throughout the protocol
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

## Quick Reference

### Activation Protocol Summary

When `/agents {name}` is executed:

1. **Discover** - Check `.kiro/agents/{name}.md` exists
2. **Load** - Read agent definition and `strict-mode.md`
3. **Apply** - Follow mandatory protocols, load required steering
4. **Assume** - Become agent completely, maintain role
5. **Begin** - Start interaction per agent's protocol

### Management Protocol Summary

When `/agents` is executed:

1. **Activate chit-chat** - Load chit-chat.md, use diff blocks
2. **Scan directory** - List `.md` files in `.kiro/agents/`
3. **Present choices** - Show agents, offer operations
4. **Handle operations** - Activation, creation, management, viewing
5. **Maintain context** - Track progress, preserve decisions

## Agent Definition Requirements

**File location:** `.kiro/agents/{agent-name}.md`

**Required sections:**
- Frontmatter (name, type, description, version)
- Core Responsibilities
- Capabilities
- Interaction Protocol
- Mandatory Protocols
- Workflows
- Examples

**Recommended sections:**
- Integration Points
- Conflict Priorities
- Best Practices
- Advanced Features
- Error Handling
- Success Metrics

## Initial Agent

When auto-setup detects no agents exist, it creates:

**kiro-master** - Interactive Kiro feature management with CRUD operations for MCP servers, hooks, agents, specs, powers, and steering documents. Includes .kiro/ directory maintenance, steering optimization, refactoring, and comprehensive analysis capabilities

## Integration Notes

- Works alongside steering documents
- Compatible with chit-chat mode
- Preserves ADHD-C optimizations
- **Mode system** - Works seamlessly with modes (see `modes-system.md`)
- **Context preservation** - File changes and conversation history persist across agent switches

## System Notes

- Prototype system using Instruction Alias pattern
- Relies on AI understanding and following instructions
- May need iteration based on actual usage

---

**Agent system ready. Use `/agents` to begin or `/agents {name}` to activate specific agent.**
