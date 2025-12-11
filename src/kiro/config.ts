/**
 * Kiro Configuration - Extends Base Config
 * 
 * This config extends src/config.ts with Kiro-specific implementations.
 * 
 * Architecture:
 * - Imports base config pattern (not directly, but follows same structure)
 * - Overrides substitution keys with real Kiro functionality
 * - Used for: npm build, power build, dev mode
 * 
 * Rules:
 * - MUST have same keys as src/config.ts
 * - Can add Kiro-specific helper functions
 * - Can use file system operations (readFileSync, etc.)
 * - Can read package.json, .kiro/ directory, etc.
 * 
 * Build process uses this config for Kiro distributions.
 */
import { readFileSync, readdirSync } from "fs";
import { injectProtocol } from "../config";

// Helper to get package version
function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    return pkg.version || "1.0.0";
  } catch {
    return "1.0.0";
  }
}

// Helper to list available agents
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

// Helper to generate commands list
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

const getSteeringsPath = (target: string) => {
  if (target === 'power') {
    return '~/.kiro/powers/installed/kiro-agents/steering';
  } else {
    return '~/.kiro/steering/kiro-agents';
  }
}

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
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.mdx', '## Agent Management Steps')
}
