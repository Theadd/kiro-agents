---
name: "git-best-practices"
displayName: "Git Best Practices"
description: "Essential Git best practices for commit messages, branching strategies, and collaborative workflows to maintain clean project history."
keywords: ["git", "commits", "branching", "workflow", "best-practices"]
author: "Example Author"
version: "1.0.0"
---

# Git Best Practices

## Overview

This power provides essential Git best practices to help you maintain a clean, understandable project history. Learn how to write meaningful commit messages, organize branches effectively, and collaborate smoothly with your team.

## Commit Message Best Practices

### Structure

Use this format for commit messages:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

**Good commit messages:**
```
feat(auth): add OAuth2 login support

Implemented OAuth2 authentication flow with Google and GitHub providers.
Added user session management and token refresh logic.

Closes #123
```

**Bad commit messages:**
```
fixed stuff
updated files
wip
```

## Branching Strategies

### Main Branches

- **main/master**: Production-ready code
- **develop**: Integration branch for features

### Supporting Branches

- **feature/**: New features (`feature/user-authentication`)
- **bugfix/**: Bug fixes (`bugfix/login-error`)
- **hotfix/**: Urgent production fixes (`hotfix/security-patch`)
- **release/**: Release preparation (`release/v1.2.0`)

### Workflow

1. Create feature branch from `develop`
2. Work on feature with regular commits
3. Open pull request to `develop`
4. Code review and merge
5. Delete feature branch after merge

## Best Practices

- **Commit often**: Small, focused commits are easier to review and revert
- **Write clear messages**: Future you will thank present you
- **Review before committing**: Use `git diff` to check changes
- **Keep branches short-lived**: Merge frequently to avoid conflicts
- **Never commit secrets**: Use `.gitignore` and environment variables
- **Use `.gitignore`**: Exclude build artifacts, dependencies, and local configs

## Common Workflows

### Starting a New Feature

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/new-feature

# Work on feature
git add .
git commit -m "feat(feature): implement new feature"

# Push to remote
git push origin feature/new-feature
```

### Fixing a Bug

```bash
# Create bugfix branch
git checkout -b bugfix/fix-issue

# Fix the bug
git add .
git commit -m "fix(module): resolve issue with X"

# Push and create PR
git push origin bugfix/fix-issue
```

## Troubleshooting

### Accidentally Committed to Wrong Branch

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Switch to correct branch
git checkout correct-branch

# Commit again
git add .
git commit -m "your message"
```

### Need to Update Feature Branch with Latest Develop

```bash
# On your feature branch
git checkout feature/your-feature

# Rebase on develop
git fetch origin
git rebase origin/develop

# Force push (only if branch not shared)
git push --force-with-lease
```

---

**Remember**: Good Git practices make collaboration easier and project history more valuable!
