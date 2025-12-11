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

/**
 * Injects protocol content from .mdx files into steering documents.
 * 
 * Reads protocol files from `src/core/protocols/` or custom path and optionally extracts content
 * starting from a specific marker. Used during build to inject detailed protocol
 * steps into minimal steering document shells.
 * 
 * **Pattern:** Steering documents (`.md`) are minimal shells with frontmatter and
 * basic structure. Protocol files (`.mdx`) contain detailed implementation steps.
 * This function injects protocol content at build time, creating single source of
 * truth for reusable workflows.
 * 
 * @param protocolFileName - Name of protocol file (e.g., 'agent-management.mdx')
 * @param startMarker - Optional heading to start extraction from (e.g., '## Agent Management Steps')
 * @param customPath - Optional custom path relative to project root (e.g., 'src/kiro/steering/protocols')
 * @returns Protocol content from marker onwards, or full content if no marker, or error comment
 * 
 * @example Full protocol injection
 * ```typescript
 * injectProtocol('agent-activation.mdx')
 * // Returns entire file content from src/core/protocols/
 * ```
 * 
 * @example Partial protocol injection
 * ```typescript
 * injectProtocol('agent-management.mdx', '## Agent Management Steps')
 * // Returns content from '## Agent Management Steps' heading onwards
 * ```
 * 
 * @example Custom path injection
 * ```typescript
 * injectProtocol('mode-management.mdx', '## Mode Management Steps', 'src/kiro/steering/protocols')
 * // Returns content from custom Kiro-specific protocol directory
 * ```
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
 * @see src/kiro/config.ts - Kiro-specific overrides
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
  /** Injects agent management protocol from core protocols directory */
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.mdx', '## Agent Management Steps')
}
