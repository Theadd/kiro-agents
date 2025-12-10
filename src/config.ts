/**
 * Base Configuration - Cross-IDE Compatible
 * 
 * This is the BASE configuration that MUST contain ALL substitution keys.
 * 
 * Architecture:
 * - src/config.ts (this file) - Base config with ALL keys
 * - src/kiro/config.ts - Kiro-specific overrides
 * 
 * Why ALL keys must be here:
 * When building for non-Kiro IDEs, only this config is used.
 * If a key is missing here, the {{{KEY}}} string will remain
 * in the output files, which looks unprofessional.
 * 
 * Pattern:
 * - Keys with cross-IDE functionality: Return appropriate content
 * - Keys specific to Kiro features: Return empty string ''
 * - Kiro config will override these with real implementations
 * 
 * Adding new substitutions:
 * 1. Add key here first (return '' if Kiro-specific)
 * 2. Add implementation in src/kiro/config.ts if needed
 * 3. Both configs must have matching keys
 */
export const substitutions = {
  '{{{VERSION}}}': () => '',
  '{{{AGENT_LIST}}}': () => '',
  '{{{COMMANDS_LIST}}}': () => '',
  '{{{MODE_COMMANDS}}}': () => `MODE COMMANDS
  /strict {state}   Control strict mode (on/off)
  /strict           Interactive strict mode control`,
  '{{{EXTRA_COMPATIBILITY}}}': () => ``,
  '{{{INTEGRATION_ENHANCEMENTS}}}': () => ``
}
