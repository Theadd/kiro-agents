/**
 * Centralized file manifest for kiro-agents distribution.
 * 
 * Single source of truth for all file mappings across build targets (npm, dev, cli, power).
 * Uses glob patterns for automatic file discovery and consistent mappings. Eliminates
 * hardcoded file lists in build scripts and CLI through declarative manifest system.
 * 
 * **Key Benefits:**
 * - Single source of truth - change once, applies everywhere
 * - Glob pattern support - auto-discovers files, no manual updates needed
 * - Guaranteed consistency - dev mode matches CLI installation exactly
 * - Type safety - compile-time validation of all mappings
 * - Target filtering - include/exclude files per build target
 * 
 * @example Expand steering mappings for npm build
 * ```typescript
 * const files = await expandMappings(STEERING_MAPPINGS, "src", "npm");
 * // Returns concrete file paths with globs resolved
 * ```
 * 
 * @example Get file lists for CLI generation
 * ```typescript
 * const steeringFiles = await getSteeringFilesForCLI();
 * const powerFiles = await getPowerFilesForCLI();
 * // Used to embed file lists in generated CLI
 * ```
 * 
 * @see scripts/build.ts - Uses STEERING_MAPPINGS and expandMappings for steering files
 * @see scripts/build-powers.ts - Uses PROTOCOL_SOURCE_MAPPINGS for protocol auto-discovery
 * @see scripts/dev-powers.ts - Uses PROTOCOL_SOURCE_MAPPINGS for dev mode protocol builds
 * @see bin/cli.template.ts - Uses getSteeringFilesForCLI() and getPowerFilesForCLI()
 * @see scripts/validate-manifest.ts - Validates manifest consistency
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
 * @property dev - Build to user directory (`~/.kiro/steering/kiro-agents/`) with watch mode
 * @property cli - CLI installation target (generates file lists for `bin/cli.ts` constants)
 * @property power - Power build target (builds to `powers/` directories)
 * 
 * @example Target-specific file filtering
 * ```typescript
 * { src: "debug.md", dest: "debug.md", targets: ["dev"] }
 * // Only included in dev builds, excluded from npm/cli/power
 * ```
 */
export type BuildTarget = "npm" | "dev" | "cli" | "power";

/**
 * File mapping with glob pattern support and target filtering.
 * 
 * Defines how source files map to destination paths across build targets.
 * Supports glob patterns for automatic file discovery and `{name}` placeholder
 * for dynamic destination paths based on source filename.
 * 
 * @property src - Source path relative to base directory (supports glob patterns like `*.md`)
 * @property dest - Destination path relative to target root (supports `{name}` placeholder)
 * @property targets - Optional: Only include for specific targets (omit for all targets)
 * 
 * @example Direct mapping
 * ```typescript
 * { src: "core/aliases.md", dest: "aliases.md" }
 * // Maps src/core/aliases.md → dest/aliases.md
 * ```
 * 
 * @example Glob pattern with placeholder
 * ```typescript
 * { src: "core/protocols/*.md", dest: "protocols/{name}.md" }
 * // Maps src/core/protocols/agent-activation.md → dest/protocols/agent-activation.md
 * // Auto-discovers all .md files in directory
 * ```
 * 
 * @example Target-specific mapping
 * ```typescript
 * { src: "debug.md", dest: "debug.md", targets: ["dev"] }
 * // Only included in dev builds, excluded from npm/cli/power
 * ```
 */
export interface FileMapping {
  /** Source path relative to base directory (supports glob patterns like `*.md`) */
  src: string;
  /** Destination path relative to target root (supports `{name}` placeholder for filename) */
  dest: string;
  /** Optional: Only include for specific targets (omit to include in all targets) */
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
 * 
 * **Note:** Protocol files (including mode definitions) are NOT included in steering mappings.
 * They are distributed exclusively through the kiro-protocols Power and loaded on-demand
 * via kiroPowers tool. Mode definitions like `kiro-spec-mode.md` and `kiro-vibe-mode.md`
 * are now part of the protocol library, not steering files.
 * 
 * @example Adding new steering file
 * ```typescript
 * { src: "core/new-feature.md", dest: "new-feature.md" }
 * // Automatically included in all builds
 * ```
 * 
 * @example Adding mode definition (goes to protocols, not steering)
 * ```typescript
 * // Create src/kiro/steering/protocols/kiro-custom-mode.md
 * // It will be auto-discovered by PROTOCOL_SOURCE_MAPPINGS
 * // Distributed via kiro-protocols Power, not as steering file
 * ```
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
  
  // Mode definitions (loaded by /modes command)
  // { src: "kiro/steering/protocols/kiro-*-mode.md", dest: "modes/{name}.md" },
];

/**
 * Power file mappings - kiro-protocols power files.
 * 
 * Protocol library power with metadata, protocols, and icon.
 * Installed separately to `~/.kiro/powers/kiro-protocols/`
 * 
 * **File Categories:**
 * - Power metadata: `POWER.md`, `mcp.json`, `icon.png`
 * - Protocol files: `steering/*.md` (auto-discovered via glob)
 * 
 * **Note:** Power files are copied from pre-built `powers/kiro-protocols/`
 * directory during npm build. The source protocols are built separately
 * via `scripts/build-powers.ts` using PROTOCOL_SOURCE_MAPPINGS.
 * 
 * @example Adding new power metadata file
 * ```typescript
 * { src: "README.md", dest: "README.md" }
 * // Automatically included in power distribution
 * ```
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
 * into the kiro-protocols power during the build-powers step. Uses glob patterns
 * for automatic protocol discovery - add new protocol files and they're automatically
 * included in builds.
 * 
 * **Auto-Discovered Protocols:**
 * - Core protocols: `src/core/protocols/*.md` (agent-activation, agent-management, etc.)
 * - Kiro protocols: `src/kiro/steering/protocols/*.md` (mode-switching, kiro-*-mode, etc.)
 * 
 * **Benefits:**
 * - Add new protocol → automatically included in builds
 * - No manual file list updates needed
 * - Consistent across production and dev builds
 * 
 * @example Adding new protocol
 * ```typescript
 * // Just create src/core/protocols/new-protocol.md
 * // Glob pattern auto-discovers it, no manifest changes needed
 * ```
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
 * 
 * @property src - Concrete source path relative to base directory (e.g., `'core/protocols/agent-activation.md'`)
 * @property dest - Concrete destination path relative to target root (e.g., `'protocols/agent-activation.md'`)
 * 
 * @example Expanded from glob pattern
 * ```typescript
 * // Input: { src: "core/protocols/*.md", dest: "protocols/{name}.md" }
 * // Output: { src: "core/protocols/agent-activation.md", dest: "protocols/agent-activation.md" }
 * ```
 */
export interface ExpandedMapping {
  /** Concrete source path relative to base directory (e.g., `'core/protocols/agent-activation.md'`) */
  src: string;
  /** Concrete destination path relative to target root (e.g., `'protocols/agent-activation.md'`) */
  dest: string;
}

/**
 * Resolves glob patterns to actual file paths.
 * 
 * Uses glob library to find all files matching the pattern in the base directory.
 * Returns paths relative to the base directory. Supports standard glob syntax
 * including `*` (any characters), `**` (recursive), and `?` (single character).
 * 
 * @param pattern - Glob pattern (e.g., `'core/protocols/*.md'`, `'**​/*.ts'`)
 * @param baseDir - Base directory to search from (e.g., `'src'`, `'powers/kiro-protocols'`)
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
 * 
 * @example Recursive glob
 * ```typescript
 * await resolveGlob("**​/*.md", "src");
 * // Returns all .md files in src/ and subdirectories
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
 * **Glob Resolution:**
 * - `*.md` matches all .md files in directory
 * - `**​/*.md` matches all .md files recursively
 * - Non-glob paths pass through unchanged
 * 
 * **Placeholder Replacement:**
 * - `{name}` replaced with filename without extension
 * - Example: `agent-activation.md` → `{name}` becomes `agent-activation`
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
 * 
 * @example Target filtering
 * ```typescript
 * // Mapping: { src: "debug.md", dest: "debug.md", targets: ["dev"] }
 * await expandMappings([mapping], "src", "npm");  // Returns: [] (excluded)
 * await expandMappings([mapping], "src", "dev");  // Returns: [{ src: "debug.md", dest: "debug.md" }]
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
 * Used to generate `STEERING_FILES` constant in CLI during build. Ensures CLI
 * installs exactly the same files as dev mode builds.
 * 
 * **Note:** Protocol files are NOT included. They are distributed through kiro-protocols
 * Power and loaded on-demand via kiroPowers tool, not as steering files.
 * 
 * @returns Array of relative destination paths (e.g., `['aliases.md', 'agents.md', 'modes.md']`)
 * 
 * @example Get steering files for CLI
 * ```typescript
 * const files = await getSteeringFilesForCLI();
 * // Returns: ['aliases.md', 'agents.md', 'modes.md', 'strict.md', 'modes/kiro-spec-mode.md', ...]
 * // Used in bin/cli.template.ts to generate STEERING_FILES constant
 * ```
 * 
 * @see bin/cli.template.ts - Uses this function to embed file list in generated CLI
 * @see STEERING_MAPPINGS - Source mappings that get expanded
 */
export async function getSteeringFilesForCLI(): Promise<string[]> {
  const expanded = await expandMappings(STEERING_MAPPINGS, "src", "cli");
  return expanded.map(m => m.dest);
}

/**
 * Gets all power files for CLI installation.
 * 
 * Expands POWER_MAPPINGS with `'cli'` target and returns destination paths only.
 * Used to generate `POWER_FILES` constant in CLI during build. Includes power
 * metadata and all protocol files discovered via glob patterns.
 * 
 * @returns Array of relative destination paths (e.g., `['POWER.md', 'steering/agent-activation.md']`)
 * 
 * @example Get power files for CLI
 * ```typescript
 * const files = await getPowerFilesForCLI();
 * // Returns: ['POWER.md', 'mcp.json', 'icon.png', 'steering/agent-activation.md', ...]
 * // Used in bin/cli.template.ts to generate POWER_FILES constant
 * ```
 * 
 * @see bin/cli.template.ts - Uses this function to embed file list in generated CLI
 * @see POWER_MAPPINGS - Source mappings that get expanded
 */
export async function getPowerFilesForCLI(): Promise<string[]> {
  const expanded = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "cli");
  return expanded.map(m => m.dest);
}
