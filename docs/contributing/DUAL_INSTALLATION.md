# Dual Installation Architecture

kiro-agents uses a dual-distribution architecture that installs both steering files and the kiro-protocols power dependency.

## Installation Targets

**Steering files** → `~/.kiro/steering/kiro-agents/` (read-only)
- Core system files providing foundational kiro-agents functionality
- Instruction aliases, agent management, mode switching, strict mode control
- Interactive interfaces (agents.md, modes.md, strict.md, reflect.md)
- Interaction patterns and mode definitions

**Power source** → `~/.kiro/powers/kiro-protocols/` (writable)
- POWER.md (power metadata)
- mcp.json (empty MCP config)
- icon.png (power icon)
- steering/ (reusable protocols)
- Kept writable so Kiro IDE can read it as a source directory

**Power installed** → `~/.kiro/powers/installed/kiro-protocols/` (read-only)
- Physical copy of power files (no symlinks)
- Where Kiro IDE reads the power from at runtime
- Does not include icon.png (Kiro IDE skips it during install)

## Why This Architecture?

The kiro-protocols power contains reusable protocol files referenced by steering files. Installing as a power provides:

- Stable reference paths: `~/.kiro/powers/kiro-protocols/steering/`
- Discoverability via Kiro Powers UI
- Independent updates
- Reusability across projects
- Automatic registration in Kiro's power system

The two-directory approach (`kiro-protocols/` + `installed/kiro-protocols/`) mirrors exactly what Kiro IDE does when a user installs a power via "Add Custom Power" UI:
- `kiro-protocols/` acts as the registered source (equivalent to the local path the user provides in the UI)
- `installed/kiro-protocols/` is the physical copy Kiro IDE creates and reads from at runtime

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
2. **Install steering files** to `~/.kiro/steering/kiro-agents/` (read-only)
3. **Install power source files** to `~/.kiro/powers/kiro-protocols/` (writable)
4. **Copy power files** to `~/.kiro/powers/installed/kiro-protocols/` (read-only physical copy)
5. **Register power** in `~/.kiro/powers/installed.json` and `~/.kiro/powers/registries/user-added.json`
6. **Show success message**

## Automatic Power Registration

The CLI registers kiro-protocols by writing to the two files Kiro IDE uses to track installed custom powers:

**`~/.kiro/powers/installed.json`**
```json
{
  "version": "1.0.0",
  "installedPowers": [
    { "name": "kiro-protocols", "registryId": "user-added" }
  ],
  "dismissedAutoInstalls": []
}
```

**`~/.kiro/powers/registries/user-added.json`**
```json
{
  "powers": [
    {
      "name": "kiro-protocols",
      "description": "Custom power from ~/.kiro/powers/kiro-protocols",
      "source": {
        "type": "local",
        "path": "~/.kiro/powers/kiro-protocols"
      }
    }
  ]
}
```

**Key points:**
- Both files are merged with existing content (other installed powers are preserved)
- `registry.json` is NOT modified — that file is the marketplace catalog managed by Kiro IDE
- The `source.path` points to `kiro-protocols/` (writable source), not `installed/kiro-protocols/`

### Implementation Details

**Physical file copy** (`installPowerFiles()`)
- Removes existing `installed/kiro-protocols/` for clean install
- Copies all files from `kiro-protocols/` to `installed/kiro-protocols/`
- Excludes `icon.png` (Kiro IDE does not copy it)
- Sets all copied files to read-only

**Registry registration** (`registerPower()`)
- Reads and merges `installed.json` and `registries/user-added.json`
- Extracts power name/description from POWER.md frontmatter
- Graceful error handling (non-blocking — warns but continues)

**Error Handling:**
- Copy/registration errors logged as warnings
- Installation continues even if these steps fail
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
ls ~/.kiro/powers/installed/kiro-protocols/

# Verify registry
cat ~/.kiro/powers/installed.json
cat ~/.kiro/powers/registries/user-added.json

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
