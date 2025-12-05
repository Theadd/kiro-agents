# Kiro Powers Refactoring Plan for kiro-agents

## Understanding Kiro Powers

### Core Concepts

**Powers are workspace-level extensions** that package:
1. **POWER.md** - Metadata, onboarding, and steering mappings (REQUIRED)
2. **mcp.json** - MCP server configuration (OPTIONAL)
3. **steering/** - Workflow-specific guidance files (OPTIONAL)

### Key Features

1. **Keyword-Based Activation**: When user mentions keywords, Kiro loads the power automatically
2. **Onboarding Instructions**: Run once when power is first used (validate tools, create hooks)
3. **Steering Files**: Loaded on-demand based on workflow context
4. **MCP Integration**: Powers can include MCP servers for tool access
5. **Slash Commands**: Steering files with `inclusion: manual` become slash commands

### Distribution Methods

1. **Kiro Power Store** (Official) - Browse at kiro.dev/powers
2. **GitHub URL** - Install from public repository
3. **Local Path** - Install from local directory

## Current kiro-agents Structure

```
kiro-agents/
├── src/
│   ├── core/                     # Cross-IDE compatible
│   │   ├── agent-system.md
│   │   ├── strict-mode.md
│   │   └── interactions/
│   │       ├── chit-chat.md
│   │       ├── conversation-language.md
│   │       └── interaction-styles.md
│   └── kiro/                     # Kiro-specific
│       └── steering/
│           ├── modes-system.md
│           └── agent-system/
│               ├── kiro-spec-mode.md
│               ├── kiro-vibe-mode.md
│               └── tools/
│                   └── client-tools.md
├── dist/                         # npm package output
└── bin/cli.ts                    # CLI for global installation
```

## Proposed Power Structure

```
power-kiro-agents/
├── POWER.md                      # Metadata + onboarding + steering mappings
├── steering/                     # All steering documents
│   ├── agent-system.md           # Core agent system
│   ├── modes-system.md           # Mode switching
│   ├── strict-mode.md            # Strict mode
│   ├── interactions/
│   │   ├── chit-chat.md
│   │   ├── conversation-language.md
│   │   └── interaction-styles.md
│   └── modes/
│       ├── kiro-spec-mode.md
│       ├── kiro-vibe-mode.md
│       └── tools/
│           └── client-tools.md
└── mcp.json                      # (Optional, if we add MCP servers later)
```

## POWER.md Structure

### Frontmatter

```markdown
---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "Advanced AI agent system with specialized agents, mode switching, and interactive workflows for Kiro IDE"
keywords: ["agent", "agents", "mode", "modes", "vibe", "spec", "strict", "workflow", "kiro-master", "chit-chat"]
author: "Your Name"
---
```

### Onboarding Section

```markdown
# Onboarding

## Step 1: Verify Installation
This power provides steering documents for the Kiro agent system. No additional tools or dependencies are required.

## Step 2: Available Features
This power includes:
- **Agent System**: Create and manage specialized AI agents
- **Mode System**: Switch between vibe (flexible) and spec (structured) modes
- **Strict Mode**: Precision mode for critical development
- **Interactive Workflows**: Choice-based interactions with minimal cognitive load

## Step 3: Quick Start
To get started:
- Type `/agents` to manage agents interactively
- Type `/modes` to switch between interaction modes
- Type `/agent {name}` to activate a specific agent
- Type `/mode {mode}` to switch modes directly
```

### Steering Mappings

```markdown
# When to Load Steering Files

## Core System (Always Loaded)
- `agent-system.md` - Agent activation and management system
- `modes-system.md` - Mode switching system

## Interaction Patterns (Loaded on Demand)
- Working with chit-chat interactions → `interactions/chit-chat.md`
- Need conversation language guidelines → `interactions/conversation-language.md`
- Understanding interaction styles → `interactions/interaction-styles.md`

## Modes (Loaded on Demand)
- Using spec mode → `modes/kiro-spec-mode.md`
- Using vibe mode → `modes/kiro-vibe-mode.md`
- Need strict mode → `strict-mode.md`

## Tools Reference
- Understanding available tools → `modes/tools/client-tools.md`
```

## Slash Commands Integration

### Current Approach (Instruction Alias in Steering)

```markdown
<alias>
  <trigger>/agent {agent_name}</trigger>
  <definition>
    ## Agent Activation: {agent_name}
    ...
  </definition>
</alias>
```

### Power Approach (Manual Inclusion Steering)

Each steering file can become a slash command by adding frontmatter:

```markdown
---
inclusion: manual
---

# Agent System

Content here...
```

**Result**: `/agent-system` command appears in slash command menu

### Hybrid Approach (Recommended)

1. **Core steering files**: `inclusion: always` (agent-system.md, modes-system.md)
2. **Specialized guidance**: `inclusion: manual` (strict-mode.md, specific workflows)
3. **Keep instruction aliases**: They work within steering documents for parameterized commands

## Refactoring Strategy

### Phase 1: Create Power Structure

1. **Create POWER.md**
   - Define metadata and keywords
   - Write onboarding instructions
   - Map steering files to workflows

2. **Reorganize Steering Files**
   - Move all `.md` files to `steering/` directory
   - Update frontmatter for inclusion modes
   - Preserve instruction aliases

3. **Test Locally**
   - Install power from local path
   - Verify keyword activation
   - Test steering file loading

### Phase 2: Maintain npm Distribution

Keep the npm package for global installation:

```
kiro-agents/
├── power/                        # Power distribution
│   ├── POWER.md
│   ├── steering/
│   └── mcp.json (optional)
├── dist/                         # npm distribution
│   └── (same as current)
└── bin/cli.ts                    # CLI for global install
```

### Phase 3: Build System Updates

```typescript
// scripts/build.ts

const buildTargets = {
  npm: {
    output: 'dist/',
    installPath: '~/.kiro/steering/',
    includeCLI: true
  },
  power: {
    output: 'power/',
    structure: {
      'POWER.md': 'src/power/POWER.md',
      'steering/': 'src/core/**/*.md + src/kiro/**/*.md'
    },
    includeCLI: false
  }
}

async function build(target: 'npm' | 'power' | 'both') {
  // Build logic for each target
}
```

## Advantages of Power Distribution

### For Users

1. **Discoverability**: Browse in Kiro Power Store
2. **Workspace-Specific**: Different versions per project
3. **Integrated**: Native Kiro UI for installation
4. **Automatic Updates**: If published to store
5. **Keyword Activation**: Automatic loading based on context

### For Developers

1. **Visibility**: Listed in official power store
2. **Community**: Easier for others to find and use
3. **Feedback**: Power store provides usage metrics
4. **Ecosystem**: Part of official Kiro ecosystem

## Disadvantages to Consider

1. **Complexity**: Need to maintain two distribution methods
2. **Build System**: More complex build process
3. **Testing**: Need to test both distributions
4. **Documentation**: Must document both installation methods

## Recommended Approach

### Short Term (Immediate)

1. **Create Power version** alongside npm package
2. **Test locally** to verify it works
3. **Publish to GitHub** for community access
4. **Keep npm package** for global installation

### Medium Term (After Validation)

1. **Gather feedback** from Power users
2. **Iterate on POWER.md** based on usage
3. **Consider adding MCP servers** if needed
4. **Optimize steering file organization**

### Long Term (If Successful)

1. **Submit to Power Store** for official listing
2. **Deprecate npm package** if Power distribution is sufficient
3. **Focus on Power ecosystem** for future features

## Implementation Checklist

### Power Creation

- [ ] Create `POWER.md` with metadata and onboarding
- [ ] Organize steering files in `steering/` directory
- [ ] Update frontmatter for inclusion modes
- [ ] Test keyword activation
- [ ] Test steering file loading
- [ ] Verify slash commands work

### Build System

- [ ] Add power build target to `scripts/build.ts`
- [ ] Configure file mapping for power structure
- [ ] Apply substitutions to POWER.md
- [ ] Test local power installation
- [ ] Verify both npm and power builds work

### Distribution

- [ ] Create GitHub repository for power
- [ ] Write installation instructions
- [ ] Test installation from GitHub URL
- [ ] Test installation from local path
- [ ] Document both installation methods

### Documentation

- [ ] Update README with power installation
- [ ] Document keyword activation
- [ ] Explain steering file organization
- [ ] Provide examples of usage
- [ ] Document slash commands

## Example POWER.md Template

```markdown
---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "Advanced AI agent system with specialized agents, mode switching, and interactive workflows"
keywords: ["agent", "agents", "mode", "modes", "vibe", "spec", "strict", "workflow", "kiro-master"]
author: "Your Name"
---

# Kiro Agents & Modes System

## Overview

An advanced AI agent system for Kiro IDE that enhances development workflows with minimal cognitive overhead. Provides specialized agents, mode switching, strict mode, and interactive workflows.

## When to Use This Power

- Creating or managing specialized AI agents
- Switching between flexible (vibe) and structured (spec) workflows
- Need precision mode for critical development
- Want choice-based interactions with minimal cognitive load
- Building custom agents for specific tasks

## Features

### Agent System
Create and manage specialized AI agents with defined capabilities, custom protocols, and specific workflows.

**Commands:**
- `/agents` - Interactive agent management
- `/agent {name}` - Activate specific agent

### Mode System
Switch between interaction styles based on workflow needs.

**Modes:**
- **Vibe Mode**: Flexible, conversational development
- **Spec Mode**: Structured feature development with requirements, design, and tasks

**Commands:**
- `/modes` - Interactive mode management
- `/mode vibe` - Switch to vibe mode
- `/mode spec` - Switch to spec mode

### Strict Mode
Precision mode that blocks execution on ambiguous input and requires explicit clarification.

**Command:**
- `/strict on` - Enable strict mode
- `/strict off` - Disable strict mode

## Getting Started

### First Time Setup

1. **Explore Available Agents**
   ```
   /agents
   ```
   This opens the interactive agent management interface.

2. **Try a Mode**
   ```
   /mode vibe
   ```
   Start with flexible, conversational development.

3. **Create Your First Agent**
   Use `/agents` and select "Create new agent" to build a custom agent.

### Common Workflows

**For Quick Iterations:**
- Use vibe mode for flexible development
- Make changes directly when clear
- Iterate quickly on feedback

**For Complex Features:**
- Switch to spec mode for structured planning
- Follow requirements → design → tasks workflow
- Use approval gates between phases

**For Critical Development:**
- Enable strict mode to prevent assumptions
- Get explicit clarification on ambiguous input
- Ensure precision in implementation

## Steering Files

This power includes comprehensive guidance:

### Core System (Always Loaded)
- `agent-system.md` - Agent activation and management
- `modes-system.md` - Mode switching system

### Interaction Patterns (On Demand)
- `interactions/chit-chat.md` - Choice-based interactions
- `interactions/conversation-language.md` - Language guidelines
- `interactions/interaction-styles.md` - Interaction patterns

### Modes (On Demand)
- `modes/kiro-spec-mode.md` - Spec mode protocols
- `modes/kiro-vibe-mode.md` - Vibe mode protocols
- `strict-mode.md` - Strict mode rules

## Available Commands

### Agent Commands
- `/agents` - Interactive agent management
- `/agent {name}` - Activate specific agent

### Mode Commands
- `/modes` - Interactive mode management
- `/mode {name}` - Switch to specific mode
- `/strict {state}` - Control strict mode

## Examples

### Create a Custom Agent

```
/agents
[Select: Create new agent]
[Follow wizard prompts]
```

### Switch Modes Mid-Workflow

```
/mode vibe
[Explore and prototype]

/mode spec
[Formalize into structured plan]
```

### Use Strict Mode for Critical Code

```
/strict on
[Work on critical implementation]
/strict off
```

## Best Practices

1. **Choose Appropriate Mode**: Vibe for exploration, Spec for planning
2. **Use Agents for Specialization**: Create agents for specific domains
3. **Leverage Strict Mode**: Enable for experimental or critical work
4. **Combine Features**: Modes + Agents + Strict mode work together

## Troubleshooting

### Agent Not Activating
- Verify agent file exists in `.kiro/agents/`
- Check filename matches command (case-sensitive)
- Try `/agents` to see available agents

### Mode Not Switching
- Confirm mode files are loaded
- Check for conflicting steering documents
- Try `/modes` for interactive management

### Commands Not Appearing
- Verify power is installed correctly
- Check steering files have correct frontmatter
- Reload Kiro IDE

## Resources

- [Agent System Documentation](link)
- [Mode System Documentation](link)
- [Strict Mode Documentation](link)
- [GitHub Repository](link)

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation
- Ask in Kiro community

---

**Quick Reference:**
- `/agents` - Manage agents
- `/modes` - Switch modes
- `/agent {name}` - Activate agent
- `/mode {name}` - Switch mode
- `/strict {state}` - Control strict mode
```

## Next Steps

1. **Review this plan** and provide feedback
2. **Create POWER.md** based on template
3. **Reorganize steering files** into power structure
4. **Test locally** to verify functionality
5. **Publish to GitHub** for community access
6. **Iterate based on feedback**

## Questions to Discuss

1. Should we deprecate npm package or maintain both?
2. What keywords should trigger power activation?
3. Which steering files should be `always` vs `manual`?
4. Do we need MCP servers for additional functionality?
5. Should we submit to official Power Store immediately?
