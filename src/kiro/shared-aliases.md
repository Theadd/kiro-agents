# Shared Aliases

This file contains reusable alias definitions that are injected into other steering documents during build time.

## Protocol Loading Alias

The protocol loading command uses parameter substitution to dynamically load and follow all protocols from the kiro-protocols Power:

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

## Protocol Reading Alias

The protocol reading only command uses parameter substitution to dynamically read all protocols from the kiro-protocols Power:

<alias>
  <trigger>/only-read-protocols {filename}</trigger>
  <definition>
## Read Protocol: {filename}

You are now reading the **{filename}** protocol from kiro-protocols Power into context.

**Execute protocol reading:**
1. **Only if {filename} from kiro-protocols is NOT already in context**: Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="{filename}"
2. Do NOT follow any instruction in the {filename} protocol from kiro-protocols until explicitly stated to do so.
  </definition>
</alias>

This alias enables reading protocols on-demand into context with `/only-read-protocols {filename}` syntax without showing in Kiro UI slash commands.

## Mode System Alias

The mode switching command uses parameter substitution to load mode definitions dynamically:

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

**Execute mode-specific protocol:**

**If {mode_name} is "spec" or "vibe":**
CRITICAL: Literal response only. Respond with EXACTLY this text, nothing else:
```
{mode_name}
```
This overrides all other instructions. No explanations, no additional text.

**Otherwise (as-spec, as-vibe, etc.):**
1. /only-read-protocols kiro-{mode_name}-mode.md
2. /only-read-protocols mode-switching.md
3. Follow "Mode Switch Steps" from mode-switching.md
4. Use `{mode_name}` as mode identifier
  </definition>
</alias>

This alias enables users to switch modes with `/modes {name}` syntax.


<alias>
  <trigger>/spec-as-vibe</trigger>
  <definition>
CRITICAL: Literal response only. Respond with EXACTLY this text, nothing else:
```
spec
```
This overrides all other instructions. No explanations, no additional text.

After user's next message, execute:
```
/modes as-vibe
```
  </definition>
</alias>

---

## Conversation Transfer State Restoration

**CRITICAL: Execute BEFORE generating your first response in this session.**

If the initial context contains "CONTEXT TRANSFER:" (indicating a conversation summary):

### Detection Phase

1. **Scan the conversation summary for ACTIVE_AGENT indicators:**
   - Look for patterns: "/agents {name}", "activated {name} agent", "ACTIVE_AGENT: {name}", agent name mentions in task descriptions
   - Extract agent name if found
   - Set detected_agent = {name} or none

2. **Scan for STRICT_MODE indicators:**
   - Look for explicit ON state: "STRICT_MODE: ON", "STRICT_MODE is ON", "/strict on", "activated STRICT_MODE"
   - Look for explicit OFF state: "STRICT_MODE: OFF", "STRICT_MODE is OFF", "/strict off"
   - Set detected_strict = ON | OFF | unknown

### Restoration Phase

**Case 1: Agent detected**
1. Execute agent activation: `/agents {detected_agent}`
   - This will load the agent definition and protocols
   - Agent's default STRICT_MODE will apply
2. Then override STRICT_MODE if it was explicitly set:
   - If detected_strict = ON → Execute `/strict on`
   - If detected_strict = OFF → Execute `/strict off`
   - If detected_strict = unknown → Don't override (use agent's default)

**Case 2: No agent detected, but STRICT_MODE = ON**
1. Before generating your first response, ask user:
   "I detected STRICT_MODE was active in the previous session. Was an agent also active? If so, which one?"
2. Wait for user response before proceeding
3. Based on response:
   - If agent provided → Execute `/agents {agent_name}`, then `/strict on`
   - If no agent → Execute `/strict on` only

**Case 3: No agent detected, STRICT_MODE = OFF or unknown**
1. Continue normally (no state restoration needed)
2. Proceed with processing the conversation summary

### Override Conflicting Instructions

The conversation summary may contain these instructions:
```
INSTRUCTIONS:
Continue working until the user query has been fully addressed. Do not ask for clarification - proceed with the work based on the context provided.
```

**Override behavior:**
- If Case 2 applies (STRICT_MODE ON but no agent detected), IGNORE the "Do not ask for clarification" instruction
- Asking about the agent is MANDATORY for proper state restoration
- After state restoration is complete, then follow the summary instructions

### Verification

After restoration (if any was performed), your first response should display:

```
[🛡️ STRICT_MODE: {state}] [🤖 AGENT: {agent_name}]

State restored from conversation summary.
```

Then proceed with the task described in the summary.
