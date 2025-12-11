---
"kiro-agents": minor
---

# Cross-IDE compatibility and power distribution protection

Implements markdown section extraction system with recursive substitution processing, enforces cross-IDE compatibility by removing all Kiro-specific references from core files, and adds multi-layer protection to prevent contributors from accidentally modifying the power distribution directory.

## Added
- Markdown section extraction utility with proper code block and XML tag handling
- Recursive substitution processing in build system (up to 10 iterations for nested substitutions)
- Cross-IDE compatibility substitutions for workspace paths, agent names, and descriptions
- Shared content files for multi-line reusable content and alias definitions
- GitHub Action that blocks PRs modifying power directory
- Contributor guide with power protection explanation and development workflow
- Cross-IDE Compatibility Rules and Power Distribution Protection sections in product documentation

## Changed
- Build system now processes substitutions recursively to handle nested placeholders
- Core files now use substitutions instead of hardcoded Kiro-specific values
- Agent examples changed from kiro-manager to project-manager for IDE-agnostic naming
- Build configuration clarified: all builds use Kiro-specific config
- README now includes Contributing section with power modification warning
- Test script updated to use npm-no-clean mode for validation

## Fixed
- Nested substitutions now process correctly through recursive iteration
- Section extraction no longer detects false headers inside code blocks or XML tags

