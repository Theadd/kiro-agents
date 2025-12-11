# Shared Aliases

This file contains reusable alias definitions that are injected into other steering documents during build time.

## Mode System Alias

The mode switching command uses parameter substitution to load mode definitions dynamically:

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

**Load and execute mode switching protocol:**
1. Read `kiro-{mode_name}-mode.md` from agent-system directory into context
2. Read `{{{KIRO_PROTOCOLS_PATH}}}/mode-switching.mdx` into context
3. Follow all steps from the "Mode Switch Steps" section in mode-switching.mdx
4. Use `{mode_name}` as the mode identifier throughout the protocol
  </definition>
</alias>

This alias enables users to switch modes with `/modes {name}` syntax.
