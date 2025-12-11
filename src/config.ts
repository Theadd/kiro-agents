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
 * Helper function to inject protocol content from .mdx files
 * 
 * @param protocolFileName - Name of the protocol file (e.g., 'agent-management.mdx')
 * @param startMarker - Optional marker to start extraction from (e.g., '## Agent Management Steps')
 * @returns Protocol content or error message
 */
export function injectProtocol(protocolFileName: string, startMarker?: string): string {
  try {
    const { readFileSync, existsSync } = require('fs');
    const { join } = require('path');
    
    const protocolPath = join(process.cwd(), 'src/core/protocols', protocolFileName);
    
    if (!existsSync(protocolPath)) {
      return `<!-- Protocol not found: ${protocolFileName} -->`;
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
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => injectProtocol('agent-management.mdx', '## Agent Management Steps')
}
