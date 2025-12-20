# Project Structure

## Repository Organization

```
kiro-agents/
├── src/                          # Source files
│   ├── manifest.ts               # **CENTRALIZED FILE MANIFEST** - Single source of truth for all file mappings
│   ├── core/                     # Cross-IDE compatible
│   │   ├── aliases.md            # Instruction alias system with injected Kiro aliases
│   │   ├── agents.md             # Interactive agent menu
│   │   ├── strict.md             # Interactive strict control
│   │   ├── docs/                 # Extended documentation
│   │   │   ├── aliases-guide.md  # Complete alias documentation
│   │   │   └── agent-system-guide.md  # Complete agent system guide
│   │   ├── protocols/            # Protocol files (auxiliary .md) - auto-discovered via manifest
│   │   │   ├── agent-activation.md  # Agent activation protocol
│   │   │   ├── agent-management.md  # Agent management protocol
│   │   │   ├── agent-creation.md    # Agent creation protocol
│   │   │   ├── chit-chat.md         # ADHD-C interaction patterns
│   │   │   └── strict-mode.md       # Strict mode protocol
│   │   └── interactions/
│   │       ├── conversation-language.md  # Language usage guidelines
│   │       └── interaction-styles.md
│   ├── kiro/                     # Kiro-specific
│   │   ├── POWER.md              # Power metadata template
│   │   ├── mcp.json              # Empty MCP config
│   │   ├── config.ts             # Kiro substitutions (includes mode aliases)
│   │   ├── shared-aliases.md     # Reusable alias definitions
│   │   └── steering/
│   │       ├── modes.md          # Interactive mode menu
│   │       └── protocols/        # Kiro-specific protocols - auto-discovered via manifest
│   │           ├── mode-switching.md    # Mode switching protocol
│   │           ├── mode-management.md   # Mode management protocol
│   │           ├── kiro-spec-mode.md    # Spec mode definition (moved from agent-system/)
│   │           ├── kiro-vibe-mode.md    # Vibe mode definition (moved from agent-system/)
│   │           ├── kiro-as-spec-mode.md # As-Spec mode definition (role-based spec)
│   │           └── kiro-as-vibe-mode.md # As-Vibe mode definition (role-based vibe)
│   ├── utils/                    # Build utilities
│   │   └── markdown-extractor.ts # Section extraction from markdown
│   └── config.ts                 # Core substitutions
├── scripts/                      # Build scripts
│   ├── build.ts                  # npm package build pipeline
│   ├── build-powers.ts           # Multi-power build system using manifest-based protocol discovery
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
│   ├── ARCHITECTURE.md           # System design and component relationships
│   ├── design/                   # Design rationale
│   │   ├── README.md             # Design documentation index
│   │   ├── protocol-system.md    # Why layered protocols work
│   │   ├── interaction-patterns.md  # How patterns reduce cognitive load
│   │   └── neurodivergent-accessibility.md  # ADHD-C design principles
│   ├── user-guide/               # User-facing documentation
│   │   └── creating-powerful-agents.md  # Layered architecture guide
│   ├── contributing/             # Contribution guides
│   │   ├── DUAL_INSTALLATION.md
│   │   ├── MANIFEST-SYSTEM.md
│   │   ├── TESTING.md
│   │   └── VERSIONING.md
│   ├── agents.md                 # Agent system documentation
│   ├── modes.md                  # Mode system documentation
│   └── resources/                # Media assets
│       └── animate-kiro.gif
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
- Chit-chat interaction protocol
- Interaction patterns (styles)
- Base configuration

**Kiro** - Kiro-specific implementations:
- Mode system (vibe/spec/as-vibe/as-spec)
- Power metadata (POWER.md)
- Kiro-specific configurations
- Mode definitions

### Build Layer (`scripts/`, `bin/`)

**Power Build Pipeline** (`scripts/build-powers.ts`):
- Builds standalone powers to `powers/` directory using centralized manifest system
- Auto-discovers protocols via `PROTOCOL_SOURCE_MAPPINGS` from `src/manifest.ts`
- Uses glob patterns: `core/protocols/*.md`, `kiro/steering/protocols/*.md`
- Processes protocol files with substitutions
- Creates kiro-protocols power with all discovered protocols
- Must run BEFORE npm build

**Power Dev Pipeline** (`scripts/dev-powers.ts`):
- Uses manifest system (`PROTOCOL_SOURCE_MAPPINGS`) for automatic protocol discovery
- Builds directly to `~/.kiro/powers/kiro-protocols/` for rapid iteration
- Watch mode for protocol file changes in `src/`
- Handles readonly files automatically (writable during build, readonly after)
- Auto-discovers both core and Kiro-specific protocols via glob patterns
- Uses same substitution system as production builds for consistency

**npm Build Pipeline** (`scripts/build.ts`):
- Two build targets: `npm`, `dev`
- Uses centralized manifest system (`src/manifest.ts`) for all file mappings
- Compiles CLI to JavaScript (npm only)
- Loads configuration with substitutions
- Processes markdown files via `STEERING_MAPPINGS` from manifest
- Copies pre-built power files from `powers/kiro-protocols/`
- Maps files to target structure with guaranteed consistency

**CLI Tool** (`bin/cli.ts`):
- Generated from `bin/cli.template.ts` with embedded file lists from manifest
- Dual installation system for steering documents and kiro-protocols power
- Uses `getSteeringFilesForCLI()` and `getPowerFilesForCLI()` from manifest
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
- Uses manifest system for automatic protocol discovery (same as production)
- Direct build to user's power directory
- Watch mode for protocol development
- Handles readonly files automatically
- Auto-discovers protocols via `PROTOCOL_SOURCE_MAPPINGS` glob patterns
- Fast iteration for protocol changes

## File Mapping

### Powers Build (via `build-powers.ts` using centralized manifest system)

**Auto-discovered via `PROTOCOL_SOURCE_MAPPINGS` in `src/manifest.ts`:**

```
# Core protocols (cross-IDE compatible)
src/core/protocols/*.md → powers/kiro-protocols/steering/{name}.md
  ├── strict-mode.md      → powers/kiro-protocols/steering/strict-mode.md
  ├── agent-activation.md → powers/kiro-protocols/steering/agent-activation.md
  ├── agent-management.md → powers/kiro-protocols/steering/agent-management.md
  └── agent-creation.md   → powers/kiro-protocols/steering/agent-creation.md

# Kiro-specific protocols (includes mode definitions)
src/kiro/steering/protocols/*.md → powers/kiro-protocols/steering/{name}.md
  ├── mode-switching.md     → powers/kiro-protocols/steering/mode-switching.md
  ├── mode-management.md    → powers/kiro-protocols/steering/mode-management.md
  ├── kiro-spec-mode.md     → powers/kiro-protocols/steering/kiro-spec-mode.md
  ├── kiro-vibe-mode.md     → powers/kiro-protocols/steering/kiro-vibe-mode.md
  ├── kiro-as-spec-mode.md  → powers/kiro-protocols/steering/kiro-as-spec-mode.md
  └── kiro-as-vibe-mode.md  → powers/kiro-protocols/steering/kiro-as-vibe-mode.md
```

**Benefits:**
- ✅ Auto-discovery: Add new protocol → automatically included
- ✅ Single source of truth: All mappings in `src/manifest.ts`
- ✅ Glob patterns: No manual file list updates needed

### Dev:Powers Build (via `dev-powers.ts` using manifest system)

**Auto-discovered via `PROTOCOL_SOURCE_MAPPINGS` in `src/manifest.ts`:**

```
# Core protocols (cross-IDE compatible) - auto-discovered via manifest
src/core/protocols/*.md → ~/.kiro/powers/kiro-protocols/steering/{name}.md
  ├── strict-mode.md      → ~/.kiro/powers/kiro-protocols/steering/strict-mode.md
  ├── agent-activation.md → ~/.kiro/powers/kiro-protocols/steering/agent-activation.md
  ├── agent-management.md → ~/.kiro/powers/kiro-protocols/steering/agent-management.md
  └── agent-creation.md   → ~/.kiro/powers/kiro-protocols/steering/agent-creation.md

# Kiro-specific protocols (includes mode definitions) - auto-discovered via manifest
src/kiro/steering/protocols/*.md → ~/.kiro/powers/kiro-protocols/steering/{name}.md
  ├── mode-switching.md     → ~/.kiro/powers/kiro-protocols/steering/mode-switching.md
  ├── mode-management.md    → ~/.kiro/powers/kiro-protocols/steering/mode-management.md
  ├── kiro-spec-mode.md     → ~/.kiro/powers/kiro-protocols/steering/kiro-spec-mode.md
  ├── kiro-vibe-mode.md     → ~/.kiro/powers/kiro-protocols/steering/kiro-vibe-mode.md
  ├── kiro-as-spec-mode.md  → ~/.kiro/powers/kiro-protocols/steering/kiro-as-spec-mode.md
  └── kiro-as-vibe-mode.md  → ~/.kiro/powers/kiro-protocols/steering/kiro-as-vibe-mode.md

# Benefits: Same as production build
# - Auto-discovery: Add new protocol → automatically included
# - Same substitutions as production, different destination for testing
# - Handles readonly files: writable during build, readonly after
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
src/core/interactions/conversation-language.md → build/npm/dist/interactions/conversation-language.md
src/core/interactions/interaction-styles.md → build/npm/dist/interactions/interaction-styles.md
src/kiro/steering/protocols/kiro-spec-mode.md     → build/npm/dist/modes/kiro-spec-mode.md
src/kiro/steering/protocols/kiro-vibe-mode.md     → build/npm/dist/modes/kiro-vibe-mode.md
src/kiro/.../kiro-as-spec-mode.md  → build/npm/dist/modes/kiro-as-spec-mode.md
src/kiro/.../kiro-as-vibe-mode.md  → build/npm/dist/modes/kiro-as-vibe-mode.md
```

## Conventions

**Source Organization**:
- Core files in `src/core/` for cross-IDE compatibility
- Kiro-specific files in `src/kiro/`
- Configuration uses import + extend pattern
- Interactive files (agents.md, modes.md, strict.md) in appropriate locations
- Protocol files (.md) as single source of truth, injected via substitutions

**Build Process**:
- **Centralized Manifest System**: All file mappings in `src/manifest.ts` (single source of truth)
- **Glob Pattern Support**: Auto-discovers files with `*.md` patterns, no manual updates needed
- **Manifest-Based Protocol Discovery**: `PROTOCOL_SOURCE_MAPPINGS` with glob patterns for automatic protocol inclusion
- **Guaranteed Consistency**: Dev mode matches CLI installation exactly (no more mismatches)
- **CLI Generation**: `bin/cli.ts` generated from template with embedded file lists from manifest
- Deterministic builds (same input = same output)
- Dynamic substitutions applied at build time
- Two build targets: npm, dev
- Powers built separately via `build:powers` script using manifest auto-discovery
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
