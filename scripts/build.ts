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
import { rmSync, existsSync, readdirSync, statSync, chmodSync, constants } from "fs";
import { STEERING_MAPPINGS, POWER_MAPPINGS, expandMappings, getSteeringFilesForCLI, getPowerFilesForCLI } from "../src/manifest.ts";

/**
 * Build target types for different distribution channels.
 * 
 * Each target determines output location, processing steps, and cleanup behavior.
 * 
 * @property npm - Build npm package, compile CLI, clean after build (for quick validation)
 * @property npm-no-clean - Build npm package but preserve artifacts (used by test.ts and release.ts for inspection/publish)
 * @property dev - Build to user directory (`~/.kiro/steering/kiro-agents/`) with watch mode for rapid iteration
 * 
 * @see scripts/build-powers.ts - Separate build system for powers/ directory using manifest-based protocol discovery
 */
type BuildTarget = "npm" | "npm-no-clean" | "dev";

/**
 * DEPRECATED: File mappings now managed by src/manifest.ts
 * 
 * This section has been replaced by the centralized manifest system which provides:
 * - Single source of truth for all file mappings
 * - Glob pattern support for automatic file discovery
 * - Guaranteed consistency between npm, dev, and cli targets
 * - Type-safe mapping definitions
 * 
 * **Note:** Protocol files are NOT in STEERING_MAPPINGS. They are distributed exclusively
 * through the kiro-protocols Power (POWER_MAPPINGS) and loaded on-demand via kiroPowers tool.
 * 
 * @see src/manifest.ts - STEERING_MAPPINGS and POWER_MAPPINGS
 * @see expandMappings - Function that resolves globs and generates concrete mappings
 */

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
 * Compiles CLI tool from template with embedded file lists.
 * 
 * Process:
 * 1. Gets file lists from manifest (`STEERING_FILES`, `POWER_FILES`)
 * 2. Reads CLI template (`bin/cli.template.ts`)
 * 3. Injects file lists as JSON arrays
 * 4. Writes temporary CLI file (`bin/cli.generated.ts`)
 * 5. Compiles to Node.js-compatible JavaScript
 * 
 * This ensures CLI file lists match exactly what npm and dev builds produce,
 * eliminating the dev mode mismatch issue.
 * 
 * **Build Configuration:**
 * - Target: Node.js runtime
 * - Format: ESM modules
 * - Output: `build/npm/bin/cli.js`
 * 
 * @throws Error if compilation fails
 * 
 * @example Compile CLI with embedded file lists
 * ```typescript
 * await buildCLI();
 * // Generates CLI with embedded file lists from manifest
 * // Compiles bin/cli.generated.ts → build/npm/bin/cli.js
 * ```
 */
async function buildCLI(): Promise<void> {
  console.log("🔧 Building CLI with embedded file lists from manifest...\n");
  
  // Get file lists from manifest
  const steeringFiles = await getSteeringFilesForCLI();
  const powerFiles = await getPowerFilesForCLI();
  
  console.log(`📋 Embedding ${steeringFiles.length} steering files`);
  console.log(`📋 Embedding ${powerFiles.length} power files\n`);
  
  // Read CLI template
  const template = await Bun.file("bin/cli.template.ts").text();
  
  // Inject file lists (format as TypeScript const arrays)
  const cliCode = template
    .replace("/* STEERING_FILES_PLACEHOLDER */", JSON.stringify(steeringFiles, null, 2))
    .replace("/* POWER_FILES_PLACEHOLDER */", JSON.stringify(powerFiles, null, 2));
  
  // Write generated CLI
  await Bun.write("bin/cli.generated.ts", cliCode);
  
  // Compile generated CLI
  const result = await Bun.build({
    entrypoints: ["./bin/cli.generated.ts"],
    outdir: "./build/npm/bin",
    target: "node",
    format: "esm",
    naming: "cli.js",
  });
  
  if (!result.success) {
    console.error("❌ CLI build failed:", result.logs);
    throw new Error("CLI build failed");
  }
  
  console.log("✅ CLI built: build/npm/bin/cli.js\n");
}



/**
 * Copies power files to npm distribution using manifest.
 * 
 * Copies pre-built power files from `powers/kiro-protocols/` directory to `build/npm/power/`
 * so they can be included in the npm package and installed by the CLI. This enables dual
 * installation where npm installs both steering files AND the kiro-protocols power dependency,
 * with automatic registry registration for Powers UI integration.
 * 
 * Uses `POWER_MAPPINGS` from manifest to auto-discover all power files including protocols.
 * 
 * @example Copy power files for npm package
 * ```typescript
 * await copyPowerFiles();
 * // Copies powers/kiro-protocols/POWER.md, mcp.json, icon.png, steering/*.md to build/npm/power/
 * ```
 * 
 * @see src/manifest.ts - POWER_MAPPINGS source of truth
 * @see bin/cli.ts - CLI that installs these to ~/.kiro/powers/kiro-protocols/ and updates registry.json
 */
async function copyPowerFiles(): Promise<void> {
  console.log("\n⚡ Copying power files from manifest...\n");
  
  // Expand power mappings with glob resolution
  const powerFiles = await expandMappings(POWER_MAPPINGS, "powers/kiro-protocols", "npm");
  
  console.log(`📋 Copying ${powerFiles.length} power files...\n`);
  
  for (const mapping of powerFiles) {
    const srcPath = join("powers/kiro-protocols", mapping.src);
    const destPath = join("build/npm/power", mapping.dest);
    
    const srcFile = Bun.file(srcPath);
    
    if (!await srcFile.exists()) {
      console.warn(`⚠️  Power file not found: ${srcPath}`);
      continue;
    }
    
    const content = await srcFile.arrayBuffer();
    await Bun.write(destPath, content, { createPath: true });
    console.log(`✅ Copied: ${mapping.src} → ${mapping.dest}`);
  }
}

/**
 * Builds npm package distribution using manifest.
 * 
 * Compiles CLI tool with embedded file lists and processes all steering files with substitutions.
 * Output goes to `build/npm/` which is included in npm package then cleaned.
 * The CLI handles power installation and `registry.json` registration during user installation.
 * 
 * Uses `STEERING_MAPPINGS` from manifest to discover files (mix of explicit paths and glob patterns).
 * This ensures consistency with dev mode and CLI installation.
 * 
 * **Note:** Protocol files are NOT in steering mappings. They are distributed exclusively
 * through the kiro-protocols Power (copied from `powers/kiro-protocols/`) and loaded
 * on-demand via kiroPowers tool.
 * 
 * **Build Steps:**
 * 1. Compile CLI with embedded file lists from manifest
 * 2. Expand steering mappings with glob resolution (excludes protocols)
 * 3. Process steering files with substitutions
 * 4. Copy power files from `powers/kiro-protocols/` to `build/npm/power/`
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example Build npm distribution
 * ```typescript
 * await buildNpm(config);
 * // Creates build/npm/bin/cli.js, build/npm/dist/*.md, and build/npm/power/*
 * ```
 */
async function buildNpm(config: Config): Promise<void> {
  console.log("📦 Building npm distribution from manifest...\n");
  
  // Build CLI with embedded file lists
  await buildCLI();
  
  // Expand steering mappings with glob resolution
  const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "npm");
  
  console.log(`📋 Building ${steeringFiles.length} steering files...\n`);
  
  // Build all steering files
  for (const mapping of steeringFiles) {
    const srcPath = join("src", mapping.src);
    const destPath = join("build/npm/dist", mapping.dest);
    await buildFile(srcPath, destPath, config.substitutions, { target: "npm" });
  }
  
  // Copy power files
  await copyPowerFiles();
  
  console.log("\n✅ npm distribution built in build/npm/");
}



/**
 * Makes all files in a directory writable (removes readonly).
 * 
 * Recursively traverses directory and removes readonly flag from all files.
 * Used before rebuilding to allow overwriting files that were set readonly
 * after previous build or CLI installation.
 * 
 * **Usage:** Called by `buildDev` before processing files to handle CLI-installed
 * readonly files. Paired with `makeReadonly` in try/finally pattern.
 * 
 * @param dirPath - Directory path to make writable
 * 
 * @example
 * ```typescript
 * makeWritable(userSteeringPath);
 * try {
 *   // Build files...
 * } finally {
 *   makeReadonly(userSteeringPath);
 * }
 * ```
 * 
 * @see makeReadonly - Companion function to restore readonly status
 * @see buildDev - Uses this for readonly file handling
 */
function makeWritable(dirPath: string): void {
  if (!existsSync(dirPath)) {
    return;
  }
  
  const entries = readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      makeWritable(fullPath);
    } else if (entry.isFile()) {
      try {
        const stats = statSync(fullPath);
        if (!(stats.mode & constants.S_IWUSR)) {
          chmodSync(fullPath, constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH);
        }
      } catch {
        // Ignore errors
      }
    }
  }
}

/**
 * Makes all files in a directory readonly.
 * 
 * Recursively traverses directory and sets readonly flag on all files.
 * Used after build to protect generated files from accidental modification.
 * 
 * **Usage:** Called by `buildDev` after processing files to restore readonly
 * status. Placed in finally block to ensure execution even if build fails.
 * 
 * @param dirPath - Directory path to make readonly
 * 
 * @example
 * ```typescript
 * makeWritable(userSteeringPath);
 * try {
 *   // Build files...
 * } finally {
 *   makeReadonly(userSteeringPath);
 * }
 * ```
 * 
 * @see makeWritable - Companion function to remove readonly status
 * @see buildDev - Uses this for readonly file handling
 */
function makeReadonly(dirPath: string): void {
  if (!existsSync(dirPath)) {
    return;
  }
  
  const entries = readdirSync(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      makeReadonly(fullPath);
    } else if (entry.isFile()) {
      try {
        chmodSync(fullPath, constants.S_IRUSR | constants.S_IRGRP | constants.S_IROTH);
      } catch {
        // Ignore errors
      }
    }
  }
}

/**
 * Builds directly to user's Kiro directory for development using manifest.
 * 
 * Processes steering files and writes to `~/.kiro/steering/kiro-agents/`
 * No CLI compilation needed. Used with watch mode for rapid iteration.
 * 
 * Uses `STEERING_MAPPINGS` from manifest - SAME as npm build - ensuring dev mode
 * installs exactly the same files as CLI installation. This fixes the dev mode mismatch!
 * 
 * **Note:** Protocol files are NOT included. They are distributed through kiro-protocols
 * Power (use `bun run dev:powers` for protocol development) and loaded on-demand via
 * kiroPowers tool.
 * 
 * **Readonly File Handling:**
 * CLI-installed files are set readonly to prevent accidental modification. This function
 * temporarily makes files writable before building, then restores readonly status after.
 * Uses try/finally to ensure readonly is restored even if build fails.
 * 
 * **Build Steps:**
 * 1. Resolve user home directory
 * 2. Make existing files writable (handles CLI-installed readonly files)
 * 3. Expand steering mappings (mix of explicit paths and glob patterns, excludes protocols)
 * 4. Process steering files with substitutions
 * 5. Write directly to `~/.kiro/steering/kiro-agents/`
 * 6. Restore readonly status on all files
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example Build to user directory
 * ```typescript
 * await buildDev(config);
 * // Makes files writable → builds → restores readonly
 * // Writes files to ~/.kiro/steering/kiro-agents/
 * // Files match exactly what CLI installs (no protocols)
 * ```
 * 
 * @see makeWritable - Removes readonly flag from files
 * @see makeReadonly - Sets readonly flag on files
 */
async function buildDev(config: Config): Promise<void> {
  console.log("🔧 Building dev mode from manifest (user directory)...\n");
  
  const userSteeringPath = join(homedir(), ".kiro", "steering", "kiro-agents");
  
  // Make files writable temporarily (handles CLI-installed readonly files)
  console.log("🔓 Making files writable...");
  makeWritable(userSteeringPath);
  
  try {
    // Expand steering mappings - SAME as npm, ensures consistency!
    const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "dev");
    
    console.log(`📋 Building ${steeringFiles.length} steering files...\n`);
    
    // Build all files to user directory
    for (const mapping of steeringFiles) {
      const srcPath = join("src", mapping.src);
      const destPath = join(userSteeringPath, mapping.dest);
      await buildFile(srcPath, destPath, config.substitutions, { target: "dev" });
    }
    
    console.log(`\n✅ Dev build completed in ${userSteeringPath}/`);
    console.log(`✅ Files match CLI installation (no more dev mode mismatch!)`);
  } finally {
    // Restore readonly status
    console.log("🔒 Restoring readonly status...");
    makeReadonly(userSteeringPath);
  }
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
 * **Note:** Powers are built separately via `scripts/build-powers.ts` using manifest-based protocol discovery
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
 * @see scripts/build-powers.ts - Separate build system for powers/ directory using manifest-based protocol discovery
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
