# Project Structure

## Repository Organization

```
kiro-agents/
├── src/                          # Source files
│   ├── core/                     # Cross-IDE compatible
│   │   ├── aliases.md            # Instruction alias system (compact)
│   │   ├── agent-system.md       # Core agent system
│   │   ├── agents.md             # Interactive agent menu
│   │   ├── strict-mode.md        # Strict mode rules
│   │   ├── strict.md             # Interactive strict control
│   │   ├── docs/                 # Extended documentation
│   │   │   └── aliases-guide.md  # Complete alias documentation
│   │   └── interactions/
│   │       ├── chit-chat.md      # ADHD-C patterns
│   │       └── interaction-styles.md
│   ├── kiro/                     # Kiro-specific
│   │   ├── POWER.md              # Power metadata template
│   │   ├── mcp.json              # Empty MCP config
│   │   ├── config.ts             # Kiro substitutions
│   │   └── steering/
│   │       ├── modes-system.md   # Mode switching
│   │       ├── modes.md          # Interactive mode menu
│   │       └── agent-system/
│   │           ├── kiro-spec-mode.md
│   │           └── kiro-vibe-mode.md
│   └── config.ts                 # Core substitutions
├── scripts/                      # Build scripts
│   ├── build.ts                  # Dual build pipeline
│   ├── test.ts                   # Validation script
│   ├── clean.ts                  # Clean script
│   ├── snapshot.ts               # Capture session context
│   ├── finalize.ts               # Consolidate snapshots
│   └── release.ts                # Publish release
├── bin/                          # CLI tool
│   └── cli.ts                    # CLI source
├── build/                        # Build artifacts (gitignored)
│   └── npm/                      # npm package build
│       ├── bin/cli.js            # Compiled CLI
│       └── dist/                 # Processed steering files
├── power/                        # Power distribution (in GitHub)
│   ├── POWER.md                  # Power metadata
│   ├── mcp.json                  # MCP config
│   └── steering/                 # Organized steering files
├── docs/                         # Documentation
│   └── VERSIONING.md             # Versioning system guide
├── .changeset/                   # Changesets
│   ├── config.json               # Changesets configuration
│   ├── README.md                 # Workflow documentation
│   ├── snapshots/                # Session snapshots (gitignored)
│   └── *.md                      # Changeset files (committed)
└── .kiro/                        # Workspace config
    ├── agents/                   # Custom agents
    ├── hooks/                    # Kiro slash commands
    │   ├── snapshot.json         # /snapshot command
    │   ├── finalize.json         # /finalize command
    │   └── release.json          # /release command
    └── steering/                 # Workspace steering
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

**Build Pipeline** (`scripts/build.ts`):
- Three build modes: `npm`, `power`, `dev`
- Compiles CLI to JavaScript (npm only)
- Loads configuration with substitutions
- Processes markdown files
- Maps files to target structure

**CLI Tool** (`bin/cli.ts`):
- Installs to `~/.kiro/steering/kiro-agents/`
- Removes old installation before installing new
- Manages file permissions
- Cross-platform compatible

### Distribution Layer

**npm Distribution** (`build/npm/`):
- Gitignored, temporary build
- CLI compiled to JavaScript
- Steering files processed
- Cleaned after npm publish

**Power Distribution** (`power/`):
- In GitHub repository
- POWER.md with metadata
- Organized steering structure
- Ready for Kiro Powers installation

**Dev Mode** (`~/.kiro/steering/kiro-agents/`):
- Direct build to user directory
- Watch mode for development
- No CLI compilation needed
- Fast iteration cycle

## File Mapping

### npm Build

```
src/core/aliases.md                → build/npm/dist/aliases.md
src/core/agent-system.md           → build/npm/dist/agent-system.md
src/core/agents.md                 → build/npm/dist/agents.md
src/kiro/steering/modes-system.md  → build/npm/dist/modes-system.md
src/kiro/steering/modes.md         → build/npm/dist/modes.md
src/core/strict-mode.md            → build/npm/dist/strict-mode.md
src/core/strict.md                 → build/npm/dist/strict.md
src/core/interactions/chit-chat.md → build/npm/dist/interactions/chit-chat.md
src/core/.../interaction-styles.md → build/npm/dist/interactions/interaction-styles.md
src/kiro/.../kiro-spec-mode.md     → build/npm/dist/modes/kiro-spec-mode.md
src/kiro/.../kiro-vibe-mode.md     → build/npm/dist/modes/kiro-vibe-mode.md
```

### Power Build

```
src/kiro/POWER.md                  → power/POWER.md
src/kiro/mcp.json                  → power/mcp.json
src/core/aliases.md                → power/steering/aliases.md
src/core/agent-system.md           → power/steering/agent-system.md
src/core/agents.md                 → power/steering/agents.md
src/kiro/steering/modes-system.md  → power/steering/modes-system.md
src/kiro/steering/modes.md         → power/steering/modes.md
src/core/strict-mode.md            → power/steering/strict-mode.md
src/core/strict.md                 → power/steering/strict.md
src/core/interactions/chit-chat.md → power/steering/interactions/chit-chat.md
src/core/.../interaction-styles.md → power/steering/interactions/interaction-styles.md
src/kiro/.../kiro-spec-mode.md     → power/steering/modes/kiro-spec-mode.md
src/kiro/.../kiro-vibe-mode.md     → power/steering/modes/kiro-vibe-mode.md
```

## Conventions

**Source Organization**:
- Core files in `src/core/` for cross-IDE compatibility
- Kiro-specific files in `src/kiro/`
- Configuration uses import + extend pattern
- Interactive files (agents.md, modes.md, strict.md) in appropriate locations

**Build Process**:
- Deterministic builds (same input = same output)
- Dynamic substitutions applied at build time
- Three build modes: npm, power, dev
- npm build cleans after completion
- Dev mode watches for changes

**Distribution**:
- npm: `build/npm/` included in package, then cleaned
- Power: `power/` committed to GitHub
- Dev: `~/.kiro/steering/kiro-agents/` for local development
- Files set to read-only after npm installation

**Versioning**:
- Session snapshots in `.changeset/snapshots/` (gitignored)
- Final changesets in `.changeset/*.md` (committed)
- Kiro hooks in `.kiro/hooks/` for slash commands
- Documentation in `docs/VERSIONING.md`
