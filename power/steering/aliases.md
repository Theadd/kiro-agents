---
inclusion: always
description: Instruction alias system for creating custom commands with parameter substitution and literal responses
---

# Instruction Alias System

System for creating custom commands using XML-based alias definitions with parameter support and literal response patterns.

**For complete documentation, examples, and troubleshooting, see `docs/aliases-guide.md`**

## Parameter Substitution

When processing instructions, if you encounter an XML structure `<alias>` with variables in `{curly_braces}`:

```xml
<alias>
  <trigger>COMMAND {param1} {param2}</trigger>
  <definition>
    Instructions with {param1} and {param2} placeholders
  </definition>
</alias>
```

**Processing steps:**
1. **Extract parameter names** from `<trigger>` (e.g., `{param1}`, `{param2}`)
2. **Match user command** - When user types matching command pattern
3. **Extract parameter values** - Capture actual values from user input
4. **Replace placeholders** - Substitute all `{param}` in `<definition>` with actual values
5. **Execute instructions** - Run resulting instructions immediately

### Example

**Alias definition:**
```xml
<alias>
  <trigger>/greet {name}</trigger>
  <definition>Say hello to {name} enthusiastically!</definition>
</alias>
```

User types: `/greet Alice` → Executes: "Say hello to Alice enthusiastically!"

## Literal Response Pattern

For outputting exact text without AI interpretation (e.g., triggering native IDE modes):

````xml
<alias>
  <trigger>command</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
literal_text
```
  </definition>
</alias>
````

**CRITICAL:** When you see this pattern, output ONLY the code block content. No explanations, no context, no other text.

### Example

**Alias definition:**
````xml
<alias>
  <trigger>/spec</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
spec
```
  </definition>
</alias>
````

User types: `/spec` → AI responds: `spec`

## Agent System Alias

The agent activation command uses parameter substitution to load agent definitions dynamically:

<alias>
  <trigger>/agents {agent_name}</trigger>
  <definition>
## Agent Activation: {agent_name}

You are now activating the **{agent_name}** agent.

**Load and execute activation protocol:**
1. Read `.kiro/agents/{agent_name}.md` into context
2. Read #[[file:protocols/agent-activation.md]] into context
3. Follow all steps from the "Agent Activation Steps" section in agent-activation.md
4. Use `{agent_name}` as the agent identifier throughout the protocol
  </definition>
</alias>

This alias enables users to activate any agent with `/agents {name}` syntax.

## Mode System Alias

The mode switching command uses parameter substitution to load mode definitions dynamically:

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

**Load and execute mode switching protocol:**
1. Read `kiro-{mode_name}-mode.md` from agent-system directory into context
2. Read #[[file:protocols/mode-switching.md]] into context
3. Follow all steps from the "Mode Switch Steps" section in mode-switching.md
4. Use `{mode_name}` as the mode identifier throughout the protocol
  </definition>
</alias>

This alias enables users to switch modes with `/modes {name}` syntax.
