# Protocol: Reflection Curator Quality Checklist

This checklist helps the reflection-curator agent validate insight quality during review.

## Quality Criteria

### 1. Specificity

**Good:** Concrete, actionable information
**Bad:** Vague, general statements

**Examples:**

✅ **Good:**
```
Use 4 backticks for outer markdown blocks, 3 for inner blocks when showing nested code examples.
```

❌ **Bad:**
```
Be careful with markdown formatting.
```

**Questions to ask:**
- Can someone apply this insight immediately?
- Does it include specific details or examples?
- Is it clear what action to take?

### 2. Context

**Good:** Explains why it matters
**Bad:** States fact without rationale

**Examples:**

✅ **Good:**
```
Always detect workspace type before implementation. External workspaces cannot modify source files, so proposals must reference installed product files only.
```

❌ **Bad:**
```
Detect workspace type first.
```

**Questions to ask:**
- Does it explain why this matters?
- Is the rationale clear?
- Would someone understand the importance?

### 3. Conciseness

**Good:** Brief but complete
**Bad:** Too verbose or too terse

**Examples:**

✅ **Good:**
```
Protocol files in src/core/protocols/ are auto-discovered via manifest glob patterns. Add new .md file → automatically included in build.
```

❌ **Bad (too verbose):**
```
When you want to add a new protocol file, you need to understand that the build system uses a manifest-based approach with glob patterns that automatically discover files in the src/core/protocols/ directory, which means that when you create a new markdown file with the .md extension in that directory, the build system will automatically find it and include it in the build process without requiring any manual configuration changes to the manifest file or build scripts.
```

❌ **Bad (too terse):**
```
Protocols auto-discovered.
```

**Questions to ask:**
- Is it as brief as possible while remaining clear?
- Does it include all necessary information?
- Can any words be removed without losing meaning?

### 4. Usefulness

**Good:** Valuable for future reference
**Bad:** Obvious, temporary, or irrelevant

**Examples:**

✅ **Good:**
```
When proposing improvements in external workspaces, reference ONLY installed product files (~/.kiro/). Never reference source files (src/) or build system. Implementer agent traces back to source.
```

❌ **Bad (obvious):**
```
Files have names and extensions.
```

❌ **Bad (temporary):**
```
Bug in line 42 of agents.md needs fixing.
```

❌ **Bad (irrelevant):**
```
I prefer coffee over tea.
```

**Questions to ask:**
- Will this be useful in 6 months?
- Is it non-obvious knowledge?
- Does it help solve real problems?

## Validation Process

### Step 1: Read Insight

Read the draft insight completely.

### Step 2: Check Each Criterion

**Specificity:** ✅ / ⚠️ / ❌
**Context:** ✅ / ⚠️ / ❌
**Conciseness:** ✅ / ⚠️ / ❌
**Usefulness:** ✅ / ⚠️ / ❌

**Legend:**
- ✅ Meets criterion
- ⚠️ Partially meets (needs refinement)
- ❌ Fails criterion

### Step 3: Calculate Score

**Pass:** All ✅ or one ⚠️
**Refine:** Two or more ⚠️
**Reject:** Any ❌

### Step 4: Take Action

**Pass:**
- Approve to appropriate tier
- No changes needed

**Refine:**
- Suggest improvements
- Show refined version
- Ask user to approve or reject

**Reject:**
- Explain why it fails
- Suggest what would make it acceptable
- Discard or ask user to rewrite

## Refinement Patterns

### Pattern 1: Add Specificity

**Before:**
```
Be careful with file operations.
```

**After:**
```
Use fsWrite for first-time file creation (creates directories automatically). Use fsAppend for adding to existing files. Check file existence first to determine which tool to use.
```

### Pattern 2: Add Context

**Before:**
```
Run bun run dev with 5-second timeout.
```

**After:**
```
Run bun run dev with 5-second timeout for validation. This is sufficient for quick iteration cycles without running full test suite.
```

### Pattern 3: Improve Conciseness

**Before:**
```
When you are working with the build system and you need to add a new protocol file, you should know that the system will automatically discover it because it uses glob patterns in the manifest configuration file.
```

**After:**
```
Protocol files in src/core/protocols/ are auto-discovered via manifest glob patterns. Add new .md file → automatically included in build.
```

### Pattern 4: Enhance Usefulness

**Before:**
```
Something went wrong with the build.
```

**After:**
```
If build fails with "file not found", check that protocol files are in src/core/protocols/ (not src/protocols/). Manifest glob pattern is src/core/protocols/*.md.
```

## Common Issues

### Issue 1: Too Generic

**Problem:** Insight applies to everything, helps with nothing

**Example:**
```
Always write good code.
```

**Fix:** Make it specific to a real situation
```
In agent definitions, use YAML frontmatter with 'name', 'type', 'description', and 'version' keys. This enables agent discovery and management.
```

### Issue 2: Missing "Why"

**Problem:** States what to do but not why

**Example:**
```
Use 4 backticks for outer blocks.
```

**Fix:** Add rationale
```
Use 4 backticks for outer blocks, 3 for inner blocks. The parser needs different backtick counts to distinguish nesting levels. Using the same count causes premature block closure.
```

### Issue 3: Too Long

**Problem:** Insight is a paragraph or more

**Example:**
```
When working with the reflection system, it's important to understand that there are multiple tiers of insights including universal insights that apply to all agents, category insights that apply to specific types of agents, agent-specific insights that only apply to one agent, and project insights that apply to the current project. Each tier has its own file location and purpose, and you need to choose the right tier based on the scope of the insight you're recording.
```

**Fix:** Break into bullet points or condense
```
Reflection system has 4 tiers: Universal (all agents), Category (agent type), Agent-Specific (one agent), Project (current project). Choose tier based on insight scope.
```

### Issue 4: Temporary Information

**Problem:** Insight will be outdated soon

**Example:**
```
Current version is 1.2.3, update to 1.2.4 when available.
```

**Fix:** Make it timeless or reject
```
Check package.json version before publishing. Use semantic versioning: major.minor.patch.
```

## Tier Assignment Guidelines

### Universal Tier

**Criteria:**
- Applies to ALL agents
- No exceptions or special cases
- Fundamental to system operation or widely applicable best practices

**Examples:**
- Markdown formatting rules
- File operation patterns
- Approval protocols
- Error handling conventions
- Documentation standards

### Agent-Specific Tier

**Criteria:**
- Applies to ONE agent only
- Agent-specific workflows or behaviors
- Unique to agent's specialized role

**Examples:**
- Agent-specific workflow preferences
- Learned behaviors from past sessions
- Agent-unique capabilities
- Specialized techniques for specific tasks

### Project Tier

**Criteria:**
- About THIS project specifically
- Project structure or conventions
- User preferences for this workspace
- Key files or patterns in this codebase

**Examples:**
- "This project uses Bun for package management"
- "Build system uses centralized manifest in src/manifest.ts"
- "User prefers integration tests over unit tests"
- "Protocols are auto-discovered via glob patterns"

## Edge Cases

### Duplicate Insights

**If insight already exists in approved tier:**
- Check if new version adds value
- If yes: Update existing insight
- If no: Reject as duplicate

### Conflicting Insights

**If insight contradicts existing approved insight:**
- Show both versions
- Ask user which is correct
- Update or reject accordingly

### Borderline Quality

**If insight is close but not quite there:**
- Suggest refinement
- Give user option to approve as-is or refine
- Document why it's borderline

---

**Use this checklist to maintain high-quality insights across all tiers.**
