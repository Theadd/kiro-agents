---
inclusion: manual
description: "Interactive mode management interface for switching between vibe and spec interaction styles"
keywords: ["modes", "vibe", "spec", "workflow", "interactive"]
---

# Mode Management

You are now in **mode management** using chit-chat interaction protocol.

## Step 1: Load Chit-Chat Mode

Apply protocols from `chit-chat.md` steering document:
- Use diff blocks to show progress
- Provide numbered choice lists (4-6 options)
- Maintain single focus per message
- Use visual formatting (bold, code blocks, lists)

## Step 2: Detect Available Modes

Scan agent-system directory for `kiro-*-mode.md` files:
- Extract mode names from filenames
- Read frontmatter for descriptions
- Identify current mode from context

## Step 3: Present Mode Selection

Use this response structure:

```diff
  👉 Mode management
  ⏳ Mode selection
```

**Current mode:** [current_mode]

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

## Step 4: Handle User Choice

Based on user selection:

**Option 1 - Switch to vibe:**
- Execute `/modes vibe` command
- Load vibe mode protocols
- Begin flexible interaction

**Option 2 - Switch to spec:**
- Execute `/modes spec` command
- Load spec mode protocols
- Begin structured workflow

**Option 3 - View mode details:**
- Show numbered list of modes
- User selects mode to view
- Display full mode definition
- Explain capabilities and use cases
- Offer to switch to that mode

**Option 4 - Mode comparison:**
- Show side-by-side comparison
- Explain when to use each mode
- Highlight key differences
- Help user choose appropriate mode

**Option 5 - Stay in current mode:**
- Confirm staying in current mode
- Return to normal interaction
- Preserve current state

**Option 6 - Help:**
- Explain mode system
- Show switching commands
- Describe mode benefits
- Provide usage examples

## Step 5: Maintain Chit-Chat Mode

Continue using diff blocks and numbered choices throughout mode management.

After each action:
- Update diff block with progress
- Show current focus
- Provide next action choices
- Allow going back or canceling

---

**Begin mode management now.**
