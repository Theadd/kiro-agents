# Mode Switching Protocol

This file contains the detailed instructions for switching Kiro modes. It is referenced by the `/modes {mode_name}` instruction alias.

## Mode Switch Steps

When switching to mode `{mode_name}`:

### Step 1: Load Mode Definition and Strict Mode

/only-read-protocols kiro-{mode_name}-mode.md

This enables `/strict {state}` command for this mode session. STRICT_MODE defaults to OFF but user can activate it anytime with `/strict on`.
/only-read-protocols strict-mode.md

This kiro-{mode_name}-mode.md file contains:
- Mode identity and purpose
- Interaction protocols
- Workflow patterns (if any)
- Response style guidelines
- Testing approaches
- File organization rules
- Integration points

### Step 2: Assume Mode Role

For this session, you are in **{mode_name} mode**.

You will:
- 
- Follow ALL protocols and instructions from the `kiro-{mode_name}-mode.md` file
- Apply mode-specific interaction patterns
- Use capabilities defined in the mode definition
- Maintain this mode until user switches modes or ends session
- Override any conflicting instructions with mode protocols

### Step 3: Preserve Context and Check State

**IMPORTANT:** Mode switching preserves:
- All file changes made in previous mode
- Conversation history and context
- Current working state
- User preferences and settings

**WARNING:** Mode switching does NOT preserve:
- Workflow state (e.g., which phase you're in)
- Approval gate status
- Phase-specific context

**If switching FROM spec mode:**
Before switching, display warning:
```
⚠️ Switching from Spec mode will reset workflow state.

Current Spec state:
- Phase: [current phase]
- Requirements: [approved/not approved]
- Design: [approved/not approved]
- Tasks: [approved/not approved]

If you return to Spec mode later, you'll need to re-approve documents.

Continue switching to {mode_name} mode? [Yes] [No, stay in Spec mode]
```

Wait for user confirmation before proceeding.

You are simply changing HOW you interact, not WHAT you're working on.

### Step 4: Begin Interaction

Start interaction according to **{mode_name} mode**'s protocols.

**If switching to spec mode:**
- Ask user what they want to work on
- Offer to create new spec or update existing
- Follow structured workflow (requirements → design → tasks)
- Use approval gates between phases

**If switching to vibe mode:**
- Continue with flexible, conversational interaction
- No formal workflow required
- Make changes directly when clear
- Iterate quickly on feedback

---

**You are now in {mode_name} mode. Begin interaction.**
