# Project Structure

## Repository Organization

```
kiro-agents/
├── src/                          # Source files
│   ├── core/                     # Cross-IDE compatible
│   │   ├── aliases.md            # Instruction alias system with injected Kiro aliases
│   │   ├── agents.md             # Interactive agent menu
│   │   ├── strict-mode.md        # Strict mode rules
│   │   ├── strict.md             # Interactive strict control
│   │   ├── docs/                 # Extended documentation
│   │   │   ├── aliases-guide.md  # Complete alias documentation
│   │   │   └── agent-system-guide.md  # Complete agent system guide
│   │   ├── protocols/            # Protocol files (auxiliary .md)
│   │   │   ├── agent-activation.md  # Agent activation protocol
│   │   │   ├── agent-management.md  # Agent management protocol
│   │   │   ├── agent-creation.md    # Agent creation protocol
│   │   │   └── mode-switching.md    # Mode switching protocol
│   │   └── interactions/
│   │       ├── chit-chat.md      # ADHD-C patterns
│   │       └── interaction-styles.md
│   ├── kiro/                     # Kiro-specific
│   │   ├── POWER.md              # Power metadata template
│   │   ├── mcp.json              # Empty MCP config
│   │   ├── config.ts             # Kiro substitutions (includes mode aliases)
│   │   ├── shared-aliases.md     # Reusable alias definitions
│   │   └── steering/
│   │       ├── modes.md          # Interactive mode menu
│   │       ├── protocols/        # Kiro-specific protocols
│   │       │   ├── mode-switching.md
│   │       │   └── mode-management.md
│   │       └── agent-system/
│   │           ├── kiro-spec-mode.md
│   │           └── kiro-vibe-mode.md
│   ├── utils/                    # Build utilities
│   │   └── markdown-extractor.ts # Section extraction from markdown
│   └── config.ts                 # Core substitutions
├── scripts/                      # Build scripts
│   ├── build.ts                  # npm package build pipeline
│   ├── build-powers.ts           # Multi-power build system
│   ├── dev-powers.ts             # Dev mode for powers (watch)
│   ├── validate-powers.ts        # Power validation
│   ├── test.ts                   # Validation script
│   ├── clean.ts                  # Clean script
│   ├── snapshot.ts               # Capture session context
│   ├── finalize.ts               # Consolidate snapshots
│   └── release.ts                # Publish release
├── bin/                          # CLI tool
│   └── cli.ts                    # CLI source (dual installation)
├── build/                        # Build artifacts (gitignored)
│   └── npm/                      # npm package build
│       ├── bin/cli.js            # Compiled CLI
│       ├── dist/                 # Processed steering files
│       └── power/                # Copied power files
├── powers/                       # Multi-power system (in GitHub)
│   ├── kiro-protocols/           # Reusable protocol library
│   │   ├── POWER.md              # Power metadata (committed)
│   │   ├── mcp.json              # MCP config (committed)
│   │   ├── icon.png              # Power icon (committed)
│   │   └── steering/             # Protocol files (auto-generated, not committed)
│   └── README.md                 # Powers documentation
├── docs/                         # Documentation
│   └── VERSIONING.md             # Versioning system guide
├── .changeset/                   # Changesets
│   ├── config.json               # Changesets configuration
│   ├── README.md                 # Workflow documentation
│   └── *.md                      # Changeset files (committed)
└── .kiro/                        # Workspace config
    ├── agents/                   # Custom agents
    ├── session-snapshots/        # Session snapshots (gitignored)
    ├── hooks/                    # Kiro slash commands
    │   ├── snapshot.kiro.hook    # /snapshot command
    │   ├── finalize.kiro.hook    # /finalize command
    │   ├── release.kiro.hook     # /release command
    │   └── ts-jsdoc-updater.kiro.hook  # JSDoc updater utility
    └── steering/                 # Workspace steering
        ├── debug.md              # Debug mode (not distributed)
        ├── product.md
        ├── structure.md
        └── tech.md
```

## Architecture Layers

### Source Layer (`src/`)

**Core** - Cross-IDE compatible components:
- Instruction alias system (aliases.md)
- Agent system protocols
- Strict mode definitions
- Interaction patterns (chit-chat, styles)
- Base configuration

**Kiro** - Kiro-specific implementations:
- Mode system (vibe/spec)
- Power metadata (POWER.md)
- Kiro-specific configurations
- Mode definitions

### Build Layer (`scripts/`, `bin/`)

**Power Build Pipeline** (`scripts/build-powers.ts`):
- Builds standalone powers to `powers/` directory
- Processes protocol files with substitutions
- Creates kiro-protocols power
- Must run BEFORE npm build

**Power Dev Pipeline** (`scripts/dev-powers.ts`):
- Builds directly to `~/.kiro/powers/kiro-protocols/` for rapid iteration
- Watch mode for protocol file changes in `src/`
- Handles readonly files automatically (writable during build, readonly after)
- Fast iteration for protocol development and testing
- Uses same substitution system as production builds

**npm Build Pipeline** (`scripts/build.ts`):
- Two build targets: `npm`, `dev`
- Compiles CLI to JavaScript (npm only)
- Loads configuration with substitutions
- Processes markdown files
- Copies pre-built power files from `powers/kiro-protocols/`
- Maps files to target structure

**CLI Tool** (`bin/cli.ts`):
- Dual installation system for steering documents and kiro-protocols power
- Installs core system files to `~/.kiro/steering/kiro-agents/`
- Installs protocol library to `~/.kiro/powers/kiro-protocols/`
- Creates symbolic links in `~/.kiro/powers/installed/kiro-protocols/`
- Automatic power registration in `~/.kiro/powers/registry.json`
- Removes old installations before installing new
- Manages file permissions
- Cross-platform compatible

### Distribution Layer

**npm Distribution** (`build/npm/`):
- Gitignored, temporary build
- CLI compiled to JavaScript
- Steering files processed
- Power files copied from `powers/kiro-protocols/`
- Cleaned after build

**Powers Distribution** (`powers/`):
- In GitHub repository
- Multi-power system with individual power directories
- kiro-protocols power with reusable protocols
- steering/ subdirectories auto-generated from source
- Ready for npm inclusion (copied to `build/npm/power/`)

**Dev Mode** (`~/.kiro/steering/kiro-agents/`):
- Direct build to user directory
- Watch mode for development
- No CLI compilation needed
- Fast iteration cycle

**Dev:Powers Mode** (`~/.kiro/powers/kiro-protocols/`):
- Direct build to user's power directory
- Watch mode for protocol development
- Handles readonly files automatically
- Fast iteration for protocol changes

## File Mapping

### Powers Build (via `build-powers.ts`)

```
src/core/protocols/strict-mode.md      → powers/kiro-protocols/steering/strict-mode.md
src/core/protocols/agent-activation.md → powers/kiro-protocols/steering/agent-activation.md
src/core/protocols/agent-management.md → powers/kiro-protocols/steering/agent-management.md
src/core/protocols/agent-creation.md   → powers/kiro-protocols/steering/agent-creation.md
src/kiro/steering/protocols/mode-switching.md  → powers/kiro-protocols/steering/mode-switching.md
src/kiro/steering/protocols/mode-management.md → powers/kiro-protocols/steering/mode-management.md
```

### Dev:Powers Build (via `dev-powers.ts`)

```
# Dev mode builds directly to user's Kiro directory for rapid iteration
src/core/protocols/strict-mode.md      → ~/.kiro/powers/kiro-protocols/steering/strict-mode.md
src/core/protocols/agent-activation.md → ~/.kiro/powers/kiro-protocols/steering/agent-activation.md
src/core/protocols/agent-management.md → ~/.kiro/powers/kiro-protocols/steering/agent-management.md
src/core/protocols/agent-creation.md   → ~/.kiro/powers/kiro-protocols/steering/agent-creation.md
src/kiro/steering/protocols/mode-switching.md  → ~/.kiro/powers/kiro-protocols/steering/mode-switching.md
src/kiro/steering/protocols/mode-management.md → ~/.kiro/powers/kiro-protocols/steering/mode-management.md

# Note: Same substitutions as production, different destination for testing
# Handles readonly files: writable during build, readonly after
```

### npm Build

```
# Steering files
src/core/aliases.md                → build/npm/dist/aliases.md
src/core/agents.md                 → build/npm/dist/agents.md
src/kiro/steering/modes.md         → build/npm/dist/modes.md
src/core/strict.md                 → build/npm/dist/strict.md

# Power files (copied from powers/)
powers/kiro-protocols/POWER.md     → build/npm/power/POWER.md
powers/kiro-protocols/mcp.json     → build/npm/power/mcp.json
powers/kiro-protocols/icon.png     → build/npm/power/icon.png
powers/kiro-protocols/steering/*   → build/npm/power/steering/*
src/core/protocols/strict-mode.md  → build/npm/dist/protocols/strict-mode.md
src/core/protocols/agent-activation.md → build/npm/dist/protocols/agent-activation.md
src/core/protocols/agent-management.md → build/npm/dist/protocols/agent-management.md
src/core/protocols/agent-creation.md   → build/npm/dist/protocols/agent-creation.md
src/kiro/steering/protocols/mode-switching.md → build/npm/dist/protocols/mode-switching.md
src/kiro/steering/protocols/mode-management.md → build/npm/dist/protocols/mode-management.md
src/core/interactions/chit-chat.md → build/npm/dist/interactions/chit-chat.md
src/core/.../interaction-styles.md → build/npm/dist/interactions/interaction-styles.md
src/kiro/.../kiro-spec-mode.md     → build/npm/dist/modes/kiro-spec-mode.md
src/kiro/.../kiro-vibe-mode.md     → build/npm/dist/modes/kiro-vibe-mode.md
```

## Conventions

**Source Organization**:
- Core files in `src/core/` for cross-IDE compatibility
- Kiro-specific files in `src/kiro/`
- Configuration uses import + extend pattern
- Interactive files (agents.md, modes.md, strict.md) in appropriate locations
- Protocol files (.md) as single source of truth, injected via substitutions

**Build Process**:
- Deterministic builds (same input = same output)
- Dynamic substitutions applied at build time
- Two build targets: npm, dev
- Powers built separately via `build:powers` script
- npm build cleans after completion
- Dev mode watches for changes

**Distribution**:
- npm: `build/npm/` included in package, then cleaned
- Powers: `powers/` committed to GitHub (steering/ auto-generated)
- Dev: `~/.kiro/steering/kiro-agents/` for local development
- Files set to read-only after npm installation

**Versioning**:
- Session snapshots in `.kiro/session-snapshots/` (gitignored)
- Final changesets in `.changeset/*.md` (committed)
- Kiro hooks in `.kiro/hooks/` for slash commands
- Documentation in `docs/VERSIONING.md`
- Kiro hooks in `.kiro/hooks/` for slash commands
