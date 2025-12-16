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
1. Read `{{{WS_AGENTS_PATH}}}/{agent_name}.md` into context
2. Read #[[file:protocols/agent-activation.md]] into context
3. Follow all steps from the "Agent Activation Steps" section in agent-activation.md
4. Use `{agent_name}` as the agent identifier throughout the protocol
  </definition>
</alias>

This alias enables users to activate any agent with `/agents {name}` syntax.

## Protocol Loading Alias

The protocol loading command uses parameter substitution to dynamically load protocols from the kiro-protocols Power:

<alias>
  <trigger>/protocols {filename}</trigger>
  <definition>
## Load Protocol: {filename}

You are now loading the **{filename}** protocol from kiro-protocols Power.

**Execute protocol loading:**
1. **Only if {filename} from kiro-protocols is NOT already in context**: Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{filename}"
2. Follow all steps in the {filename} protocol from kiro-protocols
  </definition>
</alias>

This alias enables loading protocols on-demand with `/protocols {filename}` syntax without showing in Kiro UI slash commands.


{{{KIRO_MODE_ALIASES}}}
