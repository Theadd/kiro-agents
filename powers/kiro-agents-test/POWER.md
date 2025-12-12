---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "Advanced AI agent system with specialized agents, mode switching, strict mode, and interactive workflows for Kiro IDE"
keywords: ["agent", "agents", "mode", "modes", "vibe", "spec", "strict", "workflow", "kiro-master", "chit-chat", "interactive"]
author: "R. Beltran"
---

# Kiro Agents & Modes System

## Overview

An advanced AI agent system for Kiro IDE that enhances development workflows with minimal cognitive overhead. Provides specialized agents, mode switching between flexible and structured workflows, strict mode for precision development, and interactive choice-based interfaces optimized for ADHD-C users.

## When to Use This Power

- **Creating specialized AI agents** for specific development tasks or domains
- **Switching between workflows** - flexible (vibe) for exploration, structured (spec) for planning
- **Precision development** - strict mode for critical code or experimental projects
- **Managing cognitive load** - choice-based interactions with visual progress tracking
- **Building custom agents** for your team's specific needs
- **Interactive workflows** - visual menus instead of typing commands

## Features

### Agent System

Create and manage specialized AI agents with defined capabilities, custom protocols, and specific workflows.

**Commands:**
- `/agents` - Interactive agent management with visual menu
- `/agents {name}` - Activate specific agent directly

**Capabilities:**
- Create custom agents interactively
- Activate agents for specialized tasks
- Manage agent configurations
- View agent details and capabilities
- Auto-create kiro-master agent on first use

### Mode System

Switch between interaction styles based on workflow needs.

**Available Modes:**
- **Vibe Mode** - Flexible, conversational development for quick iterations
- **Spec Mode** - Structured feature development with requirements, design, and task planning

**Commands:**
- `/modes` - Interactive mode management with visual menu
- `/modes vibe` - Switch to vibe mode directly
- `/modes spec` - Switch to spec mode directly

**Benefits:**
- Adapt AI interaction to your current workflow
- Structured planning when needed
- Flexible exploration when experimenting
- Seamless switching between modes

### Strict Mode

Precision mode that blocks execution on ambiguous input and requires explicit clarification. Prevents assumption propagation in critical development.

**Commands:**
- `/strict` - Interactive control with visual buttons
- `/strict on` - Enable strict mode directly
- `/strict off` - Disable strict mode directly

**Use Cases:**
- Experimental projects with cutting-edge technologies
- Architectural decisions that propagate throughout codebase
- Breaking changes affecting multiple files/systems
- New component creation establishing patterns
- Debugging propagated errors from incorrect assumptions

### Interactive Workflows

All commands provide choice-based interactions optimized for minimal cognitive load:
- Visual progress tracking with diff blocks
- Numbered choice lists (no typing required)
- Single focus per message
- Clear visual formatting
- ADHD-C optimizations

## Getting Started

### First Time Setup (Onboarding)

When you first use this power, Kiro will automatically:

1. **Create initial agent** - kiro-master agent will be created in `.kiro/agents/`
2. **Verify structure** - Ensure `.kiro/agents/` directory exists
3. **Ready to use** - All commands immediately available

No manual setup required!

### Quick Start

**Explore available agents:**
```
/agents
```
This opens the interactive agent management interface with visual menu.

**Try a mode:**
```
/modes vibe
```
Start with flexible, conversational development.

**Create your first custom agent:**
1. Type `/agents`
2. Select "Create new agent"
3. Follow the interactive wizard
4. Agent is ready to use!

### Common Workflows

**For Quick Iterations:**
- Use vibe mode: `/modes vibe`
- Make changes directly when clear
- Iterate quickly on feedback
- Switch agents as needed: `/agents {name}`

**For Complex Features:**
- Switch to spec mode: `/modes spec`
- Follow requirements → design → tasks workflow
- Use approval gates between phases
- Combine with specialized agents

**For Critical Development:**
- Enable strict mode: `/strict on`
- Get explicit clarification on ambiguous input
- Ensure precision in implementation
- Disable when done: `/strict off`

## Available Commands

### Agent Commands
- `/agents` - Interactive agent management with visual menu
- `/agents {name}` - Activate specific agent directly

### Mode Commands
- `/modes` - Interactive mode management with visual menu
- `/modes vibe` - Switch to vibe mode directly
- `/modes spec` - Switch to spec mode directly

### Strict Mode Commands
- `/strict` - Interactive control with visual buttons
- `/strict on` - Enable strict mode directly
- `/strict off` - Disable strict mode directly

## Steering Files

This power includes comprehensive guidance organized by workflow:

### Core System (Always Loaded)
- `agent-system.md` - Agent activation and management protocols
- `modes-system.md` - Mode switching system
- `strict-mode.md` - Strict mode rules and protocols

### Interactive Interfaces (Manual Inclusion)
- `agents.md` - Interactive agent management (via `/agents`)
- `modes.md` - Interactive mode management (via `/modes`)
- `strict.md` - Interactive strict mode control (via `/strict`)

### Interaction Patterns (On Demand)
- `interactions/chit-chat.md` - Choice-based interaction patterns
- `interactions/conversation-language.md` - Language guidelines
- `interactions/interaction-styles.md` - Interaction style patterns

### Modes (On Demand)
- `modes/kiro-spec-mode.md` - Spec mode protocols and workflows
- `modes/kiro-vibe-mode.md` - Vibe mode protocols and workflows
- `modes/tools/client-tools.md` - Available Kiro tools reference

## Examples

### Create a Custom Agent

**Interactive approach:**
```
/agents
[Visual menu appears]
[Select: Create new agent]
[Follow wizard prompts]
```

**Result:** New agent created and ready to activate

### Switch Modes Mid-Workflow

**Explore then formalize:**
```
/modes vibe
[Explore and prototype features]

/modes spec
[Formalize into structured plan with requirements and design]
```

**Result:** Seamless transition from exploration to structured planning

### Use Strict Mode for Critical Code

**Interactive control:**
```
/strict
[Visual buttons appear]
[Select: Enable Strict Mode]
[Work on critical implementation with precision]
[Select: Disable Strict Mode when done]
```

**Result:** Precision mode for critical work, normal mode for routine tasks

### Combine Features

**Example workflow:**
```
/modes spec              # Structured planning
/agents architect        # Activate architecture specialist
/strict on              # Enable precision mode
[Design critical system architecture]
/strict off             # Return to normal mode
/modes vibe             # Switch to flexible implementation
/agents developer       # Activate development specialist
[Implement the design]
```

**Result:** Modes + Agents + Strict mode working together

## Best Practices

1. **Choose Appropriate Mode**
   - Vibe for exploration and quick iterations
   - Spec for complex features requiring planning

2. **Use Agents for Specialization**
   - Create agents for specific domains (frontend, backend, testing)
   - Activate appropriate agent for current task
   - Switch agents as workflow changes

3. **Leverage Strict Mode**
   - Enable for experimental or critical work
   - Disable for routine development
   - Use when assumptions are dangerous

4. **Combine Features**
   - Modes + Agents + Strict mode work together
   - Each feature enhances the others
   - Adapt to your workflow needs

5. **Interactive First**
   - Use visual menus when exploring
   - Use direct commands when you know what you want
   - Both approaches available for all features

## Troubleshooting

### Agent Not Activating

**Problem:** `/agents {name}` doesn't work

**Solutions:**
- Verify agent file exists in `.kiro/agents/`
- Check filename matches command (case-sensitive)
- Try `/agents` to see available agents
- Create agent if it doesn't exist

### Mode Not Switching

**Problem:** Mode doesn't change

**Solutions:**
- Confirm mode files are loaded
- Check for conflicting steering documents
- Try `/modes` for interactive management
- Verify mode name is correct (vibe/spec)

### Commands Not Appearing

**Problem:** Slash commands don't show in menu

**Solutions:**
- Verify power is installed correctly
- Check steering files have correct frontmatter
- Reload Kiro IDE
- Try typing command directly

### Strict Mode Not Working

**Problem:** Strict mode doesn't block execution

**Solutions:**
- Verify strict mode is enabled: `/strict`
- Check current state in response headers
- Re-enable if needed: `/strict on`
- Ensure strict-mode.md is loaded

## Resources

- **GitHub Repository:** [Link to repository]
- **Documentation:** [Link to docs]
- **Issues:** [Link to issues]
- **Community:** [Link to community]

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation
- Ask in Kiro community

---

**Quick Reference:**

```
INTERACTIVE COMMANDS (Visual Menus)
/agents          Agent management
/modes           Mode management
/strict          Strict mode control

DIRECT COMMANDS (Fast Typing)
/agents {name}   Activate agent
/modes {mode}    Switch mode
/strict {state}  Change strict mode

AVAILABLE AGENTS
- build-pipeline-specialist
- changeset-issue-fixer
- kiro-master
- seo-specialist
```

**Version:** 1.7.0
