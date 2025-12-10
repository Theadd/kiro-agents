---
"kiro-agents": minor
---

# Add AI-powered versioning system with session snapshots

Implemented hybrid AI + Changesets versioning system that captures rich development context through session snapshots. Enables collaborative changelog generation with automatic filtering of temporary changes.

## Added
- /snapshot command - Captures session context (purpose, findings, decisions, limitations)
- /finalize command - Consolidates snapshots into changesets with AI analysis
- /release command - Automates version bumping, changelog updates, and npm publishing
- Session snapshot system - Stores development context across multiple sessions
- Comprehensive documentation (docs/VERSIONING.md, CONTRIBUTING.md, .changeset/README.md)

## Changed
- Build system now supports versioning workflow with new scripts
- Project structure updated with .changeset/ directory and .kiro/hooks/
- Steering documents updated with versioning system architecture

## Key Findings
- AI session context captures 'why' and 'how' that git commits cannot
- Gitignored snapshots prevent merge conflicts while committed changesets enable coordination
- Multi-session support essential for features that exceed context window limits

## Design Decisions
- Hybrid AI + Changesets approach balances automation with multi-developer coordination
- Separated /snapshot (incremental) from /finalize (consolidation) to support frequent commits and multi-session features
- Kiro slash commands via hooks provide seamless IDE integration

