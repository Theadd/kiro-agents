---
name: "kiro-protocols"
displayName: "Kiro Protocols"
description: "Steering file library - Reusable content loaded on-demand to minimize context overhead"
keywords: ["protocol-library", "steering-library", "lazy-loading"]
author: "R. Beltran"
version: "1.0.0"
---

# Kiro Protocols

Steering file library providing reusable content loaded on-demand to minimize context overhead.

## Usage

Load steering files on-demand via instruction aliases or direct kiroPowers calls:

```markdown
/protocols agent-activation.md
/only-read-protocols chit-chat.md
```

Or directly:

```markdown
kiroPowers action="readSteering" powerName="kiro-protocols" steeringFile="agent-activation.md"
```

**Note:** No activation needed - protocols are steering files, not MCP tools.

---

**Repository:** https://github.com/Theadd/kiro-agents
