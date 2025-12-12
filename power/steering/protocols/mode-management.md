# Mode Management Protocol

This file contains the detailed instructions for interactive mode management. It is referenced when `/modes` is executed without parameters.

## Mode Management Steps

When entering mode management:

### Step 1: Load Chit-Chat Mode

Apply protocols from `chit-chat.md` steering document:
- Use diff blocks to show progress
- Provide numbered choice lists (4-6 options)
- Maintain single focus per message
- Use visual formatting (bold, code blocks, lists)

Begin with a diff block showing:
```diff
  👉 Mode management
  ⏳ Mode selection
```

### Step 2: Detect Available Modes

Scan agent-system directory for `kiro-*-mode.md` files:
- Extract mode names from filenames (remove `kiro-` prefix and `-mode.md` suffix)
- Read frontmatter for descriptions
- Identify current mode from context (if any)

**Available Kiro modes:**
- **vibe** - Flexible, conversational development assistance
- **spec** - Structured feature development with requirements, design, and tasks

### Step 3: Present Mode Selection

Use this response structure:

```diff
  👉 Mode management
  ⏳ Mode selection
```

**Current mode:** [current_mode or "none"]

**Available Kiro modes:**

- **vibe** - Flexible, conversational development assistance
- **spec** - Structured feature development with requirements, design, and tasks

**What would you like to do?**

1. **Switch to vibe mode** - Flexible development and quick iterations
2. **Switch to spec mode** - Structured feature planning and implementation
3. **View mode details** - See full mode capabilities and protocols
4. **Mode comparison** - Understand differences between modes
5. **Stay in current mode** - Continue with current mode
6. **Help** - Learn about mode system

### Step 4: Handle User Choice

Based on user selection:

#### Option 1 - Switch to vibe

- Execute `/modes vibe` command
- Load vibe mode protocols
- Begin flexible interaction

#### Option 2 - Switch to spec

- Execute `/modes spec` command
- Load spec mode protocols
- Begin structured workflow

#### Option 3 - View mode details

- Show numbered list of modes
- User selects mode to view
- Display full mode definition
- Explain capabilities and use cases
- Offer to switch to that mode

#### Option 4 - Mode comparison

- Show side-by-side comparison:
  - **Vibe Mode**: Flexible, conversational, quick iterations, no formal workflow
  - **Spec Mode**: Structured workflow with requirements → design → tasks, approval gates
- Explain when to use each mode:
  - Use vibe for: Quick fixes, exploration, prototyping, iterative development
  - Use spec for: Complex features, team collaboration, formal planning, documentation
- Highlight key differences:
  - Workflow: None vs. Structured phases
  - Approval: Direct changes vs. Approval gates
  - Documentation: Minimal vs. Comprehensive
- Help user choose appropriate mode

#### Option 5 - Stay in current mode

- Confirm staying in current mode
- Return to normal interaction
- Preserve current state

#### Option 6 - Help

Explain mode system:
- **What are modes?** - Different interaction styles for different workflows
- **How to switch?** - Use `/modes {name}` or `/modes` for interactive menu
- **Mode benefits:**
  - Vibe: Fast iteration, flexible approach
  - Spec: Structured planning, comprehensive documentation
- **Mode coordination:**
  - Modes can be combined with agents
  - File changes preserved when switching
  - Workflow state resets when switching
- **Usage examples:**
  - Quick bug fix → Use vibe mode
  - New feature with requirements → Use spec mode
  - Refactoring existing code → Use vibe mode
  - Team feature with documentation → Use spec mode

### Step 5: Maintain Chit-Chat Mode

Continue using diff blocks and numbered choices throughout mode management session.

After each action:
- Update diff block with progress
- Show current focus
- Provide next action choices
- Allow going back or canceling

**Context Preservation:**
- Use diff blocks to show progress
- Preserve user decisions
- Allow going back to previous step
- Enable canceling operations

---

**Mode management active. Present choices to user.**
