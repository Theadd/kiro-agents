---
"kiro-agents": minor
---

# Automatic power registration in CLI installer

The kiro-protocols power now automatically registers in Kiro's Powers UI when running `npx kiro-agents`, eliminating the need for manual activation. The CLI extracts metadata from POWER.md and updates the Kiro registry, making the power appear as installed immediately after installation.

## Added
- Automatic power registration during CLI installation
- Power metadata extraction from POWER.md frontmatter
- Registry registration with installation info and timestamps
- TypeScript interfaces for Kiro registry structure
- Graceful error handling with fallback instructions if registration fails
- Comprehensive technical documentation (AUTOMATIC_POWER_REGISTRATION.md)
- Implementation summary documentation (IMPLEMENTATION_CHANGELOG.md)

## Changed
- CLI install function now includes registry registration step
- Installation success messages mention automatic power registration
- DUAL_INSTALLATION_GUIDE.md updated with registry registration details
- Enhanced documentation throughout CLI code

## Fixed
- Power no longer requires manual activation after installation
- Users no longer need to manually add repository via Powers UI
