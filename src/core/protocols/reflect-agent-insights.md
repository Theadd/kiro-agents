# Protocol: Record Agent Insight

This protocol guides agents on how to capture insights, patterns, decisions, and learnings during their work.

## When to Use This Protocol

- Agent discovers something worth remembering
- Agent identifies a useful pattern
- Agent makes an important decision
- Agent learns from an error or success

## Insight Types

**Insights:** General knowledge, preferences, standards
**Patterns:** Reusable approaches, workflows, solutions
**Decisions:** Important choices made and their rationale
**Learnings:** Lessons from successes or failures

## Recording Process

### Step 1: Determine Insight Tier

**Where should this insight be recorded?**

- **Universal** (`.ai-storage/reflections/drafts/universal.md`) - Useful for ALL agents
  - Examples: Markdown preferences, approval protocols, error handling patterns, documentation standards
  
- **Agent-Specific** (`.ai-storage/reflections/drafts/agents/{agent-name}.md`) - Only this agent
  - Examples: Agent-specific workflows, learned behaviors, specialized techniques
  
- **Project** (`.ai-storage/reflections/drafts/project.md`) - About this project
  - Examples: Project structure, user preferences, conventions, key files, team standards

### Step 2: Determine Insight Type Tag

**Choose the appropriate type tag:**

- `[INSIGHT]` - General knowledge, preferences, standards
- `[PATTERN]` - Reusable approaches, workflows, solutions
- `[DECISION]` - Important choices made and their rationale
- `[LEARNING]` - Lessons from successes or failures

### Step 3: Check if Draft File Exists

**Try to read the target draft file:**

```
Read: .ai-storage/reflections/drafts/{tier}/{file}.md
```

**If file doesn't exist or is empty:**
- Go to Step 4 (Create)

**If file exists with content:**
- Go to Step 5 (Append)

### Step 4: Create Draft File (First Time)

Use `fsWrite` to create the draft file with header and first insight:

```markdown
# {Tier} Draft Reflections

- **[TYPE]** {Your insight content} (captured: {YYYY-MM-DD})
```

**Replace:**
- `{Tier}` - Universal, Category Name, Agent Name, or Project
- `[TYPE]` - INSIGHT, PATTERN, DECISION, or LEARNING
- `{Your insight content}` - The actual insight text
- `{YYYY-MM-DD}` - Current date (e.g., 2026-01-01)

**Note:** fsWrite automatically creates all missing directories (`.ai-storage/reflections/drafts/`).

**Important:** Agents ALWAYS write to drafts first, never directly to approved files. Only the reflection-curator agent moves insights from drafts to approved after review.

**Then:** Skip to Step 6 (Done)

### Step 5: Append to Existing Draft File

Use `fsAppend` to add the new insight:

```markdown

- **[TYPE]** {Your insight content} (captured: {YYYY-MM-DD})
```

**Format rules:**
- Start with blank line (separator)
- Use `- **[TYPE]**` prefix (TYPE in uppercase)
- Include capture date in parentheses
- Keep insight on single line if possible (use line breaks only if necessary)

**Important:** This format allows `fsAppend` to work without reading the file first.

### Step 6: Notify User (Optional)

Briefly mention the insight was captured:

```
💡 Insight captured in drafts (pending curator review)
```

**Then:** Continue with your work.

## Quality Guidelines

**Good insights are:**
- ✅ Specific and actionable
- ✅ Include context (why it matters)
- ✅ Concise but complete
- ✅ Useful for future reference

**Avoid:**
- ❌ Vague statements ("be careful")
- ❌ Obvious facts ("files have names")
- ❌ Temporary information ("bug in line 42")
- ❌ Personal opinions without rationale

## Examples

### Good Insight (Universal)

```markdown
- **[INSIGHT]** Markdown: Use 4 backticks for outer blocks, 3 for inner blocks when showing nested code examples. This prevents premature block closure in the parser. (captured: 2026-01-01)
```

### Good Pattern (Agent-Specific)

```markdown
- **[PATTERN]** Workspace Detection: Always check for development files (src/manifest.ts, package.json, scripts/) before implementation. External workspaces require proposal-only mode. (captured: 2026-01-01)
```

### Good Decision (Agent-Specific)

```markdown
- **[DECISION]** Protocol Organization: Decided to use 4-tier hierarchy (Universal, Category, Agent, Project) instead of flat structure. Rationale: Better scalability and clearer separation of concerns. (captured: 2026-01-01)
```

### Good Learning (Project)

```markdown
- **[LEARNING]** Build System: Learned that `bun run dev` with 5-second timeout is sufficient for validation. Full test suite not needed for quick iteration cycles. (captured: 2026-01-01)
```

## File Format Example

**Complete draft file structure:**

```markdown
# Universal Draft Reflections

- **[INSIGHT]** Use 4 backticks for outer blocks, 3 for inner. Prevents premature block closure. (captured: 2026-01-01)

- **[PATTERN]** Workspace Detection: Check for src/manifest.ts before implementation. External workspaces require proposal-only mode. (captured: 2026-01-01)

- **[DECISION]** Protocol Organization: 4-tier hierarchy instead of flat. Rationale: Better scalability. (captured: 2026-01-02)

- **[LEARNING]** Build System: `bun run dev` with 5s timeout sufficient for validation. (captured: 2026-01-02)
```

**Key features:**
- Single header line
- Each insight is a separate bullet point
- Type tag in bold brackets
- Blank line separator between insights
- Capture date at end
- No subsections (enables fsAppend)

## Integration with Agent Definition

Agents with Reflections section in their definition will have file references that resolve to approved insights:

```markdown
## Reflections

### Universal Insights
#[[file:.ai-storage/reflections/approved/universal.md]]

### Agent-Specific Insights
#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md]]

### Project Insights
#[[file:.ai-storage/reflections/approved/project.md]]
```

**Note:** Agents write insights to drafts (`.ai-storage/reflections/drafts/`). The reflection-curator agent reviews drafts and moves approved insights to the appropriate approved tier (`.ai-storage/reflections/approved/`).

---

**Protocol complete. Record insights as you discover them.**
