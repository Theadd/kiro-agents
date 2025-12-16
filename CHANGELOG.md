# Changelog

## 1.10.0

### Minor Changes

- 74fec7e: # Automatic power registration with symbolic links

  The kiro-protocols power now appears immediately as "installed" in Kiro Powers UI after running `npx kiro-agents`. The CLI creates symbolic links in the installed directory and registers the power following Kiro IDE's exact pattern, eliminating the need for manual activation.

  ## Added

  - Automatic symbolic link creation in installed directory pointing to actual power files
  - Automatic power registration following Kiro's exact registry pattern
  - Platform-specific symlink handling (Windows: junction for directories, symlink for files; Unix: symlink for both)
  - New `createSymbolicLinks()` function in CLI for cross-platform symlink creation
  - Documentation file `AUTOMATIC_REGISTRATION_FIX.md` with implementation details and testing results

  ## Changed

  - Power registration now uses stable repoId instead of timestamp-based ID to prevent conflicts on reinstall
  - Registry structure updated to match Kiro's pattern with separate install and source paths
  - Power source type changed from "local" to "repo" for proper Powers UI integration
  - Installation flow now includes symlink creation and registry registration steps with graceful error handling
  - CLI documentation updated to reflect enabled automatic registration
  - Steering documentation updated to document automatic registration and symlink capabilities

  ## Fixed

  - Power no longer requires manual activation via Powers panel after npm installation
  - Registry conflicts on reinstall eliminated by using stable repo ID instead of timestamps

## 1.9.1

### Patch Changes

- 876185c: # Disable automatic power registry modification

  Commented out the registry write operation in the CLI's power registration logic to prevent potential conflicts with Kiro IDE's internal power management system. The registration code remains in place but disabled, pending validation of the approach with the Kiro team.

  ## Changed

  - Disabled automatic writing to Kiro's power registry during npm installation to avoid modifying IDE internal state

## 1.9.0

### Minor Changes

- 29b4dea: # Automatic power registration in CLI installer

  The kiro-protocols power now automatically registers in Kiro's Powers UI when running `npx kiro-agents`, eliminating the need for manual activation. The CLI extracts metadata from POWER.md and updates the Kiro registry, making the power appear as installed immediately after installation.

  ## Added

  - Automatic power registration during CLI installation
  - Power metadata extraction from POWER.md frontmatter
  - Registry registration with installation info and timestamps
  - TypeScript interfaces for Kiro registry structure
  - Graceful error handling with fallback instructions if registration fails
  - Comprehensive technical documentation (AUTOMATIC_POWER_REGISTRATION.md)
  - Implementation summary documentation (IMPLEMENTATION_CHANGELOG.md)

  ## Changed

  - CLI install function now includes registry registration step
  - Installation success messages mention automatic power registration
  - DUAL_INSTALLATION_GUIDE.md updated with registry registration details
  - Enhanced documentation throughout CLI code

  ## Fixed

  - Power no longer requires manual activation after installation
  - Users no longer need to manually add repository via Powers UI

## 1.8.0

### Minor Changes

- a006d66: # Multi-method agent creation system

  Redesigned agent creation to support five different creation methods, making agent creation accessible to users of all experience levels. The system now offers Quick Start templates, Project-Specific AI analysis, domain-based role exploration, the existing guided wizard, and natural language descriptions.

  ## Added

  - Quick Start method with 12 predefined agent templates embedded in protocol
  - Project-Specific method that analyzes workspace files and suggests relevant agents
  - Explore Roles method with roles organized across 8 domains
  - Natural Language method allowing users to describe agents in plain English
  - Method selection menu presenting all 5 creation approaches with guidance

  ## Changed

  - Agent creation protocol restructured from single wizard to multi-method system
  - Agent management protocol updated to present method selection menu
  - Existing wizard preserved as Guided Wizard method for full control

- 25aea1d: # Dual installation system for steering files and power dependency

  Implemented dual installation architecture where npm package installs both steering files and kiro-protocols power simultaneously. Users now get single-command installation with discoverable protocols via Kiro Powers UI.

  ## Added

  - Dual installation system in CLI installs steering files and kiro-protocols power simultaneously
  - Comprehensive documentation of dual installation architecture
  - Power file copying function in build system
  - Power files now included in published npm package

  ## Changed

  - CLI installation function accepts flexible source and destination paths
  - CLI installs to both steering and powers directories
  - Build system includes power file copying step
  - GitHub workflow validates test powers not committed

  ## Removed

  - Old build:power script replaced by build:powers for multi-power architecture
  - Old power build implementation replaced by dedicated build-powers script
  - Obsolete analysis and planning documents

## 1.7.1

### Patch Changes

- d07d8be: # Add debugging documentation and test powers for investigation

  Created comprehensive analysis documentation and test powers to systematically debug Power loading issues. Added implementation plan, systematic testing guide, and three test powers to identify root causes through empirical testing.

  ## Added

  - Implementation plan document with 4-phase restructuring approach
  - Systematic testing plan document with 3 test scenarios
  - MCP configuration files for protocol and example powers
  - Test power configurations for control testing
  - Example Knowledge Base Power for testing minimal requirements

  ## Changed

  - Updated Power metadata frontmatter with version fields
  - Cleaned up Power structure to match working reference

  ## Removed

  - Extra documentation files from protocol power
  - Placeholder files that differed from working power structure

## 1.7.0

### Minor Changes

- 0c0a5f6: # Add kiro-protocols power for on-demand protocol loading

  Introduces a new Kiro Power that provides reusable protocol library for AI agents. Protocols can be loaded on-demand using Kiro's kiroPowers tool, significantly reducing context overhead while maintaining access to step-by-step workflows for agent management, mode switching, and interactive patterns.

  ## Added

  - kiro-protocols power with 5 reusable protocols for agent and mode management
  - Comprehensive power documentation with metadata and integration examples
  - Multi-power infrastructure support for scalable power ecosystem
  - On-demand protocol loading via kiroPowers tool integration

## 1.6.1

### Patch Changes

- 0aed95e: # Fix protocol file loading outside workspace with File References

  Migrated protocol files from .mdx to .md and replaced absolute path references with Kiro File References syntax. This fixes the critical issue where protocol files couldn't be loaded when kiro-agents is installed in the global user directory because Kiro's file reading tools cannot access files outside the workspace.

  ## Added

  - Debug mode steering document for development and testing
  - File References syntax for all protocol file references
  - Missing protocol files (agent-management.md, agent-creation.md) to npm build mappings

  ## Changed

  - Renamed all protocol files from .mdx to .md extension (5 files: agent-activation, agent-management, agent-creation, mode-switching, mode-management)
  - Updated all protocol references to use File References syntax instead of absolute paths
  - Updated build configuration to map all protocol files correctly in both npm and power distributions
  - Updated documentation to reflect new file extensions and reference patterns

  ## Fixed

  - Protocol files can now be loaded correctly when installed outside workspace directory
  - npm build now includes all protocol files (previously missing agent-management and agent-creation)
  - File References work correctly with relative paths from current file location

## 1.6.0

### Minor Changes

- 1cacbd1: # Cross-IDE compatibility and power distribution protection

  Implements markdown section extraction system with recursive substitution processing, enforces cross-IDE compatibility by removing all Kiro-specific references from core files, and adds multi-layer protection to prevent contributors from accidentally modifying the power distribution directory.

  ## Added

  - Markdown section extraction utility with proper code block and XML tag handling
  - Recursive substitution processing in build system (up to 10 iterations for nested substitutions)
  - Cross-IDE compatibility substitutions for workspace paths, agent names, and descriptions
  - Shared content files for multi-line reusable content and alias definitions
  - GitHub Action that blocks PRs modifying power directory
  - Contributor guide with power protection explanation and development workflow
  - Cross-IDE Compatibility Rules and Power Distribution Protection sections in product documentation

  ## Changed

  - Build system now processes substitutions recursively to handle nested placeholders
  - Core files now use substitutions instead of hardcoded Kiro-specific values
  - Agent examples changed from kiro-manager to project-manager for IDE-agnostic naming
  - Build configuration clarified: all builds use Kiro-specific config
  - README now includes Contributing section with power modification warning
  - Test script updated to use npm-no-clean mode for validation

  ## Fixed

  - Nested substitutions now process correctly through recursive iteration
  - Section extraction no longer detects false headers inside code blocks or XML tags

### Patch Changes

- 6b83576: Reorganize session snapshots to .kiro directory structure

  Move session snapshots from `.changeset/snapshots/` to `.kiro/session-snapshots/` for better organization and consistency with other workspace configuration. This change consolidates all kiro-agents workspace data under the `.kiro/` directory, making the project structure cleaner and more intuitive.

  ### Changed

  - Moved session snapshots directory from `.changeset/snapshots/` to `.kiro/session-snapshots/`
  - Updated `.gitignore` to reflect new snapshot location
  - Updated all documentation references in `.changeset/README.md`, `CONTRIBUTING.md`, and steering documents
  - Updated hook prompts in `finalize.kiro.hook` and `snapshot.kiro.hook` to reference new location
  - Enhanced snapshot script with better error handling and validation

## 1.5.0

### Minor Changes

- 7d241d9: # Consolidate agent and mode systems with protocol injection pattern

  Refactored agent and mode systems to use protocol injection pattern, eliminating redundant steering documents and reducing AI context overhead by ~220 lines. Protocols now live in separate files and are injected at build time, with Kiro-specific aliases injected into core aliases via substitutions.

  ## Added

  - Mode switching protocol in Kiro-specific location
  - Mode management protocol with interactive workflow
  - User-facing agent commands reference documentation
  - User-facing mode commands reference documentation
  - KIRO_PROTOCOLS_PATH substitution for Kiro-specific protocol paths
  - KIRO_MODE_ALIASES substitution to inject mode aliases at build time
  - MODE_MANAGEMENT_PROTOCOL substitution for protocol injection
  - Custom path support in protocol injection function

  ## Changed

  - Core aliases now include injected Kiro-specific aliases via substitution
  - Mode management simplified to use protocol injection
  - Protocol injection function supports custom directory paths
  - Build script updated with new protocol file mappings
  - Test script updated to remove obsolete file validations
  - CLI installer updated to remove obsolete files from installation
  - Project structure documentation reflects new architecture
  - Product documentation references injected aliases instead of system files
  - Versioning documentation reorganized into contributing subdirectory

  ## Removed

  - Agent system steering document after consolidating content
  - Mode system steering document after consolidating content

## 1.4.0

### Minor Changes

- fa0fbd5: # Enhanced repository metadata and discoverability

  Improved project discoverability through GitHub features, enhanced documentation structure, and better package metadata. Added GitHub Sponsors support.

  ## Added

  - GitHub Sponsors funding configuration

  ## Changed

  - README.md restructured with improved clarity and better feature presentation
  - Package.json metadata enhanced with better keywords and description
  - Documentation formatting improved in VERSIONING.md
  - Gitignore updated to exclude workspace agents directory

## 1.3.0

### Minor Changes

- eb63cda: # Reduce context overhead with protocol extraction and injection system

  Extracted large instruction blocks from always-loaded steering documents into separate protocol files (.mdx), reducing context overhead by ~312 lines. Implemented build-time protocol injection system with target-aware substitutions, enabling single source of truth for agent management workflows while maintaining minimal footprint in AI context.

  ## Added

  - Protocol files for agent activation, mode switching, agent management, and agent creation
  - Build-time protocol injection system with `injectProtocol()` helper function
  - Target-aware substitutions that generate different paths for npm vs power distributions
  - Comprehensive guide files for agent system and modes system
  - `{{{PROTOCOLS_PATH}}}` and `{{{AGENT_MANAGEMENT_PROTOCOL}}}` substitution placeholders

  ## Changed

  - Steering documents reduced from ~280 lines to ~100 lines each (agent-system.md, modes-system.md)
  - Alias definitions now reference external protocol files instead of inline instructions
  - Substitution functions now receive build target context for dynamic path resolution
  - agents.md simplified to minimal shell with protocol content injected at build time

## 1.2.0

### Minor Changes

- 415ee0c: # Instruction Alias system with literal response pattern and extended documentation

  Refactored the Instruction Alias system into a compact steering document with a separate comprehensive guide. Added support for literal response pattern to enable triggering native IDE features, and reduced context overhead by separating essential instructions from extended documentation.

  ## Added

  - Instruction Alias system as Core Feature #0 with compact steering document (`src/core/aliases.md`)
  - Comprehensive alias documentation guide (`src/core/docs/aliases-guide.md`) with examples, best practices, and troubleshooting
  - Literal Response Pattern for outputting exact text to trigger native IDE features
  - Extended documentation directory structure (`src/core/docs/`)

  ## Changed

  - Refactored agent-system.md to reference aliases.md instead of containing inline alias documentation
  - Updated build pipeline to include aliases.md in both npm and power distributions
  - Improved project structure documentation to reflect new aliases and docs organization

### Patch Changes

- 28a5ff7: # Documentation consistency improvements and workspace steering setup

  Standardized command syntax across all documentation and source files, resolved architectural inconsistencies, and added comprehensive workspace steering documents for better development experience.

  ## Added

  - Workspace steering documents (product.md, structure.md, tech.md) providing comprehensive project context
  - .changeset/snapshots/ to .gitignore for session snapshot management

  ## Changed

  - Standardized command syntax from `/agent` to `/agents` throughout README and documentation
  - Standardized command syntax from `/mode` to `/modes` for consistency
  - Removed strict-mode.md loading from modes-system.md to eliminate duplicate loading when combining modes and agents

  ## Fixed

  - Command inconsistencies between README.md (singular) and source implementation (plural)
  - Architectural coupling where modes-system.md unnecessarily loaded strict-mode.md
  - Documentation clarity in MODE-SWITCHING-GUIDE.md and QUICK-REFERENCE.md

- c4225e4: # Refactor strict mode control to use numbered choice pattern

  Replaced userInput tool-based interaction with ADHD-C friendly numbered list format in strict mode control. This change improves compatibility with chit-chat interaction patterns and removes dependency on Kiro-specific tool constraints.

  ## Changed

  - Strict mode interactive control (`/strict`) now uses numbered choice pattern instead of userInput tool
  - Updated documentation in both `strict.md` and `strict-mode.md` to reflect numbered options interface
  - Replaced "visual buttons" terminology with "numbered choice interface" for consistency

## 1.1.0

### Minor Changes

- e6b0574: # Add AI-powered versioning system with session snapshots

  Implemented hybrid AI + Changesets versioning system that captures rich development context through session snapshots. Enables collaborative changelog generation with automatic filtering of temporary changes.

  ## Added

  - /snapshot command - Captures session context (purpose, findings, decisions, limitations)
  - /finalize command - Consolidates snapshots into changesets with AI analysis
  - /release command - Automates version bumping, changelog updates, and npm publishing
  - Session snapshot system - Stores development context across multiple sessions
  - Comprehensive documentation (docs/VERSIONING.md, CONTRIBUTING.md, .changeset/README.md)

  ## Changed

  - Build system now supports versioning workflow with new scripts
  - Project structure updated with .changeset/ directory and .kiro/hooks/
  - Steering documents updated with versioning system architecture

  ## Key Findings

  - AI session context captures 'why' and 'how' that git commits cannot
  - Gitignored snapshots prevent merge conflicts while committed changesets enable coordination
  - Multi-session support essential for features that exceed context window limits

  ## Design Decisions

  - Hybrid AI + Changesets approach balances automation with multi-developer coordination
  - Separated /snapshot (incremental) from /finalize (consolidation) to support frequent commits and multi-session features
  - Kiro slash commands via hooks provide seamless IDE integration

- e6b0574: # Add AI-powered versioning system with interactive workflows

  Implemented hybrid AI + Changesets versioning system with session snapshots, interactive confirmation prompts, and Kiro slash command hooks. The system captures rich development context across multiple sessions and consolidates it into user-facing changelogs.

  ## Added

  - Session snapshot system (/snapshot) for capturing development context
  - Interactive finalize workflow (/finalize) with 3-option confirmation prompt
  - Release automation (/release) with prerequisites and monitoring
  - Kiro hook files (.kiro.hook format) for slash commands
  - Comprehensive versioning documentation in docs/VERSIONING.md
  - AI-powered changeset consolidation from multiple sessions

  ## Changed

  - Hook format from .json to proper .kiro.hook files via Kiro UI
  - Finalize workflow now includes interactive commit/review/cancel options
  - Snapshot workflow enhanced with explicit AI auto-update instructions

  ## Removed

  - Old .json hook files (replaced with .kiro.hook format)

  ## Key Findings

  - Kiro hooks require .kiro.hook files created via UI, not programmatic .json files
  - Console prompts using readline work universally across all contexts
  - Session snapshots capture 'why' decisions were made, not just 'what' changed

  ## Design Decisions

  - Chose console prompts over userInput tool for universal compatibility
  - Implemented 3-option confirmation for flexibility: commit now, review first, or cancel
  - Separated snapshot (incremental) from finalize (consolidation) for better workflow

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
