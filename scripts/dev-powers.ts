#!/usr/bin/env bun
/**
 * Development mode for Kiro Powers with file watching and rapid iteration.
 * 
 * Builds powers directly to `~/.kiro/powers/kiro-protocols/` for immediate testing.
 * Watches `src/` directory for changes and automatically rebuilds. Handles readonly
 * files by temporarily making them writable during build, then restoring protection.
 * 
 * **Current Implementation:**
 * - Uses manifest system (`PROTOCOL_SOURCE_MAPPINGS`, `expandMappings`) for automatic protocol discovery
 * - Auto-discovers both core and Kiro-specific protocols via glob patterns
 * - Maintains same substitution system as production builds for consistency
 * 
 * **Workflow:**
 * 1. Initial build to `~/.kiro/powers/kiro-protocols/`
 * 2. Watch `src/` directory recursively for changes
 * 3. Auto-rebuild on any file modification
 * 4. Continue until Ctrl-C (graceful shutdown)
 * 
 * **Readonly File Handling:**
 * - Detects readonly files in target directory
 * - Temporarily makes them writable for build operations
 * - Restores readonly status after successful build
 * - Prevents accidental modification of generated files
 * 
 * @example Basic usage
 * ```bash
 * bun run dev:powers
 * # Initial build, then watches for changes
 * # Edit src/core/protocols/agent-activation.md → auto-rebuilds
 * # Press Ctrl-C to stop watching
 * ```
 * 
 * @example Development workflow
 * ```bash
 * # Terminal 1: Start dev mode
 * bun run dev:powers
 * 
 * # Terminal 2: Edit protocols
 * code src/core/protocols/agent-activation.md
 * # → Auto-rebuilds in Terminal 1
 * 
 * # Test in Kiro IDE immediately
 * # Files available at ~/.kiro/powers/kiro-protocols/steering/
 * ```
 * 
 * @see scripts/build-powers.ts - Production power build using identical manifest-based protocol discovery
 * @see src/manifest.ts - PROTOCOL_SOURCE_MAPPINGS used for automatic protocol discovery
 */

import { homedir } from "os";
import { join } from "path";
import { existsSync, readdirSync, statSync, chmodSync, constants, readFileSync, writeFileSync, mkdirSync } from "fs";
import { PROTOCOL_SOURCE_MAPPINGS, expandMappings } from "../src/manifest.ts";

/**
 * Build options passed to substitution functions during power processing.
 * 
 * Dev mode always uses 'power' target since it builds directly to user's
 * `~/.kiro/powers/kiro-protocols/` directory for rapid iteration testing.
 * 
 * @property target - Build target, always 'power' for dev-powers builds
 */
interface SubstitutionOptions {
  /** Build target for power distribution (always 'power' in dev mode) */
  target: 'power';
}

/**
 * Map of placeholder keys to replacement functions for build-time content injection.
 * 
 * Similar to main build system (`scripts/build.ts`, `scripts/build-powers.ts`) but used
 * in dev mode for rapid iteration. Each function receives `SubstitutionOptions` and returns
 * string to replace placeholder in source files.
 * 
 * @example Common substitutions
 * ```typescript
 * const substitutions: Substitutions = {
 *   '{{{VERSION}}}': ({ target }) => '1.10.1',
 *   '{{{PROTOCOLS_PATH}}}': ({ target }) => '~/.kiro/powers/kiro-protocols/steering'
 * };
 * ```
 * 
 * @see scripts/build-powers.ts - Production power build with manifest-based protocol discovery
 */
type Substitutions = { [key: string]: (options: SubstitutionOptions) => string };

/**
 * Configuration object containing substitution functions for power builds.
 * 
 * Loaded from `src/kiro/config.ts` which provides Kiro-specific substitutions
 * for all build targets. Dev mode uses same config as production builds to ensure
 * consistency between development and distribution.
 * 
 * @property substitutions - Map of placeholder keys to replacement functions
 * 
 * @see src/kiro/config.ts - Kiro-specific substitutions
 * @see loadConfig - Loads configuration from src/kiro/config.ts
 */
interface Config {
  /** Substitution functions for dynamic content replacement */
  substitutions: Substitutions;
}

/**
 * Power configuration defining build behavior for dev mode with manifest-based discovery.
 * 
 * Simplified config for dev mode that leverages manifest system for automatic protocol
 * discovery. Protocols are auto-discovered via `PROTOCOL_SOURCE_MAPPINGS` glob patterns,
 * eliminating need to maintain hardcoded protocol lists.
 * 
 * **Manifest Integration:**
 * - Core protocols: `src/core/protocols/*.md` → auto-discovered
 * - Kiro protocols: `src/kiro/steering/protocols/*.md` → auto-discovered
 * - No manual protocol list maintenance required
 * 
 * @see PROTOCOL_SOURCE_MAPPINGS - Manifest mappings with glob patterns
 * @see expandMappings - Resolves globs to concrete file paths
 */
interface PowerConfig {
  /** Power name matching directory name (e.g., 'kiro-protocols') */
  name: string;
  /** Display name shown in Kiro IDE Powers panel (e.g., 'Kiro Protocols') */
  displayName: string;
}

/**
 * Power configuration for kiro-protocols in dev mode using manifest-based auto-discovery.
 * 
 * Leverages manifest system for automatic protocol discovery, matching production build
 * behavior. All protocols are auto-discovered via `PROTOCOL_SOURCE_MAPPINGS` glob patterns
 * from `src/manifest.ts`, ensuring consistency between dev and production builds.
 * 
 * **Auto-Discovered Protocols (via manifest):**
 * - Core protocols: `src/core/protocols/*.md` (strict-mode, agent-activation, agent-creation, agent-management)
 * - Kiro protocols: `src/kiro/steering/protocols/*.md` (mode-switching, mode-management, kiro-spec-mode, kiro-vibe-mode)
 * 
 * **Benefits:**
 * - No manual protocol list maintenance
 * - Automatic inclusion of new protocols
 * - Guaranteed consistency with production builds
 * - Single source of truth in manifest system
 * 
 * @see scripts/build-powers.ts - Production config using identical manifest system
 * @see src/manifest.ts - PROTOCOL_SOURCE_MAPPINGS with glob patterns for auto-discovery
 * @see expandMappings - Function that resolves glob patterns to concrete file paths
 */
const KIRO_PROTOCOLS_CONFIG: PowerConfig = {
  name: "kiro-protocols",
  displayName: "Kiro Protocols",
};

/**
 * Loads Kiro-specific build configuration with substitution functions.
 * 
 * Always loads `src/kiro/config.ts` which contains all substitutions needed for
 * kiro-agents builds. Dev mode uses same config as production to ensure consistency
 * between development testing and final distribution.
 * 
 * @returns Configuration object with Kiro-specific substitution functions
 * 
 * @example
 * ```typescript
 * const config = await loadConfig();
 * // config.substitutions['{{{VERSION}}}']({ target: 'power' }) => '1.10.1'
 * // config.substitutions['{{{PROTOCOLS_PATH}}}']({ target: 'power' }) => '~/.kiro/powers/...'
 * ```
 * 
 * @see src/kiro/config.ts - Kiro-specific config with all substitutions
 */
async function loadConfig(): Promise<Config> {
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
 * @param content - Original file content with placeholders
 * @param substitutions - Map of placeholder keys to replacement functions
 * @param options - Build options passed to substitution functions
 * @returns Processed content with all substitutions applied (or warning if circular)
 * 
 * @example Simple substitution
 * ```typescript
 * const content = "Version: {{{VERSION}}}";
 * const result = await applySubstitutions(content, substitutions, { target: 'power' });
 * // "Version: 1.10.1"
 * ```
 * 
 * @see scripts/build.ts - Same multi-pass algorithm used in main build
 * @see scripts/build-powers.ts - Same multi-pass algorithm used in manifest-based power build
 */
async function applySubstitutions(
  content: string,
  substitutions: Substitutions,
  options: SubstitutionOptions
): Promise<string> {
  let result = content;
  let maxIterations = 10;
  let iteration = 0;
  
  while (iteration < maxIterations) {
    let hasSubstitutions = false;
    
    for (const [key, fn] of Object.entries(substitutions)) {
      if (result.includes(key)) {
        const value = fn(options);
        result = result.replaceAll(key, value);
        hasSubstitutions = true;
      }
    }
    
    if (!hasSubstitutions) {
      break;
    }
    
    iteration++;
  }
  
  if (iteration >= maxIterations) {
    console.warn(`⚠️  Warning: Reached maximum substitution iterations (${maxIterations})`);
  }
  
  return result;
}

/**
 * Makes all files in a directory writable (removes readonly).
 * 
 * Recursively traverses directory and removes readonly flag from all files.
 * Used before rebuilding to allow overwriting files that were set readonly
 * after previous build. Silently ignores errors (e.g., file doesn't exist).
 * 
 * **Permission changes:**
 * - Before: `r--r--r--` (readonly)
 * - After: `rw-r--r--` (writable by owner)
 * 
 * @param dirPath - Directory path to make writable (e.g., '~/.kiro/powers/kiro-protocols')
 * 
 * @example
 * ```typescript
 * makeWritable('~/.kiro/powers/kiro-protocols');
 * // All files in directory and subdirectories become writable
 * ```
 * 
 * @see makeReadonly - Restores readonly status after build
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
          // File is readonly, make it writable
          chmodSync(fullPath, constants.S_IRUSR | constants.S_IWUSR | constants.S_IRGRP | constants.S_IROTH);
        }
      } catch (error) {
        // Ignore errors, file might not exist
      }
    }
  }
}

/**
 * Makes all files in a directory readonly.
 * 
 * Recursively traverses directory and sets readonly flag on all files.
 * Used after build to protect generated files from accidental modification.
 * Silently ignores errors (e.g., file doesn't exist).
 * 
 * **Permission changes:**
 * - Before: `rw-r--r--` (writable)
 * - After: `r--r--r--` (readonly)
 * 
 * @param dirPath - Directory path to make readonly (e.g., '~/.kiro/powers/kiro-protocols')
 * 
 * @example
 * ```typescript
 * makeReadonly('~/.kiro/powers/kiro-protocols');
 * // All files in directory and subdirectories become readonly
 * ```
 * 
 * @see makeWritable - Removes readonly status before build
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
      } catch (error) {
        // Ignore errors
      }
    }
  }
}

/**
 * Copies and processes protocol files using manifest system for automatic discovery.
 * 
 * Uses `PROTOCOL_SOURCE_MAPPINGS` from manifest.ts to discover all protocol files
 * via glob patterns. Creates steering/ subdirectory if needed, reads each protocol,
 * applies substitutions, and writes processed content. Warns if source protocol not found.
 * 
 * **Manifest Integration:**
 * - Auto-discovers protocols via `expandMappings(PROTOCOL_SOURCE_MAPPINGS, "src", "power")`
 * - Supports glob patterns: `core/protocols/*.md`, `kiro/steering/protocols/*.md`
 * - Handles `{name}` placeholder replacement in destination paths
 * 
 * @param powerPath - Destination power directory (e.g., '~/.kiro/powers/kiro-protocols')
 * @param substitutions - Substitution functions to apply
 * 
 * @example
 * ```typescript
 * await copyProtocols('~/.kiro/powers/kiro-protocols', config.substitutions);
 * // Uses manifest to discover all protocols, processes with substitutions
 * ```
 * 
 * @see PROTOCOL_SOURCE_MAPPINGS - Manifest mappings for protocol discovery
 * @see expandMappings - Resolves glob patterns to concrete file paths
 * @see scripts/build-powers.ts - Production version using same manifest system
 */
async function copyProtocols(
  powerPath: string,
  substitutions: Substitutions
): Promise<void> {
  const steeringDir = join(powerPath, "steering");
  
  // Create steering directory if it doesn't exist
  if (!existsSync(steeringDir)) {
    mkdirSync(steeringDir, { recursive: true });
  }
  
  // Use manifest to get all protocol files (replaces hardcoded protocol list)
  console.log("📋 Using manifest to discover protocol files...");
  const protocolMappings = await expandMappings(PROTOCOL_SOURCE_MAPPINGS, "src", "power");
  
  console.log(`📋 Found ${protocolMappings.length} protocol files in manifest`);
  
  // Copy and process each protocol from manifest
  for (const mapping of protocolMappings) {
    const srcPath = join("src", mapping.src);
    const destPath = join(powerPath, mapping.dest);
    
    if (!existsSync(srcPath)) {
      console.warn(`⚠️  Protocol not found: ${srcPath}`);
      continue;
    }
    
    // Read source file
    const content = readFileSync(srcPath, "utf-8");
    
    // Apply substitutions
    const processed = await applySubstitutions(content, substitutions, { target: 'power' });
    
    // Write processed content
    writeFileSync(destPath, processed, "utf-8");
    
    console.log(`  ✅ Processed: ${mapping.src} → ${mapping.dest}`);
  }
}

// NOTE: copyKiroProtocols function removed - now handled by copyProtocols via manifest system
// The manifest system auto-discovers both core and Kiro-specific protocols via glob patterns

/**
 * Builds kiro-protocols power to user's Kiro directory for rapid iteration testing.
 * 
 * Orchestrates the complete dev build process: makes files writable, copies and processes
 * protocols with substitutions, adds Kiro-specific protocols, then restores readonly status.
 * Builds directly to `~/.kiro/powers/kiro-protocols/` for immediate testing in Kiro IDE.
 * 
 * **Build Steps:**
 * 1. Make existing files writable (remove readonly protection)
 * 2. Auto-discover protocols via manifest system (`PROTOCOL_SOURCE_MAPPINGS`)
 * 3. Copy and process all protocols (core + Kiro-specific) with substitutions
 * 4. Restore readonly status on all files for protection
 * 
 * @param config - Power configuration (protocols auto-discovered via manifest)
 * @param substitutions - Substitution functions to apply during protocol processing
 * 
 * @example
 * ```typescript
 * await buildPowerDev(KIRO_PROTOCOLS_CONFIG, config.substitutions);
 * // Builds to ~/.kiro/powers/kiro-protocols/ with substitutions applied
 * ```
 * 
 * @see scripts/build-powers.ts - Production build to powers/ directory using manifest system
 */
async function buildPowerDev(config: PowerConfig, substitutions: Substitutions): Promise<void> {
  const userHome = homedir();
  const powerPath = join(userHome, ".kiro", "powers", config.name);
  
  console.log(`🔨 Building power: ${config.displayName}`);
  console.log(`📁 Target: ${powerPath}\n`);
  
  // Make files writable temporarily
  console.log("🔓 Making files writable...");
  makeWritable(powerPath);
  
  try {
    // Copy and process protocols using manifest system (includes both core and Kiro-specific)
    console.log(`📋 Processing protocols...`);
    await copyProtocols(powerPath, substitutions);
    
    console.log(`✅ Power built: ${config.displayName}`);
  } finally {
    // Restore readonly status
    console.log("🔒 Restoring readonly status...");
    makeReadonly(powerPath);
  }
}

/**
 * Performs single build to user's Kiro directory.
 * 
 * Loads Kiro configuration with substitutions and builds kiro-protocols power
 * to `~/.kiro/powers/kiro-protocols/`. Used for both initial build and watch
 * mode rebuilds. No CLI compilation needed (power files only).
 * 
 * @example
 * ```typescript
 * await build();
 * // Loads config, builds power to ~/.kiro/powers/kiro-protocols/
 * ```
 * 
 * @see devMode - Calls this function initially and on file changes
 */
async function build(): Promise<void> {
  console.log(`🔨 Starting dev build...\n`);
  
  // Load configuration
  const config = await loadConfig();
  console.log(`📝 Loaded ${Object.keys(config.substitutions).length} substitutions\n`);
  
  // Build power
  await buildPowerDev(KIRO_PROTOCOLS_CONFIG, config.substitutions);
  
  console.log("\n✨ Build completed successfully!");
}

/**
 * Development mode with file watching for rapid iteration.
 * 
 * Performs initial build to user's Kiro directory, then watches `src/` for changes.
 * Automatically rebuilds on file modifications. Handles Ctrl-C gracefully to close
 * watcher and exit cleanly.
 * 
 * **Workflow:**
 * 1. Initial build to `~/.kiro/powers/kiro-protocols/`
 * 2. Watch `src/` directory recursively
 * 3. Rebuild on any file change
 * 4. Continue until Ctrl-C
 * 
 * **Use Cases:**
 * - Developing new protocols
 * - Testing protocol changes
 * - Debugging substitutions
 * - Rapid prototyping
 * 
 * @example
 * ```bash
 * bun run dev:powers
 * # Initial build, then watches for changes
 * # Edit src/core/protocols/agent-activation.md → auto-rebuilds
 * # Press Ctrl-C to stop
 * ```
 * 
 * @see scripts/build.ts - Main build system with similar dev mode for steering files
 */
async function devMode(): Promise<void> {
  console.log("👀 Starting dev:powers mode (watch)...\n");
  
  // Initial build
  await build();
  
  console.log("\n👀 Watching src/ for changes...\n");
  
  const { watch } = await import("fs");
  const watcher = watch("src", { recursive: true }, async (event, filename) => {
    if (filename) {
      console.log(`\n🔄 Detected ${event} in ${filename}`);
      console.log("🔨 Rebuilding...\n");
      
      try {
        await build();
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
devMode();
