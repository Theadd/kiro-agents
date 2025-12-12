# Testing Guide: kiro-protocols Power

Quick guide to test the new kiro-protocols power locally before release.

## Prerequisites

- Kiro IDE installed
- This repository cloned locally
- Powers built: `bun run build:powers`

## Testing Steps

### 1. Build the Power

```bash
bun run build:powers kiro-protocols
```

Expected output:
- ✅ Valid POWER.md
- ✅ Protocols copied
- ✅ Icon placeholder created

### 2. Validate the Power

```bash
bun run validate:powers kiro-protocols
```

Expected output:
- ✅ All powers valid
- ⚠️  Using placeholder icon (expected)

### 3. Install Locally in Kiro IDE

1. Open Kiro IDE
2. Go to Powers panel (sidebar)
3. Click "Available Powers" → "Manage Repos"
4. Click "Add Repository"
5. Select "Local Directory"
6. Browse to: `{your-repo-path}/powers/kiro-protocols/`
7. Click "Add"

Expected result:
- Power appears in available powers list
- Shows "Kiro Protocols" name
- Shows description
- Shows placeholder icon (letter "K")


### 4. Install the Power

1. Click "Install" on Kiro Protocols power
2. Wait for installation to complete

Expected result:
- Power installed to `~/.kiro/powers/installed/kiro-protocols/`
- Power shows as "Installed" in Powers panel

### 5. Test Protocol Loading

#### Test 1: Activate Power

In Kiro chat:
```
Can you activate the kiro-protocols power?
```

Expected AI response:
- Calls `kiroPowers` action="activate" with powerName="kiro-protocols"
- Shows power overview
- Lists available steering files (protocols)

#### Test 2: Load Specific Protocol

In Kiro chat:
```
Load the agent-activation protocol from kiro-protocols
```

Expected AI response:
- Calls `kiroPowers` action="readSteering"
- Loads agent-activation.md content
- Shows protocol steps

#### Test 3: Use Protocol in Workflow

In Kiro chat:
```
/agents
```

Expected AI response:
- Loads agent-management protocol
- Shows interactive menu
- Presents numbered choices

### 6. Verify Protocol Content

Check that protocols contain expected content:

1. **agent-activation.md** - Should have "Agent Activation Steps"
2. **agent-management.md** - Should have "Agent Management Steps"
3. **agent-creation.md** - Should have "Agent Creation Steps"
4. **mode-switching.md** - Should have "Mode Switch Steps"
5. **mode-management.md** - Should have "Mode Management Steps"

### 7. Test Protocol Updates

1. Modify source protocol:
   ```bash
   echo "# Test Update" >> src/core/protocols/agent-activation.md
   ```

2. Rebuild power:
   ```bash
   bun run build:powers kiro-protocols
   ```

3. Reload power in Kiro IDE:
   - Powers panel → kiro-protocols → Reload

4. Verify update:
   - Load agent-activation protocol
   - Check for "Test Update" text

5. Revert change:
   ```bash
   git checkout src/core/protocols/agent-activation.md
   bun run build:powers kiro-protocols
   ```

## Validation Checklist

- [ ] Power builds without errors
- [ ] Power validates successfully
- [ ] Power installs in Kiro IDE
- [ ] Power shows correct metadata
- [ ] All 5 protocols load correctly
- [ ] Protocols contain expected content
- [ ] Protocol updates work
- [ ] Icon displays (placeholder OK)

## Troubleshooting

### Power Not Showing in Kiro

**Problem:** Power doesn't appear in available powers

**Solutions:**
1. Check POWER.md exists and has valid frontmatter
2. Verify steering/ directory has .md files
3. Try removing and re-adding repository
4. Check Kiro IDE console for errors

### Protocol Not Loading

**Problem:** Error loading protocol file

**Solutions:**
1. Verify protocol exists in steering/ directory
2. Check protocol name spelling (case-sensitive)
3. Rebuild power: `bun run build:powers`
4. Reload power in Kiro IDE

### Build Fails

**Problem:** Build script errors

**Solutions:**
1. Check source files exist in src/core/protocols/
2. Verify POWER.md has valid frontmatter
3. Run validation: `bun run validate:powers`
4. Check build script output for specific errors

## Next Steps

After successful testing:

1. **Create actual icon:**
   - Design 512x512 PNG icon
   - Save as `powers/kiro-protocols/icon.png`
   - Remove `icon-placeholder.svg`
   - Rebuild and test

2. **Update kiro-agents:**
   - Modify steering files to use protocol loading
   - Test integration
   - Document changes

3. **Commit and push:**
   - Commit POWER.md and icon.png
   - Push to GitHub
   - Create release

4. **Announce:**
   - Update README
   - Create release notes
   - Share with community

## Success Criteria

✅ All tests pass
✅ Power installs cleanly
✅ Protocols load on-demand
✅ No errors in Kiro console
✅ Documentation is clear
✅ Ready for production use

---

**Questions?** Open an issue: https://github.com/Theadd/kiro-agents/issues
