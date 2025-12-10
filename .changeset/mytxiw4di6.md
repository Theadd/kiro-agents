---
"kiro-agents": patch
---

# Refactor strict mode control to use numbered choice pattern

Replaced userInput tool-based interaction with ADHD-C friendly numbered list format in strict mode control. This change improves compatibility with chit-chat interaction patterns and removes dependency on Kiro-specific tool constraints.

## Changed
- Strict mode interactive control (`/strict`) now uses numbered choice pattern instead of userInput tool
- Updated documentation in both `strict.md` and `strict-mode.md` to reflect numbered options interface
- Replaced "visual buttons" terminology with "numbered choice interface" for consistency

