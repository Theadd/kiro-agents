---
inclusion: manual
---

# Client Tools

## userInput Tool

```typescript
userInput({
  question: "# Markdown works here! 🚀",
  options: [
    {
      title: "🎯 Emoji + text only",  // NO markdown
      description: "## Full markdown here!",  // YES markdown
      recommended: true
    }
  ],
  reason: "fix-pbt"  // REQUIRED
})
```
