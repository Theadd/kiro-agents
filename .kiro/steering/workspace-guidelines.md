---
inclusion: always
---

# Workspace Guidelines

Critical rules for working with kiro-agents codebase.

## Change Approval Protocol

**CRITICAL**: Get explicit user approval before applying file changes.

**Workflow**: Analyze → Present → Confirm → Execute

**Never**:
- Make changes without approval
- Assume approval from vague responses
- Proceed if user asks questions (answer first, re-confirm)

## File Modification Rules

### Protected Auto-Generated Files

**NEVER modify** `powers/*/steering/` - auto-generated from source.

**Correct workflow**:
1. Edit `src/core/protocols/` or `src/kiro/steering/protocols/`
2. `bun run build:powers` to regenerate
3. Commit both source and generated files

### Centralized Manifest System

**Single source of truth**: `src/manifest.ts` defines all file mappings.

**Adding files**:
- Add to `src/manifest.ts` (uses glob patterns)
- `core/protocols/*.md` auto-discovers new protocols
- Build system uses manifest for all targets

### Cross-IDE Compatibility

`src/core/` files MUST be IDE-agnostic:
- ❌ "Kiro" mentions, `.kiro/` paths, Kiro-specific features
- ✅ `{{{WS_AGENTS_PATH}}}`, `{{{INITIAL_AGENT_NAME}}}` placeholders

**Note**: kiro-agents uses `src/kiro/config.ts` (Kiro-specific package).

### Steering Document Standards

All `src/*.md` files require:
1. YAML frontmatter with `inclusion` key
2. Empty line after `---`
3. `{{{TRIPLE_BRACES}}}` for substitutions
4. `<alias><trigger>` XML for commands

## Build System

### Build Order

Protocol + steering changes:
1. `bun run build:powers` (regenerates `powers/*/steering/`)
2. `bun run build` (copies power files)
3. `bun run test` (validates)

### Commands

```bash
# Development (watch mode)
bun run dev         # Steering → ~/.kiro/steering/kiro-agents/
bun run dev:powers  # Protocols → ~/.kiro/powers/kiro-protocols/

# Distribution
bun run build:powers  # Powers (manifest auto-discovery)
bun run build         # npm package
bun run test          # Validate
bun run clean         # Remove build/
```

### Protocol Auto-Discovery

`PROTOCOL_SOURCE_MAPPINGS` in `src/manifest.ts`:
- `core/protocols/*.md` → Auto-discovers core protocols
- `kiro/steering/protocols/*.md` → Auto-discovers Kiro protocols
- Add `.md` file → automatically included in build

## Git Commands

Always use `--no-pager`:
```bash
git log --no-pager
git diff --no-pager
git show --no-pager
```

## Markdown Formatting

**Tables in conversation**: Wrap in 4-backtick `bash` blocks
**Markdown in code blocks**: Use 4-backticks (prevents nesting issues)

## Versioning Workflow

AI-powered Changesets + session analysis:

```bash
/snapshot  # After each session
/finalize  # When feature complete
/release   # Maintainers only
```

Never manually create changesets.

## Testing

```bash
bun run test            # Build outputs
bun run validate:powers # Power structure
```

**Validates**: outputs exist, file counts, substitutions, frontmatter, POWER.md structure.

## Common Workflows

### Add/Modify Protocol

1. Edit `src/core/protocols/*.md` or `src/kiro/steering/protocols/*.md`
2. `bun run build:powers` (auto-discovers via manifest)
3. `bun run test`
4. Commit source + generated files

### Add Steering File

1. Create in `src/core/` or `src/kiro/steering/`
2. Add to `src/manifest.ts`
3. `bun run build` (or `bun run dev`)
4. `bun run test`
5. Commit source

### Test Locally

**Fast**: `bun run dev` or `bun run dev:powers` (watch mode → `~/.kiro/`)
**Full**: `bun run build:powers && bun run build && bun link && kiro-agents`
