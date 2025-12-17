/**
 * Centralized file manifest for kiro-agents distribution.
 * 
 * Single source of truth for all file mappings across build targets (npm, dev, cli).
 * Uses glob patterns for automatic file discovery and consistent mappings. Replaces
 * hardcoded file lists in build scripts and CLI with declarative manifest system.
 * 
 * **Key Benefits:**
 * - Single source of truth - change once, applies everywhere
 * - Glob pattern support - auto-discovers files, no manual updates
 * - Guaranteed consistency - dev mode matches CLI installation
 * - Type safety - compile-time validation of mappings
 * 
 * @example expandMappings(STEERING_MAPPINGS, "src", "npm")
 * @example getSteeringFilesForCLI() returns array of destination paths
 * 
 * @see scripts/build.ts - Uses STEERING_MAPPINGS and expandMappings
 * @see scripts/build-powers.ts - Uses PROTOCOL_SOURCE_MAPPINGS and expandMappings for manifest-based protocol discovery
 * @see bin/cli.ts - Uses getSteeringFilesForCLI() and getPowerFilesForCLI()
 */

import { glob } from "glob";
import { basename } from "path";

/**
 * Build target types for different distribution channels.
 * 
 * Determines output location, processing steps, and which files to include.
 * Each target can filter mappings using the `targets` property in FileMapping.
 * 
 * @property npm - Build npm package (compiles CLI, processes files, cleans after)
 * @property dev - Build to user directory with watch mode
 * @property cli - CLI installation target (generates file lists for bin/cli.ts constants)
 * @property power - Power build target (builds to powers directories)
 */
export type BuildTarget = "npm" | "dev" | "cli" | "power";

/**
 * File mapping with glob pattern support and target filtering.
 * 
 * @property src - Source path relative to base directory (supports glob patterns)
 * @property dest - Destination path relative to target root (supports name placeholder)
 * @property targets - Optional: Only include for specific targets (omit for all targets)
 * 
 * @example Direct mapping: { src: "core/aliases.md", dest: "aliases.md" }
 * @example Glob pattern: { src: "core/protocols/*.md", dest: "protocols/{name}.md" }
 * @example Target-specific: { src: "debug.md", dest: "debug.md", targets: ["dev"] }
 */
export interface FileMapping {
  /** Source path relative to base directory (supports glob patterns) */
  src: string;
  /** Destination path relative to target root (supports {name} placeholder) */
  dest: string;
  /** Optional: Only include for specific targets */
  targets?: BuildTarget[];
}

/**
 * Steering file mappings - Core system files loaded by Kiro IDE.
 * 
 * These files provide foundational kiro-agents functionality including
 * instruction aliases, agent management, mode switching, strict mode control,
 * and interaction patterns. Installed to `~/.kiro/steering/kiro-agents/`
 * 
 * **File Categories:**
 * - Core system files (always loaded): `aliases.md`
 * - Interactive interfaces (manual inclusion): `agents.md`, `modes.md`, `strict.md`
 * - Interaction patterns: `interactions/chit-chat.md` (explicit inclusion)
 * - Mode definitions: `modes/*.md` (auto-discovered via glob)
 * 
 * **Note:** Protocol files are NOT included in steering mappings. They are distributed
 * exclusively through the kiro-protocols Power and loaded on-demand via kiroPowers tool.
 * 
 * **Glob Patterns:**
 * - `kiro/steering/agent-system/*.md` - Auto-discovers mode definitions
 */
export const STEERING_MAPPINGS: FileMapping[] = [
  // Core system files (always loaded)
  { src: "core/aliases.md", dest: "aliases.md" },
  
  // Protocol files (auxiliary, loaded on-demand via /protocols command)
  // Uses glob pattern to auto-discover all protocols
  // { src: "core/protocols/*.md", dest: "protocols/{name}.md" },
  // { src: "kiro/steering/protocols/*.md", dest: "protocols/{name}.md" },
  
  // Interactive interfaces (manual inclusion via /agents, /modes, /strict)
  { src: "core/agents.md", dest: "agents.md" },
  { src: "kiro/steering/modes.md", dest: "modes.md" },
  { src: "core/strict.md", dest: "strict.md" },
  
  // Interaction patterns (loaded by agents/modes)
  // { src: "core/interactions/*.md", dest: "interactions/{name}.md" },
  { src: "core/interactions/chit-chat.md", dest: "interactions/chit-chat.md" },
  
  // Mode definitions (loaded by /modes command)
  { src: "kiro/steering/agent-system/*.md", dest: "modes/{name}.md" },
];

/**
 * Power file mappings - kiro-protocols power files.
 * 
 * Protocol library power with metadata, protocols, and icon.
 * Installed separately to `~/.kiro/powers/kiro-protocols/`
 * 
 * **File Categories:**
 * - Power metadata: `POWER.md`, `mcp.json`, `icon.png`
 * - Protocol files: `steering/*.md` (auto-discovered)
 * 
 * **Note:** Power files are copied from pre-built `powers/kiro-protocols/`
 * directory during npm build. The source protocols are built separately
 * via `scripts/build-powers.ts` using manifest-based protocol discovery
 */
export const POWER_MAPPINGS: FileMapping[] = [
  // Power metadata
  { src: "POWER.md", dest: "POWER.md" },
  { src: "mcp.json", dest: "mcp.json" },
  { src: "icon.png", dest: "icon.png" },
  
  // Protocol files (auto-discovered from steering/)
  { src: "steering/*.md", dest: "steering/{name}.md" },
];

/**
 * Protocol source mappings - Source protocols that get built into kiro-protocols power.
 * 
 * These mappings define which source protocol files get copied and processed
 * into the kiro-protocols power during the build-powers step using manifest-based discovery.
 */
export const PROTOCOL_SOURCE_MAPPINGS: FileMapping[] = [
  { src: "core/protocols/*.md", dest: "steering/{name}.md" },
  { src: "kiro/steering/protocols/*.md", dest: "steering/{name}.md" },
];

/**
 * Expanded file mapping with concrete paths (no globs or placeholders).
 * 
 * Result of expanding a FileMapping with glob resolution and placeholder replacement.
 * Ready for direct use in build operations (read `src`, write `dest`).
 */
export interface ExpandedMapping {
  /** Concrete source path relative to base directory (e.g., 'core/protocols/agent-activation.md') */
  src: string;
  /** Concrete destination path relative to target root (e.g., 'protocols/agent-activation.md') */
  dest: string;
}

/**
 * Resolves glob patterns to actual file paths.
 * 
 * Uses glob library to find all files matching the pattern in the base directory.
 * Returns paths relative to the base directory.
 * 
 * @param pattern - Glob pattern (e.g., `'core/protocols/*.md'`)
 * @param baseDir - Base directory to search from (e.g., `'src'`)
 * @returns Array of resolved file paths relative to `baseDir`
 * 
 * @example Resolve core protocols
 * ```typescript
 * await resolveGlob("core/protocols/*.md", "src");
 * // Returns: ['core/protocols/agent-activation.md', 'core/protocols/agent-management.md', ...]
 * ```
 * 
 * @example Resolve power steering files
 * ```typescript
 * await resolveGlob("steering/*.md", "powers/kiro-protocols");
 * // Returns: ['steering/agent-activation.md', 'steering/mode-switching.md', ...]
 * ```
 */
export async function resolveGlob(pattern: string, baseDir: string): Promise<string[]> {
  return glob(pattern, { cwd: baseDir });
}

/**
 * Expands file mappings by resolving globs and placeholders.
 * 
 * Process:
 * 1. Filter mappings by target (if `targets` specified)
 * 2. Resolve glob patterns to concrete file paths
 * 3. Replace `{name}` placeholder with filename (without extension)
 * 4. Return array of concrete `src`/`dest` pairs
 * 
 * @param mappings - File mappings with potential glob patterns
 * @param baseDir - Base directory for source files (e.g., `'src'`, `'powers/kiro-protocols'`)
 * @param target - Build target for filtering (e.g., `'npm'`, `'dev'`, `'cli'`)
 * @returns Expanded array of concrete file mappings
 * 
 * @example Expand steering mappings for npm build
 * ```typescript
 * const expanded = await expandMappings(STEERING_MAPPINGS, "src", "npm");
 * // Returns: [
 * //   { src: 'core/aliases.md', dest: 'aliases.md' },
 * //   { src: 'core/protocols/agent-activation.md', dest: 'protocols/agent-activation.md' },
 * //   ...
 * // ]
 * ```
 * 
 * @example Expand power mappings for CLI
 * ```typescript
 * const expanded = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "cli");
 * // Returns: [
 * //   { src: 'POWER.md', dest: 'POWER.md' },
 * //   { src: 'steering/agent-activation.md', dest: 'steering/agent-activation.md' },
 * //   ...
 * // ]
 * ```
 */
export async function expandMappings(
  mappings: FileMapping[],
  baseDir: string,
  target: BuildTarget
): Promise<ExpandedMapping[]> {
  const expanded: ExpandedMapping[] = [];
  
  for (const mapping of mappings) {
    // Skip if target-specific and doesn't match
    if (mapping.targets && !mapping.targets.includes(target)) {
      continue;
    }
    
    // Check if source has glob pattern
    if (mapping.src.includes("*")) {
      const files = await resolveGlob(mapping.src, baseDir);
      
      for (const file of files) {
        // Extract filename without extension for placeholder replacement
        const name = basename(file, ".md");
        const dest = mapping.dest.replace("{name}", name);
        
        expanded.push({ src: file, dest });
      }
    } else {
      // Direct mapping, no glob
      expanded.push({ src: mapping.src, dest: mapping.dest });
    }
  }
  
  return expanded;
}

/**
 * Gets all steering files for CLI installation.
 * 
 * Expands STEERING_MAPPINGS with `'cli'` target and returns destination paths only.
 * Used to generate `STEERING_FILES` constant in CLI during build.
 * 
 * **Note:** Protocol files are NOT included. They are distributed through kiro-protocols
 * Power and loaded on-demand via kiroPowers tool, not as steering files.
 * 
 * @returns Array of relative destination paths (e.g., `['aliases.md', 'agents.md', 'modes.md']`)
 * 
 * @example Get steering files for CLI
 * ```typescript
 * const files = await getSteeringFilesForCLI();
 * // Returns: ['aliases.md', 'agents.md', 'modes.md', 'strict.md', 'interactions/chit-chat.md', ...]
 * // Used in bin/cli.template.ts to generate STEERING_FILES constant
 * ```
 */
export async function getSteeringFilesForCLI(): Promise<string[]> {
  const expanded = await expandMappings(STEERING_MAPPINGS, "src", "cli");
  return expanded.map(m => m.dest);
}

/**
 * Gets all power files for CLI installation.
 * 
 * Expands POWER_MAPPINGS with `'cli'` target and returns destination paths only.
 * Used to generate `POWER_FILES` constant in CLI during build.
 * 
 * @returns Array of relative destination paths (e.g., `['POWER.md', 'steering/agent-activation.md']`)
 * 
 * @example Get power files for CLI
 * ```typescript
 * const files = await getPowerFilesForCLI();
 * // Returns: ['POWER.md', 'mcp.json', 'icon.png', 'steering/agent-activation.md', ...]
 * // Used in bin/cli.template.ts to generate POWER_FILES constant
 * ```
 */
export async function getPowerFilesForCLI(): Promise<string[]> {
  const expanded = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "cli");
  return expanded.map(m => m.dest);
}
