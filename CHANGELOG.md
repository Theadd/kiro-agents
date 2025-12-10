# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### Dual Build Pipeline System
- **Three build modes** for different use cases:
  - `bun run build` - npm package build (compiles CLI, processes files, auto-cleans)
  - `bun run build:power` - Kiro Power distribution build
  - `bun run dev` - Development mode with watch (builds to user directory)
- **Power distribution support** - Complete Kiro Power structure with POWER.md and mcp.json
- **Dev mode** - Watch mode that builds directly to `~/.kiro/steering/kiro-agents/` for fast iteration
- **Dynamic substitutions system** - Template-based content generation with:
  - `{{{VERSION}}}` - Auto-inject package version
  - `{{{COMMANDS_LIST}}}` - Auto-generate command documentation
  - `{{{AGENT_LIST}}}` - Auto-list available agents
  - `{{{MODE_COMMANDS}}}` - Mode-specific command lists

#### Interactive Command System
- **Interactive agent management** (`/agents`) - Visual menu for agent operations
- **Interactive mode management** (`/modes`) - Visual menu for mode switching
- **Interactive strict mode control** (`/strict`) - Visual buttons using userInput tool
- **Parameterized commands** - Direct activation with parameters:
  - `/agents {name}` - Activate specific agent
  - `/modes {name}` - Switch to specific mode
  - `/strict {state}` - Change strict mode state

#### New Source Files
- `src/core/agents.md` - Interactive agent management interface
- `src/core/strict.md` - Interactive strict mode control with userInput
- `src/kiro/steering/modes.md` - Interactive mode management interface
- `src/kiro/POWER.md` - Power metadata template with dynamic substitutions
- `src/kiro/mcp.json` - Empty MCP server configuration (prepared for future)

#### Build Infrastructure
- `scripts/test.ts` - Automated build validation script
- Updated `scripts/build.ts` - Complete rewrite for dual build support
- Updated `scripts/clean.ts` - Cleans both build and power directories

### Changed

#### Command Structure
- **Breaking**: Changed command names from singular to plural for consistency:
  - `/agent {name}` → `/agents {name}`
  - `/mode {name}` → `/modes {name}`
- **New**: Added interactive versions (no parameters) for all commands
- **Unified**: Same command name for both interactive and direct usage

#### Installation Behavior
- **npm installation** now installs to `~/.kiro/steering/kiro-agents/` (subdirectory)
- **Auto-cleanup**: Removes old installation before installing new version
- **Simplified updates**: Just re-run `npx kiro-agents` to update

#### File Organization
- **npm build**: Flatter structure, includes interactive files
- **Power build**: Hierarchical structure with `steering/` subdirectories
- **Excluded files**: `conversation-language.md` and `client-tools.md` not included in builds (work in progress)

#### Build Process
- **npm build**: Now auto-cleans `build/npm/` after successful build
- **Power build**: Outputs to `power/` directory (committed to GitHub)
- **Dev mode**: Replaces old watch mode, builds to user directory

#### Configuration
- Enhanced `src/kiro/config.ts` with dynamic substitution functions
- Updated `package.json` scripts:
  - `build` → npm package build
  - `build:power` → Power distribution build
  - `dev` → Development watch mode (replaces `watch`)
  - Removed `build:npm` (now just `build`)

### Fixed
- **File mappings**: Corrected to include all interactive files in npm build
- **Clean script**: Now removes correct directories (`build`, `power` instead of `dist`)
- **CLI paths**: Updated to use new `build/npm/` structure

### Removed
- `index.ts` - Obsolete test file
- Old `dist/` directory structure - Replaced by `build/npm/dist/`
- Workspace `.kiro/steering/` auto-copy - No longer copies to workspace during build

## Architecture Changes

### Before
```
Single build target (npm only)
dist/ → npm package
.kiro/steering/ → local copy
```

### After
```
Three build targets:
1. npm → build/npm/ (temporary, auto-cleaned)
2. power → power/ (committed to GitHub)
3. dev → ~/.kiro/steering/kiro-agents/ (watch mode)
```

## Migration Guide

### For Users

**npm installation** (no changes needed):
```bash
npx kiro-agents  # Still works, now installs to subdirectory
```

**New Power installation**:
```bash
# In Kiro IDE:
# Powers panel → Add from GitHub → https://github.com/user/kiro-agents
```

**New commands** (breaking changes):
```bash
# Old → New
/agent {name}  → /agents {name}
/mode {name}   → /modes {name}

# New interactive commands
/agents        # Visual menu
/modes         # Visual menu
/strict        # Visual buttons
```

### For Developers

**New build commands**:
```bash
# Old → New
bun run build        # Still builds npm, now auto-cleans
bun run watch        # → bun run dev (builds to user dir)
bun run build:npm    # → bun run build
bun run build:power  # New: builds Power distribution
```

**New file structure**:
- Source files unchanged
- Build outputs: `build/npm/` (temp) and `power/` (committed)
- Dev mode: `~/.kiro/steering/kiro-agents/`

## Testing

All builds validated with automated test suite:
```bash
bun run test  # Validates both npm and Power builds
```

Tests verify:
- File existence and counts
- Substitution processing
- Frontmatter validity
- POWER.md structure
- CLI compilation (npm only)

---

**Full Changelog**: https://github.com/user/kiro-agents/commits/main
