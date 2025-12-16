# Dual Installation Architecture

kiro-agents uses a dual-distribution architecture that installs both steering files and the kiro-protocols power dependency.

## Installation Targets

**Steering files** → `~/.kiro/steering/kiro-agents/`
- Core system files (aliases.md, strict-mode.md)
- Interactive interfaces (agents.md, modes.md, strict.md)
- Mode definitions (kiro-spec-mode.md, kiro-vibe-mode.md)

**Power dependency** → `~/.kiro/powers/kiro-protocols/`
- POWER.md (power metadata)
- mcp.json (empty MCP config)
- icon.png (power icon)
- steering/ (reusable protocols)

## Why This Architecture?

The kiro-protocols power contains reusable protocol files referenced by steering files. Installing as a power provides:

- Stable reference paths: `~/.kiro/powers/kiro-protocols/steering/`
- Discoverability via Kiro Powers UI
- Independent updates
- Reusability across projects
- Automatic registration in Kiro's power system

## Build Process

### Stage 1: Build Powers

```bash
bun run build:powers
```

- Processes protocols from `src/core/protocols/` and `src/kiro/steering/protocols/`
- Applies substitutions
- Outputs to `powers/kiro-protocols/steering/`

### Stage 2: Build npm Package

```bash
bun run build
```

- Builds steering files to `build/npm/dist/`
- Copies pre-built power files from `powers/kiro-protocols/` to `build/npm/power/`
- Compiles CLI to `build/npm/bin/cli.js`

**Important:** Always run `build:powers` before `build` to ensure latest protocols are included.

## CLI Installation Flow

When user runs `npx kiro-agents`:

1. **Remove old installations** (if present)
2. **Install steering files** to `~/.kiro/steering/kiro-agents/`
3. **Install power files** to `~/.kiro/powers/kiro-protocols/`
4. **Create symbolic links** in `~/.kiro/powers/installed/kiro-protocols/`
5. **Register power** in `~/.kiro/powers/registry.json`
6. **Show success message**

## Automatic Power Registration

The CLI automatically registers kiro-protocols in Kiro's registry following the exact pattern used by Kiro IDE:

```json
{
  "powers": {
    "kiro-protocols": {
      "installed": true,
      "installedAt": "2025-12-16T...",
      "installPath": "~/.kiro/powers/installed/kiro-protocols",
      "source": {
        "type": "repo",
        "repoId": "local-kiro-protocols",
        "repoName": "~/.kiro/powers/kiro-protocols"
      },
      "sourcePath": "~/.kiro/powers/kiro-protocols"
    }
  },
  "repoSources": {
    "local-kiro-protocols": {
      "name": "~/.kiro/powers/kiro-protocols",
      "type": "local",
      "enabled": true,
      "path": "~/.kiro/powers/kiro-protocols",
      "powerCount": 1
    }
  }
}
```

**Key features:**
- Uses stable repo ID `"local-kiro-protocols"` (no timestamp conflicts)
- `installPath` points to `installed/` directory with symlinks
- `sourcePath` points to actual power directory
- Power appears immediately as "installed" in Kiro Powers UI

### Implementation Details

**Symbolic Links** (`createSymbolicLinks()`)
- Creates `installed/kiro-protocols/` directory
- Links each file and directory from power
- Platform-specific: Windows uses junction for directories, symlink for files

**Registry Registration** (`registerPowerInRegistry()`)
- Extracts metadata from POWER.md frontmatter
- Creates/updates registry entries
- Graceful error handling (non-blocking)

**Error Handling:**
- Registry registration errors logged as warnings
- Installation continues even if registration fails
- User gets manual activation instructions as fallback

## Testing

```bash
# Build both stages
bun run build:powers
bun run build

# Test locally
bun link
kiro-agents

# Verify installations
ls ~/.kiro/steering/kiro-agents/
ls ~/.kiro/powers/kiro-protocols/

# Verify registry
cat ~/.kiro/powers/registry.json | grep -A 10 "kiro-protocols"

# Check Kiro Powers UI
# Should see "kiro-protocols" with "Installed" badge
```

## Release Workflow

```bash
# 1. Build powers
bun run build:powers

# 2. Validate
bun run validate:powers

# 3. Build npm package
bun run build

# 4. Test
bun run test

# 5. Release (maintainer only)
bun run finalize
bun run release
```
