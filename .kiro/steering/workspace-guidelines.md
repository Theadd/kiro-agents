---
inclusion: always
---

# Workspace Guidelines

## Change Approval Protocol

**CRITICAL**: You MUST receive explicit user approval on your proposal before applying any changes to files.

**Workflow**:
1. Analyze the request and understand requirements
2. Present your proposed changes clearly
3. Wait for explicit user confirmation
4. Only then execute the changes

## Git Commands

Always use `--no-pager` flag on git commands that accept it to ensure output is displayed directly without pagination.

**Examples**:
- `git log --no-pager`
- `git diff --no-pager`
- `git show --no-pager`

## Markdown Table Formatting

When presenting markdown tables in session messages, you MUST:
- Pretty print the table with aligned columns
- Wrap the entire table within a 4-backtick markdown code block

**Example**:
````markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
````

## Build Order Requirements

When making changes that affect both steering files and protocol files:

1. **Protocol changes first**: If modifying `src/core/protocols/` or `src/kiro/steering/protocols/`, run `bun run build:powers` first
2. **Steering changes second**: Then run `bun run build` for npm package
3. **Validation**: Always run `bun run test` after builds to validate

**Rationale**: npm build copies pre-built power files from `powers/`, so powers must be built first.

## Protected Files

**NEVER directly modify files in `powers/*/steering/` directories**. These are auto-generated from source files.

**Instead**:
- Modify source files in `src/core/protocols/` or `src/kiro/steering/protocols/`
- Run `bun run build:powers` to regenerate
- Commit both source and regenerated files

## Cross-IDE Compatibility

Files in `src/core/` MUST remain IDE-agnostic:
- Use generic terminology ("IDE" not "Kiro IDE")
- Use substitution placeholders for IDE-specific values
- No Kiro-specific paths or features in core files

**Note**: All kiro-agents builds use `src/kiro/config.ts` since this package is specifically for Kiro IDE.

## Steering Document Standards

All steering documents (`.md` files in `src/`) MUST include:

1. **YAML frontmatter** with `inclusion` key
2. **Empty line** after frontmatter
3. **Substitution placeholders** in `{{{TRIPLE_BRACES}}}` format
4. **Instruction aliases** using `<alias><trigger>` XML pattern

## Development Workflow

**For steering file changes**:
```bash
bun run dev        # Watch mode, builds to ~/.kiro/steering/kiro-agents/
```

**For protocol file changes**:
```bash
bun run dev:powers # Watch mode, builds to ~/.kiro/powers/kiro-protocols/
```

**For distribution**:
```bash
bun run build:powers  # Build powers first
bun run build         # Build npm package
bun run test          # Validate
```

## Versioning Workflow

Use AI-powered hybrid versioning system:

1. **During development**: Run `/snapshot` after each session to capture context
2. **When feature complete**: Run `/finalize` to consolidate snapshots into changeset
3. **For release** (maintainers): Run `/release` to publish

**Never manually create changesets** - use the finalize command to leverage AI analysis.
