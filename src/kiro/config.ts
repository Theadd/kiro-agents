
export const substitutions = {
  '{{{MODE_COMMANDS}}}': () => `MODE COMMANDS (see modes-system.md)
  /mode {name}      Switch Kiro mode (vibe/spec)
  /modes            Interactive mode management
  /strict {state}   Control strict mode (on/off)`,
  '{{{EXTRA_COMPATIBILITY}}}': () => `- **Mode system** - Works seamlessly with modes (see \`modes-system.md\`)
- **Context preservation** - File changes and conversation history persist across agent switches`,
  '{{{INTEGRATION_ENHANCEMENTS}}}': () => `
**Integration enhancements:**
- **Task sessions** - Agents create sub-tasks with own context
- **Session continuation** - Resume interrupted work with full context
- **Enhanced mode integration** - Better coordination with modes system`
}
