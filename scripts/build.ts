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
 * - `power` - Processes files to `power/` directory for GitHub distribution
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
 * @example Build for Power
 * ```bash
 * bun run build:power
 * # Processes files to power/ directory
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
 * @property npm - Build npm package, compile CLI, clean after build (used by publish workflow)
 * @property npm-no-clean - Build npm package but preserve artifacts (used by release script for npm publish)
 * @property power - Build Kiro Power distribution to `power/` directory (committed to GitHub)
 * @property dev - Build to user directory (`~/.kiro/steering/kiro-agents/`) with watch mode for rapid iteration
 */
type BuildTarget = "npm" | "npm-no-clean" | "power" | "dev";

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
 * - Protocol files (auxiliary): agent-activation.mdx, mode-switching.mdx, etc.
 * - Interactive interfaces (manual): agents.md, modes.md, strict.md
 * - Interaction patterns: chit-chat.md, interaction-styles.md
 * - Mode definitions: kiro-spec-mode.md, kiro-vibe-mode.md
 * 
 * @see POWER_FILE_MAPPINGS - Power distribution (includes agent-system.md)
 */
const NPM_FILE_MAPPINGS = [
  // Core system files (always loaded)
  { src: "src/core/aliases.md", dest: "build/npm/dist/aliases.md" },
  { src: "src/core/strict-mode.md", dest: "build/npm/dist/strict-mode.md" },
  
  // Protocol files (auxiliary, not in steering list)
  { src: "src/core/protocols/agent-activation.mdx", dest: "build/npm/dist/protocols/agent-activation.mdx" },
  { src: "src/kiro/steering/protocols/mode-switching.mdx", dest: "build/npm/dist/protocols/mode-switching.mdx" },
  { src: "src/kiro/steering/protocols/mode-management.mdx", dest: "build/npm/dist/protocols/mode-management.mdx" },
  
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
 * File mappings for Power distribution.
 * 
 * Maps source files to Kiro Power structure (installed to `.kiro/powers/kiro-agents/`).
 * Power distribution is committed to GitHub and installed via Kiro IDE Powers panel.
 * 
 * **Key differences from npm distribution:**
 * - Includes `agent-system.md` (provides full agent system context and documentation)
 * - Auto-updates from GitHub (npm requires manual reinstall)
 * - Keyword-based automatic loading (better Kiro integration)
 * - Workspace-specific installation (npm is global)
 * - Includes POWER.md and mcp.json for Power metadata
 * 
 * **File categories:**
 * - Power metadata: POWER.md, mcp.json
 * - Core system files: aliases.md, agent-system.md, modes-system.md, strict-mode.md
 * - Protocol files: agent-activation.mdx, mode-switching.mdx, etc.
 * - Interactive interfaces: agents.md, modes.md, strict.md
 * - Interaction patterns: chit-chat.md, interaction-styles.md
 * - Mode definitions: kiro-spec-mode.md, kiro-vibe-mode.md
 * 
 * @see NPM_FILE_MAPPINGS - npm package mappings (excludes agent-system.md)
 */
const POWER_FILE_MAPPINGS = [
  // POWER.md and mcp.json
  { src: "src/kiro/POWER.md", dest: "power/POWER.md" },
  { src: "src/kiro/mcp.json", dest: "power/mcp.json" },
  
  // Core system files (always loaded) - Power includes agent-system.md, npm does not
  { src: "src/core/aliases.md", dest: "power/steering/aliases.md" },
  { src: "src/core/agent-system.md", dest: "power/steering/agent-system.md" },
  { src: "src/core/strict-mode.md", dest: "power/steering/strict-mode.md" },
  
  // Protocol files (auxiliary, not in steering list)
  { src: "src/core/protocols/agent-activation.mdx", dest: "power/steering/protocols/agent-activation.mdx" },
  { src: "src/kiro/steering/protocols/mode-switching.mdx", dest: "power/steering/protocols/mode-switching.mdx" },
  { src: "src/kiro/steering/protocols/mode-management.mdx", dest: "power/steering/protocols/mode-management.mdx" },
  
  // Interactive interfaces (manual inclusion)
  { src: "src/core/agents.md", dest: "power/steering/agents.md" },
  { src: "src/kiro/steering/modes.md", dest: "power/steering/modes.md" },
  { src: "src/core/strict.md", dest: "power/steering/strict.md" },
  
  // Interaction patterns
  { src: "src/core/interactions/chit-chat.md", dest: "power/steering/interactions/chit-chat.md" },
  { src: "src/core/interactions/interaction-styles.md", dest: "power/steering/interactions/interaction-styles.md" },
  
  // Mode definitions
  { src: "src/kiro/steering/agent-system/kiro-spec-mode.md", dest: "power/steering/modes/kiro-spec-mode.md" },
  { src: "src/kiro/steering/agent-system/kiro-vibe-mode.md", dest: "power/steering/modes/kiro-vibe-mode.md" },
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
 * Substitution function map for dynamic content replacement.
 * 
 * Each function receives SubstitutionOptions and returns the replacement string.
 * Keys use triple-brace syntax (e.g., `{{{VERSION}}}`) in source files.
 * 
 * **Common substitutions:**
 * - `{{{VERSION}}}` - Package version from package.json
 * - `{{{PROTOCOLS_PATH}}}` - Path to protocols directory (varies by target)
 * - `{{{AGENT_MANAGEMENT_PROTOCOL}}}` - Injected protocol content from .mdx files
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
 * Loads build configuration with substitution functions.
 * 
 * Imports Kiro-specific config which extends base config. The config contains
 * functions that generate dynamic content based on build target and runtime state.
 * 
 * @returns Configuration object with substitution functions
 * 
 * @example
 * ```typescript
 * const config = await loadConfig();
 * // config.substitutions['{{{VERSION}}}']({ target: 'npm' }) => '1.4.0'
 * ```
 */
async function loadConfig(): Promise<Config> {
  // Import kiro config (which imports core config)
  const kiroConfig = await import("../src/kiro/config.ts");
  return kiroConfig as Config;
}

/**
 * Applies all substitutions to file content.
 * 
 * Replaces all placeholder keys (e.g., `{{{VERSION}}}`) with values generated
 * by substitution functions. Processes all substitutions in order.
 * 
 * **Processing:**
 * - Iterates through all substitution keys
 * - Calls each function with build options
 * - Replaces all occurrences of key with result
 * - Returns fully processed content
 * 
 * @param content - Original file content with placeholders
 * @param substitutions - Map of placeholder keys to replacement functions
 * @param options - Build options passed to substitution functions
 * @returns Processed content with all substitutions applied
 * 
 * @example Simple substitution
 * ```typescript
 * const content = "Version: {{{VERSION}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'npm' });
 * // result: "Version: 1.4.0"
 * ```
 * 
 * @example Multiple substitutions
 * ```typescript
 * const content = "Version: {{{VERSION}}}\nPath: {{{PROTOCOLS_PATH}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'power' });
 * // result: "Version: 1.4.0\nPath: ~/.kiro/powers/.../protocols"
 * ```
 */
async function applySubstitutions(
  content: string, 
  substitutions: Substitutions, 
  options: SubstitutionOptions
): Promise<string> {
  let result = content;
  
  for (const [key, fn] of Object.entries(substitutions)) {
    const value = fn(options);
    result = result.replaceAll(key, value);
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
 * Only runs during npm builds (not Power or dev builds).
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
 * Creates empty MCP configuration file for Power distribution.
 * 
 * Generates `power/mcp.json` with empty mcpServers object. This file is
 * required by Kiro Powers but currently unused by kiro-agents.
 * 
 * @example
 * ```typescript
 * await createMcpJson();
 * // Creates power/mcp.json with empty structure
 * ```
 */
async function createMcpJson(): Promise<void> {
  const mcpContent = `{
  "mcpServers": {
    
  }
}
`;
  
  await Bun.write("power/mcp.json", mcpContent, { createPath: true });
  console.log("✅ Created: power/mcp.json (empty structure for future)");
}

/**
 * Builds npm package distribution.
 * 
 * Compiles CLI tool and processes all steering files with substitutions.
 * Output goes to `build/npm/` which is included in npm package then cleaned.
 * 
 * **Build Steps:**
 * 1. Compile CLI: `bin/cli.ts` → `build/npm/bin/cli.js`
 * 2. Process steering files with substitutions
 * 3. Map files to `build/npm/dist/` structure
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example
 * ```typescript
 * await buildNpm(config);
 * // Creates build/npm/bin/cli.js and build/npm/dist/*.md
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
  
  console.log("\n✅ npm distribution built in build/npm/");
}

/**
 * Builds Kiro Power distribution.
 * 
 * Processes POWER.md, creates mcp.json, and processes all steering files.
 * Output goes to `power/` directory which is committed to GitHub.
 * 
 * **Build Steps:**
 * 1. Create empty `power/mcp.json`
 * 2. Process `POWER.md` with substitutions
 * 3. Process steering files with substitutions
 * 4. Map files to `power/steering/` structure
 * 
 * @param config - Configuration with substitution functions
 * 
 * @example
 * ```typescript
 * await buildPower(config);
 * // Creates power/POWER.md, power/mcp.json, power/steering/*.md
 * ```
 */
async function buildPower(config: Config): Promise<void> {
  console.log("⚡ Building Power distribution...\n");
  
  // Create mcp.json
  await createMcpJson();
  
  // Build all Power files
  for (const mapping of POWER_FILE_MAPPINGS) {
    await buildFile(mapping.src, mapping.dest, config.substitutions, { target: "power" });
  }
  
  console.log("\n✅ Power distribution built in power/");
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
 * Loads configuration, executes target-specific build, and optionally cleans
 * artifacts. Handles npm, power, and dev builds with appropriate post-processing.
 * 
 * **Build Flow:**
 * 1. Load config with substitution functions
 * 2. Execute target-specific build (npm/power/dev)
 * 3. Clean artifacts if target is 'npm' (not 'npm-no-clean')
 * 
 * **Target behaviors:**
 * - `npm` - Compiles CLI, processes files, cleans after (for testing)
 * - `npm-no-clean` - Same as npm but preserves artifacts (for release script)
 * - `power` - Processes files to power/ directory (for GitHub)
 * - `dev` - Builds to user directory with watch mode (for development)
 * 
 * @param target - Build target (npm/npm-no-clean/power/dev)
 * 
 * @example npm build with cleanup
 * ```typescript
 * await build('npm');
 * // Builds to build/npm/, then cleans directory
 * ```
 * 
 * @example npm build without cleanup (used by release script)
 * ```typescript
 * await build('npm-no-clean');
 * // Builds to build/npm/, preserves for npm publish
 * ```
 * 
 * @example Power build
 * ```typescript
 * await build('power');
 * // Processes files to power/ directory
 * ```
 */
async function build(target: BuildTarget): Promise<void> {
  console.log(`🔨 Starting build: ${target}...\n`);
  
  // Load configuration
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
  } else if (target === "power") {
    await buildPower(config);
  } else if (target === "dev") {
    await buildDev(config);
  }
  
  console.log("\n✨ Build completed successfully!");
  
  if (target === "npm") {
    console.log("\n📁 Build output: build/npm/ (cleaned after build)");
  } else if (target === "power") {
    console.log("\n📁 Build output: power/ (in GitHub)");
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
} else if (command === "power") {
  build("power");
} else {
  console.error("❌ Invalid command. Use: dev, npm, npm-no-clean, or power");
  process.exit(1);
}
