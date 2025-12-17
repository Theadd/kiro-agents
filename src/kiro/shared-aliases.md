# Shared Aliases

This file contains reusable alias definitions that are injected into other steering documents during build time.

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
