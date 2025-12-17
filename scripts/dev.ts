#!/usr/bin/env bun
/**
 * Parallel development mode runner for kiro-agents project.
 * 
 * Runs both steering files dev mode (`dev:agents`) and powers dev mode (`dev:powers`)
 * simultaneously with color-coded output prefixes. Each process watches its respective
 * source directories and rebuilds on changes for rapid iteration.
 * 
 * **Processes:**
 * - `dev:agents` - Watches `src/` and builds steering files to `~/.kiro/steering/kiro-agents/`
 * - `dev:powers` - Watches `src/` and builds protocols to `~/.kiro/powers/kiro-protocols/`
 * 
 * **Output Format:**
 * - `[kiro-agents]` prefix in yellow for steering files build
 * - `[kiro-protocols]` prefix in magenta for powers build
 * 
 * @example Run parallel dev mode
 * ```bash
 * bun run dev
 * # Starts both watch processes
 * # Edit src/core/aliases.md → [kiro-agents] rebuilds
 * # Edit src/core/protocols/agent-activation.md → [kiro-protocols] rebuilds
 * # Press Ctrl-C to stop both
 * ```
 * 
 * @see scripts/build.ts - Steering files build system with dev mode
 * @see scripts/dev-powers.ts - Powers build system with dev mode
 */

/**
 * ANSI color code utilities for terminal output formatting.
 * 
 * Provides static methods for wrapping text in ANSI escape sequences to display
 * colored output in terminals. Each color method returns the input text wrapped
 * with the appropriate color code and reset sequence.
 * 
 * @example Color output
 * ```typescript
 * console.log(c.yellow("Warning"));  // Yellow text
 * console.log(c.magenta("Info"));    // Magenta text
 * console.log(c.green("Success"));   // Green text
 * ```
 */
export class c {
  /** ANSI reset code to restore default terminal colors */
  static normal = "\x1b[0m"
  
  /** Wraps text in yellow ANSI color codes */
  static yellow = (t: string) => "\x1b[33m" + t + this.normal
  
  /** Wraps text in cyan ANSI color codes */
  static cyan = (t: string) => "\x1b[36m" + t + this.normal
  
  /** Wraps text in green ANSI color codes */
  static green = (t: string) => "\x1b[32m" + t + this.normal
  
  /** Wraps text in blue ANSI color codes */
  static blue = (t: string) => "\x1b[34m" + t + this.normal
  
  /** Wraps text in magenta ANSI color codes */
  static magenta = (t: string) => "\x1b[35m" + t + this.normal
}

/**
 * Spawns a command as a child process and pipes its output with a colored prefix.
 * 
 * Uses Bun.spawn to run the command with stdout and stderr piped. Both streams
 * are processed by `pipeOutput` to add the colored prefix to each line. The process
 * runs indefinitely until manually terminated (Ctrl-C).
 * 
 * @param prefix - Colored prefix string to prepend to each output line (e.g., `[kiro-agents]`)
 * @param command - Command array where first element is executable and rest are arguments
 * 
 * @example Spawn dev process
 * ```typescript
 * runCommand(`[${c.yellow("build")}]`, ["bun", "run", "build.ts", "dev"]);
 * // Output: [build] 🔨 Starting dev build...
 * // Output: [build] ✅ Built: src/core/aliases.md
 * ```
 */
function runCommand(prefix: string, command: string[]) {
  const proc = Bun.spawn(command, {
    stdout: "pipe",
    stderr: "pipe",
  });

  pipeOutput(proc.stdout, prefix);
  pipeOutput(proc.stderr, prefix);
}

/**
 * Pipes a readable stream to console with a prefix on each line.
 * 
 * Asynchronously reads chunks from the stream, decodes them as UTF-8 text,
 * trims trailing whitespace, and logs each chunk with the provided prefix.
 * Continues until the stream ends.
 * 
 * @param stream - Readable byte stream from process stdout or stderr
 * @param prefix - Colored prefix string to prepend to each output line
 * 
 * @example Pipe process output
 * ```typescript
 * const proc = Bun.spawn(["echo", "hello"]);
 * await pipeOutput(proc.stdout, "[test]");
 * // Output: [test] hello
 * ```
 */
async function pipeOutput(stream: ReadableStream<Uint8Array>, prefix: string) {
  const decoder = new TextDecoder();
  for await (const chunk of stream) {
    console.log(`${prefix} ${decoder.decode(chunk).trimEnd()}`);
  }
}

// Start both dev processes in parallel
runCommand(`[${c.yellow("kiro-agents")}] `,  ["bun", "run", "dev:agents"]);
runCommand(`[${c.magenta("kiro-protocols")}]`, ["bun", "run", "dev:powers"]);
