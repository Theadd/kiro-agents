#!/usr/bin/env bun
import { watch } from "fs";
import { join, dirname } from "path";

// File mapping configuration
const FILE_MAPPINGS = [
  { src: "src/core/agent-system.md", dest: "dist/agent-system.md" },
  { src: "src/kiro/steering/modes-system.md", dest: "dist/modes-system.md" },
  { src: "src/core/strict-mode.md", dest: "dist/agent-system/strict-mode.md" },
  { src: "src/kiro/steering/agent-system/kiro-spec-mode.md", dest: "dist/agent-system/kiro-spec-mode.md" },
  { src: "src/kiro/steering/agent-system/kiro-vibe-mode.md", dest: "dist/agent-system/kiro-vibe-mode.md" },
  { src: "src/core/interactions/chit-chat.md", dest: "dist/agent-system/interactions/chit-chat.md" },
  { src: "src/core/interactions/interaction-styles.md", dest: "dist/agent-system/interactions/interaction-styles.md" },
  { src: "src/kiro/steering/agent-system/tools/client-tools.md", dest: "dist/agent-system/tools/client-tools.md" },
] as const;

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
  const content = await file.text();
  
  // Apply substitutions
  const processed = await applySubstitutions(content, substitutions);
  
  // Ensure destination directory exists
  await Bun.write(destPath, processed, { createPath: true });
  
  console.log(`✅ Built: ${srcPath} → ${destPath}`);
}

async function copyToKiroSteering(): Promise<void> {
  const kiroSteeringPath = ".kiro/steering";
  
  console.log(`\n📦 Copying build to ${kiroSteeringPath}/...`);
  
  for (const mapping of FILE_MAPPINGS) {
    const srcPath = mapping.dest; // Copy from dist/
    const destPath = mapping.dest.replace("dist/", `${kiroSteeringPath}/`);
    
    const file = Bun.file(srcPath);
    await Bun.write(destPath, file, { createPath: true });
    
    console.log(`✅ Copied: ${destPath}`);
  }
}

async function buildCLI(): Promise<void> {
  console.log("🔧 Building CLI...\n");
  
  const result = await Bun.build({
    entrypoints: ["./bin/cli.ts"],
    outdir: "./bin",
    target: "node",
    format: "esm",
    naming: "[dir]/[name].js",
  });
  
  if (!result.success) {
    console.error("❌ CLI build failed:", result.logs);
    throw new Error("CLI build failed");
  }
  
  console.log("✅ CLI built: bin/cli.js\n");
}

async function build(): Promise<void> {
  console.log("🔨 Starting build...\n");
  
  // Build CLI
  await buildCLI();
  
  // Load configuration
  const config = await loadConfig();
  console.log(`📝 Loaded configuration with ${Object.keys(config.substitutions).length} substitutions\n`);
  
  // Build all files
  for (const mapping of FILE_MAPPINGS) {
    await buildFile(mapping.src, mapping.dest, config.substitutions);
  }
  
  // Copy to .kiro/steering/
  await copyToKiroSteering();
  
  console.log("\n✨ Build completed successfully!");
}

async function watchMode(): Promise<void> {
  console.log("👀 Starting watch mode...\n");
  
  // Initial build
  await build();
  
  console.log("\n👀 Watching src/ for changes...\n");
  
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
const args = process.argv.slice(2);
const isWatchMode = args.includes("--watch");

if (isWatchMode) {
  watchMode();
} else {
  build();
}
