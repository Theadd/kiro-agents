# Testing Guide

## Automated Testing

```bash
# Validate build outputs
bun run test

# Validate power structure
bun run validate:powers
```

### What Gets Validated

**Build validation:**
- Build outputs exist
- File counts match expectations
- Substitutions applied correctly
- Frontmatter in steering files
- POWER.md structure

**Power validation:**
- POWER.md frontmatter valid
- Required steering files exist
- Icon present (512x512 PNG)
- Directory structure correct

## Manual Testing

### Testing npm Package

```bash
# Build
bun run build:powers
bun run build

# Link locally
bun link

# Install
kiro-agents

# Verify files
ls ~/.kiro/steering/kiro-agents/
ls ~/.kiro/powers/kiro-protocols/

# Check registry
cat ~/.kiro/powers/registry.json | grep "kiro-protocols"
```

### Testing Power in Kiro IDE

**Install from local directory:**

1. Open Kiro IDE
2. Powers panel → Available Powers → Manage Repos
3. Add Repository → Local Directory
4. Browse to `powers/kiro-protocols/`
5. Install power

**Test protocol loading:**

```
# In Kiro chat
Can you activate the kiro-protocols power?
Load the agent-activation protocol
```

Expected behavior:
- Power activates successfully
- Protocol content loads
- AI follows protocol steps

### Testing Protocol Updates

```bash
# Modify source
vim src/core/protocols/agent-activation.md

# Rebuild
bun run build:powers

# Reload in Kiro IDE
# Powers panel → kiro-protocols → Reload

# Verify changes appear
```

## Troubleshooting

### Power Not Showing in Kiro

**Solutions:**
1. Check POWER.md has valid frontmatter
2. Verify steering/ directory has .md files
3. Remove and re-add repository
4. Check Kiro IDE console for errors

### Protocol Not Loading

**Solutions:**
1. Verify protocol exists in steering/
2. Check protocol name spelling (case-sensitive)
3. Rebuild: `bun run build:powers`
4. Reload power in Kiro IDE

### Build Fails

**Solutions:**
1. Check source files exist
2. Verify POWER.md frontmatter
3. Run validation: `bun run validate:powers`
4. Check build script output

## Cross-Platform Testing

Test on:
- Windows (cmd shell)
- macOS (bash/zsh)
- Linux (bash)

Verify:
- File permissions set correctly
- Paths resolve properly
- Symbolic links created
- Registry registration works
