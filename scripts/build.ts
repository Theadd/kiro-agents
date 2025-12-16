#!/usr/bin/env bun
/**
 * Dual-distribution build system for kiro-agents package.
 * 
 * Processes source files from `src/` with dynamic substitutions and maps them to
 * target directories for npm package or Kiro Power distribution. Supports three
 * build modes plus dev watch mode for rapid iteration.
 * 
 * **Build Modes:**
 * - `npm` - Compiles CLI, processes steering files, cleans after publish
 * - `npm-no-clean` - Same as npm but preserves build artifacts for inspection
 * - `dev` - Builds to `~/.kiro/steering/kiro-agents/` with watch mode
 * 
 * **Key Features:**
 * - Dynamic substitution system via config functions
 * - Deterministic builds (same input = same output)
 * - Cross-platform path handling
 * - File permission management for npm installs
 * 
 * @example Build for npm
 * ```bash
 * bun run build
 * # Compiles CLI, processes files, publishes, cleans
 * ```
 * 
 * @example Dev mode with watch
 * ```bash
 * bun run dev
 * # Builds to user directory, watches for changes
 * ```
 * 
 * @see src/config.ts - Base substitution definitions
 * @see src/kiro/config.ts - Kiro-specific substitutions
 */
import { homedir } from "os";
import { join } from "path";
import { rmSync } from "fs";

/**
 * Build target types for different distribution channels.
 * 
 * Each target determines output location, processing steps, and cleanup behavior.
 * 
 * @property npm - Build npm package, compile CLI, clean after build (for quick validation)
 * @property npm-no-clean - Build npm package but preserve artifacts (used by test.ts and release.ts for inspection/publish)
 * @property dev - Build to user directory (`~/.kiro/steering/kiro-agents/`) with watch mode for rapid iteration
 * 
 * @see scripts/build-powers.ts - Separate build system for powers/ directory
 */
type BuildTarget = "npm" | "npm-no-clean" | "dev";

/**
 * File mappings for npm distribution.
 * 
 * Maps source files to npm package structure (installed to `~/.kiro/steering/kiro-agents/`).
 * Core system files are always loaded by Kiro IDE.
 * 
 * **Key exclusion:** `agent-system.md` is NOT included - npm distribution relies on `aliases.md`
 * which contains the agent activation alias. The full `agent-system.md` context is only
 * included in Power distribution for better Kiro ecosystem integration.
 * 
 * **File categories:**
 * - Core system files (always loaded): aliases.md, strict-mode.md
 * - Protocol files (auxiliary): agent-activation.md, agent-management.md, agent-creation.md, mode-switching.md, mode-management.md
 * - Interactive interfaces (manual): agents.md, modes.md, strict.md
 * - Interaction patterns: chit-chat.md, interaction-styles.md
 * - Mode definitions: kiro-spec-mode.md, kiro-vibe-mode.md
 * 
 * @see NPM_POWER_FILES - Power files copied from powers/kiro-protocols/ during npm build
 */
const NPM_FILE_MAPPINGS = [
  // Core system files (always loaded)
  { src: "src/core/aliases.md", dest: "build/npm/dist/aliases.md" },
  { src: "src/core/strict-mode.md", dest: "build/npm/dist/strict-mode.md" },
  
  // Protocol files (auxiliary, not in steering list)
  { src: "src/core/protocols/agent-activation.md", dest: "build/npm/dist/protocols/agent-activation.md" },
  { src: "src/core/protocols/agent-management.md", dest: "build/npm/dist/protocols/agent-management.md" },
  { src: "src/core/protocols/agent-creation.md", dest: "build/npm/dist/protocols/agent-creation.md" },
  { src: "src/kiro/steering/protocols/mode-switching.md", dest: "build/npm/dist/protocols/mode-switching.md" },
  { src: "src/kiro/steering/protocols/mode-management.md", dest: "build/npm/dist/protocols/mode-management.md" },
  
  // Interactive interfaces (manual inclusion)
  { src: "src/core/agents.md", dest: "build/npm/dist/agents.md" },
  { src: "src/kiro/steering/modes.md", dest: "build/npm/dist/modes.md" },
  { src: "src/core/strict.md", dest: "build/npm/dist/strict.md" },
  
  // Interaction patterns
  { src: "src/core/interactions/chit-chat.md", dest: "build/npm/dist/interactions/chit-chat.md" },
  { src: "src/core/interactions/interaction-styles.md", dest: "build/npm/dist/interactions/interaction-styles.md" },
  
  // Mode definitions
  { src: "src/kiro/steering/agent-system/kiro-spec-mode.md", dest: "build/npm/dist/modes/kiro-spec-mode.md" },
  { src: "src/kiro/steering/agent-system/kiro-vibe-mode.md", dest: "build/npm/dist/modes/kiro-vibe-mode.md" },
] as const;

/**
 * Power files to copy to npm distribution.
 * 
 * These files are copied from the `powers/kiro-protocols/` directory to `build/npm/power/`
 * so they can be installed alongside steering files. The CLI will install these to
 * `~/.kiro/powers/kiro-protocols/` during npm installation and register the power
 * in Kiro's registry.json for automatic UI integration.
 * 
 * **Source:** Pre-built kiro-protocols power from multi-power system
 * **Destination:** npm package for dual installation (steering + power)
 * 
 * @see bin/cli.ts - CLI that installs these files and registers power in registry.json
 * @see powers/kiro-protocols/ - Source power directory
 */
const NPM_POWER_FILES = [
  { src: "powers/kiro-protocols/POWER.md", dest: "build/npm/power/POWER.md" },
  { src: "powers/kiro-protocols/mcp.json", dest: "build/npm/power/mcp.json" },
  { src: "powers/kiro-protocols/icon.png", dest: "build/npm/power/icon.png" },
  { src: "powers/kiro-protocols/steering/agent-activation.md", dest: "build/npm/power/steering/agent-activation.md" },
  { src: "powers/kiro-protocols/steering/agent-creation.md", dest: "build/npm/power/steering/agent-creation.md" },
  { src: "powers/kiro-protocols/steering/agent-management.md", dest: "build/npm/power/steering/agent-management.md" },
  { src: "powers/kiro-protocols/steering/mode-management.md", dest: "build/npm/power/steering/mode-management.md" },
  { src: "powers/kiro-protocols/steering/mode-switching.md", dest: "build/npm/power/steering/mode-switching.md" },
] as const;



// File mappings for dev mode (user directory)
const DEV_FILE_MAPPINGS = NPM_FILE_MAPPINGS.map(mapping => ({
  src: mapping.src,
  dest: mapping.dest.replace("build/npm/dist/", "")
}));

/**
 * Options passed to substitution functions during build.
 * 
 * @property target - Current build target (npm/power/dev)
 */
interface SubstitutionOptions {
  target: BuildTarget;
}

/**
 * Substitution function map for dynamic content replacement with multi-pass support.
 * 
 * Each function receives SubstitutionOptions and returns the replacement string.
 * Keys use triple-brace syntax (e.g., `{{{VERSION}}}`) in source files. Supports
 * nested substitutions where replacement values contain additional placeholders.
 * 
 * **Common substitutions:**
 * - `{{{VERSION}}}` - Package version from package.json
 * - `{{{PROTOCOLS_PATH}}}` - Path to protocols directory (varies by target)
 * - `{{{AGENT_MANAGEMENT_PROTOCOL}}}` - Injected protocol content from .md files
 * - `{{{KIRO_MODE_ALIASES}}}` - Mode alias definition (contains nested `{{{KIRO_PROTOCOLS_PATH}}}`)
 * 
 * **Multi-pass processing:**
 * Substitution values can contain placeholders that get resolved in subsequent passes.
 * This enables modular content injection where injected content references other substitutions.
 * 
 * @example Basic substitution
 * ```typescript
 * {
 *   '{{{VERSION}}}': ({ target }) => '1.0.0'
 * }
 * ```
 * 
 * @example Target-specific substitution
 * ```typescript
 * {
 *   '{{{PROTOCOLS_PATH}}}': ({ target }) => 
 *     target === 'power' 
 *       ? '~/.kiro/powers/.../protocols' 
 *       : '~/.kiro/steering/.../protocols'
 * }
 * ```
 * 
 * @example Nested substitution (multi-pass)
 * ```typescript
 * {
 *   '{{{KIRO_MODE_ALIASES}}}': ({ target }) => {
 *     // Returns content containing {{{KIRO_PROTOCOLS_PATH}}}
 *     return extractSection('src/kiro/shared-aliases.md', 'Mode System Alias');
 *   },
 *   '{{{KIRO_PROTOCOLS_PATH}}}': ({ target }) => 
 *     target === 'power' ? '~/.kiro/powers/.../protocols' : '~/.kiro/steering/.../protocols'
 * }
 * // First pass resolves {{{KIRO_MODE_ALIASES}}}, second pass resolves {{{KIRO_PROTOCOLS_PATH}}}
 * ```
 */
type Substitutions = { [key: string]: (options: SubstitutionOptions) => string };

/**
 * Configuration object loaded from config files.
 * 
 * @property substitutions - Map of placeholder keys to replacement functions
 */
interface Config {
  substitutions: Substitutions;
}

/**
 * Loads Kiro-specific build configuration with substitution functions.
 * 
 * Always loads `src/kiro/config.ts` which contains all substitutions needed for
 * kiro-agents builds (npm, power, dev). The Kiro config extends base config patterns
 * but provides Kiro-specific implementations for all substitution keys.
 * 
 * **Why Kiro config for all builds:**
 * - kiro-agents is a Kiro-specific package (not cross-IDE)
 * - All builds need Kiro paths, mode system, and enhanced features
 * - Base config (`src/config.ts`) exists as reference pattern only
 * 
 * @returns Configuration object with Kiro-specific substitution functions
 * 
 * @example Loading config
 * ```typescript
 * const config = await loadConfig();
 * // Always uses src/kiro/config.ts
 * // config.substitutions['{{{VERSION}}}']({ target: 'npm' }) => '1.4.0'
 * // config.substitutions['{{{KIRO_MODE_ALIASES}}}']({ target: 'power' }) => '...'
 * ```
 * 
 * @see src/kiro/config.ts - Kiro-specific config with all substitutions
 * @see src/config.ts - Base config pattern (reference only)
 */
async function loadConfig(): Promise<Config> {
  // Import kiro config (which extends base config)
  // Used for ALL kiro-agents builds (npm, power, dev)
  const kiroConfig = await import("../src/kiro/config.ts");
  return kiroConfig as Config;
}

/**
 * Applies all substitutions to file content with multi-pass processing.
 * 
 * Replaces placeholder keys (e.g., `{{{VERSION}}}`) with values from substitution
 * functions. Supports nested substitutions where replacement values contain additional
 * placeholders. Processes iteratively until no placeholders remain or max iterations reached.
 * 
 * **Multi-pass processing:**
 * - Pass 1: Replaces all found placeholders with substitution values
 * - Pass 2+: Processes any new placeholders introduced by previous pass
 * - Continues until no placeholders remain (max 10 iterations)
 * - Warns if circular reference detected (max iterations reached)
 * 
 * **Use cases:**
 * - Simple: `{{{VERSION}}}` → `"1.4.0"`
 * - Nested: `{{{KIRO_MODE_ALIASES}}}` contains `{{{KIRO_PROTOCOLS_PATH}}}` → both resolved
 * - Chained: Substitution A injects placeholder B, which gets resolved in next pass
 * 
 * @param content - Original file content with placeholders
 * @param substitutions - Map of placeholder keys to replacement functions
 * @param options - Build options passed to substitution functions
 * @returns Processed content with all substitutions applied (or warning if circular)
 * 
 * @example Simple substitution (single pass)
 * ```typescript
 * const content = "Version: {{{VERSION}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'npm' });
 * // Pass 1: "Version: 1.4.0" (no more placeholders, done)
 * ```
 * 
 * @example Nested substitution (multi-pass)
 * ```typescript
 * // substitutions['{{{ALIAS}}}'] returns "Path: {{{PROTOCOLS_PATH}}}"
 * // substitutions['{{{PROTOCOLS_PATH}}}'] returns "~/.kiro/steering/protocols"
 * const content = "{{{ALIAS}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'npm' });
 * // Pass 1: "Path: {{{PROTOCOLS_PATH}}}" (found new placeholder)
 * // Pass 2: "Path: ~/.kiro/steering/protocols" (no more placeholders, done)
 * ```
 * 
 * @example Circular reference detection
 * ```typescript
 * // substitutions['{{{A}}}'] returns "{{{B}}}"
 * // substitutions['{{{B}}}'] returns "{{{A}}}"
 * const content = "{{{A}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'npm' });
 * // Pass 1-10: Keeps swapping A↔B
 * // Warns: "Reached maximum substitution iterations (10). Possible circular reference."
 * ```
 */
async function applySubstitutions(
  content: string, 
  substitutions: Substitutions, 
  options: SubstitutionOptions
): Promise<string> {
  let result = content;
  let maxIterations = 10; // Prevent infinite loops
  let iteration = 0;
  
  // Keep processing until no more substitutions found or max iterations reached
  while (iteration < maxIterations) {
    let hasSubstitutions = false;
    
    for (const [key, fn] of Object.entries(substitutions)) {
      if (result.includes(key)) {
        const value = fn(options);
        result = result.replaceAll(key, value);
        hasSubstitutions = true;
      }
    }
    
    // If no substitutions were found in this pass, we're done
    if (!hasSubstitutions) {
      break;
    }
    
    iteration++;
  }
  
  if (iteration >= maxIterations) {
    console.warn(`⚠️  Warning: Reached maximum substitution iterations (${maxIterations}). Possible circular reference.`);
  }
  
  return result;
}

/**
 * Builds a single file with substitutions applied.
 * 
 * Reads source file, applies all substitutions, and writes to destination.
 * Creates destination directory if needed. Skips missing source files with warning.
 * 
 * @param srcPath - Source file path (relative to project root)
 * @param destPath - Destination file path (relative to project root)
 * @param substitutions - Map of placeholder keys to replacement functions
 * @param options - Build options passed to substitution functions
 * 
 * @example
 * ```typescript
 * await buildFile(
 *   'src/core/aliases.md',
 *   'build/npm/dist/aliases.md',
 *   substitutions,
 *   { target: 'npm' }
 * );
 * // Reads src/core/aliases.md, applies substitutions, writes to build/npm/dist/aliases.md
 * ```
 */
async function buildFile(
  srcPath: string, 
  destPath: string, 
  substitutions: Substitutions, 
  options: SubstitutionOptions
): Promise<void> {
  // Read source file
  const file = Bun.file(srcPath);
  
  // Check if file exists
  if (!await file.exists()) {
    console.warn(`⚠️  Source file not found: ${srcPath}`);
    return;
  }
  
  const content = await file.text();
  
  // Apply substitutions
  const processed = await applySubstitutions(content, substitutions, options);
  
  // Ensure destination directory exists
  await Bun.write(destPath, processed, { createPath: true });
  
  console.log(`✅ Built: ${srcPath} → ${destPath}`);
}

/**
 * Compiles CLI tool from TypeScript to JavaScript.
 * 
 * Uses Bun.build to compile `bin/cli.ts` to Node.js-compatible JavaScript.
 * Only runs during npm builds (not dev builds).
 * 
 * **Build Configuration:**
 * - Target: Node.js runtime
 * - Format: ESM modules
 * - Output: `build/npm/bin/cli.js`
 * 
 * @throws Error if compilation fails
 * 
 * @example
 * ```typescript
 * await buildCLI();
 * // Compiles bin/cli.ts → build/npm/bin/cli.js
 * ```
 */
async function buildCLI(): Promise<void> {
  console.log("🔧 Building CLI...\n");
  
  const result = await Bun.build({
    entrypoints: ["./bin/cli.ts"],
    outdir: "./build/npm/bin",
    target: "node",
    format: "esm",
    naming: "[dir]/[name].js",
  });
  
  if (!result.success) {
    console.error("❌ CLI build failed:", result.logs);
    throw new Error("CLI build failed");
  }
  
  console.log("✅ CLI built: build/npm/bin/cli.js\n");
}



/**
 * Copies power files to npm distribution.
 * 
 * Copies pre-built power files from `powers/kiro-protocols/` directory to `build/npm/power/`
 * so they can be included in the npm package and installed by the CLI. This enables dual
 * installation where npm installs both steering files AND the kiro-protocols power dependency,
 * with automatic registry registration for Powers UI integration.
 * 
 * @example
 * ```typescript
 * await copyPowerFiles();
 * // Copies powers/kiro-protocols/POWER.md, mcp.json, icon.png, steering/*.md to build/npm/power/
 * ```
 * 
 * @see NPM_POWER_FILES - List of files to copy
 * @see bin/cli.ts - CLI that installs these to ~/.kiro/powers/kiro-protocols/ and updates registry.json
 */
async function copyPowerFiles(): Promise<void> {
  console.log("\n⚡ Copying power files...\n");
  
  for (const mapping of NPM_POWER_FILES) {
    const srcFile = Bun.file(mapping.src);
    
    if (!await srcFile.exists()) {
      console.warn(`⚠️  Power file not found: ${mapping.src}`);
      continue;
    }
    
    const content = await srcFile.arrayBuffer();
    await Bun.write(mapping.dest, content, { createPath: true });
    console.log(`✅ Copied: ${mapping.src} → ${mapping.dest}`);
  }
}

/**
 * Builds npm package distribution.
 * 
 * Compiles CLI tool and processes all steering files with substitutions.
 * Output goes to `build/npm/` which is included in npm package then cleaned.
 * The CLI handles power installation and registry.json registration during user installation.
 * 
 * **Build Steps:**
 * 1. Compile CLI: `bin/cli.ts` → `build/npm/bin/cli.js`
 * 2. Process steering files with substitutions
 * 3. Map files to `build/npm/dist/` structure
 * 4. Copy power files from `powers/kiro-protocols/` to `build/npm/power/`
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example
 * ```typescript
 * await buildNpm(config);
 * // Creates build/npm/bin/cli.js, build/npm/dist/*.md, and build/npm/power/*
 * ```
 */
async function buildNpm(config: Config): Promise<void> {
  console.log("📦 Building npm distribution...\n");
  
  // Build CLI
  await buildCLI();
  
  // Build all npm files
  for (const mapping of NPM_FILE_MAPPINGS) {
    await buildFile(mapping.src, mapping.dest, config.substitutions, { target: "npm" });
  }
  
  // Copy power files
  await copyPowerFiles();
  
  console.log("\n✅ npm distribution built in build/npm/");
}



/**
 * Builds directly to user's Kiro directory for development.
 * 
 * Processes steering files and writes to `~/.kiro/steering/kiro-agents/`.
 * No CLI compilation needed. Used with watch mode for rapid iteration.
 * 
 * **Build Steps:**
 * 1. Resolve user home directory
 * 2. Process steering files with substitutions
 * 3. Write directly to `~/.kiro/steering/kiro-agents/`
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example
 * ```typescript
 * await buildDev(config);
 * // Writes files to ~/.kiro/steering/kiro-agents/
 * ```
 */
async function buildDev(config: Config): Promise<void> {
  console.log("🔧 Building dev mode (user directory)...\n");
  
  const userSteeringPath = join(homedir(), ".kiro", "steering", "kiro-agents");
  
  // Build all files to user directory
  for (const mapping of DEV_FILE_MAPPINGS) {
    const destPath = join(userSteeringPath, mapping.dest);
    await buildFile(mapping.src, destPath, config.substitutions, { target: "dev" });
  }
  
  console.log(`\n✅ Dev build completed in ${userSteeringPath}/`);
}

/**
 * Main build orchestrator for all distribution targets.
 * 
 * Loads Kiro configuration, executes target-specific build, and optionally cleans
 * artifacts. Handles npm and dev builds with appropriate post-processing.
 * 
 * **Build Flow:**
 * 1. Load Kiro config with substitution functions
 * 2. Execute target-specific build (npm/dev)
 * 3. Clean artifacts if target is 'npm' (not 'npm-no-clean')
 * 
 * **Target behaviors:**
 * - `npm` - Compiles CLI, processes files, cleans after (for quick validation)
 * - `npm-no-clean` - Same as npm but preserves artifacts (for release script)
 * - `dev` - Builds to user directory with watch mode (for development)
 * 
 * **Note:** Powers are built separately via `scripts/build-powers.ts`
 * 
 * @param target - Build target (npm/npm-no-clean/dev)
 * 
 * @example npm build with cleanup
 * ```typescript
 * await build('npm');
 * // Loads Kiro config, builds to build/npm/, then cleans directory
 * ```
 * 
 * @example npm build without cleanup (used by release script)
 * ```typescript
 * await build('npm-no-clean');
 * // Loads Kiro config, builds to build/npm/, preserves for npm publish
 * ```
 * 
 * @see scripts/build-powers.ts - Separate build system for powers/ directory
 */
async function build(target: BuildTarget): Promise<void> {
  console.log(`🔨 Starting build: ${target}...\n`);
  
  // Load Kiro configuration (used for all builds)
  const config = await loadConfig();
  console.log(`📝 Loaded configuration with ${Object.keys(config.substitutions).length} substitutions\n`);
  
  // Build based on target
  if (target === "npm" || target === "npm-no-clean") {
    await buildNpm(config);
    
    // Clean build directory after successful build (unless npm-no-clean)
    if (target === "npm") {
      console.log("\n🧹 Cleaning build directory...");
      rmSync("build/npm", { recursive: true, force: true });
      console.log("✅ Build directory cleaned");
    }
  } else if (target === "dev") {
    await buildDev(config);
  }
  
  console.log("\n✨ Build completed successfully!");
  
  if (target === "npm") {
    console.log("\n📁 Build output: build/npm/ (cleaned after build)");
  } else if (target === "dev") {
    console.log(`\n📁 Build output: ~/.kiro/steering/kiro-agents/`);
  }
}

/**
 * Development mode with file watching for rapid iteration.
 * 
 * Performs initial build to user directory, then watches `src/` for changes.
 * Automatically rebuilds on file modifications. Handles Ctrl-C gracefully.
 * 
 * **Workflow:**
 * 1. Initial build to `~/.kiro/steering/kiro-agents/`
 * 2. Watch `src/` directory recursively
 * 3. Rebuild on any file change
 * 4. Continue until Ctrl-C
 * 
 * @example
 * ```bash
 * bun run dev
 * # Initial build, then watches for changes
 * # Edit src/core/aliases.md → auto-rebuilds
 * ```
 */
async function devMode(): Promise<void> {
  console.log("👀 Starting dev mode (watch)...\n");
  
  // Initial build
  await build("dev");
  
  console.log("\n👀 Watching src/ for changes...\n");
  
  const { watch } = await import("fs");
  const watcher = watch("src", { recursive: true }, async (event, filename) => {
    if (filename) {
      console.log(`\n🔄 Detected ${event} in ${filename}`);
      console.log("🔨 Rebuilding...\n");
      
      try {
        await build("dev");
      } catch (error) {
        console.error("❌ Build failed:", error);
      }
    }
  });
  
  // Handle Ctrl-C gracefully
  process.on("SIGINT", () => {
    console.log("\n\n👋 Closing watcher...");
    watcher.close();
    process.exit(0);
  });
}

// Main execution
const args = process.argv.slice(2);
const command = args[0];

if (command === "dev") {
  devMode();
} else if (command === "npm") {
  build("npm");
} else if (command === "npm-no-clean") {
  build("npm-no-clean");
} else {
  console.error("❌ Invalid command. Use: dev, npm, or npm-no-clean");
  console.error("💡 To build powers, use: bun run build:powers");
  process.exit(1);
}
