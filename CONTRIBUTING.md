# Contributing to kiro-agents

Thank you for your interest in contributing! This guide will help you get started.

## Development Workflow

### Making Changes

1. **Fork and clone** the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/kiro-agents.git
   cd kiro-agents
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Create a branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make changes** in `src/` directory only
   - `src/core/` - Cross-IDE compatible features
   - `src/kiro/` - Kiro-specific extensions

5. **Test your changes**
   ```bash
   bun run test
   ```

6. **Commit and push**
   ```bash
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

7. **Open a Pull Request** to `main`

## Important: DO NOT Modify power/ Directory

**⚠️  The `power/` directory is auto-generated and should NOT be modified in PRs.**

### Why?

- `power/` is the Kiro Power distribution built from `src/`
- It's regenerated during release to stay in sync with npm package
- Manual changes will be overwritten and cause inconsistencies

### Testing Power Locally

If you need to test Power distribution:

```bash
# Generate power/ locally
bun run build:power

# Install from local directory in Kiro IDE
# (Use local path in Powers panel)

# DO NOT commit the generated files
git restore power/
```

### CI Protection

- PRs that modify `power/` will **fail CI automatically**
- Maintainers will regenerate `power/` after merging your PR
- This ensures npm and Power distributions stay synchronized

## Build Commands

```bash
# Run all tests
bun run test

# Build Power distribution (for local testing only)
bun run build:power

# Build npm distribution
bun run build

# Clean build artifacts
bun run clean

# Dev mode (builds to ~/.kiro/steering/kiro-agents/ with watch)
bun run dev
```

## Project Structure

```
kiro-agents/
├── src/
│   ├── core/          # Cross-IDE compatible (NO Kiro-specific code)
│   ├── kiro/          # Kiro-specific extensions
│   ├── utils/         # Build utilities
│   └── config.ts      # Base config (reference pattern)
├── scripts/           # Build and release scripts
├── power/             # ⚠️  AUTO-GENERATED - DO NOT EDIT
├── build/             # Temporary artifacts (gitignored)
└── docs/              # Documentation
```

## Cross-IDE Compatibility Rules

**Files in `src/core/` MUST be IDE-agnostic:**

❌ **Prohibited:**
- Mentions of "Kiro" (IDE name)
- Kiro-specific paths (`.kiro/`)
- Kiro-specific features (MCP servers, Powers, etc.)
- Kiro-specific agent names (`kiro-master`)

✅ **Required:**
- Use substitutions: `{{{WS_AGENTS_PATH}}}`, `{{{INITIAL_AGENT_NAME}}}`
- Generic terminology: "IDE" instead of "Kiro IDE"
- Generic paths: `.ai-agents/agents` (base) → `.kiro/agents` (Kiro override)

## Versioning System

We use an AI-powered versioning system with Changesets:

### During Development

```bash
# After each development session
bun run snapshot  # or /snapshot in Kiro IDE

# Captures context: purpose, findings, decisions
# Stored in .changeset/snapshots/ (gitignored)
```

### When Feature Complete

```bash
# Consolidate snapshots into changeset
bun run finalize  # or /finalize in Kiro IDE

# AI analyzes snapshots vs git diff
# Generates changeset in .changeset/*.md
# Commit the changeset file
```

### Release (Maintainers Only)

```bash
# Publish to npm and update power/
bun run release  # or /release in Kiro IDE

# Consumes changesets
# Bumps version
# Updates CHANGELOG.md
# Publishes to npm
# Creates git tag
```

See `docs/VERSIONING.md` for detailed documentation.

## Code Style

- **TypeScript** for build scripts
- **Markdown** for steering documents
- **Frontmatter** required in all steering documents
- **Substitutions** for dynamic content: `{{{PLACEHOLDER}}}`

## Testing

All PRs must pass tests:

```bash
bun run test
```

Tests validate:
- Build outputs exist
- Substitutions applied correctly
- Frontmatter valid
- No unprocessed placeholders

## Questions or Issues?

- Open an issue for bugs or feature requests
- Start a discussion for questions
- Check existing issues before creating new ones

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to kiro-agents! 🎉**
