---
inclusion: manual
---

# Quick Reference Card

## Mode Commands

```bash
/mode vibe          # Flexible, conversational development
/mode spec          # Structured feature planning
/modes              # Interactive mode management
```

## Agent Commands

```bash
/agent {name}       # Activate specific agent
/agents             # Interactive agent management
```

## Utility Commands

```bash
/strict on          # Enable precision mode
/strict off         # Disable precision mode
```

## When to Use Each Mode

### Use Vibe Mode For:
- Quick fixes and changes
- Exploratory coding
- Prototyping ideas
- Refactoring existing code
- Debugging issues
- General questions
- Rapid iteration

### Use Spec Mode For:
- Complex new features
- Formal requirements
- Property-based testing
- Structured planning
- Multi-stakeholder alignment
- Long-term features

## Mode Characteristics

| Feature | Vibe | Spec |
|---------|------|------|
| Workflow | Flexible | Structured |
| Requirements | Natural | EARS/INCOSE |
| Testing | Pragmatic | PBT-focused |
| Approval Gates | None | Mandatory |
| Documentation | As needed | Formal |

## Common Workflows

### Explore → Formalize
```
/mode vibe          # Prototype and explore
[Build proof of concept]
/mode spec          # Formalize the design
[Create requirements, design, tasks]
```

### Plan → Implement
```
/mode spec          # Create formal plan
[Write requirements, design, tasks]
/mode vibe          # Implement quickly
[Code without ceremony]
```

### Precision When Needed
```
/mode vibe          # Start flexible
/strict on          # Add precision
[Critical section with no assumptions]
/strict off         # Return to flexible
```

## Combining Features

```bash
# Structured planning with precision
/mode spec
/strict on

# Flexible development with agent
/mode vibe
/agent kiro-master

# Full stack
/mode spec
/agent kiro-master
/strict on
```

## What Gets Preserved

✅ File changes
✅ Conversation history
✅ Working state
✅ User preferences
✅ Active agents

❌ Workflow phase (spec mode)
❌ Approval gate status

## Troubleshooting

**Mode not switching?**
- Check mode file exists
- Try `/modes` to see available
- Verify agent-system.md loaded

**Not sure which mode?**
- Ask "Which mode am I in?"
- Use `/modes` command
- Look for approval gates (= spec mode)

**Context seems lost?**
- Files persist - check filesystem
- History preserved - scroll up
- Nothing deleted on mode switch

## Available Modes

- **vibe** - Flexible, conversational development
- **spec** - Structured feature planning with requirements/design/tasks

## Available Agents

Check `.kiro/agents/` directory or use `/agents` command

## Tips

1. **Start with vibe** for exploration
2. **Switch to spec** when formalizing
3. **Use strict mode** for critical decisions
4. **Combine with agents** for specialized tasks
5. **Switch freely** - context is preserved

---

**Quick start:** `/modes` to see options and switch interactively
