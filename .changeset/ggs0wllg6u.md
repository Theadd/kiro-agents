---
"kiro-agents": minor
---

# Simplify reflection system to 3-tier hierarchy

Streamlined the AI reflection system from 4 tiers to 3 tiers by removing the category tier, and updated file references to remove anchors for better compatibility. This simplification reduces complexity while maintaining full functionality.

## Changed
- Reflection system now uses 3-tier hierarchy (Universal, Agent, Project) instead of 4-tier
- File references no longer use anchors (e.g., `#[[file:path.md]]` instead of `#[[file:path.md:insights]]`)
- All reflection protocols updated to support simplified architecture
- Documentation updated throughout to reflect 3-tier structure

## Removed
- Category tier from reflection hierarchy (Universal, ~~Category~~, Agent, Project)
- File reference anchors for better compatibility with flat file format

