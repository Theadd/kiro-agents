# Kiro Powers

This directory contains Kiro Powers that can be installed via Kiro IDE's Powers panel.

## Available Powers

Currently, this repository provides **one production power**:

### kiro-protocols

**Description:** Reusable protocol library for AI agents - Load step-by-step workflows on-demand for agent management, mode switching, and interactive patterns.

**Protocols:**
- `agent-activation.md` - Protocol for activating and assuming agent roles
- `agent-creation.md` - Step-by-step agent creation wizard
- `agent-management.md` - Interactive agent management workflow
- `mode-switching.md` - Protocol for switching between Kiro modes
- `mode-management.md` - Interactive mode management workflow

**Installation:**
```
1. Open Kiro IDE
2. Go to Powers panel
3. Add repository: https://github.com/Theadd/kiro-agents
4. Install "Kiro Protocols" power
```

**Note:** The multi-power infrastructure supports additional powers in the future. See "Creating a New Power" below to contribute.

## Power Structure

Each power follows this structure:

```
powers/{power-name}/
├── POWER.md           # Power metadata and documentation (committed)
├── icon.png           # 512x512 power icon (optional, committed)
└── steering/          # Protocol files (generated, not committed)
    └── *.md
```

**Important:** The `steering/` directory is auto-generated from source files during build and should NOT be committed to git. Only `POWER.md` and `icon.png` are committed.

## Development Workflow

### Creating a New Power

1. **Create power directory:**
   ```bash
   mkdir powers/my-new-power
   ```

2. **Create POWER.md with frontmatter:**
   ```markdown
   ---
   name: "my-new-power"
   displayName: "My New Power"
   description: "Brief description of what this power does"
   keywords: ["keyword1", "keyword2", "keyword3"]
   author: "Your Name"
   ---
   
   # My New Power
   
   [Power documentation here...]
   ```

3. **Add power configuration to `scripts/build-powers.ts`:**
   ```typescript
   const POWER_CONFIGS: PowerConfig[] = [
     // ... existing powers
     {
       name: "my-new-power",
       displayName: "My New Power",
       sourceDir: "src/path/to/protocols",
       protocols: ["protocol1", "protocol2"],
       generateIcon: true,
     },
   ];
   ```

4. **Build the power:**
   ```bash
   bun run build:powers my-new-power
   ```

5. **Test locally:**
   - Open Kiro IDE
   - Powers panel → Add Repository → Local Directory
   - Select `powers/my-new-power/`
   - Install and test

### Modifying Existing Powers

**DO NOT modify files in `powers/*/steering/` directly!**

Instead:

1. **Modify source files:**
   - Core protocols: `src/core/protocols/*.md`
   - Kiro protocols: `src/kiro/steering/protocols/*.md`

2. **Rebuild powers:**
   ```bash
   bun run build:powers
   ```

3. **Test changes:**
   - Reload power in Kiro IDE
   - Verify protocols load correctly

### Adding a Protocol to Existing Power

1. **Create protocol source file:**
   ```bash
   # For core protocols
   touch src/core/protocols/my-new-protocol.md
   
   # For Kiro-specific protocols
   touch src/kiro/steering/protocols/my-new-protocol.md
   ```

2. **Update power configuration in `scripts/build-powers.ts`:**
   ```typescript
   {
     name: "kiro-protocols",
     protocols: [
       "agent-activation",
       "agent-creation",
       "agent-management",
       "my-new-protocol",  // Add here
     ],
   }
   ```

3. **Rebuild:**
   ```bash
   bun run build:powers kiro-protocols
   ```

## Build System

### Commands

```bash
# Build all powers
bun run build:powers

# Build specific power
bun run build:powers kiro-protocols

# Clean generated files (steering directories)
git clean -fdx powers/*/steering/
```

### Build Process

1. **Scan** `powers/` for power directories
2. **Validate** each `POWER.md` has required frontmatter
3. **Copy** protocol files from source to `steering/`
4. **Generate** icon placeholder if missing
5. **Output** ready-to-distribute power

### CI/CD

**PR Validation** (`.github/workflows/validate-pr.yml`):
- Blocks PRs that modify `powers/*/steering/` directly
- Ensures only source files are modified in PRs
- Maintainers regenerate powers after merge

**Power Publishing** (`.github/workflows/publish-powers.yml`):
- Runs on release or manual trigger
- Builds all powers from source
- Commits generated steering files
- Creates power-specific tags (e.g., `kiro-protocols-v1.0.0`)
- Pushes to repository

## Icon Guidelines

### Requirements

- **Format:** PNG with transparency
- **Size:** 512x512 pixels (recommended)
- **Location:** `powers/{power-name}/icon.png`
- **Naming:** Must be exactly `icon.png`

### Creating Icons

1. **Design icon** (512x512 PNG)
2. **Save as** `powers/{power-name}/icon.png`
3. **Commit** the icon file
4. **Rebuild** power to verify

**Placeholder:** If no icon exists, build script creates `icon-placeholder.svg` as a reminder to create a proper icon.

## Distribution

### Via GitHub Repository

Powers are distributed directly from this GitHub repository:

1. **User adds repository** in Kiro IDE Powers panel
2. **Kiro scans** `powers/` directory for `POWER.md` files
3. **User installs** desired powers
4. **Powers auto-update** when repository updates

### Installation Paths

- **User installation:** `~/.kiro/powers/installed/{power-name}/`
- **Workspace installation:** `.kiro/powers/{power-name}/`

## Best Practices

### For Power Authors

1. **Keep POWER.md comprehensive** - It's the main documentation
2. **Use clear protocol names** - Descriptive and consistent
3. **Document all protocols** - List in POWER.md with descriptions
4. **Test thoroughly** - Install and test in Kiro IDE before release
5. **Version carefully** - Breaking changes affect all users

### For Contributors

1. **Modify source files only** - Never edit `powers/*/steering/` directly
2. **Test locally first** - Use local directory installation
3. **Follow structure** - Match existing power patterns
4. **Update documentation** - Keep POWER.md in sync with protocols
5. **Submit clean PRs** - No generated files in PRs

## Troubleshooting

### Power Not Showing in Kiro IDE

**Causes:**
- Missing or invalid `POWER.md`
- Invalid frontmatter format
- Repository not added to Kiro

**Solutions:**
1. Validate `POWER.md` has required fields
2. Check frontmatter syntax (YAML)
3. Verify repository URL in Kiro Powers panel
4. Try removing and re-adding repository

### Protocol Not Loading

**Causes:**
- Protocol file missing in `steering/`
- Incorrect protocol name in reference
- Power not installed or outdated

**Solutions:**
1. Rebuild power: `bun run build:powers`
2. Check protocol exists in `steering/`
3. Verify protocol name spelling
4. Update power in Kiro IDE

### Build Fails

**Causes:**
- Missing source files
- Invalid power configuration
- Syntax errors in protocols

**Solutions:**
1. Check source files exist in `src/`
2. Validate power config in `build-powers.ts`
3. Check protocol markdown syntax
4. Review build error messages

## Contributing

Want to contribute a new power or improve existing ones?

1. **Fork repository**
2. **Create feature branch**
3. **Modify source files** (not generated files)
4. **Test locally**
5. **Submit PR** (without `powers/*/steering/` changes)
6. **Maintainers will regenerate** powers after merge

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

## License

MIT License - See [LICENSE](../LICENSE) for full text

---

**Repository:** https://github.com/Theadd/kiro-agents  
**Issues:** https://github.com/Theadd/kiro-agents/issues  
**Discussions:** https://github.com/Theadd/kiro-agents/discussions
