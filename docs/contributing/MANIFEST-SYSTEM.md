# Centralized File Manifest System

## Overview

The kiro-agents build system now uses a **centralized file manifest** (`src/manifest.ts`) as the single source of truth for all file mappings across build targets (npm, dev, cli, power).

This eliminates the scattered file mapping constants that were previously duplicated across multiple files and ensures consistency between dev mode and CLI installation.

## Problem Solved

### Before (Scattered Mappings)

File mappings were hardcoded in 3 different places:

1. **`scripts/build.ts`** - Uses `STEERING_MAPPINGS` and `POWER_MAPPINGS` from manifest
2. **`bin/cli.template.ts`** - Template with placeholders for file lists
3. **Build generates** - `bin/cli.generated.ts` with embedded lists from manifest functions

**Critical Issues:**
- ❌ Dev mode installed **different files** than CLI (missing `protocols/` directory!)
- ❌ No glob patterns - all files hardcoded 1-to-1
- ❌ Adding new file required updating 3+ locations
- ❌ No validation that dev == cli
- ❌ Easy to introduce inconsistencies

### After (Centralized Manifest)

All file mappings defined once in `src/manifest.ts`:

```typescript
export const STEERING_MAPPINGS: FileMapping[] = [
  { src: "core/aliases.md", dest: "aliases.md" },
  { src: "core/protocols/*.md", dest: "protocols/{name}.md" },  // Glob pattern!
  { src: "kiro/steering/protocols/*.md", dest: "protocols/{name}.md" },
  { src: "core/agents.md", dest: "agents.md" },
  { src: "kiro/steering/modes.md", dest: "modes.md" },
  { src: "core/strict.md", dest: "strict.md" },
  { src: "core/interactions/*.md", dest: "interactions/{name}.md" },
  { src: "kiro/steering/agent-system/*.md", dest: "modes/{name}.md" },
];
```

**Benefits:**
- ✅ Single source of truth
- ✅ Glob pattern support (auto-discovers files)
- ✅ Dev mode == CLI installation (guaranteed)
- ✅ Type-safe with compile-time validation
- ✅ Add new file → automatically included
- ✅ Validation script ensures consistency

## Architecture

### Core Components

#### 1. `src/manifest.ts` - Single Source of Truth

Defines file mappings with glob pattern support:

```typescript
export interface FileMapping {
  src: string;      // Supports glob patterns (e.g., "*.md")
  dest: string;     // Supports placeholders (e.g., "{name}.md")
  targets?: BuildTarget[];  // Optional target filtering
}

export type BuildTarget = "npm" | "dev" | "cli" | "power";
```

**Key Functions:**
- `expandMappings()` - Resolves globs and placeholders to concrete paths
- `getSteeringFilesForCLI()` - Generates file list for CLI installation
- `getPowerFilesForCLI()` - Generates power file list for CLI

#### 2. `bin/cli.template.ts` - CLI Template

Template file with placeholders for file lists:

```typescript
const STEERING_FILES = /* STEERING_FILES_PLACEHOLDER */ as const;
const POWER_FILES = /* POWER_FILES_PLACEHOLDER */ as const;
```

During build, placeholders are replaced with actual file lists from manifest.

#### 3. `scripts/build.ts` - Build Orchestrator

Uses manifest to build npm and dev distributions:

```typescript
// Expand steering mappings with glob resolution
const steeringFiles = await expandMappings(STEERING_MAPPINGS, "src", "npm");

// Build all files
for (const mapping of steeringFiles) {
  await buildFile(mapping.src, mapping.dest, substitutions, { target: "npm" });
}
```

#### 4. `scripts/validate-manifest.ts` - Validation

Ensures manifest consistency:

- ✅ Dev mode files match CLI installation
- ✅ All source files exist
- ✅ No duplicate destinations
- ✅ Glob patterns resolve to files
- ✅ File counts are reasonable

## Usage

### Adding New Files

**Before:** Update 3+ files manually

**After:** Just add the file, glob pattern auto-discovers it!

```typescript
// In src/manifest.ts
{ src: "core/protocols/*.md", dest: "protocols/{name}.md" }

// Add new file: src/core/protocols/new-protocol.md
// Automatically included in all builds!
```

### Adding New File Category

Add one mapping to manifest:

```typescript
export const STEERING_MAPPINGS: FileMapping[] = [
  // ... existing mappings ...
  { src: "core/utilities/*.md", dest: "utilities/{name}.md" },
];
```

That's it! All build targets automatically include the new category.

### Target-Specific Files

Use `targets` property to include files only for specific builds:

```typescript
{ 
  src: "debug.md", 
  dest: "debug.md", 
  targets: ["dev"]  // Only in dev mode, not npm or cli
}
```

## Build Workflow

### 1. Validate Manifest

```bash
bun run validate:manifest
```

Checks consistency before building.

### 2. Build Powers

```bash
bun run build:powers
```

Builds protocol files to `powers/kiro-protocols/steering/`

### 3. Build npm Package

```bash
bun run build
```

Process:
1. Generates CLI with embedded file lists from manifest
2. Expands steering mappings with glob resolution
3. Processes files with substitutions
4. Copies power files
5. Cleans build directory

### 4. Dev Mode

```bash
bun run dev
```

Builds to `~/.kiro/steering/kiro-agents/` using **same manifest** as npm build.

**Guaranteed:** Dev mode installs exactly the same files as CLI!

## File Counts

After refactoring:

- **Steering files:** 15 (was 9 in CLI, 14 in dev - now consistent!)
- **Power files:** 9 (consistent across all targets)
- **Total:** 24 files managed by manifest

## Validation

Run validation before every build:

```bash
bun run validate:manifest
```

**Output:**
```
🧪 Validating file manifest...

✅ Dev mode matches CLI installation (15 files)
✅ All source files exist (24 files)
✅ No duplicate destinations (15 unique paths)
✅ core/protocols/*.md → 4 files
✅ kiro/steering/protocols/*.md → 2 files
✅ core/interactions/*.md → 3 files
✅ kiro/steering/agent-system/*.md → 2 files
✅ steering/*.md → 6 files
✅ File counts are reasonable

📊 Validation Summary
Total checks: 5
✅ Passed: 5
❌ Failed: 0

✨ All manifest validations passed!
```

## Migration Summary

### Files Created

- ✅ `src/manifest.ts` - Centralized file manifest
- ✅ `bin/cli.template.ts` - CLI template with placeholders
- ✅ `scripts/validate-manifest.ts` - Manifest validation script
- ✅ `docs/MANIFEST-SYSTEM.md` - This documentation

### Files Modified

- ✅ `scripts/build.ts` - Uses manifest instead of hardcoded mappings
- ✅ `package.json` - Added `glob` dependency and `validate:manifest` script
- ✅ `bin/cli.generated.ts` - Generated during build (gitignored)

### Files Removed

- ❌ Hardcoded `NPM_FILE_MAPPINGS` constant
- ❌ Hardcoded file lists in multiple locations
- ❌ Manual synchronization required between build script and CLI
- ❌ Dev mode could install different files than CLI

### Dependencies Added

- `glob@^11.0.0` - For glob pattern resolution

## Benefits Summary

### 1. Single Source of Truth
- Change once, applies everywhere
- No more scattered constants
- Easier to maintain

### 2. Glob Pattern Support
- Auto-discovers files
- Add new file → automatically included
- No manual updates needed

### 3. Dev Mode = CLI Installation
- Both use same `expandMappings()` function
- Guaranteed consistency
- No more missing files in dev mode

### 4. Type Safety
- `FileMapping` interface enforces structure
- `BuildTarget` enum prevents typos
- Compile-time validation

### 5. Validation
- Automated consistency checks
- Catches issues before build
- Prevents dev mode mismatches

### 6. Easier Maintenance
- Add new file category → update manifest only
- Change destination structure → update manifest only
- No hunting through multiple files

## Future Enhancements

Potential improvements:

1. **Build Caching** - Skip unchanged files for faster rebuilds
2. **Performance Metrics** - Track build times per file
3. **Dry-Run Mode** - Test builds without writing files
4. **Enhanced Error Messages** - More context on substitution failures
5. **Parallel Processing** - Build multiple files concurrently

## Conclusion

The centralized manifest system transforms the kiro-agents build system from a scattered, error-prone collection of hardcoded mappings into a **production-grade, maintainable, and consistent** build pipeline.

**Key Achievement:** Dev mode now installs exactly the same files as CLI installation, eliminating the critical mismatch issue!
