# Interaction Patterns

Understanding the interaction patterns that make kiro-agents accessible, effective, and powerful.

## Overview

kiro-agents uses structured interaction patterns that reduce cognitive load while preserving full AI capability. Originally designed for ADHD-C accessibility, these patterns benefit all users through universal design principles.

**Core Philosophy:** Structure the interaction format without limiting AI capability or user freedom.

**Key Patterns:**
1. **Diff blocks** - Visual progress tracking
2. **Numbered choices** - Pre-structured options
3. **STOP system** - Response length management
4. **Multi-part navigation** - User-controlled pacing
5. **Context references** - Explicit context
6. **Visual formatting** - Scannable structure
7. **Flexibility options** - Freedom within structure

---

## Chit-Chat Protocol

### Three-Part Response Structure

Every response follows this structure:

1. **Diff Block** - Progress tracker
2. **Single Topic** - Current focus (one concept only)
3. **Numbered Choices** - 6-8 options (up to 16 when necessary)

### Example

````markdown
```diff
- ✅ Authentication bug fixed → *password validation corrected*
  👉 Write tests for auth flow
  ⏳ Update documentation
```

**Current Focus:** Writing tests for authentication flow

We need to ensure the password validation fix is properly tested.

**What would you like to do?**

1. **Write unit tests** - Test password validation logic
2. **Write integration tests** - Test complete auth flow
3. **Both unit and integration** - Comprehensive coverage
4. **Review test strategy first** - Discuss approach
5. **Skip tests for now** - Move to documentation
6. **Something else** - Tell me what you need
````

---

## Diff Block Pattern

### Purpose
Persistent visual progress tracking that serves as external working memory.

### Format

````markdown
```diff
- ✅ Completed step → *clarification or result*
  👉 Current step
  ⏳ Upcoming step
  💤 Suspended step
```
````

### Symbols
- `✅` Completed
- `👉` Current focus
- `⏳` Upcoming
- `💤` Suspended

### Rules
1. **Same step text across all diff blocks** - Never rename mid-workflow
2. **Linear progression** - Steps move down as completed
3. **Clarifications in italics** - `→ *clarification*` after completed steps
4. **Track suspended tasks** - Use `💤` for paused work

### Benefits
- External working memory
- Context preservation across interruptions
- Progress visibility
- Reduced cognitive load

---

## Numbered Choice Pattern

### Purpose
Reduce decision fatigue with pre-structured options while maintaining flexibility.

### Format

````markdown
**What would you like to do?**

1. **Action** - Brief description (max 180 characters)
2. **Action** - Brief description
3. **Action** - Brief description
...
````

### Rules
- **6-8 options** (up to 16 when necessary)
- **Bold action, plain description**
- **180 character maximum**
- **Logical ordering** (most likely first)

### Flexibility

Users are NOT limited to numbered choices:

- Type `more` for additional options
- Type `search {keyword}` to filter
- Type `Filter By Keyword: {term}` for specific filtering
- State desires directly in plain language

**Important:** If response matches current suggestions, AI proceeds with that option. KISS principle: use numbered options or be explicit.

### Benefits
- Reduced decision fatigue
- Quick action without prompt writing
- Predictive (AI anticipates needs)
- Flexible (can request more or state directly)

---

## STOP System

### Purpose
Prevent information overload by managing response length.

### How It Works

**Point Counting** (starts after diff block + 3 lines):
- Text: 1 line = 1 point
- Code/Lists: 3 lines = 1 point

**Thresholds:**
- 20 points - Dense technical content
- 15 points - Multi-concept explanations
- 12 points - Abstract/complex topics

**At Threshold:**
1. Continue to natural break
2. Offer navigation options
3. Let user control pace

### Example

````markdown
[Content explaining authentication flow... 18 points]

We've covered the basic flow. Would you like to:

1. **Continue** - Dive into error handling
2. **Recap** - Summarize what we've covered
3. **Skip ahead** - Move to implementation
4. **Ask questions** - Clarify anything
````

### Benefits
- Prevents overwhelm
- User-controlled pacing
- Natural breaks at logical points
- Maintains engagement

---

## Multi-Part Navigation

### Purpose
Break complex explanations into discrete parts with user-controlled navigation.

### Format

````markdown
**Part 1A: [Topic]**

[Content - ONE concept only]

**Navigation:**
1. **Continue to Part 1B** - Next concept
2. **Skip to implementation** - Jump ahead
3. **Ask questions** - Clarify this part
4. **Recap** - Summarize so far
````

### Rules
1. **One concept per part**
2. **Navigation after each part**
3. **Recap after final part**

### Benefits
- User-controlled pacing
- Prevents overwhelm
- Accommodates interruptions
- Flexible navigation

---

## Context Reference Pattern

### Purpose
Provide explicit context without requiring users to scroll back.

### Rules

1. **Use italics for clarification**
   - `*clarification text*`
   - Example: `The validation function *in src/auth/validate.ts*`

2. **Include file paths and line numbers**
   - Example: `src/auth/validate.ts:42-58`

3. **No orphaned references**
   - ❌ "As mentioned earlier..."
   - ✅ "The `validatePassword` function *in src/auth/validate.ts*"

### Example

````markdown
**Bad:**
Now let's implement the function we discussed earlier.

**Good:**
Now let's implement the `validatePassword` function *in src/auth/validate.ts* 
that checks password length and character requirements.
````

### Benefits
- No scrolling back needed
- Reduced cognitive load
- Clear and unambiguous
- Accessible for users with memory limitations

---

## Visual Formatting Pattern

### Purpose
Create scannable structure that reduces reading fatigue.

### Rules

1. **Bold for emphasis** - Key terms, actions, headings
2. **Code blocks for technical content** - Inline or multi-line
3. **Lists for structure** - Bullet points, numbered lists
4. **Whitespace for breathing room** - Short paragraphs (max 5 lines)
5. **Avoid dense text blocks** - No walls of text or code

### Example

````markdown
**Bad (Dense):**
The authentication system uses JWT tokens for session management. When a user logs in, the server validates credentials against the database, generates a JWT token with user ID and expiration time, and returns it to the client. The client stores the token in localStorage and includes it in the Authorization header for subsequent requests.

**Good (Structured):**
**Authentication Flow:**

1. **User Login**
   - Server validates credentials
   - Generates JWT token
   - Returns token to client

2. **Token Storage**
   - Client stores in `localStorage`
   - Includes in `Authorization` header

3. **Token Validation**
   - Server checks signature and expiration
   - Invalid/expired → `401 Unauthorized`
````

### Benefits
- Scannable and quick to find information
- Reduced reading fatigue
- Better comprehension
- Accessible for users with dyslexia

---

## Language Adaptation Pattern

### Purpose
Support bilingual users by adapting navigation language while keeping technical terms in English.

### Rules

1. **Detect user language** from messages
2. **Navigation in user's language** (choices, instructions, questions)
3. **Technical terms in English** (function names, APIs, file paths, code)

### Example

````markdown
**English User:**
What would you like to do?
1. **Create new agent** - Start agent creation wizard
2. **Exit** - Return to normal mode

**Spanish User:**
¿Qué te gustaría hacer?
1. **Crear nuevo agente** - Iniciar asistente de creación
2. **Salir** - Volver al modo normal

**Technical Content (Always English):**
The `validatePassword` function in `src/auth/validate.ts` checks:
- Minimum length (8 characters)
- At least one uppercase letter
````

---

## Flexibility Patterns

### More Options

````markdown
User types: more

AI response:
Here are additional options:
8. **Advanced configuration** - Customize agent behavior
9. **Import from template** - Use existing agent as base
10. **Export agent** - Save agent definition
````

### Search

````markdown
User types: search testing

AI response:
Filtered options (matching "testing"):
1. **Create testing agent** - Specialized for test automation
2. **Add testing capabilities** - Enhance existing agent
3. **Testing workflows** - Configure TDD
````

### Direct Statement

````markdown
User types: I need a testing agent for my React project

AI response:
```diff
  👉 Create testing agent for React project
  ⏳ Configure testing capabilities
```

**Creating React Testing Agent**

I'll create a specialized testing agent with:
- Component testing (React Testing Library)
- E2E testing (Playwright)
- Test coverage analysis

**Would you like to:**
1. **Proceed with creation** - Use these capabilities
2. **Customize capabilities** - Add or remove features
````

---

## Pattern Combinations

### Agent Creation Example

````markdown
```diff
  👉 Select agent creation method
  ⏳ Define agent capabilities
  ⏳ Configure workflows
```

**Agent Creation Methods**

Choose how you'd like to create your agent:

1. **Quick Start** - Predefined templates
2. **Project-Specific** - AI analyzes your codebase
3. **Explore Roles** - Browse domain categories
4. **Guided Wizard** - Step-by-step customization
5. **Natural Language** - Describe what you need

**Need help deciding?**
- Type `more` for additional methods
- Type `search {keyword}` to filter
- Ask questions about any method
````

### Mode Switching Example

````markdown
```diff
  👉 Select new mode
  ⏳ Load mode definition
  ⏳ Preserve context
```

**Mode Selection**

| Mode | Tools | Workflow | Use Case |
|------|-------|----------|----------|
| `vibe` | Kiro | Flexible | Prototyping |
| `spec` | Kiro | Structured | Production |
| `as-vibe` | Current | Flexible | Agent + vibe |
| `as-spec` | Current | Structured | Agent + spec |

**Which mode?**
1. **Vibe mode** - Flexible development
2. **Spec mode** - Structured development
3. **As-Vibe mode** - Keep tools, vibe workflow
4. **As-Spec mode** - Keep tools, spec workflow
````

---

## Design Rationale

### Why These Patterns Work

1. **Cognitive Load Reduction** - Structured presentation reduces extraneous load
2. **Universal Design** - Originally for ADHD-C, benefits all users
3. **Flexibility Within Structure** - Suggestions, not constraints
4. **Context Preservation** - Diff blocks survive interruptions
5. **User Control** - Choose depth, pace, and navigation

### Evidence from Real-World Usage

Users consistently report:
- Reduced cognitive fatigue in long sessions
- Faster decision-making with numbered choices
- Better context retention with diff blocks
- Appreciation for flexibility within structure
- Surprise that structure doesn't limit capability

**Why:** Patterns reduce cognitive load without limiting AI power or user freedom.

---

## Conclusion

kiro-agents interaction patterns demonstrate that structure and flexibility are not opposites. By carefully designing the presentation format while preserving full AI capability, we create an experience that is:

- **Accessible** - Works for diverse cognitive styles
- **Efficient** - Reduces decision fatigue and cognitive load
- **Powerful** - Full AI capability always available
- **Flexible** - Users control depth, pace, and navigation
- **Clear** - Explicit context, visual structure, progress tracking

**Key Takeaway:** Structure the interaction format without limiting capability or freedom.

---

**See Also:**
- [Protocol System Design](protocol-system.md) - Why layered protocols work
- [Neurodivergent Accessibility](neurodivergent-accessibility.md) - ADHD-C design principles
- [Creating All-Powerful Agents](../user-guide/creating-powerful-agents.md) - Practical guide

**Document version:** 1.0.0  
**Last updated:** December 20, 2025  
**Maintained by:** kiro-agents project
