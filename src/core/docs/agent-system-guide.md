# Agent System - Complete Guide

Comprehensive documentation for the agent activation and management system in Kiro IDE.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Agent Activation](#agent-activation)
4. [Agent Management](#agent-management)
5. [Creating Agents](#creating-agents)
6. [Usage Examples](#usage-examples)
7. [Integration Patterns](#integration-patterns)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Advanced Topics](#advanced-topics)
11. [Future Enhancements](#future-enhancements)

## Overview

The Agent System provides specialized AI personas with defined capabilities and workflows. Agents are activated via instruction aliases and maintain their role throughout the session.

**Key Concepts:**
- **Agents** - Specialized AI personas defined in `{{{WS_AGENTS_PATH}}}/{name}.md` files
- **Activation** - Loading agent definition and assuming agent role
- **Management** - Interactive interface for viewing, creating, and managing agents
- **Coordination** - Multiple agents working together or handing off tasks

**Core Commands:**
- `/agents` - Interactive agent management
- `/agents {name}` - Activate specific agent directly

## Quick Start

### First Time Setup

1. **Install kiro-agents** (if not already installed)
   ```bash
   npx kiro-agents  # or via Kiro Powers panel
   ```

2. **View available agents**
   ```
   /agents
   ```

3. **Create your first agent** (if none exist)
   - Choose "Create new agent" from menu
   - Follow interactive wizard
   - Agent file created in `{{{WS_AGENTS_PATH}}}/`

4. **Activate an agent**
   ```
   /agents {{{INITIAL_AGENT_NAME}}}
   ```

### Common Workflows

**Exploration workflow:**
```
/agents                    # See what's available
[Choose agent from list]   # Interactive selection
[Work with agent]          # Agent maintains role
```

**Direct activation workflow:**
```
/agents refactor-architect  # Activate directly
[Work with agent]           # Agent maintains role
/agents {{{INITIAL_AGENT_NAME}}}         # Switch to different agent
```

## Agent Activation

### Activation Process

When you execute `/agents {name}`, the system:

1. **Discovers agent file**
   - Checks `{{{WS_AGENTS_PATH}}}/{name}.md` exists
   - Shows error if missing, suggests `/agents` command

2. **Loads agent definition**
   - Reads `{{{WS_AGENTS_PATH}}}/{name}.md` into context
   - Loads `strict-mode.md` (enables `/strict` commands)
   - Parses frontmatter metadata
   - Understands agent capabilities and workflows
   - Identifies mandatory protocols
   - Notes interaction patterns
   - Checks integration requirements

3. **Applies protocols**
   - Follows all mandatory protocols from definition
   - Loads required steering documents
   - Applies agent-specific overrides
   - Sets up agent context

4. **Assumes role**
   - Becomes the agent completely
   - Maintains role until user switches agents
   - Applies agent personality and style
   - Uses agent-specific tools and workflows

5. **Begins interaction**
   - Starts according to agent's interaction protocol
   - Uses agent's response structure
   - Applies agent's formatting rules
   - Maintains agent's focus and priorities

### What Happens During Activation

**Context Loading:**
- Agent definition file (`{{{WS_AGENTS_PATH}}}/{name}.md`)
- Strict mode steering (`strict-mode.md`)
- Agent activation protocol (`protocols/agent-activation.md`)
- Any additional steering documents specified by agent

**State Changes:**
- Previous agent context suspended (if any)
- New agent context activated
- Agent-specific protocols take priority
- File changes and conversation history preserved

**Agent Behavior:**
- Follows agent's mandatory protocols
- Uses agent's interaction style
- Applies agent's response formatting
- Maintains agent's focus areas

## Agent Management

### Interactive Management

When you execute `/agents` (without parameters), the system:

1. **Loads chit-chat protocol**
   - Loads `chit-chat.md` from kiro-protocols Power
   - Uses diff blocks for progress tracking
   - Provides numbered choices
   - Maintains single focus per message

2. **Scans agents directory**
   - Lists all `.md` files in `{{{WS_AGENTS_PATH}}}/`
   - Excludes `.instructions.md` files
   - Extracts agent metadata from frontmatter
   - Categorizes agents by type (if specified)

3. **Presents choices**
   - Shows available agents with descriptions
   - Offers management operations (create, edit, delete)
   - Provides help and documentation links
   - Allows exit to normal mode

4. **Handles operations**
   - **Agent activation** → Executes `/agents {name}`
   - **Agent creation** → Starts creation wizard
   - **Agent management** → Modifies agent files
   - **Agent viewing** → Displays agent details
   - **Help** → Explains agent system
   - **Exit** → Returns to normal mode

5. **Maintains context**
   - Uses diff blocks to show progress
   - Preserves user decisions
   - Allows going back to previous step
   - Enables canceling operations

### Management Operations

**View Agents:**
- Lists all available agents
- Shows agent descriptions
- Displays agent metadata
- Indicates current agent (if any)

**Create Agent:**
- Interactive wizard guides through setup
- Prompts for agent name, description, capabilities
- Generates agent definition file
- Offers immediate activation

**Edit Agent:**
- Opens agent definition file
- Allows modifying capabilities, protocols
- Validates changes
- Reloads agent if currently active

**Delete Agent:**
- Confirms deletion
- Removes agent file
- Deactivates if currently active
- Cannot delete last agent

## Creating Agents

### Agent Definition Structure

Agents are defined in `{{{WS_AGENTS_PATH}}}/{name}.md` files with this structure:

```markdown
---
name: agent-name
type: specialist|generalist|coordinator
description: Brief description of agent purpose
version: 1.0.0
---

# Agent Name

Brief overview of agent purpose and capabilities.

## Core Responsibilities

- Primary responsibility 1
- Primary responsibility 2
- Primary responsibility 3

## Capabilities

Detailed list of what this agent can do:

1. **Capability Category 1**
   - Specific capability A
   - Specific capability B

2. **Capability Category 2**
   - Specific capability C
   - Specific capability D

## Interaction Protocol

How this agent responds to user input:

- Response style (formal, casual, technical)
- Formatting preferences (code blocks, lists, tables)
- Confirmation requirements (always, never, when risky)
- Error handling approach

## Mandatory Protocols

Rules this agent MUST follow:

1. **Protocol 1** - Description and rationale
2. **Protocol 2** - Description and rationale
3. **Protocol 3** - Description and rationale

## Workflows

Step-by-step processes for common tasks:

### Workflow 1: Task Name

1. Step 1 description
2. Step 2 description
3. Step 3 description

### Workflow 2: Task Name

1. Step 1 description
2. Step 2 description
3. Step 3 description

## Examples

Interaction patterns showing agent in action:

### Example 1: Scenario Name

**User:** Example user input
**Agent:** Example agent response

### Example 2: Scenario Name

**User:** Example user input
**Agent:** Example agent response

## Integration Points

### Required Steering Documents
- `steering-name.md` - Always loaded when agent active
- `another-steering.md` - Core rules for agent behavior

### Optional Steering Documents
- `conditional-steering.md` - Loaded based on file context
- `manual-steering.md` - Loaded when explicitly needed

## Conflict Priorities

When conflicts arise, this agent prioritizes:

1. User safety and data integrity
2. Agent mandatory protocols
3. Project-specific requirements
4. Performance and efficiency
5. Code style and conventions

## Best Practices

- Best practice 1 for using this agent
- Best practice 2 for using this agent
- Best practice 3 for using this agent

## Advanced Features

- Advanced feature 1 description
- Advanced feature 2 description
- Advanced feature 3 description

## Error Handling

How this agent handles errors:

- **Syntax errors** - Approach description
- **Logic errors** - Approach description
- **Ambiguous input** - Approach description

## Success Metrics

How to measure this agent's effectiveness:

- Metric 1 description
- Metric 2 description
- Metric 3 description
```

### Required Sections

Every agent MUST have:

- **Frontmatter** - Name, type, description, version
- **Core Responsibilities** - Primary focus areas
- **Capabilities** - Detailed list of what agent can do
- **Interaction Protocol** - How agent responds
- **Mandatory Protocols** - Rules agent must follow
- **Workflows** - Step-by-step processes
- **Examples** - Interaction patterns

### Recommended Sections

Agents SHOULD have:

- **Integration Points** - Required/optional steering documents
- **Conflict Priorities** - Ordered priority list
- **Best Practices** - Usage recommendations
- **Advanced Features** - Optional capabilities
- **Error Handling** - Error response strategies
- **Success Metrics** - Effectiveness measures

### Agent Types

**Specialist:**
- Focused on specific domain (e.g., refactoring, testing)
- Deep expertise in narrow area
- Clear boundaries of responsibility

**Generalist:**
- Broad capabilities across domains
- Flexible and adaptable
- Good for exploration and discovery

**Coordinator:**
- Manages other agents
- Orchestrates complex workflows
- Handles agent handoffs

## Usage Examples

### Example 1: Activate Specific Agent

```
/agents refactor-architect
```

**What happens:**
1. System loads `{{{WS_AGENTS_PATH}}}/refactor-architect.md`
2. System loads `protocols/agent-activation.md`
3. AI assumes refactor-architect role
4. AI applies refactor-architect protocols
5. AI begins interaction in refactor-architect style

**Result:** AI is now refactor-architect, focused on code refactoring tasks with specialized workflows and protocols.

### Example 2: Interactive Agent Management

```
/agents
```

**What happens:**
1. Chit-chat protocol loads
2. System scans `{{{WS_AGENTS_PATH}}}/` directory
3. AI presents numbered list of available agents
4. AI offers management operations
5. User selects option via number

**Result:** Interactive menu with options to view, create, activate, or manage agents.

### Example 3: Switch Between Agents

```
/agents {{{INITIAL_AGENT_NAME}}}
```

**What happens:**
1. Current agent context suspended (e.g., refactor-architect)
2. System loads `{{{WS_AGENTS_PATH}}}/{{{INITIAL_AGENT_NAME}}}.md`
3. AI assumes {{{INITIAL_AGENT_NAME}}} role
4. File changes and history preserved
5. Workflow state reset

**Result:** Now in {{{INITIAL_AGENT_NAME}}} agent, previous agent suspended but can be reactivated later.

### Example 4: Create New Agent

```
/agents
[Choose option 2: Create new agent]
[Follow wizard prompts]
```

**What happens:**
1. Interactive wizard activates
2. AI prompts for agent name
3. AI prompts for agent description
4. AI prompts for agent capabilities
5. AI generates agent definition file
6. AI offers immediate activation

**Result:** New agent created in `{{{WS_AGENTS_PATH}}}/{name}.md`, ready to activate.

## Integration Patterns

### With Steering Documents

Agents can load additional steering documents:

```markdown
## Integration Points

### Required Steering Documents
- `code-style.md` - Always loaded when agent active
- `project-conventions.md` - Core rules for agent behavior

### Optional Steering Documents
- `performance-guidelines.md` - Loaded for performance tasks
- `security-checklist.md` - Loaded for security reviews
```

**Loading behavior:**
- Required documents loaded automatically on activation
- Optional documents loaded based on context or explicit request
- Documents remain loaded until agent deactivated

### With Chit-Chat Protocol

Agents can use chit-chat interaction patterns:

```markdown
## Interaction Protocol

This agent uses chit-chat protocol for all interactions:

- Begin with diff block showing current state
- Provide numbered choice list (4-6 options, up to 16 if needed)
- Maintain single focus per message
- Use visual formatting (bold, code blocks)
```

**Benefits:**
- Reduced cognitive load for users
- Clear progress tracking
- Easy navigation through workflows
- Consistent interaction patterns

### With Mode System

Agents work seamlessly with modes:

```
/modes spec              # Switch to spec mode
/agents {{{INITIAL_AGENT_NAME}}}      # Activate {{{INITIAL_AGENT_NAME}}} agent
```

**Behavior:**
- Agent inherits mode protocols
- Agent works within mode workflows
- Mode defines HOW, agent defines WHAT
- Both contexts active simultaneously

**Example combinations:**
- **Spec mode + {{{INITIAL_AGENT_NAME}}}** - Structured feature planning with Kiro expertise
- **Vibe mode + refactor-architect** - Flexible refactoring exploration
- **Spec mode + test-specialist** - Structured test planning

### With Strict Mode

Agents can enable strict mode:

```markdown
## Mandatory Protocols

1. **Strict Mode Required** - This agent always operates in strict mode
   - Blocks execution on ambiguous input
   - Requires explicit clarification
   - Prevents assumption propagation
```

**Activation:**
- Agent definition can require strict mode
- User can enable/disable with `/strict on|off`
- Strict mode persists across agent switches

### Agent Coordination

**Handoff Pattern:**
```markdown
## Workflows

### Handoff to Another Agent

When task requires different expertise:

1. Summarize current state and progress
2. Identify which agent is better suited
3. Suggest handoff to user
4. If approved, execute `/agents {other-agent}`
5. Provide context to new agent
```

**Collaboration Pattern:**
```markdown
## Workflows

### Collaborate with Another Agent

When task requires multiple perspectives:

1. Complete agent's portion of work
2. Document findings and decisions
3. Suggest activating complementary agent
4. User switches agents as needed
5. Agents share context via documentation
```

## Best Practices

### For Agent Users

**Discovery and Selection:**
1. **Use `/agents` for discovery** - See what agents are available before choosing
2. **Read agent descriptions** - Understand agent capabilities and focus areas
3. **Match agent to task** - Choose agent whose expertise aligns with your needs
4. **Try different agents** - Experiment to find best fit for different tasks

**Working with Agents:**
1. **Let agents maintain focus** - Don't switch agents mid-task unless necessary
2. **Provide clear context** - Help agents understand your specific needs
3. **Follow agent workflows** - Trust agent's structured processes
4. **Use agent capabilities** - Leverage agent-specific tools and expertise
5. **Give feedback** - Help improve agent definitions based on experience

**Agent Switching:**
1. **Complete current task** - Finish or reach good stopping point before switching
2. **Document state** - Note progress and decisions before switching
3. **Understand context loss** - Workflow state resets, file changes preserved
4. **Plan handoffs** - Think about which agent is best for next phase

### For Agent Creators

**Agent Definition:**
1. **Clear agent definition** - Comprehensive `.md` with all capabilities and protocols
2. **Focused scope** - Define clear boundaries of agent responsibility
3. **Explicit protocols** - Clear mandatory protocols section with rationale
4. **Good examples** - Show agent in action with realistic scenarios
5. **Integration rules** - Specify required steering documents and dependencies

**Interaction Design:**
1. **Consistent interaction** - Follow established patterns (chit-chat protocol, etc.)
2. **Clear formatting** - Use visual hierarchy and formatting consistently
3. **Helpful errors** - Provide actionable error messages and suggestions
4. **Progressive disclosure** - Start simple, reveal complexity as needed
5. **User control** - Always confirm before making changes

**Testing and Iteration:**
1. **Test thoroughly** - Verify agent activates and functions correctly
2. **Real-world scenarios** - Test with actual use cases, not just examples
3. **Edge cases** - Test error handling and ambiguous situations
4. **User feedback** - Gather feedback from actual users
5. **Iterate based on use** - Improve agent based on real usage patterns

### For Agent Development

**Starting Out:**
1. **Start with template** - Use existing agents as reference
2. **Copy and modify** - Easier than starting from scratch
3. **Keep it simple** - Don't overcomplicate initial version
4. **Focus on core** - Get basic functionality working first
5. **Expand gradually** - Add advanced features after core is solid

**Maintenance:**
1. **Version your agents** - Track changes with version numbers
2. **Document changes** - Keep changelog of agent modifications
3. **Backward compatibility** - Consider impact of changes on existing workflows
4. **Test after changes** - Verify agent still works after modifications
5. **Archive old versions** - Keep backups before major changes

**Collaboration:**
1. **Share agents** - Make useful agents available to team
2. **Document well** - Clear descriptions help others understand agent
3. **Accept feedback** - Others may have valuable insights
4. **Contribute improvements** - Help improve shared agents
5. **Build on others** - Learn from existing agent patterns

## Troubleshooting

### Agent Not Activating

**Problem:** `/agents {name}` doesn't work

**Symptoms:**
- Error message about missing file
- No response from command
- Agent doesn't load

**Possible Causes:**
- Agent file doesn't exist in `{{{WS_AGENTS_PATH}}}/`
- Filename doesn't match command (case-sensitive)
- Agent file is malformed or missing required sections
- Steering documents not loaded properly

**Solutions:**
1. **Check file exists:**
   ```
   # List agents directory
   ls {{{WS_AGENTS_PATH}}}/
   ```

2. **Verify filename matches:**
   - Command: `/agents refactor-architect`
   - File: `{{{WS_AGENTS_PATH}}}/refactor-architect.md`
   - Must match exactly (case-sensitive)

3. **Check file structure:**
   - Has YAML frontmatter with `---` delimiters
   - Contains all required sections
   - No syntax errors in markdown

4. **Try interactive mode:**
   ```
   /agents
   ```
   - See if agent appears in list
   - Check agent description
   - Try activating from menu

5. **Reload steering documents:**
   - Restart Kiro IDE
   - Or reload workspace
   - Verify `agent-system.md` is loaded

### Agent Behaving Incorrectly

**Problem:** Agent doesn't follow expected protocols

**Symptoms:**
- Agent ignores mandatory protocols
- Agent uses wrong interaction style
- Agent doesn't apply workflows correctly
- Agent conflicts with other steering

**Possible Causes:**
- Mandatory protocols not clear enough
- Conflicting steering documents
- Agent definition ambiguous
- Missing integration points

**Solutions:**
1. **Review mandatory protocols:**
   - Are they explicit and unambiguous?
   - Do they have clear rationale?
   - Are they prioritized correctly?

2. **Check for conflicts:**
   - Review other loaded steering documents
   - Look for contradictory instructions
   - Check conflict priorities section

3. **Clarify agent definition:**
   - Make protocols more explicit
   - Add examples showing correct behavior
   - Specify what NOT to do

4. **Test in isolation:**
   - Deactivate other steering documents
   - Test agent alone
   - Identify conflicting instructions

5. **Add integration rules:**
   - Specify how agent works with other steering
   - Define conflict resolution priorities
   - Document expected interactions

### Agent Management Not Working

**Problem:** `/agents` command doesn't activate

**Symptoms:**
- No response from command
- Interactive menu doesn't appear
- Error messages

**Possible Causes:**
- `agent-system.md` not in steering directory
- Missing `inclusion: always` in frontmatter
- `chit-chat.md` not available in kiro-protocols Power
- Steering documents not loaded

**Solutions:**
1. **Verify agent-system.md location:**
   - Should be in `.kiro/steering/` or `~/.kiro/steering/`
   - Check file exists and is readable

2. **Check frontmatter:**
   ```yaml
   ---
   inclusion: always
   description: Agent system description
   ---
   ```

3. **Verify chit-chat.md exists in kiro-protocols Power:**
   - Required for interactive management
   - Should be in kiro-protocols Power steering directory
   - Check file is valid markdown

4. **Reload steering documents:**
   - Restart Kiro IDE
   - Or reload workspace
   - Check Kiro's steering document list

5. **Check Kiro logs:**
   - Look for errors loading steering documents
   - Check for syntax errors
   - Verify file permissions

### Agent Creation Fails

**Problem:** Creating new agent doesn't work

**Symptoms:**
- Wizard doesn't complete
- Agent file not created
- Errors during creation

**Possible Causes:**
- `{{{WS_AGENTS_PATH}}}/` directory doesn't exist
- Permission issues
- Invalid agent name
- File already exists

**Solutions:**
1. **Create agents directory:**
   ```bash
   mkdir -p {{{WS_AGENTS_PATH}}}
   ```

2. **Check permissions:**
   - Verify write access to `{{{WS_AGENTS_PATH}}}/`
   - Check file system permissions

3. **Use valid agent name:**
   - Lowercase with hyphens (e.g., `my-agent`)
   - No spaces or special characters
   - Not empty or too long

4. **Check for existing file:**
   - Agent name must be unique
   - Delete or rename existing agent first

5. **Try manual creation:**
   - Create file manually in `{{{WS_AGENTS_PATH}}}/`
   - Copy template from existing agent
   - Modify as needed

## Advanced Topics

### Agent Parameters

**Future feature** - Pass parameters to agents:

```
/agents refactor-architect --mode=strict --focus=performance
```

**Potential uses:**
- Configure agent behavior
- Set agent focus areas
- Enable/disable features
- Adjust verbosity level

### Agent Chaining

**Future feature** - Chain multiple agents:

```
/agents {{{INITIAL_AGENT_NAME}}} then refactor-architect
```

**Potential uses:**
- Sequential workflows
- Automatic handoffs
- Multi-agent collaboration
- Complex task decomposition

### Agent Templates

**Future feature** - Quick agent creation from templates:

```
/agents create --template=specialist --name=my-agent
```

**Potential templates:**
- Specialist agent template
- Generalist agent template
- Coordinator agent template
- Custom templates

### Agent Marketplace

**Future feature** - Share agents with community:

```
/agents install community/refactor-expert
/agents publish my-agent
```

**Potential features:**
- Browse community agents
- Install agents from marketplace
- Publish your agents
- Rate and review agents

### Agent Versioning

**Future feature** - Track agent changes:

```
/agents version refactor-architect
/agents rollback refactor-architect 1.0.0
```

**Potential features:**
- Version history
- Rollback to previous version
- Compare versions
- Migration guides

### Agent Testing

**Future feature** - Automated agent validation:

```
/agents test refactor-architect
```

**Potential tests:**
- Activation test
- Protocol compliance test
- Workflow execution test
- Integration test

## Future Enhancements

### Agent Enhancements

**Agent parameters:**
- Pass configuration to agents
- Customize agent behavior per session
- Enable/disable features dynamically

**Agent chaining:**
- Sequential agent execution
- Automatic handoffs between agents
- Multi-agent workflows

**Agent templates:**
- Quick agent creation from templates
- Predefined agent patterns
- Customizable templates

**Agent marketplace:**
- Share agents with community
- Install community agents
- Rate and review agents

**Agent versioning:**
- Track agent changes over time
- Rollback to previous versions
- Migration between versions

**Agent testing:**
- Automated agent validation
- Protocol compliance testing
- Integration testing

### Integration Enhancements

**Task sessions:**
- Agents create sub-tasks with own context
- Nested agent activation
- Task-specific state management

**Session continuation:**
- Resume interrupted work with full context
- Persistent agent state
- Workflow checkpoints

**Enhanced mode integration:**
- Better coordination with modes system
- Mode-specific agent behaviors
- Automatic mode switching

**Cross-agent communication:**
- Agents share information
- Collaborative problem solving
- Distributed workflows

## Notes

**System Status:**
- This is a **prototype** system
- Kiro doesn't natively support agents
- Commands implemented via Instruction Alias pattern
- Relies on AI understanding and following instructions

**Limitations:**
- May need iteration based on actual usage
- Agent behavior depends on AI interpretation
- No native IDE integration
- Limited state persistence

**Future:**
- Consider proposing as Kiro feature request
- Potential for native IDE support
- Enhanced agent capabilities
- Better integration with Kiro ecosystem

---

**For quick reference, see the compact version in `agent-system.md` steering document.**
