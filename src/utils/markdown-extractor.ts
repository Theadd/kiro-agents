/**
 * Markdown Section Extractor
 * 
 * Extracts sections from markdown files while respecting code blocks, XML tags, and nested structures.
 * Used by build system to inject protocol content into steering documents via substitutions.
 * 
 * **Use cases:**
 * - Extract protocol sections for build-time injection (e.g., "## Agent Management Steps")
 * - Create reusable substitution functions for config.ts
 * - Parse markdown with complex nested structures (code blocks, nested XML aliases)
 * 
 * **Key features:**
 * - Scope-aware parsing: Headers inside code blocks/XML tags are ignored
 * - Nested XML support: Properly tracks nested `<alias>` tags and other XML structures
 * - Anchor or title matching: Query by "Section Title" or "#section-title"
 * - Section boundaries: Extracts from header to next same-level header
 * 
 * @see src/config.ts - Uses createSectionSubstitution for protocol injection
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Converts string to markdown anchor format (lowercase, hyphens, alphanumeric only).
 * 
 * @param str - String to slugify (e.g., "My Section Title")
 * @returns Slugified anchor (e.g., "my-section-title")
 */
function slugify(str: string): string {
  let result = '';
  let prevDash = false;
  
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    const isAlnum = (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
    const isSpace = c === 32 || c === 95;
    
    if (isAlnum) {
      result += String.fromCharCode(c >= 65 && c <= 90 ? c + 32 : c);
      prevDash = false;
    } else if (isSpace && !prevDash && result.length > 0) {
      result += '-';
      prevDash = true;
    }
  }
  
  return prevDash ? result.slice(0, -1) : result;
}

/**
 * Detects code fence at position (requires 3+ backticks at line start).
 * 
 * @param content - Full markdown content
 * @param i - Current position index
 * @returns Fence length (3+) if valid fence, 0 otherwise
 */
function checkCodeFence(content: string, i: number): number {
  if (content.charCodeAt(i) !== 96) return 0; // Not a backtick
  
  let count = 1;
  const len = content.length;
  while (i + count < len && content.charCodeAt(i + count) === 96) count++;
  
  return count >= 3 ? count : 0;
}

/**
 * Parses XML tag at position, handling multi-line tags, self-closing syntax, and nested tags.
 * 
 * Detects both opening and closing tags to maintain proper XML scope tracking.
 * Called even when already inside XML context to handle nested tag structures.
 * 
 * @param content - Full markdown content
 * @param i - Current position index (must point to '<' character)
 * @returns Tag metadata (name, closing/self-closing status, end position) or null if invalid
 */
function checkXmlTag(content: string, i: number): { tag: string; isClosing: boolean; selfClosing: boolean; end: number } | null {
  if (content.charCodeAt(i) !== 60) return null; // Not '<'
  
  let j = i + 1;
  const len = content.length;
  const isClosing = content.charCodeAt(j) === 47; // '/'
  if (isClosing) j++;
  
  const tagStart = j;
  while (j < len) {
    const c = content.charCodeAt(j);
    if (c === 62 || c === 32 || c === 47 || c === 10) break;
    j++;
  }
  
  if (j === tagStart) return null;
  const tag = content.slice(tagStart, j).toLowerCase();
  
  // Find tag close (may be multi-line)
  while (j < len && content.charCodeAt(j) !== 62) j++;
  if (j >= len) return null;
  
  const selfClosing = content.charCodeAt(j - 1) === 47;
  return { tag, isClosing, selfClosing, end: j };
}

/**
 * Extracts markdown section with scope-aware parsing (ignores headers in code/XML).
 * 
 * **Parsing behavior:**
 * - Headers inside code blocks or XML tags are ignored
 * - XML tag detection handles nested structures (checks even when inside XML)
 * - Section ends at next same-or-higher level header
 * - Trailing whitespace trimmed
 * 
 * **State tracking:**
 * - 0 = normal scope (headers detected)
 * - 1 = inside code block (headers ignored)
 * - 2 = inside XML tag (headers ignored, nested tags tracked)
 * 
 * @param content - Full markdown content
 * @param query - Section title (exact match) or anchor with # prefix (e.g., "#installation")
 * @returns Extracted section content including header
 * @throws Error if section not found
 */
function extractSectionFromContent(content: string, query: string): string {
  const len = content.length;
  const isAnchor = query.startsWith('#');
  const searchTerm = isAnchor ? query.slice(1) : slugify(query);
  
  // Parser state: 0=normal, 1=code-block, 2=xml-tag
  let state = 0;
  let fenceCount = 0;
  let xmlStack: string[] = [];
  
  let i = 0;
  let startIdx = -1;
  let endIdx = len;
  let headerLevel = 0;
  
  while (i < len) {
    const atLineStart = i === 0 || content.charCodeAt(i - 1) === 10;
    
    // Detect code fence
    if (atLineStart && state !== 2) {
      const fence = checkCodeFence(content, i);
      if (fence > 0) {
        if (state === 0) {
          state = 1;
          fenceCount = fence;
        } else if (state === 1 && fence >= fenceCount) {
          state = 0;
          fenceCount = 0;
        }
        while (i < len && content.charCodeAt(i) !== 10) i++;
        i++;
        continue;
      }
    }
    
    // Detect XML tag (check even when inside XML for nested tags)
    if (content.charCodeAt(i) === 60) {
      const tag = checkXmlTag(content, i);
      if (tag && !tag.selfClosing) {
        if (tag.isClosing) {
          if (xmlStack.length > 0 && xmlStack[xmlStack.length - 1] === tag.tag) {
            xmlStack.pop();
            if (xmlStack.length === 0) state = 0;
          }
        } else {
          xmlStack.push(tag.tag);
          state = 2;
        }
        i = tag.end + 1;
        continue;
      }
    }
    
    // Only search for headers in normal scope
    if (state === 0 && atLineStart) {
      // Count header level
      let level = 0;
      let j = i;
      while (j < len && content.charCodeAt(j) === 35) { // '#'
        level++;
        j++;
      }
      
      if (level > 0 && j < len && content.charCodeAt(j) === 32) { // Space after #
        const titleStart = j + 1;
        let titleEnd = titleStart;
        while (titleEnd < len && content.charCodeAt(titleEnd) !== 10) titleEnd++;
        
        const title = content.slice(titleStart, titleEnd).trim();
        const slug = slugify(title);
        
        // Found target section
        if (startIdx === -1 && ((isAnchor && slug === searchTerm) || (!isAnchor && title === query))) {
          startIdx = i;
          headerLevel = level;
          i = titleEnd + 1;
          continue;
        }
        
        // Found next same-or-higher level header (end of section)
        if (startIdx !== -1 && level <= headerLevel) {
          endIdx = i;
          break;
        }
        
        i = titleEnd;
      }
    }
    
    i++;
  }
  
  if (startIdx === -1) {
    throw new Error(`Section not found: ${query}`);
  }
  
  // Trim trailing whitespace
  let end = endIdx;
  while (end > startIdx && (content.charCodeAt(end - 1) === 10 || content.charCodeAt(end - 1) === 32)) {
    end--;
  }
  
  return content.slice(startIdx, end);
}

/**
 * Extracts section from markdown file with scope-aware parsing.
 * 
 * @param filePath - Path relative to project root (e.g., 'src/core/protocols/agent-activation.md')
 * @param sectionQuery - Section title (exact) or anchor with # (e.g., "Installation" or "#installation")
 * @returns Extracted section content including header
 * @throws Error if file or section not found
 * 
 * @example Extract by exact title
 * ```typescript
 * extractSection('docs/guide.md', 'Installation')
 * // Matches: ## Installation
 * ```
 * 
 * @example Extract by anchor (case-insensitive, slug-matched)
 * ```typescript
 * extractSection('docs/guide.md', '#installation')
 * // Matches: ## Installation, ## INSTALLATION, etc.
 * ```
 * 
 * @example Extract protocol section for injection
 * ```typescript
 * extractSection('src/core/protocols/agent-management.md', '## Agent Management Steps')
 * // Returns from "## Agent Management Steps" to next ## header
 * ```
 */
export function extractSection(filePath: string, sectionQuery: string): string {
  const fullPath = join(process.cwd(), filePath);
  
  if (!existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const content = readFileSync(fullPath, 'utf-8');
  return extractSectionFromContent(content, sectionQuery);
}

/**
 * Creates substitution function for build-time section injection (error-safe).
 * 
 * Returns a function that extracts section content, falling back to HTML comment on error.
 * Used in config.ts to inject protocol content into steering documents during build.
 * 
 * @param filePath - Path relative to project root (e.g., 'src/core/protocols/agent-activation.md')
 * @param sectionQuery - Section title or anchor (e.g., "## Agent Management Steps")
 * @returns Substitution function returning section content or error comment
 * 
 * @example Inject protocol section
 * ```typescript
 * export const substitutions = {
 *   '{{{AGENT_PROTOCOL}}}': createSectionSubstitution(
 *     'src/core/protocols/agent-management.md',
 *     '## Agent Management Steps'
 *   )
 * }
 * ```
 * 
 * @example Inject mode alias definition
 * ```typescript
 * export const substitutions = {
 *   '{{{MODE_ALIAS}}}': createSectionSubstitution(
 *     'src/core/aliases.md',
 *     'Mode System Alias'
 *   )
 * }
 * ```
 * 
 * @see src/config.ts - Base substitutions using this pattern
 * @see src/kiro/config.ts - Kiro-specific substitutions
 */
export function createSectionSubstitution(filePath: string, sectionQuery: string): () => string {
  return () => {
    try {
      return extractSection(filePath, sectionQuery);
    } catch (error: any) {
      return `<!-- Error extracting section: ${error.message} -->`;
    }
  };
}
