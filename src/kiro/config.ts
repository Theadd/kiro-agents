/**
 * Kiro-specific build configuration with dynamic substitutions.
 * 
 * Extends base config (`src/config.ts`) with Kiro-specific implementations.
 * Used for npm, power, and dev builds. Provides runtime-generated content
 * like version numbers, command lists, and file paths.
 * 
 * **Architecture:**
 * - Imports base config's `injectProtocol` helper for protocol injection
 * - Imports `extractSection` for markdown section extraction
 * - Overrides substitution keys with Kiro functionality
 * - MUST have same keys as `src/config.ts` (cross-IDE compatibility)
 * 
 * **Substitution Functions:**
 * - Receive `SubstitutionOptions` with build target
 * - Return strings to replace placeholder keys
 * - Can read filesystem, package.json, etc.
 * 
 * @see src/config.ts - Base config with all required keys and injectProtocol function
 * @see src/utils/markdown-extractor.ts - Section extraction utilities
 */
import { readFileSync, readdirSync } from "fs";
import { injectProtocol } from "../config";
import { extractSection } from "../utils/markdown-extractor";

/**
 * Reads package version from package.json (fallback: '1.0.0').
 * 
 * @returns Version string (e.g., '1.4.0')
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
 * Scans `.kiro/agents/` for agent definitions (fallback message if directory missing).
 * 
 * @returns Markdown bullet list of agent names without .md extension
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
 * Resolves steering directory path based on build target (npm vs power distribution).
 * 
 * @param target - Build target ('npm' | 'power' | 'dev')
 * @returns Absolute path to steering directory
 * 
 * @example npm/dev builds
 * ```typescript
 * getSteeringsPath('npm') // '~/.kiro/steering/kiro-agents'
 * ```
 * 
 * @example Power builds
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
 * Kiro-specific substitution map for build-time content replacement with multi-pass support.
 * 
 * Overrides base config substitutions with Kiro implementations. Each function receives
 * `SubstitutionOptions` (with `target` property) and returns replacement string. Supports
 * nested substitutions where replacement values contain additional placeholders that get
 * resolved in subsequent build passes.
 * 
 * **Protocol injections:**
 * - `AGENT_MANAGEMENT_PROTOCOL` - Injects from `src/core/protocols/agent-management.md`
 * - `MODE_MANAGEMENT_PROTOCOL` - Injects from `src/kiro/steering/protocols/mode-management.md`
 * 
 * **Nested substitutions:**
 * - `KIRO_MODE_ALIASES` - Extracts section containing `{{{KIRO_PROTOCOLS_PATH}}}` placeholder
 * - Build system resolves nested placeholders automatically via multi-pass processing
 * 
 * **Agent system overrides:**
 * - Can override `WS_AGENTS_PATH`, `INITIAL_AGENT_NAME`, `INITIAL_AGENT_DESCRIPTION` if Kiro needs different values
 * - Base config provides cross-IDE defaults (`.ai-agents/agents`, `project-master`)
 * - Kiro typically uses `.kiro/agents/` and `kiro-master` instead
 * 
 * @see src/config.ts - Base substitutions with all required keys
 * @see scripts/build.ts - Multi-pass substitution processor
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
  /** Override workspace agents path for Kiro */
  '{{{WS_AGENTS_PATH}}}': () => '.kiro/agents',
  /** Override initial agent name for Kiro */
  '{{{INITIAL_AGENT_NAME}}}': () => 'kiro-master',
  /** Override initial agent description for Kiro */
  '{{{INITIAL_AGENT_DESCRIPTION}}}': () => '**kiro-master** - Interactive Kiro feature management with CRUD operations for MCP servers, hooks, agents, specs, powers, and steering documents. Includes .kiro/ directory maintenance, steering optimization, refactoring, and comprehensive analysis capabilities',
  /** Injects agent management protocol from core protocols directory */
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.md', '## Agent Management Steps'),
  /** Injects mode management protocol from Kiro-specific protocols directory */
  '{{{MODE_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('mode-management.md', '## Mode Management Steps', 'src/kiro/steering/protocols'),
  /** 
   * Injects additional Kiro-specific aliases from shared aliases file.
   * 
   * Extracts reusable alias definitions from `src/kiro/shared-aliases.md` for injection into
   * main `aliases.md` steering document. Combines multiple sections with proper separation.
   * 
   * **Sections included (in order):**
   * 1. Protocol Loading Alias - `/protocols {filename}` command for loading and executing protocols
   * 2. Protocol Reading Alias - `/only-read-protocols {filename}` command for loading without executing
   * 3. Mode System Alias - Mode switching commands (`/modes {name}`, `/spec-as-vibe`)
   * 4. Conversation Transfer State Restoration - Auto-detects and restores STRICT_MODE/ACTIVE_AGENT state
   * 
   * **Multi-pass substitution:**
   * Extracted content may contain nested placeholders (e.g., `{{{KIRO_PROTOCOLS_PATH}}}`) that get
   * resolved in subsequent build passes, enabling modular content injection.
   * 
   * @param target - Build target ('npm' | 'power' | 'dev'), passed to nested substitutions
   * @returns Combined alias definitions with separators, or error comment on failure
   * 
   * @example Multi-pass resolution
   * ```typescript
   * // Pass 1: Returns "Path: {{{KIRO_PROTOCOLS_PATH}}}/mode-switching.md"
   * // Pass 2: Resolves to "Path: ~/.kiro/steering/kiro-agents/protocols/mode-switching.md"
   * ```
   * 
   * @see src/kiro/shared-aliases.md - Source file with reusable alias definitions
   * @see scripts/build.ts - Multi-pass substitution processor
   */
  '{{{ADDITIONAL_ALIASES}}}': ({ target }: any) => {
    try {
      // Extract all sections from shared aliases file in order
      const protocolLoading = extractSection('src/kiro/shared-aliases.md', 'Protocol Loading Alias');
      const protocolReading = extractSection('src/kiro/shared-aliases.md', 'Protocol Reading Alias');
      const modeAliases = extractSection('src/kiro/shared-aliases.md', 'Mode System Alias');
      const stateRestoration = extractSection('src/kiro/shared-aliases.md', 'Conversation Transfer State Restoration');
      
      // Return combined content with separators
      return `${protocolLoading}\n\n${protocolReading}\n\n${modeAliases}\n\n---\n\n${stateRestoration}`;
    } catch (error: any) {
      return `<!-- Error loading additional aliases: ${error.message} -->`;
    }
  }
}
