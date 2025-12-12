---
name: "kiro-protocols"
displayName: "Kiro Protocols"
description: "Reusable protocol library for AI agents - Load step-by-step workflows on-demand for agent management, mode switching, and interactive patterns"
keywords: ["protocols", "workflows", "agents", "modes", "procedures", "instructions"]
author: "R. Beltran"
version: "1.0.0"
---

# Kiro Protocols

## Overview

A comprehensive library of reusable protocols (step-by-step workflows) that can be loaded on-demand by AI agents, steering documents, and other Kiro Powers. Each protocol provides detailed instructions for specific tasks like agent management, mode switching, and interactive patterns.

**What are Protocols?**

Protocols are detailed, step-by-step instruction documents that guide AI through complex workflows. Instead of embedding these instructions directly in every steering document, protocols are loaded dynamically only when needed, reducing context overhead and improving maintainability.

**Key Benefits:**
- **On-Demand Loading** - Protocols load only when needed, minimizing context
- **Single Source of Truth** - One protocol, many consumers
- **Reusable Across Powers** - Any power can reference these protocols
- **Maintainable** - Update once, affects all consumers
- **Extensible** - Easy to add new protocols

## Available Protocols

This power provides the following protocols as steering files:

### Agent System Protocols

- **agent-activation** - Protocol for activating and assuming agent roles
  - Loads agent definition
  - Applies agent protocols
  - Begins agent interaction

- **agent-management** - Interactive agent management workflow
  - Chit-chat mode interface
  - Agent directory scanning
  - Create, activate, manage, and view agents

- **agent-creation** - Step-by-step agent creation wizard
  - Gather agent information
  - Generate agent definition
  - Validate and finalize

### Mode System Protocols

- **mode-switching** - Protocol for switching between Kiro modes
  - Load mode definition
  - Preserve context
  - Handle workflow state transitions

- **mode-management** - Interactive mode management workflow
  - Mode selection interface
  - Mode comparison
  - Help and documentation

## How to Use Protocols

### Method 1: Direct Steering File Load (Recommended)

Use Kiro's built-in power tools to load protocols on-demand:

```markdown
**Load protocol:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
3. Follow all steps from the loaded protocol
```

**Example in steering document:**
```markdown
When user activates agent:
1. Load agent-activation protocol from kiro-protocols power
2. Execute protocol steps with agent name as parameter
3. Agent assumes role and begins interaction
```

### Method 2: Instruction Alias Pattern

Create reusable aliases that load protocols:

```markdown
<alias>
  <trigger>/protocol {protocol_name}</trigger>
  <definition>
## Load Protocol: {protocol_name}

**Execute protocol loading:**
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{protocol_name}.md"
3. Follow all steps from the loaded protocol
  </definition>
</alias>
```

### Method 3: Programmatic Reference

Reference protocols in your steering documents:

```markdown
**When creating new agent:**
- Load `agent-creation.md` protocol from kiro-protocols power
- Follow wizard steps to gather information
- Generate agent definition file
- Validate and offer activation
```

## Protocol Structure

Each protocol follows a consistent structure:

```markdown
# Protocol Name

Brief description of what this protocol does.

## Protocol Steps

### Step 1: [Action Name]

Detailed instructions for this step...

### Step 2: [Action Name]

Detailed instructions for this step...

[Additional steps...]

---

**Protocol complete. [Next action guidance]**
```

## Best Practices

### For Protocol Consumers

1. **Load on-demand** - Only load protocols when needed
2. **Follow steps sequentially** - Protocols are designed as ordered workflows
3. **Preserve context** - Protocols may reference previous steps
4. **Handle errors gracefully** - Protocols include error handling guidance

### For Protocol Authors

1. **Keep focused** - One protocol, one workflow
2. **Be explicit** - Clear, actionable steps
3. **Include examples** - Show expected inputs/outputs
4. **Document dependencies** - List required context or prerequisites
5. **Version carefully** - Breaking changes affect all consumers

## Creating Custom Protocols

Want to add your own protocols to this power?

1. **Fork the repository** - https://github.com/Theadd/kiro-agents
2. **Add protocol file** - Create `.md` file in `src/core/protocols/`
3. **Follow structure** - Use existing protocols as templates
4. **Build and test** - Run build script and test in Kiro IDE
5. **Submit PR** - Contribute back to the community

## Integration Examples

### Example 1: Agent System

```markdown
# agents.md (steering document)

When user types `/agents {name}`:
1. Load agent-activation protocol
2. Pass agent name as parameter
3. Execute protocol steps
4. Agent activates and assumes role
```

### Example 2: Mode System

```markdown
# modes.md (steering document)

When user types `/modes {mode}`:
1. Load mode-switching protocol
2. Pass mode name as parameter
3. Check for workflow state preservation
4. Execute mode switch
```

### Example 3: Custom Power

```markdown
# my-custom-power/steering/workflow.md

When complex workflow needed:
1. Load agent-management protocol from kiro-protocols
2. Use interactive chit-chat pattern
3. Guide user through multi-step process
4. Apply custom power logic
```

## Troubleshooting

### Protocol Not Found

**Problem:** Error loading protocol file

**Solutions:**
1. Verify kiro-protocols power is installed
2. Check protocol name spelling (case-sensitive)
3. Ensure protocol exists in available list above
4. Try reloading power: Kiro Powers panel → Reload

### Protocol Outdated

**Problem:** Protocol references old paths or commands

**Solutions:**
1. Update kiro-protocols power to latest version
2. Check GitHub releases for breaking changes
3. Review protocol changelog in repository

### Context Overflow

**Problem:** Too many protocols loaded at once

**Solutions:**
1. Load protocols only when needed (not upfront)
2. Use on-demand loading pattern
3. Consider splitting complex workflows
4. Unload unused protocols from context

## Version Compatibility

This power follows semantic versioning:

- **Major version** - Breaking changes to protocol structure
- **Minor version** - New protocols added
- **Patch version** - Bug fixes and clarifications

**Current Version:** 1.0.0

**Compatibility:**
- Kiro IDE: All versions with Powers support
- kiro-agents: v1.6.0+

## Contributing

Contributions welcome! See repository for guidelines:
- https://github.com/Theadd/kiro-agents

**Ways to contribute:**
1. Report issues with existing protocols
2. Suggest new protocols
3. Improve protocol documentation
4. Submit protocol enhancements

## License

MIT License - See repository for full license text

---

**Power:** kiro-protocols  
**Repository:** https://github.com/Theadd/kiro-agents  
**Version:** 1.0.0
