/**
 * Base Configuration - Cross-IDE Compatible
 * 
 * This is the BASE configuration that MUST contain ALL substitution keys.
 * 
 * Architecture:
 * - src/config.ts (this file) - Base config with ALL keys
 * - src/kiro/config.ts - Kiro-specific overrides
 * - src/utils/markdown-extractor.ts - Section extraction utilities
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

/**
 * Injects protocol content from .md files into steering documents (simple line-based extraction).
 * 
 * **Pattern:** Steering documents (`.md`) are minimal shells. Protocol files (`.md`) contain
 * detailed steps. This function injects protocol content at build time for single source of truth.
 * 
 * **Note:** This is a simple implementation using line-based extraction. For scope-aware parsing
 * that handles code blocks and XML tags correctly, use `extractSection` from `src/utils/markdown-extractor.ts`.
 * 
 * @param protocolFileName - Protocol file name (e.g., 'agent-management.md')
 * @param startMarker - Optional heading to start from (e.g., '## Agent Management Steps')
 * @param customPath - Optional path relative to project root (default: 'src/core/protocols')
 * @returns Protocol content from marker onwards, full content if no marker, or error comment
 * 
 * @example Full protocol injection
 * ```typescript
 * injectProtocol('agent-activation.md')
 * // Returns entire file from src/core/protocols/
 * ```
 * 
 * @example Section extraction (simple line-based)
 * ```typescript
 * injectProtocol('agent-management.md', '## Agent Management Steps')
 * // Returns from first line matching marker onwards
 * ```
 * 
 * @example Custom protocol directory
 * ```typescript
 * injectProtocol('mode-management.md', '## Mode Steps', 'src/kiro/steering/protocols')
 * ```
 * 
 * @see src/utils/markdown-extractor.ts - Scope-aware alternative with proper parsing
 */
export function injectProtocol(protocolFileName: string, startMarker?: string, customPath?: string): string {
  try {
    const { readFileSync, existsSync } = require('fs');
    const { join } = require('path');
    
    const basePath = customPath || 'src/core/protocols';
    const protocolPath = join(process.cwd(), basePath, protocolFileName);
    
    if (!existsSync(protocolPath)) {
      return `<!-- Protocol not found: ${protocolFileName} in ${basePath} -->`;
    }
    
    const content = readFileSync(protocolPath, 'utf-8');
    
    // If no start marker, return full content
    if (!startMarker) {
      return content;
    }
    
    // Extract content from start marker onwards
    const lines = content.split('\n');
    const startIndex = lines.findIndex((line: string) => line.startsWith(startMarker));
    
    if (startIndex >= 0) {
      return lines.slice(startIndex).join('\n');
    }
    
    // If marker not found, return full content
    return content;
  } catch (error: any) {
    return `<!-- Error loading protocol ${protocolFileName}: ${error.message} -->`;
  }
}

/**
 * Base substitution map for cross-IDE compatible builds.
 * 
 * Contains ALL substitution keys used across the project. Keys specific to
 * Kiro features return empty strings here and are overridden in `src/kiro/config.ts`.
 * This ensures non-Kiro builds don't have unresolved `{{{PLACEHOLDER}}}` strings.
 * 
 * **Pattern:**
 * - Cross-IDE keys: Return appropriate content
 * - Kiro-specific keys: Return empty string (overridden in kiro/config.ts)
 * 
 * **Cross-IDE Agent System Keys:**
 * - `{{{WS_AGENTS_PATH}}}` - Workspace agents directory (e.g., '.ai-agents/agents')
 * - `{{{INITIAL_AGENT_NAME}}}` - Default agent name (e.g., 'project-master')
 * - `{{{INITIAL_AGENT_DESCRIPTION}}}` - Agent description from shared-content.md
 * 
 * @see src/kiro/config.ts - Kiro-specific overrides
 * @see src/core/shared-content.md - Reusable content blocks
 */
export const substitutions = {
  '{{{VERSION}}}': () => '',
  '{{{AGENT_LIST}}}': () => '',
  '{{{COMMANDS_LIST}}}': () => '',
  '{{{MODE_COMMANDS}}}': () => `MODE COMMANDS
  /strict {state}   Control strict mode (on/off)
  /strict           Interactive strict mode control`,
  '{{{EXTRA_COMPATIBILITY}}}': () => ``,
  '{{{INTEGRATION_ENHANCEMENTS}}}': () => ``,
  '{{{PROTOCOLS_PATH}}}': () => 'protocols',
  '{{{KIRO_PROTOCOLS_PATH}}}': () => 'protocols',
  '{{{KIRO_MODE_ALIASES}}}': () => '',
  /** Workspace agents directory path (e.g., '.ai-agents/agents' for cross-IDE compatibility) */
  '{{{WS_AGENTS_PATH}}}': () => '.ai-agents/agents',
  /** Initial agent name created during auto-setup (e.g., 'project-master') */
  '{{{INITIAL_AGENT_NAME}}}': () => 'project-master',
  /** 
   * Initial agent description extracted from shared-content.md.
   * 
   * Reads "Initial Agent Description" section from `src/core/shared-content.md` at build time.
   * Falls back to default description if file not found or section missing.
   * 
   * @returns Agent description string (e.g., 'project-master - Interactive project management...')
   * 
   * @example Successful extraction
   * ```typescript
   * // Returns content from shared-content.md:
   * // "project-master - Interactive project management with CRUD operations..."
   * ```
   * 
   * @example Fallback on error
   * ```typescript
   * // If file missing or section not found:
   * // "project-master - Interactive project management"
   * ```
   */
  '{{{INITIAL_AGENT_DESCRIPTION}}}': () => {
    try {
      const { readFileSync } = require('fs');
      const { join } = require('path');
      const content = readFileSync(join(process.cwd(), 'src/core/shared-content.md'), 'utf-8');
      // Extract content between "## Initial Agent Description" and next heading
      const match = content.match(/## Initial Agent Description\n\n([\s\S]*?)(?=\n##|\n---|\n$)/);
      return match ? match[1].trim() : 'project-master - Interactive project management';
    } catch {
      return 'project-master - Interactive project management';
    }
  },
  /** Injects agent management protocol from core protocols directory */
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.md', '## Agent Management Steps'),
  /** Mode management protocol - empty for base (Kiro-specific feature) */
  '{{{MODE_MANAGEMENT_PROTOCOL}}}': () => ''
}
