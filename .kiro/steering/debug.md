---
inclusion: manual
description: "Debug mode for kiro-agents development - shows detailed tool execution information on errors without altering AI behavior"
keywords: ["debug", "development", "testing"]
---

# Debug Mode System

Development mode for kiro-agents workspace. Shows detailed tool execution information when errors occur, without altering normal AI behavior.

## State Variable

```
DEBUG_MODE: OFF | ON (default: OFF)
```

## Response Protocol (MANDATORY - CHECK EVERY RESPONSE)

At the **START of every response**, display status flag:

`[🐾 DEBUG_MODE: ON]` or `[🐾 DEBUG_MODE: OFF]`

This ensures user awareness of current mode state.

## Debug Rules (APPLY WHEN DEBUG_MODE = ON)

### 1. MANDATORY ERROR REPORTING

For **EVERY** tool execution that:
- Returns an error
- Produces unsatisfactory results
- Fails to find expected files/data
- Returns unexpected output

**Immediately output** a debug block with this structure:

````markdown
## 🐾 DEBUG: Tool Execution Details

**Tool Used**: `toolName`

**Input Parameters** (AS-IS):
```json
{
  "parameter1": "value1",
  "parameter2": "value2"
}
```

**Output/Error Returned**:
```
[Exact output or error message from tool]
```

**System Suggestions** (if any):
```
[Any suggestions or alternatives provided by the system/tool]
```
````

**CRITICAL**: After showing debug block, **CONTINUE with normal behavior** as if DEBUG_MODE was OFF. Do NOT alter your response or actions based on DEBUG_MODE being active.

### 2. IGNORE SOURCE FILES AND BUILD ARTIFACTS IN KIRO-AGENTS WORKSPACE

When working in kiro-agents development workspace:

**IGNORE these paths** (unless other instructions explicitly say otherwise):
- `build/` directory and all contents
- `power/` directory and all contents
- `src/` directory for source files
- Root level config files
- Any compiled/generated artifacts

**USE these paths** (the actual files being tested):
- `.kiro/` directory for workspace files
- `~/.kiro/` directory for user global files

**Rationale**: Build artifacts and source files are not meant to be used within kiro-agents development workspace. User is testing the dev build live generated from watching changes to source files.

### 3. SEAMLESS INTEGRATION

DEBUG_MODE provides **information only**, it does NOT:
- ❌ Change AI behavior or decisions
- ❌ Block execution or require user input
- ❌ Alter response structure or content
- ❌ Modify tool selection or usage
- ❌ Affect other instructions, rules, or protocols

DEBUG_MODE only adds debug blocks after tool errors, then continues normally.

## Activation Commands

### Direct State Change

**Usage**: `/debug on` or `/debug off`

Set DEBUG_MODE = {state}

State changed. Response Protocol now applies.

### Interactive Control

**Usage**: `/debug` (no parameters)

Display interactive menu:

```markdown
# Debug Mode Control

**Current State**: DEBUG_MODE = ${current_state}

Debug mode shows detailed tool execution information when errors occur, without altering AI behavior.

**What would you like to do?**

1. **🟢 Enable Debug Mode** - Show detailed tool error information
2. **🔴 Disable Debug Mode** - Return to normal error handling
3. **ℹ️ Learn More** - Understand debug mode features
4. **📊 Check Current State** - Show current configuration
```

## Use Cases

**When to Activate**:
- Working on kiro-agents codebase
- Testing build pipeline behavior
- Investigating tool execution issues
- Debugging path resolution problems

**When Standard Mode is Fine**:
- Using kiro-agents as end user
- Working on other projects
- Stable operations

---

**Debug mode control ready. Use `/debug` or `/debug {state}` to control.**
