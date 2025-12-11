/**
 * Kiro-specific build configuration with dynamic substitutions.
 * 
 * Extends base config (`src/config.ts`) with Kiro-specific implementations.
 * Used for npm, power, and dev builds. Provides runtime-generated content
 * like version numbers, command lists, and file paths.
 * 
 * **Architecture:**
 * - Imports base config's `injectProtocol` helper for protocol injection
 * - Overrides substitution keys with Kiro functionality
 * - MUST have same keys as `src/config.ts` (cross-IDE compatibility)
 * 
 * **Substitution Functions:**
 * - Receive `SubstitutionOptions` with build target
 * - Return strings to replace placeholder keys
 * - Can read filesystem, package.json, etc.
 * 
 * @see src/config.ts - Base config with all required keys and injectProtocol function
 */
import { readFileSync, readdirSync } from "fs";
import { injectProtocol } from "../config";

/**
 * Gets package version from package.json.
 * 
 * @returns Version string (e.g., '1.4.0') or '1.0.0' if not found
 */
function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    return pkg.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}

/**
 * Lists available agents from `.kiro/agents/` directory.
 * 
 * Scans for `.md` files and formats as bullet list. Falls back to
 * default message if directory doesn't exist (e.g., during build).
 * 
 * @returns Markdown bullet list of agent names
 */
function getAgentList(): string {
  try {
    const agentsDir = ".kiro/agents";
    const files = readdirSync(agentsDir);
    const agents = files
      .filter(f => f.endsWith(".md"))
      .map(f => f.replace(".md", ""))
      .map(name => `- ${name}`)
      .join("\n");
    return agents || "- kiro-master (auto-created on first use)";
  } catch {
    return "- kiro-master (auto-created on first use)";
  }
}

/**
 * Generates formatted command list for documentation.
 * 
 * @returns Markdown-formatted command reference with descriptions
 */
function getCommandsList(): string {
  return `### Agent Commands
- \`/agents\` - Interactive agent management with visual menu
- \`/agents {name}\` - Activate specific agent directly

### Mode Commands
- \`/modes\` - Interactive mode management with visual menu
- \`/modes vibe\` - Switch to vibe mode directly
- \`/modes spec\` - Switch to spec mode directly

### Strict Mode Commands
- \`/strict\` - Interactive control with visual buttons
- \`/strict on\` - Enable strict mode directly
- \`/strict off\` - Disable strict mode directly`;
}

/**
 * Resolves steering path based on build target.
 * 
 * Power distribution installs to `.kiro/powers/installed/kiro-agents/`,
 * npm distribution installs to `~/.kiro/steering/kiro-agents/`.
 * Used for generating correct protocol paths in substitutions.
 * 
 * @param target - Build target (npm/power/dev)
 * @returns Absolute path to steering directory
 * 
 * @example npm/dev target
 * ```typescript
 * getSteeringsPath('npm') // '~/.kiro/steering/kiro-agents'
 * ```
 * 
 * @example power target
 * ```typescript
 * getSteeringsPath('power') // '~/.kiro/powers/installed/kiro-agents/steering'
 * ```
 */
const getSteeringsPath = (target: string) => {
  if (target === 'power') {
    return '~/.kiro/powers/installed/kiro-agents/steering';
  } else {
    return '~/.kiro/steering/kiro-agents';
  }
}

/**
 * Kiro-specific substitution map for build-time content replacement.
 * 
 * Overrides base config substitutions with Kiro-specific implementations.
 * Each function receives SubstitutionOptions and returns replacement string.
 * 
 * **Protocol Injections:**
 * - `AGENT_MANAGEMENT_PROTOCOL` - Injects from core protocols (src/core/protocols/)
 * - `MODE_MANAGEMENT_PROTOCOL` - Injects from Kiro protocols (src/kiro/steering/protocols/)
 * 
 * @see src/config.ts - Base substitutions and injectProtocol function
 */
export const substitutions = {
  '{{{VERSION}}}': getVersion,
  '{{{AGENT_LIST}}}': getAgentList,
  '{{{COMMANDS_LIST}}}': getCommandsList,
  '{{{MODE_COMMANDS}}}': () => `MODE COMMANDS (see modes-system.md)
  /modes {name}     Switch Kiro mode (vibe/spec)
  /modes            Interactive mode management
  /strict {state}   Control strict mode (on/off)
  /strict           Interactive strict mode control`,
  '{{{EXTRA_COMPATIBILITY}}}': () => `- **Mode system** - Works seamlessly with modes (see \`modes-system.md\`)
- **Context preservation** - File changes and conversation history persist across agent switches`,
  '{{{INTEGRATION_ENHANCEMENTS}}}': () => `
**Integration enhancements:**
- **Task sessions** - Agents create sub-tasks with own context
- **Session continuation** - Resume interrupted work with full context
- **Enhanced mode integration** - Better coordination with modes system`,
  '{{{PROTOCOLS_PATH}}}': ({ target }: any) => getSteeringsPath(target) + '/protocols',
  '{{{KIRO_PROTOCOLS_PATH}}}': ({ target }: any) => getSteeringsPath(target) + '/protocols',
  /** Injects agent management protocol from core protocols directory */
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.mdx', '## Agent Management Steps'),
  /** Injects mode management protocol from Kiro-specific protocols directory */
  '{{{MODE_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('mode-management.mdx', '## Mode Management Steps', 'src/kiro/steering/protocols'),
  '{{{KIRO_MODE_ALIASES}}}': ({ target }: any) => `
## Mode System Alias

The mode switching command uses parameter substitution to load mode definitions dynamically:

<alias>
  <trigger>/modes {mode_name}</trigger>
  <definition>
## Mode Switch: {mode_name}

You are now switching to **{mode_name} mode**.

**Load and execute mode switching protocol:**
1. Read \`kiro-{mode_name}-mode.md\` from agent-system directory into context
2. Read \`${getSteeringsPath(target)}/protocols/mode-switching.mdx\` into context
3. Follow all steps from the "Mode Switch Steps" section in mode-switching.mdx
4. Use \`{mode_name}\` as the mode identifier throughout the protocol
  </definition>
</alias>

This alias enables users to switch modes with \`/modes {name}\` syntax.`
}
