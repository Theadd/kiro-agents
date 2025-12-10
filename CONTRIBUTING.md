# Contributing to kiro-agents

Thanks for your interest in contributing! This guide will help you get started.

## Development Setup

### Prerequisites

- [Bun](https://bun.sh/) - JavaScript runtime and package manager
- Git
- Node.js (for npm publishing)

### Installation

```bash
# Clone the repository
git clone https://github.com/Theadd/kiro-agents.git
cd kiro-agents

# Install dependencies
bun install

# Run dev mode (builds to ~/.kiro/steering/kiro-agents/)
bun run dev
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Work on your feature with frequent commits:

```bash
# Make changes
git add .
git commit -m "wip: initial work on feature"

# More changes
git add .
git commit -m "wip: progress on feature"
```

**Tip**: Commit frequently! This gives you safety nets for rollbacks.

### 3. Capture Session Context

After each development session, capture the context:

```bash
/snapshot
```

Or via command line:

```bash
bun run snapshot
```

The AI agent will analyze your session and create a snapshot that captures:
- **Purpose**: What you were trying to achieve
- **Changes**: What was added, modified, removed, or attempted
- **Findings**: Important discoveries or insights
- **Limitations**: Blockers or constraints encountered
- **Decisions**: Design decisions and reasoning

Snapshots are stored in `.changeset/snapshots/` (gitignored).

### 4. Continue Development

Repeat steps 2-3 across multiple sessions as needed. The system handles:
- Multiple sessions per feature
- Context window limitations
- Failed experiments (they'll be filtered out later)
- Frequent commits for safety

### 5. Finalize Your Feature

When your feature is complete and you're satisfied:

```bash
/finalize
```

Or via command line:

```bash
bun run finalize
```

This will:
- Analyze all your session snapshots
- Compare with the final git diff
- Filter out temporary/experimental changes
- Generate a consolidated changeset
- Clean up snapshots
- **Prompt you for next action**

You'll see an interactive prompt:

```
✅ Changeset created successfully! What would you like to do?

  1. ✅ Commit changeset now
  2. 📝 Review changeset first
  3. ❌ Cancel (keep changeset, don't commit)

Enter your choice (1-3):
```

**Choose your option:**
- **Option 1**: Automatically commits the changeset (recommended for quick workflow)
- **Option 2**: Shows commands to review and commit manually (recommended if you want to edit)
- **Option 3**: Keeps changeset but doesn't commit (if you need to make changes first)

### 6. Squash and Push

If you chose to commit (option 1) or committed manually (option 2):

Squash your WIP commits:

```bash
git rebase -i main
```

Push your branch:

```bash
git push origin feature/your-feature-name
```

### 7. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Create a pull request on GitHub.

## Changeset Format

Changesets use this format:

```markdown
---
"kiro-agents": minor
---

# Feature summary

Brief description of what changed and why.

## Added
- New feature X
- New capability Y

## Changed
- Modified behavior Z

## Fixed
- Bug fix W

## Key Findings
- Important discovery A

## Design Decisions
- Chose approach B because C
```

### Version Types

- **major**: Breaking changes, API changes, architectural changes
- **minor**: New features, backwards-compatible additions
- **patch**: Bug fixes, documentation, refactoring

## Testing

### Run Tests

```bash
bun run test
```

This validates:
- Build outputs exist
- File counts match expectations
- Substitutions applied correctly
- Frontmatter validity

### Manual Testing

**npm package**:
```bash
bun run build
bun link
kiro-agents
```

**Power distribution**:
```bash
bun run build:power
# Install from local path in Kiro IDE
```

**Dev mode**:
```bash
bun run dev
# Files in ~/.kiro/steering/kiro-agents/
```

## Project Structure

```
kiro-agents/
├── src/                    # Source files
│   ├── core/              # Cross-IDE compatible
│   └── kiro/              # Kiro-specific
├── scripts/               # Build and release scripts
├── .changeset/            # Changesets and snapshots
├── .kiro/                 # Workspace config
│   ├── agents/           # Custom agents
│   ├── hooks/            # Slash commands
│   └── steering/         # Workspace steering
└── docs/                  # Documentation
```

## Build System

### Build Modes

**npm** - Package distribution:
```bash
bun run build
```

**power** - Kiro Power distribution:
```bash
bun run build:power
```

**dev** - Development mode (watch):
```bash
bun run dev
```

### Configuration

Dynamic substitutions in `src/config.ts` and `src/kiro/config.ts`:
- `{{{VERSION}}}` - Package version
- `{{{COMMANDS_LIST}}}` - Auto-generated commands
- `{{{AGENT_LIST}}}` - Available agents

## Release Process (Maintainers Only)

### Prerequisites

- Write access to repository
- npm publish permissions
- On `main` branch

### Steps

1. **Merge feature branches** with changesets
2. **Run release command**:
   ```bash
   /release
   ```
   Or:
   ```bash
   bun run release
   ```

This will:
- Consume all changesets
- Bump version in `package.json`
- Update `CHANGELOG.md`
- Build the package
- Publish to npm
- Create git tag
- Push to GitHub

## Code Style

- **TypeScript** for scripts and configuration
- **Markdown** for documentation and steering files
- **ESM modules** throughout
- **Bun** as primary runtime

## Documentation

- **Steering documents** in `.kiro/steering/` - Project architecture
- **User documentation** in `docs/` - User-facing guides
- **Inline comments** for complex logic
- **Frontmatter** in markdown files for metadata

## Getting Help

- **Issues**: Open an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Documentation**: Check `docs/VERSIONING.md` for versioning details

## Tips for Success

### Use Snapshots Liberally

Don't wait until the end - capture context after each session. It's easier to consolidate rich context than to remember everything later.

### Commit Frequently

Frequent commits give you rollback points. Don't worry about messy history - you'll squash before merging.

### Let AI Filter

Don't worry about documenting failed experiments in snapshots. The AI will filter them out during finalization by comparing with the final commit.

### Review Changesets

Always review the generated changeset before committing. The AI does a good job, but you know your changes best.

### Ask Questions

If you're unsure about the workflow, open an issue or discussion. We're here to help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
