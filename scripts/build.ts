#!/usr/bin/env bun
import { homedir } from "os";
import { join } from "path";
import { rmSync } from "fs";

// Build targets configuration
type BuildTarget = "npm" | "power" | "dev";

// File mappings for npm distribution
const NPM_FILE_MAPPINGS = [
  // Core system files (always loaded)
  { src: "src/core/agent-system.md", dest: "build/npm/dist/agent-system.md" },
  { src: "src/kiro/steering/modes-system.md", dest: "build/npm/dist/modes-system.md" },
  { src: "src/core/strict-mode.md", dest: "build/npm/dist/strict-mode.md" },
  
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

// File mappings for Power distribution
const POWER_FILE_MAPPINGS = [
  // POWER.md and mcp.json
  { src: "src/kiro/POWER.md", dest: "power/POWER.md" },
  { src: "src/kiro/mcp.json", dest: "power/mcp.json" },
  
  // Core system files (always loaded)
  { src: "src/core/agent-system.md", dest: "power/steering/agent-system.md" },
  { src: "src/kiro/steering/modes-system.md", dest: "power/steering/modes-system.md" },
  { src: "src/core/strict-mode.md", dest: "power/steering/strict-mode.md" },
  
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

type Substitutions = { [key: string]: () => string };

interface Config {
  substitutions: Substitutions;
}

async function loadConfig(): Promise<Config> {
  // Import kiro config (which imports core config)
  const kiroConfig = await import("../src/kiro/config.ts");
  return kiroConfig as Config;
}

async function applySubstitutions(content: string, substitutions: Substitutions): Promise<string> {
  let result = content;
  
  for (const [key, fn] of Object.entries(substitutions)) {
    const value = fn();
    result = result.replaceAll(key, value);
  }
  
  return result;
}

async function buildFile(srcPath: string, destPath: string, substitutions: Substitutions): Promise<void> {
  // Read source file
  const file = Bun.file(srcPath);
  
  // Check if file exists
  if (!await file.exists()) {
    console.warn(`⚠️  Source file not found: ${srcPath}`);
    return;
  }
  
  const content = await file.text();
  
  // Apply substitutions
  const processed = await applySubstitutions(content, substitutions);
  
  // Ensure destination directory exists
  await Bun.write(destPath, processed, { createPath: true });
  
  console.log(`✅ Built: ${srcPath} → ${destPath}`);
}

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

async function createMcpJson(): Promise<void> {
  const mcpContent = `{
  "mcpServers": {
    
  }
}
`;
  
  await Bun.write("power/mcp.json", mcpContent, { createPath: true });
  console.log("✅ Created: power/mcp.json (empty structure for future)");
}

async function buildNpm(config: Config): Promise<void> {
  console.log("📦 Building npm distribution...\n");
  
  // Build CLI
  await buildCLI();
  
  // Build all npm files
  for (const mapping of NPM_FILE_MAPPINGS) {
    await buildFile(mapping.src, mapping.dest, config.substitutions);
  }
  
  console.log("\n✅ npm distribution built in build/npm/");
}

async function buildPower(config: Config): Promise<void> {
  console.log("⚡ Building Power distribution...\n");
  
  // Create mcp.json
  await createMcpJson();
  
  // Build all Power files
  for (const mapping of POWER_FILE_MAPPINGS) {
    await buildFile(mapping.src, mapping.dest, config.substitutions);
  }
  
  console.log("\n✅ Power distribution built in power/");
}

async function buildDev(config: Config): Promise<void> {
  console.log("🔧 Building dev mode (user directory)...\n");
  
  const userSteeringPath = join(homedir(), ".kiro", "steering", "kiro-agents");
  
  // Build all files to user directory
  for (const mapping of DEV_FILE_MAPPINGS) {
    const destPath = join(userSteeringPath, mapping.dest);
    await buildFile(mapping.src, destPath, config.substitutions);
  }
  
  console.log(`\n✅ Dev build completed in ${userSteeringPath}/`);
}

async function build(target: BuildTarget): Promise<void> {
  console.log(`🔨 Starting build: ${target}...\n`);
  
  // Load configuration
  const config = await loadConfig();
  console.log(`📝 Loaded configuration with ${Object.keys(config.substitutions).length} substitutions\n`);
  
  // Build based on target
  if (target === "npm") {
    await buildNpm(config);
    
    // Clean build directory after successful build
    console.log("\n🧹 Cleaning build directory...");
    rmSync("build/npm", { recursive: true, force: true });
    console.log("✅ Build directory cleaned");
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
} else if (command === "power") {
  build("power");
} else {
  console.error("❌ Invalid command. Use: dev, npm, or power");
  process.exit(1);
}
