#!/usr/bin/env bun
/**
 * Multi-Power Build System for Kiro Powers distribution.
 * 
 * Builds standalone Kiro Powers from source protocols with validation and structure
 * enforcement. Each power is independent with its own POWER.md, protocols, and icon.
 * Powers are distributed via GitHub for installation through Kiro IDE Powers panel.
 * 
 * **Build Process:**
 * 1. Load power configurations from POWER_CONFIGS array
 * 2. For each power, validate POWER.md exists with required frontmatter
 * 3. Copy protocol files from source directories to power/steering/
 * 4. Generate icon placeholder if missing (SVG, convert to PNG for production)
 * 5. Output ready-to-distribute power in powers/{name}/ directory
 * 
 * **Power Structure:**
 * ```
 * powers/{power-name}/
 * ├── POWER.md              # Power metadata with frontmatter (name, displayName, description, keywords)
 * ├── icon.png              # 512x512 power icon (optional, placeholder generated as SVG)
 * └── steering/             # Protocol files loaded on-demand by AI
 *     ├── agent-activation.md
 *     ├── agent-management.md
 *     └── ...
 * ```
 * 
 * **Current Powers:**
 * - `kiro-protocols` - Reusable protocol library (agent/mode management workflows)
 * 
 * **Adding New Powers:**
 * 1. Create `powers/{name}/POWER.md` with frontmatter
 * 2. Add configuration to POWER_CONFIGS array
 * 3. Run build script to copy protocols and validate
 * 
 * @example Build all configured powers
 * ```bash
 * bun run build-powers.ts
 * # Builds all powers in POWER_CONFIGS
 * ```
 * 
 * @example Build specific power
 * ```bash
 * bun run build-powers.ts kiro-protocols
 * # Builds only kiro-protocols power
 * ```
 * 
 * @see powers/kiro-protocols/POWER.md - Example power metadata
 * @see src/core/protocols/ - Source protocols copied to powers
 */

import { readdirSync, existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/**
 * Build options passed to substitution functions during power processing.
 * 
 * Currently only supports 'power' target since powers are always built for
 * Kiro Power distribution (not npm). Future expansion could support multiple
 * power distribution channels.
 * 
 * @property target - Build target, always 'power' for power builds
 */
interface SubstitutionOptions {
  /** Build target for power distribution (always 'power') */
  target: 'power';
}

/**
 * Map of placeholder keys to replacement functions for build-time content injection.
 * 
 * Similar to main build system (`scripts/build.ts`) but power-specific. Each function
 * receives `SubstitutionOptions` and returns string to replace placeholder in source files.
 * 
 * **Note:** Currently unused in build-powers.ts but defined for future protocol processing
 * where powers may need dynamic content (e.g., version numbers, generated lists).
 * 
 * @example Future usage
 * ```typescript
 * const substitutions: Substitutions = {
 *   '{{{POWER_VERSION}}}': ({ target }) => '1.0.0',
 *   '{{{PROTOCOL_LIST}}}': ({ target }) => protocols.map(p => `- ${p}`).join('\n')
 * };
 * ```
 */
type Substitutions = { [key: string]: (options: SubstitutionOptions) => string };

/**
 * Configuration object containing substitution functions for power builds.
 * 
 * Mirrors structure from main build config (`src/config.ts`, `src/kiro/config.ts`)
 * but for power-specific processing. Currently defined for future expansion when
 * powers need dynamic content generation during build.
 * 
 * @property substitutions - Map of placeholder keys to replacement functions
 * 
 * @see src/config.ts - Main build substitutions pattern
 * @see src/kiro/config.ts - Kiro-specific substitutions
 */
interface Config {
  /** Substitution functions for dynamic content replacement */
  substitutions: Substitutions;
}

/**
 * Power configuration defining source protocols and build behavior.
 * 
 * Each power is built independently with its own set of protocols copied from
 * source directories. Protocols are loaded on-demand by AI when power is activated.
 */
interface PowerConfig {
  /** Power name matching directory name (e.g., 'kiro-protocols') */
  name: string;
  /** Display name shown in Kiro IDE Powers panel (e.g., 'Kiro Protocols') */
  displayName: string;
  /** Source directory containing protocol .md files (e.g., 'src/core/protocols') */
  sourceDir: string;
  /** Protocol file names to copy without .md extension (e.g., ['agent-activation', 'agent-management']) */
  protocols: string[];
  /** Whether to generate SVG icon placeholder (convert to PNG for production) */
  generateIcon: boolean;
}

/**
 * Power configurations for all available powers.
 * 
 * Each entry defines a standalone power with its own protocols and metadata.
 * Add new powers here to include them in the build process.
 * 
 * **Current Powers:**
 * - `kiro-protocols` - Reusable protocol library for agent/mode management workflows
 * 
 * **Protocol List:**
 * - `strict-mode` - Precision mode that blocks execution on ambiguous input
 * - `agent-activation` - Agent activation workflow
 * - `agent-creation` - Agent creation wizard with multiple methods
 * - `agent-management` - Interactive agent management interface
 * 
 * **Adding New Power:**
 * 1. Create `powers/{name}/POWER.md` with required frontmatter
 * 2. Add configuration entry here with source directory and protocol list
 * 3. Run `bun run build-powers.ts` to validate and build
 */
const POWER_CONFIGS: PowerConfig[] = [
  {
    name: "kiro-protocols",
    displayName: "Kiro Protocols",
    sourceDir: "src/core/protocols",
    protocols: [
      "strict-mode",
      "agent-activation",
      "agent-creation", 
      "agent-management",
    ],
    generateIcon: true,
  },
  // Add more powers here as needed
];

/**
 * Validates POWER.md exists and has required frontmatter fields.
 * 
 * Checks for YAML frontmatter with name, displayName, and description fields.
 * These fields are required by Kiro IDE Powers panel for display and search.
 * 
 * @param powerPath - Path to power directory (e.g., 'powers/kiro-protocols')
 * @returns true if POWER.md exists with valid frontmatter, false otherwise
 * 
 * @example
 * ```typescript
 * validatePowerMd('powers/kiro-protocols');
 * // Checks powers/kiro-protocols/POWER.md for required fields
 * ```
 */
function validatePowerMd(powerPath: string): boolean {
  const powerMdPath = join(powerPath, "POWER.md");
  
  if (!existsSync(powerMdPath)) {
    console.error(`❌ Missing POWER.md in ${powerPath}`);
    return false;
  }
  
  const content = readFileSync(powerMdPath, "utf-8");
  
  // Check for frontmatter
  if (!content.startsWith("---")) {
    console.error(`❌ POWER.md missing frontmatter in ${powerPath}`);
    return false;
  }
  
  // Extract frontmatter
  const frontmatterEnd = content.indexOf("---", 3);
  if (frontmatterEnd === -1) {
    console.error(`❌ Invalid frontmatter in ${powerPath}`);
    return false;
  }
  
  const frontmatter = content.slice(3, frontmatterEnd);
  
  // Check required fields
  const requiredFields = ["name:", "displayName:", "description:"];
  for (const field of requiredFields) {
    if (!frontmatter.includes(field)) {
      console.error(`❌ Missing required field '${field}' in ${powerPath}/POWER.md`);
      return false;
    }
  }
  
  console.log(`✅ Valid POWER.md in ${powerPath}`);
  return true;
}

/**
 * Generates SVG icon placeholder for development (convert to PNG for production).
 * 
 * Creates a simple colored square (512x512) with power's initial letter. This is
 * a development placeholder - convert to PNG using image tools before distribution.
 * Skips generation if icon.png already exists.
 * 
 * **Production:** Use image editor or CLI tool to convert SVG to PNG:
 * ```bash
 * # Example with ImageMagick
 * convert icon-placeholder.svg -resize 512x512 icon.png
 * ```
 * 
 * @param powerPath - Path to power directory (e.g., 'powers/kiro-protocols')
 * @param powerName - Power name for icon text (first letter used)
 * 
 * @example
 * ```typescript
 * generateIconPlaceholder('powers/kiro-protocols', 'kiro-protocols');
 * // Creates powers/kiro-protocols/icon-placeholder.svg with 'K' letter
 * ```
 */
function generateIconPlaceholder(powerPath: string, powerName: string): void {
  const iconPath = join(powerPath, "icon.png");
  
  if (existsSync(iconPath)) {
    console.log(`ℹ️  Icon already exists: ${iconPath}`);
    return;
  }
  
  // Create a simple SVG placeholder
  const initial = powerName.charAt(0).toUpperCase();
  const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#6366f1"/>
  <text x="256" y="340" font-family="Arial, sans-serif" font-size="280" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
</svg>`;
  
  // Note: This creates an SVG file, not PNG
  // For actual PNG, you'd need a library like sharp or canvas
  // For now, we'll create a note file
  writeFileSync(
    join(powerPath, "icon-placeholder.svg"),
    svg,
    "utf-8"
  );
  
  console.log(`📝 Created icon placeholder (SVG): ${powerPath}/icon-placeholder.svg`);
  console.log(`   Convert to PNG (512x512) for production use`);
}

/**
 * Loads Kiro-specific build configuration with substitution functions.
 * 
 * @returns Configuration object with substitution functions
 */
async function loadConfig(): Promise<Config> {
  const kiroConfig = await import("../src/kiro/config.ts");
  return kiroConfig as Config;
}

/**
 * Applies all substitutions to file content with multi-pass processing.
 * 
 * @param content - Original file content with placeholders
 * @param substitutions - Map of placeholder keys to replacement functions
 * @param options - Build options passed to substitution functions
 * @returns Processed content with all substitutions applied
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
 * Copies and processes protocol files from source directory to power steering directory.
 * 
 * Creates steering/ subdirectory if needed, reads each protocol, applies substitutions,
 * and writes processed content. Warns if source protocol not found but continues.
 * 
 * @param config - Power configuration with source directory and protocol list
 * @param powerPath - Destination power directory (e.g., 'powers/kiro-protocols')
 * @param substitutions - Substitution functions to apply
 * 
 * @example
 * ```typescript
 * await copyProtocols(
 *   { sourceDir: 'src/core/protocols', protocols: ['agent-activation'] },
 *   'powers/kiro-protocols',
 *   substitutions
 * );
 * // Reads, processes, and writes agent-activation.md with substitutions applied
 * ```
 */
async function copyProtocols(
  config: PowerConfig,
  powerPath: string,
  substitutions: Substitutions
): Promise<void> {
  const steeringDir = join(powerPath, "steering");
  
  // Create steering directory if it doesn't exist
  if (!existsSync(steeringDir)) {
    mkdirSync(steeringDir, { recursive: true });
  }
  
  // Copy and process each protocol
  for (const protocol of config.protocols) {
    const srcPath = join(config.sourceDir, `${protocol}.md`);
    const destPath = join(steeringDir, `${protocol}.md`);
    
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
    
    console.log(`  ✅ Processed: ${protocol}.md`);
  }
}

/**
 * Copies and processes Kiro-specific protocols (mode-switching, mode-management) to power.
 * 
 * Special handling for kiro-protocols power which includes both core protocols
 * and Kiro-specific mode system protocols. Only runs for kiro-protocols power.
 * Applies substitutions to ensure placeholders are replaced.
 * 
 * @param powerPath - Destination power directory (e.g., 'powers/kiro-protocols')
 * @param substitutions - Substitution functions to apply
 * 
 * @example
 * ```typescript
 * await copyKiroProtocols('powers/kiro-protocols', substitutions);
 * // Reads, processes, and writes Kiro-specific protocols with substitutions
 * ```
 */
async function copyKiroProtocols(
  powerPath: string,
  substitutions: Substitutions
): Promise<void> {
  const kiroProtocolsDir = "src/kiro/steering/protocols";
  const steeringDir = join(powerPath, "steering");
  
  if (!existsSync(kiroProtocolsDir)) {
    return;
  }
  
  const kiroProtocols = ["mode-switching", "mode-management"];
  
  for (const protocol of kiroProtocols) {
    const srcPath = join(kiroProtocolsDir, `${protocol}.md`);
    const destPath = join(steeringDir, `${protocol}.md`);
    
    if (!existsSync(srcPath)) {
      continue;
    }
    
    // Read source file
    const content = readFileSync(srcPath, "utf-8");
    
    // Apply substitutions
    const processed = await applySubstitutions(content, substitutions, { target: 'power' });
    
    // Write processed content
    writeFileSync(destPath, processed, "utf-8");
    
    console.log(`  ✅ Processed: ${protocol}.md (Kiro-specific)`);
  }
}

/**
 * Builds a single power from configuration with validation and substitution processing.
 * 
 * Orchestrates the complete build process for one power: validates POWER.md,
 * copies and processes protocols with substitutions, adds Kiro-specific protocols
 * if applicable, and generates icon placeholder. Throws error if POWER.md validation fails.
 * 
 * **Build Steps:**
 * 1. Validates POWER.md exists with required frontmatter
 * 2. Copies and processes protocols with substitutions applied
 * 3. Adds Kiro-specific protocols for kiro-protocols power
 * 4. Generates icon placeholder if needed
 * 
 * @param config - Power configuration defining protocols and build behavior
 * @param substitutions - Substitution functions to apply during protocol processing
 * @throws Error if POWER.md validation fails
 * 
 * @example
 * ```typescript
 * await buildPower({
 *   name: 'kiro-protocols',
 *   displayName: 'Kiro Protocols',
 *   sourceDir: 'src/core/protocols',
 *   protocols: ['agent-activation', 'agent-management'],
 *   generateIcon: true
 * }, config.substitutions);
 * // Validates, copies protocols with substitutions, generates icon
 * ```
 * 
 * @see copyProtocols - Copies and processes protocol files with substitutions
 * @see copyKiroProtocols - Adds Kiro-specific protocols for kiro-protocols power
 */
async function buildPower(config: PowerConfig, substitutions: Substitutions): Promise<void> {
  console.log(`\n🔨 Building power: ${config.displayName}`);
  
  const powerPath = join("powers", config.name);
  
  // Validate POWER.md exists and is valid
  if (!validatePowerMd(powerPath)) {
    throw new Error(`Invalid POWER.md for ${config.name}`);
  }
  
  // Copy and process protocols
  console.log(`📋 Processing protocols...`);
  await copyProtocols(config, powerPath, substitutions);
  
  // Copy and process Kiro-specific protocols if this is kiro-protocols power
  if (config.name === "kiro-protocols") {
    await copyKiroProtocols(powerPath, substitutions);
  }
  
  // Generate icon placeholder if needed
  if (config.generateIcon) {
    generateIconPlaceholder(powerPath, config.name);
  }
  
  console.log(`✅ Power built: ${config.displayName}`);
}

/**
 * Builds all configured powers or a specific power by name with substitution processing.
 * 
 * Main entry point for power build system. Loads Kiro configuration with substitutions,
 * filters POWER_CONFIGS by name if specificPower provided, then builds each power with
 * substitution processing. Exits with code 1 on any failure.
 * 
 * **Build Process:**
 * 1. Loads Kiro config with substitution functions
 * 2. Filters power configurations (all or specific)
 * 3. Builds each power with substitutions applied
 * 4. Validates and reports results
 * 
 * @param specificPower - Optional power name to build only that power (e.g., 'kiro-protocols')
 * 
 * @example Build all powers
 * ```typescript
 * await buildAllPowers();
 * // Loads config, builds all powers in POWER_CONFIGS array
 * ```
 * 
 * @example Build specific power
 * ```typescript
 * await buildAllPowers('kiro-protocols');
 * // Loads config, builds only kiro-protocols power
 * ```
 * 
 * @see loadConfig - Loads Kiro-specific substitution configuration
 * @see buildPower - Builds individual power with substitutions
 */
async function buildAllPowers(specificPower?: string): Promise<void> {
  console.log("🚀 Starting Kiro Powers build...\n");
  
  // Load configuration with substitutions
  console.log("📝 Loading configuration...");
  const config = await loadConfig();
  console.log(`✅ Loaded ${Object.keys(config.substitutions).length} substitutions\n`);
  
  const configs = specificPower
    ? POWER_CONFIGS.filter(c => c.name === specificPower)
    : POWER_CONFIGS;
  
  if (configs.length === 0) {
    console.error(`❌ Power not found: ${specificPower}`);
    process.exit(1);
  }
  
  for (const powerConfig of configs) {
    try {
      await buildPower(powerConfig, config.substitutions);
    } catch (error) {
      console.error(`❌ Failed to build ${powerConfig.name}:`, error);
      process.exit(1);
    }
  }
  
  console.log("\n✨ All powers built successfully!");
  console.log(`\n📁 Output: powers/`);
  console.log(`   Powers ready for distribution via GitHub`);
}

// Main execution
const args = process.argv.slice(2);
const specificPower = args[0];

buildAllPowers(specificPower);
