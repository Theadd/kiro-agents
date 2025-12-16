---
"kiro-agents": patch
---

# Disable automatic power registry modification

Commented out the registry write operation in the CLI's power registration logic to prevent potential conflicts with Kiro IDE's internal power management system. The registration code remains in place but disabled, pending validation of the approach with the Kiro team.

## Changed
- Disabled automatic writing to Kiro's power registry during npm installation to avoid modifying IDE internal state

