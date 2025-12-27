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
  - Examples: Markdown preferences, approval protocols, team standards
  
- **Category** (`.ai-storage/reflections/drafts/categories/{category}.md`) - Useful for agent type
  - Examples: Architecture patterns (architects), testing conventions (developers)
  
- **Agent-Specific** (`.ai-storage/reflections/drafts/agents/{agent-name}.md`) - Only this agent
  - Examples: Agent-specific preferences, learned behaviors
  
- **Project** (`.ai-storage/reflections/drafts/project.md`) - About this project
  - Examples: Project structure, conventions, key files

### Step 2: Check if Draft File Exists

**Try to read the target draft file:**

```
Read: .ai-storage/reflections/drafts/{tier}/{file}.md
```

**If file doesn't exist or is empty:**
- Go to Step 3 (Create)

**If file exists with content:**
- Go to Step 4 (Append)

### Step 3: Create Draft File (First Time)

Use `fsWrite` to create the draft file with all subsections:

```markdown
# {Tier} Draft Reflections

## Insights (Draft)

{Your insight if type is Insights}

## Patterns (Draft)

{Your insight if type is Patterns}

## Decisions (Draft)

{Your insight if type is Decisions}

## Learnings (Draft)

{Your insight if type is Learnings}
```

**Note:** fsWrite automatically creates all missing directories (`.ai-storage/reflections/drafts/`).

**Important:** Agents ALWAYS write to drafts first, never directly to approved files. Only the reflection-curator agent moves insights from drafts to approved after review.

**Then:** Skip to Step 5 (Done)

### Step 4: Append to Existing Draft File

Use `fsAppend` to add to the appropriate subsection:

```markdown

- {Your insight content} (captured: {date})
```

**Important:** Add to the correct subsection (Insights, Patterns, Decisions, or Learnings).

### Step 5: Notify User (Optional)

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
- Markdown: Use 4 backticks for outer blocks, 3 for inner blocks when showing nested code examples. This prevents premature block closure in the parser.
```

### Good Pattern (Category: Architects)

```markdown
- Workspace Detection Pattern: Always check for development files (src/manifest.ts, package.json, scripts/) before implementation. External workspaces require proposal-only mode.
```

### Good Decision (Agent-Specific)

```markdown
- Protocol Organization: Decided to use 4-tier hierarchy (Universal, Category, Agent, Project) instead of flat structure. Rationale: Better scalability and clearer separation of concerns.
```

### Good Learning (Project)

```markdown
- Build System: Learned that `bun run dev` with 5-second timeout is sufficient for validation. Full test suite not needed for quick iteration cycles.
```

## Integration with Agent Definition

Agents with Reflections section in their definition will have file references that resolve to approved insights:

```markdown
## Reflections

### Universal Insights
#[[file:.ai-storage/reflections/approved/universal.md:insights]]

### Category Insights
#[[file:.ai-storage/reflections/approved/categories/{category}.md:insights]]

### Agent-Specific Insights
#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md:insights]]

### Project Insights
#[[file:.ai-storage/reflections/approved/project.md:insights]]
```

**Note:** Agents write insights to drafts (`.ai-storage/reflections/drafts/`). The reflection-curator agent reviews drafts and moves approved insights to the appropriate approved tier (`.ai-storage/reflections/approved/`).

---

**Protocol complete. Record insights as you discover them.**
