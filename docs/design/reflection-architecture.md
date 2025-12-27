# Reflection System Architecture

Technical design documentation for the AI-managed reflection system in kiro-agents.

## Design Goals

### Primary Goals

1. **Persistent Memory** - Enable agents to remember insights across sessions
2. **Quality Control** - Ensure only valuable insights are shared
3. **Minimal Overhead** - Keep base context small, load insights on-demand
4. **Zero Setup** - No initialization required, files created on-demand
5. **Team Collaboration** - Share approved insights via git

### Non-Goals

- Real-time synchronization across team members
- Complex insight relationships or dependencies
- Automatic insight generation without human review
- Cross-project insight sharing (future enhancement)

## Architecture Overview

### Core Principles

**1. On-Demand Creation**
- No initialization scripts or setup required
- Files created automatically when first insight is recorded
- Directories created automatically by fsWrite tool
- Clean repository (no empty files)

**2. Draft → Approved Workflow**
- Agents write to drafts first (never directly to approved)
- Curator agent reviews and validates quality
- User assigns insights to appropriate tier
- Approved insights moved to tier-specific files

**3. 4-Tier Hierarchy**
- Universal (all agents)
- Category (agent type)
- Agent-Specific (one agent)
- Project (project-wide)

**4. File Reference-Driven**
- Agent definitions contain file references to all 4 tiers
- File references resolve to actual content when agent loads
- Broken references (missing files) show blank
- Agent detects blank and creates file on first insight

## System Components

### 1. Storage Layer

**Location:** `.ai-storage/reflections/`

**Structure:**
```
.ai-storage/
└── reflections/
    ├── drafts/              # Pending insights
    │   ├── universal.md
    │   ├── project.md
    │   ├── categories/
    │   │   └── {category}.md
    │   └── agents/
    │       └── {agent-name}.md
    └── approved/            # Approved insights
        ├── universal.md
        ├── project.md
        ├── categories/
        │   └── {category}.md
        └── agents/
            └── {agent-name}.md
```

**File Format:**
```markdown
# {Tier} Reflections

## Insights
- Insight 1
- Insight 2

## Patterns
- Pattern 1
- Pattern 2

## Decisions
- Decision 1 (rationale: why we chose this)
- Decision 2

## Learnings
- Learning 1 (what we discovered)
- Learning 2
```

**Why This Structure:**
- Separate drafts from approved (clear workflow)
- Tier-based organization (easy to find relevant insights)
- Subsections by type (organized knowledge)
- Markdown format (human-readable, git-friendly)

### 2. Agent Integration Layer

**Reflections Section in Agent Definitions:**

```markdown
## Reflections

This agent records insights, patterns, and learnings in its dedicated reflection files.

### Universal Insights

#[[file:.ai-storage/reflections/approved/universal.md:insights]]

### Category Insights ({agent-category})

#[[file:.ai-storage/reflections/approved/categories/{agent-category}.md:insights]]

### Agent-Specific Insights

#[[file:.ai-storage/reflections/approved/agents/{agent-name}.md:insights]]

### Project Insights

#[[file:.ai-storage/reflections/approved/project.md:insights]]
```

**File Reference Behavior:**
- Kiro IDE resolves file references when agent loads
- If file exists: Content injected into agent definition
- If file doesn't exist: Reference shows blank or just syntax
- Agent detects blank and uses fsWrite to create file

**Why File References:**
- Single source of truth (insights in one place)
- Automatic loading (no manual protocol calls)
- Graceful degradation (broken refs = blank)
- Easy to audit (broken refs visible)

### 3. Protocol Layer

**Protocols in kiro-protocols Power:**

| Protocol | Purpose | Used By |
|----------|---------|---------|
| `reflect-agent-insights.md` | How agents capture insights | All agents with Reflections section |
| `reflect-review-workflow.md` | Draft review process | reflection-curator agent |
| `reflect-curator-checklist.md` | Quality validation | reflection-curator agent |
| `reflect-manager-workflow.md` | Batch enablement | reflection-curator agent |

**Why Separate Protocols:**
- Reusable workflows (DRY principle)
- Single source of truth (one place to update)
- Minimize context overhead (load only when needed)
- Clear separation of concerns (each protocol has one job)

### 4. Command Layer

**Steering File:** `src/core/reflect.md`

**Commands:**
- `/reflect` - Enable reflection (session-temporary)
- `/reflect review` - Review draft insights

**Why Minimal Commands:**
- Simple user interface (two main commands)
- Complex workflows handled by protocols
- Curator agent handles batch operations
- Progressive disclosure (advanced features via curator)

### 5. Curator Agent

**File:** `.kiro/agents/reflection-curator.md`

**Responsibilities:**
- Review draft insights
- Validate quality
- Assign to tiers
- Batch agent enablement
- Statistics and maintenance

**Why Dedicated Agent:**
- Complex workflows need specialized agent
- Quality control requires expertise
- Batch operations need careful handling
- Separates concerns (agents capture, curator reviews)

## Data Flow

### Insight Capture Flow

```
1. Agent discovers insight during work
   ↓
2. Agent determines tier (Universal, Category, Agent, Project)
   ↓
3. Agent checks if draft file exists
   ├─ If blank/missing → fsWrite (creates file + directories)
   └─ If exists → fsAppend (adds to file)
   ↓
4. Insight written to appropriate subsection (Insights, Patterns, Decisions, Learnings)
   ↓
5. Agent continues working (no interruption)
```

**Key Design Decisions:**
- **Immediate capture** - Don't wait until end of session
- **Automatic tier detection** - Agent determines based on scope
- **On-demand file creation** - No initialization required
- **Non-blocking** - Agent continues working after capture

### Review Flow

```
1. User types: /reflect review
   ↓
2. Activates reflection-curator agent
   ↓
3. Curator loads all draft files
   ↓
4. For each draft insight:
   ├─ Display content
   ├─ Validate quality (checklist)
   ├─ Suggest refinements if needed
   └─ Ask user which tier to approve to
   ↓
5. User selects tier (Universal, Category, Agent, Project, Reject, Skip)
   ↓
6. Curator moves insight to approved tier
   ├─ Check if approved file exists
   ├─ If not → fsWrite (create with all subsections)
   └─ If exists → fsAppend (add to subsection)
   ↓
7. Curator removes insight from draft file
   ↓
8. Repeat for all drafts
   ↓
9. Report results (counts by tier)
```

**Key Design Decisions:**
- **Human-in-the-loop** - User approves every insight
- **Quality validation** - Curator checks against checklist
- **Refinement suggestions** - Curator improves vague insights
- **Batch processing** - Review multiple drafts in one session

### Loading Flow

```
1. User activates agent: /agents {name}
   ↓
2. Agent definition loads
   ↓
3. Reflections section contains file references
   ↓
4. Kiro IDE resolves file references
   ├─ Universal: .ai-storage/reflections/approved/universal.md
   ├─ Category: .ai-storage/reflections/approved/categories/{category}.md
   ├─ Agent: .ai-storage/reflections/approved/agents/{agent-name}.md
   └─ Project: .ai-storage/reflections/approved/project.md
   ↓
5. For each file reference:
   ├─ If file exists → Content injected into agent definition
   └─ If file doesn't exist → Reference shows blank
   ↓
6. Agent has all approved insights in context
   ↓
7. Agent applies insights during work
```

**Key Design Decisions:**
- **Automatic loading** - No manual protocol calls
- **Tier-based loading** - Only relevant insights loaded
- **Graceful degradation** - Missing files don't break agent
- **Lazy evaluation** - Files created on first insight

## Design Decisions

### Why On-Demand Creation?

**Alternative Considered:** Initialization script that creates all directories and files upfront

**Rejected Because:**
- Adds setup friction (user must run script)
- Creates empty files (clutters repository)
- Requires maintenance (keep script in sync with structure)
- Doesn't scale (new tiers require script updates)

**Chosen Approach:** On-demand creation via fsWrite

**Benefits:**
- Zero setup friction (just start using)
- No empty files (clean repository)
- Scales automatically (new tiers work immediately)
- Self-documenting (structure emerges from usage)

### Why 4-Tier Hierarchy?

**Alternative Considered:** Flat structure (all insights in one file)

**Rejected Because:**
- Poor scalability (file grows too large)
- No relevance filtering (all agents load all insights)
- Difficult to maintain (hard to find specific insights)
- No separation of concerns (personal vs team vs project)

**Chosen Approach:** 4-tier hierarchy (Universal, Category, Agent, Project)

**Benefits:**
- Scalable (each tier stays manageable size)
- Relevant (agents load only applicable insights)
- Maintainable (easy to find and update insights)
- Clear separation (personal, team, project scopes)

### Why Draft → Approved Workflow?

**Alternative Considered:** Direct write to approved files

**Rejected Because:**
- No quality control (bad insights shared immediately)
- No review process (mistakes propagate to team)
- No refinement opportunity (vague insights stay vague)
- No user control (agent decides what's shared)

**Chosen Approach:** Draft → Curator Review → Approved

**Benefits:**
- Quality control (curator validates before sharing)
- Review process (user approves every insight)
- Refinement opportunity (curator improves vague insights)
- User control (user decides what's shared)

### Why File References?

**Alternative Considered:** Protocol-based loading (agents call protocols to load insights)

**Rejected Because:**
- Manual loading (agents must remember to load)
- Inconsistent (some agents forget to load)
- Verbose (requires protocol calls in every agent)
- Error-prone (easy to forget or misconfigure)

**Chosen Approach:** File references in agent definitions

**Benefits:**
- Automatic loading (Kiro IDE resolves references)
- Consistent (all agents with Reflections section load insights)
- Concise (one Reflections section per agent)
- Reliable (Kiro IDE handles resolution)

### Why Separate Curator Agent?

**Alternative Considered:** Review workflow in reflect.md steering file

**Rejected Because:**
- Complex workflow (too much for steering file)
- No specialization (generic AI, not expert curator)
- Limited capabilities (steering files can't define agent expertise)
- Poor UX (no chit-chat protocol, no visual formatting)

**Chosen Approach:** Dedicated reflection-curator agent

**Benefits:**
- Complex workflows (agent can handle multi-step processes)
- Specialized expertise (curator knows quality standards)
- Rich capabilities (quality validation, refinement, batch ops)
- Better UX (chit-chat protocol, visual formatting)

## Scalability Considerations

### File Size Management

**Problem:** Approved files could grow very large over time

**Mitigation Strategies:**
1. **Tier-based organization** - Splits insights across multiple files
2. **Subsection organization** - Splits insights by type within files
3. **Periodic archival** - Curator can archive old insights
4. **Consolidation** - Curator can merge similar insights

**Thresholds:**
- Universal: ~100 insights (most common)
- Category: ~50 insights per category
- Agent: ~30 insights per agent
- Project: ~50 insights

**When to archive:**
- Insights older than 6 months
- Insights marked as outdated
- Insights superseded by newer ones

### Context Overhead

**Problem:** Loading all insights could add too much context

**Mitigation Strategies:**
1. **Tier-based loading** - Only load relevant tiers
2. **Lazy loading** - Load only when agent activates
3. **Subsection filtering** - Load only specific subsections (future)
4. **Token budget monitoring** - Track context size

**Current Overhead:**
- Universal: ~500-1000 tokens
- Category: ~300-500 tokens
- Agent: ~200-300 tokens
- Project: ~300-500 tokens
- **Total: ~1300-2300 tokens** (acceptable)

### Team Collaboration

**Problem:** Multiple team members editing same files could cause conflicts

**Mitigation Strategies:**
1. **Git-based workflow** - Use git for conflict resolution
2. **Append-only pattern** - Insights appended, not modified
3. **Curator review** - One person reviews at a time
4. **Clear ownership** - Each agent has dedicated file

**Conflict Scenarios:**
- Two team members approve insights simultaneously → Git merge conflict
- Resolution: Manual merge (insights are independent, easy to merge)

## Future Enhancements

### Phase 2: Advanced Features

**Insight Search:**
- Search across all approved insights
- Filter by tier, type, date, keyword
- Show matching insights with context

**Insight Export:**
- Export all insights to single file
- Export by tier or category
- Format options (markdown, JSON, YAML)

**Insight Analytics:**
- Track insight frequency
- Identify common patterns
- Measure learning over time
- Suggest areas for improvement

### Phase 3: Automation

**Automatic Insight Detection:**
- AI suggests insights proactively
- AI identifies patterns automatically
- AI consolidates similar insights

**Smart Categorization:**
- AI suggests appropriate tier
- AI detects duplicates
- AI recommends refinements

**Lifecycle Management:**
- Automatic archival of old insights
- Automatic consolidation of similar insights
- Automatic detection of outdated insights

### Phase 4: Cross-Project Sharing

**Public Insight Library:**
- Share insights across projects
- Community contributions
- Curated collections

**Insight Versioning:**
- Track changes to insights over time
- Rollback to previous versions
- Compare versions

**Insight Relationships:**
- Link related insights
- Show dependencies
- Group by theme

## Testing Strategy

### Unit Testing

**Components to Test:**
- File creation (fsWrite with nested paths)
- File appending (fsAppend to subsections)
- File reference resolution (Kiro IDE behavior)
- Tier detection logic
- Quality validation checklist

### Integration Testing

**Workflows to Test:**
- End-to-end insight capture (agent → draft → review → approved)
- Batch agent enablement (manager workflow)
- Multi-agent collaboration (multiple agents capturing insights)
- Conflict resolution (simultaneous approvals)

### User Acceptance Testing

**Scenarios to Test:**
- First-time user (no setup, immediate capture)
- Daily usage (capture, review, reuse)
- Team collaboration (shared insights)
- Quality control (curator validation)

## Monitoring and Metrics

### Success Metrics

**Adoption:**
- % of agents with Reflections section
- Insights captured per week
- Insights approved per week
- Active agents using insights

**Quality:**
- Approval rate (approved / total drafts)
- Average confidence level
- Duplicate rate
- Archive rate

**Impact:**
- Reduction in repeated corrections
- Reduction in repeated mistakes
- Time saved per session
- Token overhead added

### Target Goals (After 1 Month)

- ✅ 80%+ agents with Reflections enabled
- ✅ 50+ insights captured
- ✅ 70%+ approval rate
- ✅ 90%+ high confidence insights
- ✅ <5% duplicate rate
- ✅ <2K tokens overhead per agent

## Security and Privacy

### Data Sensitivity

**Insights may contain:**
- Project-specific information
- Team conventions
- Personal preferences
- Architectural decisions

**Mitigation:**
- Insights stored in workspace (not global)
- User reviews before sharing (via git)
- Clear tier separation (personal vs team)
- Gitignore for drafts (not shared until approved)

### Access Control

**Who can:**
- **Capture insights:** Any agent with Reflections section
- **Review drafts:** User via reflection-curator agent
- **Approve insights:** User only (human-in-the-loop)
- **Read approved insights:** All agents in workspace

**No automatic sharing:**
- Drafts never shared (gitignored)
- Approved insights shared only via git commit
- User controls what's committed

## Conclusion

The reflection system provides persistent memory for AI agents through a carefully designed architecture that balances:

- **Simplicity** (on-demand creation, minimal commands)
- **Quality** (curator review, validation checklist)
- **Scalability** (4-tier hierarchy, file-based storage)
- **Usability** (automatic loading, graceful degradation)
- **Collaboration** (git-based sharing, clear ownership)

The system is production-ready and can be extended with advanced features in future phases.

---

**For user documentation, see:** `docs/user-guide/reflection-system.md`  
**For implementation details, see:** `proposals/ai-managed-storage-and-reflection-system-v2.md`
