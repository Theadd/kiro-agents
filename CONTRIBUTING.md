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

## Important: DO NOT Modify powers/*/steering/ Directories

**⚠️  The `powers/*/steering/` directories are auto-generated and should NOT be modified in PRs.**

### Why?

- Steering files in `powers/*/steering/` are built from `src/` during release
- They're regenerated to stay in sync with source protocols
- Manual changes will be overwritten and cause inconsistencies

### Testing Powers Locally

If you need to test power distribution:

```bash
# Build powers locally
bun run build:powers

# Install from local directory in Kiro IDE
# Powers panel → Add Repository → Local Directory
# Select powers/kiro-protocols/

# DO NOT commit the generated steering files
git restore powers/*/steering/
```

### CI Protection

- PRs that modify `powers/*/steering/` will **fail CI automatically**
- Maintainers will regenerate powers after merging your PR
- This ensures source and distribution stay synchronized

## Fork Guidelines

We welcome contributions! Please use GitHub forks for PRs (standard workflow).

### GitHub Fork vs Project Fork

**GitHub Fork (for contributions)** ✅ **Encouraged!**
- Fork on GitHub → Clone locally → Make changes → Push → Open PR
- Temporary fork with intention to merge upstream
- Standard contribution workflow
- **This is NOT what we're regulating below**

**Project Fork (permanent divergence)** ⚠️ **Regulated**
- Separate project with independent development
- No intention to merge back upstream
- Published as standalone product/package
- **These guidelines apply to permanent forks**

### When to Create a Permanent Fork (Legitimate Reasons)

✅ **Fork when:**
- **Technical divergence** - You need incompatible architectural changes
- **Rejected proposal** - Maintainers reject your proposal after discussion
- **Different vision** - You want to take the project in a fundamentally different direction

❌ **Please DON'T fork for:**
- **Cosmetic changes** - Themes, branding, UI tweaks (contribute upstream)
- **Feature additions** - New features that could be merged (open PR instead)
- **Bug fixes** - Always contribute fixes upstream first
- **Rebranding** - Just changing names/logos without technical changes

### If You Create a Permanent Fork

Please follow these guidelines:

1. **Discuss upstream first** - Open an issue to discuss your proposal
2. **Keep AGPL-3.0 license** - Or wait 16 months for MIT (see LICENSE)
3. **Attribute original project** - Link back to kiro-agents in your README
4. **Consider merging back** - If projects converge, consider upstreaming changes
5. **Respect time-delayed licensing** - Recent versions are AGPL, old versions become MIT

### Why These Guidelines?

**Goals:**
- Prevent parasitic clones that fragment the community
- Encourage upstream contributions over separate forks
- Allow legitimate technical divergence
- Keep community unified around single source of truth

## Build Commands

```bash
# Run all tests
bun run test

# Build all powers (for local testing only)
bun run build:powers

# Build specific power
bun run build:powers kiro-protocols

# Validate powers
bun run validate:powers

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
├── powers/            # Kiro Powers (steering/ auto-generated)
│   └── kiro-protocols/
│       ├── POWER.md   # Committed
│       ├── icon.png   # Committed
│       └── steering/  # ⚠️  AUTO-GENERATED - DO NOT EDIT
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
# Stored in .kiro/session-snapshots/ (gitignored)
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

## License and Contributor Agreement

By contributing to this project, you agree that:

1. **Your contributions are licensed under AGPL-3.0** (current project license)
2. **You grant the project maintainer the right to relicense your contributions** under any license, including:
   - MIT License (for time-delayed licensing after 16 months)
   - Commercial License (for proprietary/closed-source products)
   - Public domain (if project is abandoned)
   - Any other license deemed necessary for project sustainability
3. **This enables project succession and sustainability** if the project becomes unmaintained or needs commercial support

### Why This Matters

This Contributor License Agreement (CLA) ensures:
- The project can transition to MIT after 16 months (time-delayed licensing)
- The project can offer Commercial Licenses to fund development
- The project can be relicensed to public domain if abandoned
- Community can continue development without legal barriers
- No need to track down every contributor for permission

### Current Licensing Strategy

kiro-agents uses **time-delayed triple licensing**:
- **Recent versions (< 16 months)**: AGPL-3.0 or Commercial License
- **Legacy versions (> 16 months)**: MIT License (automatic)

See [LICENSE](LICENSE) for full details.

---

**Thank you for contributing to kiro-agents! 🎉**
