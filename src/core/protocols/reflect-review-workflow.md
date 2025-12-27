# Protocol: Review Draft Insights

This protocol guides the reflection-curator agent through reviewing draft insights and moving them to approved tiers.

## When to Use This Protocol

- User executes `/reflect review` command
- Curator agent needs to process pending drafts
- Batch review of accumulated insights

## Review Workflow

### Step 1: Load All Draft Files

**Scan draft directory:**

```
.ai-storage/reflections/drafts/
├── universal.md
├── project.md
├── categories/
│   ├── {category}.md
│   └── ...
└── agents/
    ├── {agent-name}.md
    └── ...
```

**Read each file that exists.**

### Step 2: Extract Draft Insights

For each draft file, extract insights from all subsections:
- Insights (Draft)
- Patterns (Draft)
- Decisions (Draft)
- Learnings (Draft)

**Create a review queue** with all pending items.

### Step 3: Review Each Insight

For each insight in the queue:

#### 3a. Display Insight

```diff
📝 DRAFT INSIGHT #{number}

Source: {file-path}
Type: {Insights|Patterns|Decisions|Learnings}

Content:
{insight-content}
```

#### 3b. Validate Quality

Check against quality checklist (see reflect-curator-checklist.md):
- Is it specific and actionable?
- Does it include context?
- Is it concise but complete?
- Is it useful for future reference?

**If quality issues found:**
- Suggest refinements
- Ask user to approve refined version or reject

#### 3c. Determine Tier

**Ask user:**

```
Where should this insight be approved to?

1. **Universal** - All agents use this
2. **Category: {category}** - All {category} agents use this
3. **Agent-Specific: {agent-name}** - Only this agent uses this
4. **Project** - Project-wide insight
5. **Reject** - Not useful, discard
6. **Skip** - Review later
```

#### 3d. Apply User Choice

**Based on user selection:**

**Option 1 (Universal):**
- Move to `.ai-storage/reflections/approved/universal.md`
- Append to appropriate subsection (Insights, Patterns, Decisions, Learnings)
- Remove from draft file

**Option 2 (Category):**
- Move to `.ai-storage/reflections/approved/categories/{category}.md`
- Create category file if doesn't exist
- Append to appropriate subsection
- Remove from draft file

**Option 3 (Agent-Specific):**
- Move to `.ai-storage/reflections/approved/agents/{agent-name}.md`
- Create agent file if doesn't exist
- Append to appropriate subsection
- Remove from draft file

**Option 4 (Project):**
- Move to `.ai-storage/reflections/approved/project.md`
- Append to appropriate subsection
- Remove from draft file

**Option 5 (Reject):**
- Remove from draft file
- Log rejection reason (optional)

**Option 6 (Skip):**
- Leave in draft file
- Continue to next insight

### Step 4: Update Draft File

After processing all insights from a draft file:

**If all insights processed:**
- Delete draft file OR
- Clear all "(Draft)" subsections

**If some insights skipped:**
- Keep draft file with remaining insights

### Step 5: Report Results

```diff
✅ REVIEW COMPLETE

Processed: {total} insights
├─ Approved to Universal: {count}
├─ Approved to Categories: {count}
├─ Approved to Agents: {count}
├─ Approved to Project: {count}
├─ Rejected: {count}
└─ Skipped: {count}

Approved files updated:
- .ai-storage/reflections/approved/universal.md
- .ai-storage/reflections/approved/categories/{category}.md
- .ai-storage/reflections/approved/agents/{agent-name}.md
- .ai-storage/reflections/approved/project.md
```

## File Operations

### Moving Insight from Draft to Approved

**Read draft file:**
```
.ai-storage/reflections/drafts/agents/{agent-name}.md
```

**Extract insight** from appropriate subsection.

**Check if approved file exists:**
```
.ai-storage/reflections/approved/{tier}/{file}.md
```

**If approved file doesn't exist:**
- Use `fsWrite` to create with all subsections
- Add insight to appropriate subsection

**If approved file exists:**
- Use `fsAppend` to add insight to appropriate subsection

**Update draft file:**
- Remove processed insight
- If file becomes empty, delete it

## Quality Refinement

**If insight is vague or unclear:**

```diff
⚠️ QUALITY ISSUE

Original:
{vague-insight}

Suggested refinement:
{refined-insight}

Accept refinement?
1. Yes, approve refined version
2. No, reject insight
3. Let me edit it
```

**Apply user choice.**

## Batch Review Mode

**For large numbers of drafts:**

1. **Group by type** - Review all Insights, then Patterns, then Decisions, then Learnings
2. **Show progress** - "Reviewing insight 5 of 23..."
3. **Allow bulk actions** - "Approve next 5 to Universal"
4. **Pause/Resume** - Save progress, continue later

## Integration Points

### Curator Agent

Reflection-curator agent loads this protocol when user executes `/reflect review`.

### Quality Checklist

Uses `reflect-curator-checklist.md` for validation criteria.

### Agent Definitions

Approved insights become available to agents via file references in their Reflections sections.

---

**Protocol complete. Review drafts systematically and maintain quality standards.**
