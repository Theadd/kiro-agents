# Dual Installation Guide: Steering + Power

This guide explains how kiro-agents installs both steering files AND the kiro-protocols power dependency during npm installation.

## Architecture Overview

kiro-agents has a dual-distribution architecture:

1. **Steering files** → `~/.kiro/steering/kiro-agents/`
   - Core system files (aliases.md, strict-mode.md, etc.)
   - Interactive interfaces (agents.md, modes.md, strict.md)
   - Mode definitions (kiro-spec-mode.md, kiro-vibe-mode.md)

2. **Power dependency** → `~/.kiro/powers/kiro-protocols/`
   - POWER.md (power metadata)
   - mcp.json (empty MCP config)
   - icon.png (power icon)
   - steering/ (reusable protocols)
     - agent-activation.md
     - agent-creation.md
     - agent-management.md
     - mode-management.md
     - mode-switching.md

## Why This Architecture?

The kiro-protocols power contains **reusable protocol files** that are referenced by the steering files in kiro-agents. By installing it as a power:

- ✅ Protocols are available at a stable path: `~/.kiro/powers/kiro-protocols/steering/`
- ✅ Users can discover and read protocols via Kiro Powers UI
- ✅ Protocols can be updated independently
- ✅ Other powers or projects can reference the same protocols
- ✅ Follows Kiro's power system conventions

## Implementation

### 1. Build Process

The build system has two independent stages:

**Stage 1: Build Powers** (`scripts/build-powers.ts`)
- Processes protocol files from `src/core/protocols/` and `src/kiro/steering/protocols/`
- Applies substitutions to protocol content
- Outputs to `powers/kiro-protocols/steering/`
- Creates standalone power ready for distribution
- **Command:** `bun run build:powers`

**Stage 2: Build npm Package** (`scripts/build.ts`)
- Builds steering files to `build/npm/dist/`
- Copies pre-built power files from `powers/kiro-protocols/` to `build/npm/power/`
- Compiles CLI to `build/npm/bin/cli.js`
- **Command:** `bun run build`
- **Note:** Does NOT build powers (use `build:powers` for that)

```typescript
// Power files copied to npm distribution
const NPM_POWER_FILES = [
  { src: "powers/kiro-protocols/POWER.md", dest: "build/npm/power/POWER.md" },
  { src: "powers/kiro-protocols/mcp.json", dest: "build/npm/power/mcp.json" },
  { src: "powers/kiro-protocols/icon.png", dest: "build/npm/power/icon.png" },
  { src: "powers/kiro-protocols/steering/agent-activation.md", dest: "build/npm/power/steering/agent-activation.md" },
  // ... more steering files
];
```

**Build Commands:**
```bash
# Build kiro-protocols power (run first)
bun run build:powers

# Build npm package (includes power files)
bun run build

# Or build both in sequence
bun run build:powers && bun run build
```

**Important Notes:**
- `build:powers` and `build` are independent - neither calls the other
- Always run `build:powers` before `build` to ensure latest protocols are included
- The old `build:power` command (singular) has been removed - use `build:powers` (plural) instead

### 2. CLI Installation (bin/cli.ts)

The CLI now installs both:

```typescript
// Installation directories
const STEERING_INSTALL_DIR = join(homedir(), ".kiro", "steering", "kiro-agents");
const POWER_INSTALL_DIR = join(homedir(), ".kiro", "powers", "kiro-protocols");

// Steering files (from dist/)
const STEERING_FILES = [
  "aliases.md",
  "agents.md",
  "modes.md",
  // ... more files
];

// Power files (from power/)
const POWER_FILES = [
  "POWER.md",
  "mcp.json",
  "icon.png",
  "steering/agent-activation.md",
  // ... more files
];
```

### 3. Installation Flow

When user runs `npx kiro-agents`:

1. **Remove old installations** (if present)
   - `~/.kiro/steering/kiro-agents/`
   - `~/.kiro/powers/kiro-protocols/`

2. **Install steering files**
   - Read from `build/npm/dist/`
   - Write to `~/.kiro/steering/kiro-agents/`
   - Set read-only permissions

3. **Install power files**
   - Read from `build/npm/power/`
   - Write to `~/.kiro/powers/kiro-protocols/`
   - Set read-only permissions

4. **Register power in Kiro registry**
   - Read/create `~/.kiro/powers/registry.json`
   - Extract metadata from POWER.md frontmatter
   - Add/update power entry with installation info
   - Add/update repo source entry
   - Save updated registry
   - Power now appears as "installed" in Kiro Powers UI
   - **Graceful failure**: If registration fails, power files are still installed and user receives manual activation instructions

5. **Success message**
   ```
   ✨ Installation completed successfully!
   
   📁 Steering files: ~/.kiro/steering/kiro-agents/
   📁 Power files: ~/.kiro/powers/kiro-protocols/
   
   💡 The kiro-protocols power should now appear as installed in Kiro Powers UI.
   💡 Files are set to read-only. To modify them, change permissions first.
   
   🔄 To update, simply run 'npx kiro-agents' again.
   ```
   
   **If registry registration fails:**
   ```
   ⚠️  Warning: Could not register power in registry: [error message]
      The power files are installed but may not appear in Kiro Powers UI.
      You can manually add the power via: Powers panel → Add Repository → Local Directory
      Path: ~/.kiro/powers/kiro-protocols/
   ```

## Package Structure

After `bun run build`, the npm package contains:

```
build/npm/
├── bin/
│   └── cli.js              # Compiled CLI
├── dist/                   # Steering files
│   ├── aliases.md
│   ├── agents.md
│   ├── modes.md
│   ├── strict.md
│   ├── strict-mode.md
│   ├── interactions/
│   │   ├── chit-chat.md
│   │   └── interaction-styles.md
│   └── modes/
│       ├── kiro-spec-mode.md
│       └── kiro-vibe-mode.md
└── power/                  # Power files
    ├── POWER.md
    ├── mcp.json
    ├── icon.png
    └── steering/
        ├── agent-activation.md
        ├── agent-creation.md
        ├── agent-management.md
        ├── mode-management.md
        └── mode-switching.md
```

## User Experience

From the user's perspective:

1. **Install once**: `npx kiro-agents`
2. **Get everything**:
   - Core steering files for agent system
   - kiro-protocols power with reusable protocols
   - **Automatic power registration** (appears in Powers UI immediately)
3. **No manual steps**: Power is automatically registered and ready to use
4. **Update easily**: Run `npx kiro-agents` again
5. **Discover protocols**: Via Kiro Powers UI

### Automatic Registry Registration

The CLI automatically registers the kiro-protocols power in `~/.kiro/powers/registry.json`:

**What gets registered:**
- Power metadata (name, displayName, description, keywords, author)
- Installation info (installed: true, installedAt, installPath)
- Source info (type: "local", repoName: "npx kiro-agents")

**Benefits:**
- ✅ Power appears immediately in Kiro Powers UI
- ✅ No manual "Add Repository" or "Install" steps needed
- ✅ Seamless integration with Kiro's power management
- ✅ Automatic discovery on Kiro IDE startup

**Fallback behavior:**
If registry registration fails (rare), the CLI:
- ⚠️ Shows warning message
- ✅ Files are still installed correctly
- 💡 Provides manual activation instructions

## Benefits

### For Users
- ✅ Single command installs everything
- ✅ **Automatic power registration** - No manual activation needed
- ✅ Power appears immediately in Kiro Powers UI
- ✅ Protocols discoverable in Powers UI
- ✅ Easy updates (just run npx again)

### For Developers
- ✅ Protocols are reusable across projects
- ✅ Stable reference paths
- ✅ Follows Kiro conventions
- ✅ Power can be updated independently

### For Maintainers
- ✅ Single source of truth (power/ directory)
- ✅ Build process handles both distributions
- ✅ No manual file copying needed
- ✅ Consistent versioning

## Testing

To test the dual installation with automatic registration:

```bash
# Step 1: Build kiro-protocols power
bun run build:powers

# Step 2: Build npm package (includes power files)
bun run build

# Step 3: Run validation tests
bun run test

# Step 4: Test locally
bun link
kiro-agents

# Step 5: Verify file installations
ls ~/.kiro/steering/kiro-agents/
ls ~/.kiro/powers/kiro-protocols/

# Step 6: Verify registry registration
cat ~/.kiro/powers/registry.json | grep -A 10 "kiro-protocols"
# Should show: "installed": true, "installedAt": "...", etc.

# Step 7: Check in Kiro IDE
# - Open Powers panel
# - Should see "kiro-protocols" power with green "Installed" badge
# - No manual activation required
# - Can read protocol files via Powers UI
```

**Important:** Always run `bun run build:powers` before `bun run build` to ensure the latest protocol files are included in the npm package.

## Future Considerations

### Alternative: Power-Only Distribution

Instead of npm + power, could distribute only as a power:

**Pros:**
- Simpler architecture (one distribution channel)
- Auto-updates from GitHub
- Better Kiro ecosystem integration

**Cons:**
- Requires Kiro IDE (not cross-IDE compatible)
- No global installation option
- Workspace-specific only

**Decision:** Keep dual distribution for now to support both global (npm) and workspace-specific (power) use cases.

### Alternative: Separate Packages

Could publish kiro-protocols as a separate npm package:

**Pros:**
- Independent versioning
- Users can install protocols separately
- Clearer dependency relationship

**Cons:**
- More complex installation (two commands)
- Version synchronization challenges
- Users might forget to install dependency

**Decision:** Keep bundled installation for better user experience.

## Complete Release Workflow

When releasing a new version:

```bash
# 1. Build kiro-protocols power
bun run build:powers

# 2. Validate power structure
bun run validate:powers

# 3. Build npm package
bun run build

# 4. Run tests
bun run test

# 5. Commit power changes (if any)
git add powers/kiro-protocols/
git commit -m "chore: update kiro-protocols power"

# 6. Create changeset and release (maintainer only)
bun run finalize
bun run release
```

**Critical:** The `build:powers` step must run before `build` to ensure protocol files are up-to-date in the npm package.

## Summary

The dual installation approach provides:

1. **Steering files** for core agent system functionality
2. **Power dependency** for reusable protocols
3. **Single command** installation (`npx kiro-agents`)
4. **Discoverable protocols** via Kiro Powers UI
5. **Easy updates** (run npx again)
6. **Multi-power architecture** for standalone power distribution

This architecture balances user convenience, developer experience, and maintainability while following Kiro's power system conventions.

### Key Benefits

**For Users:**
- ✅ Single command installs everything
- ✅ No manual power installation needed
- ✅ Protocols discoverable in Powers UI
- ✅ Easy updates (just run npx again)

**For Developers:**
- ✅ Protocols are reusable across projects
- ✅ Stable reference paths
- ✅ Follows Kiro conventions
- ✅ Power can be updated independently
- ✅ Multi-power system for future expansion

**For Maintainers:**
- ✅ Single source of truth (powers/ directory)
- ✅ Build process handles both distributions
- ✅ No manual file copying needed
- ✅ Consistent versioning
- ✅ Validation scripts ensure quality
