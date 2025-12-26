# Technology Stack

## Runtime & Package Manager

**Bun** - Primary runtime and package manager
- Fast JavaScript/TypeScript runtime
- Native TypeScript support
- Built-in bundler and build system
- Package management

## Language

**TypeScript** - Configuration and build scripts
- Type-safe configurations
- Modern JavaScript features
- ESM modules

## Build System

**Centralized Manifest System** (`src/manifest.ts`)
- Single source of truth for all file mappings across build targets
- Glob pattern support for automatic file discovery
- Type-safe file mapping definitions with target filtering
- Guaranteed consistency between dev mode and CLI installation

**Custom Dual Build Pipeline** (`scripts/build.ts`)
- Uses centralized manifest system for all file operations
- Bun.build API for CLI compilation (npm only)
- Dynamic substitution system
- File mapping and transformation via manifest
- Three build modes: npm, power, dev

**Build Targets**:

1. **npm** (`bun run build`)
   - Generates CLI from template: `bin/cli.template.ts` → `bin/cli.ts` (with embedded file lists from manifest)
   - Compiles CLI: `bin/cli.ts` → `build/npm/bin/cli.js`
   - Processes steering files via `STEERING_MAPPINGS` from manifest
   - Copies pre-built power files from `powers/kiro-protocols/`
   - Maps to `build/npm/dist/` and `build/npm/power/` using manifest
   - Cleans `build/npm/` after build

2. **dev** (`bun run dev`)
   - Uses same manifest mappings as npm build for consistency
   - Builds directly to `~/.kiro/steering/kiro-agents/`
   - Watch mode for file changes
   - No CLI compilation
   - Fast iteration cycle

**Powers Build** (separate script):

- **powers** (`bun run build:powers`)
  - Uses `PROTOCOL_SOURCE_MAPPINGS` from manifest for automatic protocol discovery
  - Supports glob patterns: `core/protocols/*.md`, `kiro/steering/protocols/*.md`
  - Auto-discovers and processes all protocol files with substitutions
  - Builds to `powers/*/steering/` directories
  - Creates kiro-protocols power with all discovered protocols
  - Must run BEFORE npm build

## Distribution

**npm** - Package distribution
- Package name: `kiro-agents`
- Executable via `npx` and `bunx`
- Dual installation: steering files + kiro-protocols power
- Installs to: `~/.kiro/steering/kiro-agents/` and `~/.kiro/powers/kiro-protocols/`
- Creates symbolic links in `~/.kiro/powers/installed/kiro-protocols/`
- Automatic power registration in `~/.kiro/powers/registry.json`
- Power appears immediately as "installed" in Kiro Powers UI
- Cross-platform CLI tool
- Removes old installation before installing new

**Powers System** - Multi-power architecture
- Built via `bun run build:powers` script using centralized manifest system
- Auto-discovers source protocols via `PROTOCOL_SOURCE_MAPPINGS` glob patterns
- Source protocols in `src/core/protocols/` and `src/kiro/steering/protocols/`
- Output to `powers/*/steering/` directories (auto-generated from manifest)
- Copied to npm package during build
- Installed by CLI to `~/.kiro/powers/kiro-protocols/`

## Build Commands

```bash
# Build standalone powers (run FIRST)
bun run build:powers

# Build npm package (compiles CLI, processes files, cleans after)
bun run build

# Dev mode (watch, builds steering to user directory)
bun run dev

# Dev mode for powers (watch, builds to ~/.kiro/powers/kiro-protocols/)
bun run dev:powers

# Validate build
bun run test

# Validate powers
bun run validate:powers

# Clean build artifacts
bun run clean
```

## Versioning System

**AI-Powered Hybrid Approach** - Combines Changesets with AI session analysis

### Architecture

- **Changesets** - Coordinates multi-developer releases, prevents conflicts
- **Session Snapshots** - AI captures rich context from development sessions
- **Smart Consolidation** - Filters temporary changes, generates user-facing changelogs

### Commands

```bash
# Capture session context (after each session)
bun run snapshot
# or: /snapshot (Kiro slash command)

# Consolidate snapshots and create changeset (when feature complete)
bun run finalize
# or: /finalize (Kiro slash command)

# Publish release (maintainer only)
bun run release
# or: /release (Kiro slash command)
```

### Workflow

**During Development:**
1. Work on feature with frequent commits
2. Run `/snapshot` after each session
3. Snapshots stored in `.kiro/session-snapshots/` (gitignored)

**When Feature Complete:**
1. Run `/finalize` to consolidate snapshots
2. AI analyzes snapshots vs final commit
3. Generates changeset in `.changeset/*.md`
4. Squash commits, commit changeset, push

**Release (Maintainer):**
1. Merge feature branches with changesets
2. Run `/release` to publish
3. Consumes changesets, bumps version, updates CHANGELOG
4. Publishes to npm, creates git tag, pushes to GitHub

### Session Snapshots

Captures context that git commits don't:
- **Purpose** - What you were trying to achieve
- **Findings** - Important discoveries
- **Limitations** - Blockers encountered
- **Decisions** - Why you chose approach X over Y
- **Attempted** - Things that didn't work

### Benefits

- **Rich documentation** - Captures "why" not just "what"
- **No merge conflicts** - Snapshots gitignored, changesets merge cleanly
- **Multi-session features** - Accumulate context across sessions
- **Smart filtering** - AI excludes temporary/experimental changes
- **Collaborative** - Multiple devs work in parallel

## Centralized Manifest System

**Architecture** (`src/manifest.ts`):
- Single source of truth for all file mappings across build targets
- Type-safe `FileMapping` interface with glob pattern support
- Target filtering (`npm`, `dev`, `cli`, `power`) for build-specific files
- Automatic file discovery via glob patterns (no manual file lists)

**Key Mappings**:
- `STEERING_MAPPINGS` - Core system files for `~/.kiro/steering/kiro-agents/`
- `POWER_MAPPINGS` - Power files for `~/.kiro/powers/kiro-protocols/`
- `PROTOCOL_SOURCE_MAPPINGS` - Source protocols with glob auto-discovery

**Glob Pattern Support**:
- `core/protocols/*.md` - Auto-discovers all core protocols
- `kiro/steering/protocols/*.md` - Auto-discovers all Kiro-specific protocols
- `{name}` placeholder replacement in destination paths
- No manual file list updates needed when adding new protocols

**Benefits**:
- **Single Source of Truth**: Change once, applies to all build targets
- **Auto-Discovery**: Add new protocol → automatically included in builds
- **Guaranteed Consistency**: Dev mode matches CLI installation exactly
- **Type Safety**: Compile-time validation of all file mappings
- **CLI Generation**: Embeds file lists in generated CLI for installation

**Functions**:
- `expandMappings()` - Resolves glob patterns to concrete file paths
- `getSteeringFilesForCLI()` - Generates file list for CLI installation
- `getPowerFilesForCLI()` - Generates power file list for CLI installation

## Configuration System

**Dynamic Substitutions**:
- Defined in `src/config.ts` (core) and `src/kiro/config.ts` (Kiro-specific)
- Type: `{ [key: string]: (options: SubstitutionOptions) => string }`
- Applied during build time with recursive processing
- Enables template-based content generation

**Recursive Processing**:
- Substitutions can contain other substitutions
- System processes up to 10 iterations until no placeholders remain
- Prevents infinite loops with iteration limit
- Enables nested content injection patterns

**Substitutions**:
- `{{{VERSION}}}` - Package version from package.json
- `{{{COMMANDS_LIST}}}` - Auto-generated command list
- `{{{AGENT_LIST}}}` - List of available agents
- `{{{MODE_COMMANDS}}}` - Mode-specific commands
- `{{{AGENT_MANAGEMENT_PROTOCOL}}}` - Injects agent-management.md content
- `{{{PROTOCOLS_PATH}}}` - Path to protocols directory (target-aware)
- `{{{KIRO_PROTOCOLS_PATH}}}` - Path to Kiro-specific protocols (target-aware)
- `{{{ADDITIONAL_ALIASES}}}` - Injects Kiro-specific aliases from shared-aliases.md (protocol loading, protocol reading, mode system, conversation transfer state restoration)

**Example**:
```typescript
export const substitutions = {
  '{{{VERSION}}}': () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf-8"));
    return pkg.version;
  },
  '{{{COMMANDS_LIST}}}': () => `### Agent Commands
- \`/agents\` - Interactive agent management
- \`/agents {name}\` - Activate specific agent`,
  '{{{AGENT_MANAGEMENT_PROTOCOL}}}': () => {
    // Uses injectProtocol helper to read and extract content
    return injectProtocol('agent-management.md', '## Agent Management Steps');
  },
  '{{{ADDITIONAL_ALIASES}}}': ({ target }) => {
    // Extracts multiple sections from shared-aliases.md
    const protocolLoading = extractSection('src/kiro/shared-aliases.md', 'Protocol Loading Alias');
    const protocolReading = extractSection('src/kiro/shared-aliases.md', 'Protocol Reading Alias');
    const modeAliases = extractSection('src/kiro/shared-aliases.md', 'Mode System Alias');
    const stateRestoration = extractSection('src/kiro/shared-aliases.md', 'Conversation Transfer State Restoration');
    // Can contain nested substitutions that will be processed recursively
    return `${protocolLoading}\n\n${protocolReading}\n\n${modeAliases}\n\n---\n\n${stateRestoration}`;
  }
}
```

**Protocol Injection Pattern**:
- Steering documents (`.md`) can be minimal "shells"
- Protocol files (`.md`) contain the detailed implementation
- Build-time substitution injects protocol content into shells
- Single source of truth for reusable workflows
- Example: `agents.md` is a shell, `agent-management.md` is injected

**Section Extraction Pattern**:
- Shared content stored in dedicated markdown files (e.g., `shared-aliases.md`)
- `extractSection()` utility extracts specific sections by title or anchor
- Handles code blocks and XML tags correctly (no false header detection)
- Enables reusable content blocks across multiple files
- Example: Mode alias extracted from `shared-aliases.md` and injected into `aliases.md`

## Dependencies

**Production**:
- None (steering documents only)

**Development**:
- `@types/bun` - Bun type definitions
- `typescript` - TypeScript compiler (peer dependency)

## Development Workflow

### Steering Files Development

1. **Make changes** to source files in `src/core/` or `src/kiro/steering/`
2. **Run dev mode** with `bun run dev` (watch mode, uses manifest for consistency)
3. **Test locally** - Files in `~/.kiro/steering/kiro-agents/`
4. **Build for distribution**:
   - Powers: `bun run build:powers` (first, uses manifest auto-discovery)
   - npm: `bun run build` (after powers, uses manifest for all mappings)
5. **Validate** with `bun run test`
6. **Publish** when ready

### Protocol Files Development

1. **Make changes** to protocol files in `src/core/protocols/` or `src/kiro/steering/protocols/`
2. **Run dev:powers mode** with `bun run dev:powers` (watch mode, uses manifest auto-discovery)
3. **Test locally** - Files in `~/.kiro/powers/kiro-protocols/steering/`
4. **Build for distribution**:
   - Powers: `bun run build:powers` (uses manifest to auto-discover and regenerate `powers/kiro-protocols/steering/`)
   - npm: `bun run build` (includes power files)
5. **Validate** with `bun run test`
6. **Publish** when ready

**Adding New Protocols**:
- Simply add `.md` files to `src/core/protocols/` or `src/kiro/steering/protocols/`
- Manifest glob patterns automatically discover and include them
- No configuration changes needed
- Example: New modes `kiro-as-vibe-mode.md` and `kiro-as-spec-mode.md` were auto-discovered

## Testing Strategy

**Automated Validation** (`bun run test`):
- Verifies build outputs exist
- Checks file counts match expectations
- Validates substitutions applied
- Checks frontmatter in steering files
- Verifies POWER.md structure
- Tests dev mode (optional)

**Manual Testing**:
- npm: `bun link` then `kiro-agents`
- Power: Install from local path in Kiro IDE
- Dev: Use files in `~/.kiro/steering/kiro-agents/`

## Publishing Process

### npm Package

1. Update version in `package.json`
2. Run `bun run clean`
3. Run `bun run build` (builds and cleans)
4. Run `bun run test` to validate
5. Publish with `npm publish`
6. Verify with `npx kiro-agents`

### Powers Distribution

1. Run `bun run build:powers` to regenerate `powers/*/steering/` using manifest auto-discovery
2. Run `bun run test` to validate
3. Commit regenerated steering files to GitHub
4. Push to repository
5. npm package includes pre-built power files

## Cross-Platform Considerations

**File Permissions**:
- Uses Node.js `fs.chmodSync` with constants
- Sets read-only: `S_IRUSR | S_IRGRP | S_IROTH`
- Restores write: `S_IRUSR | S_IWUSR | S_IRGRP | S_IROTH`

**Path Handling**:
- Uses Node.js `path.join` for cross-platform paths
- Handles `~/.kiro/steering/kiro-agents/` on all platforms
- Works with Windows, macOS, Linux

**CLI Compatibility**:
- Shebang: `#!/usr/bin/env node`
- Compiled to JavaScript for Node.js
- Works with both `npx` and `bunx`

## Dev Mode Benefits

### dev (Steering Files)

**Fast Iteration**:
- No CLI compilation needed
- Direct build to user directory (`~/.kiro/steering/kiro-agents/`)
- Watch mode for automatic rebuilds
- Immediate testing in Kiro IDE

**Use Cases**:
- Developing new steering files
- Testing aliases and interactive interfaces
- Debugging substitutions
- Rapid prototyping

### dev:powers (Protocol Files)

**Fast Iteration**:
- Uses manifest system for automatic protocol discovery
- Direct build to power directory (`~/.kiro/powers/kiro-protocols/`)
- Watch mode for automatic rebuilds
- Handles readonly files automatically
- Immediate testing in Kiro IDE

**Manifest Integration**:
- Auto-discovers protocols via `PROTOCOL_SOURCE_MAPPINGS` glob patterns
- Includes both core and Kiro-specific protocols automatically
- No manual file list updates needed when adding new protocols

**Readonly Handling**:
- Detects readonly files in target directory
- Temporarily makes them writable for build
- Restores readonly status after build

**Use Cases**:
- Developing protocol files
- Testing protocol changes
- Debugging protocol substitutions
- Rapid protocol iteration
