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

### Step 2: Present Mode Selection

Use this response structure:

```diff
  👉 Mode management
  ⏳ Mode selection
```

**Current mode:** [current_mode or "none"]

**Available Kiro modes:**

- **vibe** - Flexible, conversational development assistance (with vibe tools)
- **spec** - Structured feature development with requirements, design, and tasks (with spec tools)
- **as-vibe** - Vibe interaction style (keeps current tools)
- **as-spec** - Spec interaction style (keeps current tools)

**What would you like to do?**

1. **Switch to vibe mode** - Flexible development with vibe tools
2. **Switch to spec mode** - Structured development with spec tools
3. **Switch to as-vibe mode** - Vibe interaction style (keeps current tools)
4. **Switch to as-spec mode** - Spec interaction style (keeps current tools)
5. **Switch to spec-as-vibe mode** - Spec tools with vibe interaction style
6. **View mode details** - See full mode capabilities and protocols
7. **Mode comparison** - Understand differences between modes
8. **Stay in current mode** - Continue with current mode
9. **Help** - Learn about mode system

### Step 3: Handle User Choice

Based on user selection:

#### Option 1 - Switch to vibe

- Execute `/modes vibe` command
- Load vibe mode protocols
- Begin flexible interaction with vibe tools

#### Option 2 - Switch to spec

- Execute `/modes spec` command
- Load spec mode protocols
- Begin structured workflow with spec tools

#### Option 3 - Switch to as-vibe

- Execute `/modes as-vibe` command
- Load as-vibe mode protocols
- Begin flexible interaction (keeps current tools)

#### Option 4 - Switch to as-spec

- Execute `/modes as-spec` command
- Load as-spec mode protocols
- Begin structured interaction (keeps current tools)

#### Option 5 - Switch to spec-as-vibe

- Execute `/spec-as-vibe` command
- Load spec tools with vibe interaction style
- Begin flexible interaction with spec capabilities

#### Option 6 - View mode details

- Show numbered list of modes
- User selects mode to view
- Display full mode definition
- Explain capabilities and use cases
- Offer to switch to that mode

#### Option 7 - Mode comparison

- Show comprehensive comparison:
  - **Vibe Mode**: Flexible, conversational, quick iterations, no formal workflow (with vibe tools)
  - **Spec Mode**: Structured workflow with requirements → design → tasks, approval gates (with spec tools)
  - **As-Vibe Mode**: Flexible interaction style but keeps current tools
  - **As-Spec Mode**: Structured interaction style but keeps current tools
- Explain when to use each mode:
  - Use vibe for: Quick fixes, exploration, prototyping, iterative development (need vibe tools)
  - Use spec for: Complex features, team collaboration, formal planning, documentation (need spec tools)
  - Use as-vibe for: Flexible interaction with current tools (agent superpowers + vibe style)
  - Use as-spec for: Structured interaction with current tools (agent superpowers + spec methodology)
- Highlight key differences:
  - **Tools**: vibe/spec change tools, as-vibe/as-spec keep current tools
  - **Interaction**: vibe/as-vibe flexible, spec/as-spec structured
  - **Use case**: Combine agent capabilities with desired interaction style
- Help user choose appropriate mode

#### Option 8 - Stay in current mode

- Confirm staying in current mode
- Return to normal interaction
- Preserve current state

#### Option 9 - Help

Explain mode system:
- **What are modes?** - Different interaction styles and tool sets for different workflows
- **How to switch?** - Use `/modes {name}` or `/modes` for interactive menu
- **Mode types:**
  - **Full modes** (vibe/spec): Change both tools and interaction style
  - **Role modes** (as-vibe/as-spec): Change only interaction style, keep current tools
- **Mode benefits:**
  - Vibe: Fast iteration, flexible approach (with vibe tools)
  - Spec: Structured planning, comprehensive documentation (with spec tools)
  - As-Vibe: Flexible interaction with current tools (agent superpowers + vibe style)
  - As-Spec: Structured interaction with current tools (agent superpowers + spec methodology)
- **Mode coordination:**
  - Modes can be combined with agents
  - File changes preserved when switching
  - Workflow state resets when switching
  - Role modes enable "agent superpowers" - specialized tools with preferred interaction style
- **Usage examples:**
  - Quick bug fix → Use vibe mode
  - New feature with requirements → Use spec mode
  - Agent with spec tools but want flexibility → Use as-vibe mode
  - Agent with vibe tools but want structure → Use as-spec mode
  - Refactoring existing code → Use vibe mode
  - Team feature with documentation → Use spec mode

### Step 4: Maintain Chit-Chat Mode

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
