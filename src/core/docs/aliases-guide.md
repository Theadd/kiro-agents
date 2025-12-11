# Instruction Alias System - Complete Guide

Comprehensive documentation for creating custom commands using XML-based alias definitions with parameter substitution and literal response patterns.

## Table of Contents

1. [Overview](#overview)
2. [Parameter Substitution Pattern](#parameter-substitution-pattern)
3. [Literal Response Pattern](#literal-response-pattern)
4. [Combining Patterns](#combining-patterns)
5. [Best Practices](#best-practices)
6. [Common Use Cases](#common-use-cases)
7. [Troubleshooting](#troubleshooting)
8. [Integration](#integration)

## Overview

The Instruction Alias system allows you to create custom commands that:
- Accept parameters from user input
- Substitute parameters into instructions
- Output literal text without AI interpretation
- Trigger native IDE features (like mode switches)

Aliases are defined using XML structures in steering documents with `inclusion: always`.

## Parameter Substitution Pattern

### How It Works

When you define an alias with parameters in `{curly_braces}`, the system:
1. Extracts parameter names from the trigger
2. Matches user command pattern
3. Captures actual values from user input
4. Replaces placeholders in definition
5. Executes resulting instructions

### Syntax

```xml
<alias>
  <trigger>COMMAND {param1} {param2}</trigger>
  <definition>
    Instructions with {param1} and {param2} placeholders
  </definition>
</alias>
```

### Examples

**Simple greeting:**
```xml
<alias>
  <trigger>/greet {name}</trigger>
  <definition>Say hello to {name} enthusiastically!</definition>
</alias>
```

User types: `/greet Alice`
AI executes: "Say hello to Alice enthusiastically!"

**Agent activation:**
```xml
<alias>
  <trigger>/agent {agent_name}</trigger>
  <definition>Load and activate agent: {agent_name}</definition>
</alias>
```

User types: `/agent refactor-architect`
AI executes: "Load and activate agent: refactor-architect"

**Multi-parameter:**
```xml
<alias>
  <trigger>/create {type} {name}</trigger>
  <definition>Create a new {type} called {name}</definition>
</alias>
```

User types: `/create component Button`
AI executes: "Create a new component called Button"

## Literal Response Pattern

### Purpose

For aliases that must output exact text without AI interpretation. Critical for:
- Triggering native IDE mode keywords (spec, vibe)
- Outputting exact commands or configuration values
- Bypassing AI interpretation entirely

### Why It's Needed

Without explicit instructions, AI may:
- Add explanations or context
- Interpret the command instead of outputting it
- Provide options instead of executing

The literal pattern prevents this by being extremely explicit.

### Syntax

```xml
<alias>
  <trigger>command_trigger</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
literal_text_here
```
  </definition>
</alias>
```

### Critical Processing Rule

**When you encounter this pattern, output ONLY the content inside the code block. Do not add explanations, context, or any other text.**

### Examples

**Trigger Spec Mode:**
```xml
<alias>
  <trigger>/s</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
spec
```
  </definition>
</alias>
```

User types: `/s`
AI responds: `spec` (triggers Kiro's native spec mode)

**Trigger Vibe Mode:**
```xml
<alias>
  <trigger>/v</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
vibe
```
  </definition>
</alias>
```

User types: `/v`
AI responds: `vibe` (triggers Kiro's native vibe mode)

**Custom Shortcut:**
```xml
<alias>
  <trigger>wololo</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
spec
```
  </definition>
</alias>
```

User types: `wololo`
AI responds: `spec` (triggers Kiro's native spec mode)

**Output Shell Command:**
```xml
<alias>
  <trigger>/build</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
bun run build
```
  </definition>
</alias>
```

User types: `/build`
AI responds: `bun run build`

## Combining Patterns

You can combine parameter substitution with literal responses:

```xml
<alias>
  <trigger>/mode {mode_name}</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
{mode_name}
```
  </definition>
</alias>
```

User types: `/mode spec`
AI responds: `spec`

User types: `/mode vibe`
AI responds: `vibe`

## Best Practices

### For Literal Response Aliases

1. **Use explicit instructions** - "Respond directly... AS-IS" prevents interpretation
2. **Use code blocks** - Clearly delineate the literal content
3. **Keep it simple** - Literal responses should be short and exact
4. **Test thoroughly** - Verify AI outputs exactly what you expect
5. **Document purpose** - Explain why literal response is needed

### For Parameter Aliases

1. **Clear parameter names** - Use descriptive names like `{agent_name}`, not `{x}`
2. **Validate inputs** - Consider what happens with unexpected values
3. **Provide examples** - Show users how to use the command
4. **Handle edge cases** - What if parameter is empty or invalid?
5. **Keep definitions focused** - One clear purpose per alias

### General Guidelines

1. **Consistent naming** - Use `/command` format for slash commands
2. **Avoid conflicts** - Don't create aliases that clash with existing commands
3. **Document in context** - Add comments explaining complex aliases
4. **Test with users** - Verify aliases work as intended in real usage
5. **Iterate based on feedback** - Improve aliases based on actual use

## Common Use Cases

### Mode Switching Shortcuts

Create short aliases for frequently used modes:

```xml
<!-- Spec mode shortcut -->
<alias>
  <trigger>/s</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
spec
```
  </definition>
</alias>

<!-- Vibe mode shortcut -->
<alias>
  <trigger>/v</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
vibe
```
  </definition>
</alias>

<!-- Fun alternative -->
<alias>
  <trigger>wololo</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
spec
```
  </definition>
</alias>
```

### Agent Activation Shortcuts

Quick access to frequently used agents:

```xml
<!-- Kiro master shortcut -->
<alias>
  <trigger>/km</trigger>
  <definition>/agents {{{INITIAL_AGENT_NAME}}}</definition>
</alias>

<!-- Refactor architect shortcut -->
<alias>
  <trigger>/ra</trigger>
  <definition>/agents refactor-architect</definition>
</alias>
```

### Custom Workflows

Combine multiple commands into workflows:

```xml
<alias>
  <trigger>/start-feature {feature_name}</trigger>
  <definition>
1. Switch to spec mode
2. Create new spec for {feature_name}
3. Begin requirements gathering
  </definition>
</alias>

<alias>
  <trigger>/quick-fix {issue}</trigger>
  <definition>
1. Switch to vibe mode
2. Analyze {issue}
3. Propose quick solution
4. Implement if approved
  </definition>
</alias>
```

### Command Shortcuts

Simplify common commands:

```xml
<!-- Build shortcut -->
<alias>
  <trigger>/b</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
bun run build
```
  </definition>
</alias>

<!-- Test shortcut -->
<alias>
  <trigger>/t</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
bun run test
```
  </definition>
</alias>
```

## Troubleshooting

### Alias Not Triggering

**Problem:** User types command but nothing happens

**Possible causes:**
- Alias not in steering document with `inclusion: always`
- Trigger syntax doesn't match exactly (case-sensitive)
- Conflicting aliases with same trigger
- Steering document not loaded in context

**Solutions:**
1. Verify alias is in correct steering document
2. Check frontmatter has `inclusion: always`
3. Ensure trigger matches user input exactly
4. Look for conflicting aliases
5. Reload steering documents if needed

### AI Interpreting Instead of Literal Output

**Problem:** AI adds explanation instead of outputting exact text

**Possible causes:**
- Missing explicit "Respond directly... AS-IS" instruction
- Literal content not wrapped in code block
- Conflicting instructions in other steering documents
- AI not recognizing the pattern

**Solutions:**
1. Use exact literal response pattern syntax
2. Ensure code block wraps literal content
3. Make instructions more explicit
4. Test with simpler literal content first
5. Check for conflicting steering documents

### Parameter Not Substituting

**Problem:** `{param}` appears in output instead of actual value

**Possible causes:**
- Parameter name in trigger doesn't match definition
- User didn't provide value for parameter
- Incorrect parameter syntax (missing braces)
- Typo in parameter name

**Solutions:**
1. Verify parameter names match exactly
2. Check user provided all required parameters
3. Ensure curly braces syntax is correct
4. Test with simple single parameter first
5. Add validation for missing parameters

### Unexpected Behavior

**Problem:** Alias does something different than expected

**Possible causes:**
- Ambiguous instructions in definition
- Conflicting with other aliases or commands
- Parameter values causing unexpected behavior
- AI interpreting instructions differently

**Solutions:**
1. Make instructions more explicit and clear
2. Test with various parameter values
3. Check for conflicts with other aliases
4. Simplify definition to isolate issue
5. Add examples showing expected behavior

## Integration

### With Agent System

Aliases can activate agents:

```xml
<alias>
  <trigger>/agent {name}</trigger>
  <definition>Load and activate agent: {name}</definition>
</alias>
```

Agents can define their own aliases in their definition files.

### With Mode System

Aliases can trigger mode switches using literal response pattern:

```xml
<alias>
  <trigger>/mode {mode}</trigger>
  <definition>
Respond directly to the user with exactly and only the content of the following code block, AS-IS:
```
{mode}
```
  </definition>
</alias>
```

### With Strict Mode

Aliases are processed before strict mode validation. This means:
- Aliases work even when strict mode is ON
- Alias output can trigger strict mode validation
- Strict mode doesn't affect alias processing

### Creating Aliases in Different Contexts

**Global aliases** (always available):
- Place in steering document with `inclusion: always`
- Located in `.kiro/steering/` or `~/.kiro/steering/`

**Workspace aliases** (workspace-specific):
- Place in `.kiro/steering/` directory
- Only available in that workspace

**Agent-specific aliases** (when agent active):
- Define in agent's `.md` file
- Only available when that agent is active

**Mode-specific aliases** (when mode active):
- Define in mode's `.md` file
- Only available when that mode is active

## Advanced Patterns

### Conditional Aliases

Use parameters to create conditional behavior:

```xml
<alias>
  <trigger>/deploy {environment}</trigger>
  <definition>
Deploy to {environment} environment:
1. Verify {environment} configuration
2. Run tests for {environment}
3. Deploy to {environment}
4. Verify deployment in {environment}
  </definition>
</alias>
```

### Chained Aliases

Create aliases that trigger other aliases:

```xml
<alias>
  <trigger>/full-build</trigger>
  <definition>
1. /clean
2. /build
3. /test
4. /validate
  </definition>
</alias>
```

### Context-Aware Aliases

Use parameters to provide context:

```xml
<alias>
  <trigger>/fix {file} {issue}</trigger>
  <definition>
Fix {issue} in {file}:
1. Read {file}
2. Identify {issue}
3. Propose solution
4. Apply fix if approved
  </definition>
</alias>
```

## Notes

- Aliases are processed by AI, not by IDE natively
- Literal response pattern is critical for triggering native IDE features
- Parameter substitution happens before instruction execution
- Aliases can be defined in any steering document with `inclusion: always`
- Multiple aliases can have same trigger if in different contexts
- Test aliases thoroughly before relying on them in workflows

---

**For quick reference, see the compact version in `aliases.md` steering document.**
