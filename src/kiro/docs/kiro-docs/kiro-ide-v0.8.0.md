# Kiro IDE v0.8.0 Changelog

**Release Date**: December 18, 2025

This release introduces web tools for searching and fetching content from the internet, enhanced hooks with new action types, subagents for parallel task execution, and improved supervised mode with per-file review capabilities.

---

## Web Tools

Kiro can now search the web and fetch content from URLs directly in chat. Use web tools to look up current documentation, find the latest library versions, or research solutions to technical problems. This keeps your development workflow in one place without switching to a browser.

**Key Capabilities**:
- Search the web from within chat
- Fetch content from URLs directly
- Look up current documentation
- Find latest library versions
- Research technical solutions
- Stay in your development workflow without context switching

**Use Cases**:
- Checking latest package versions before updating dependencies
- Looking up API documentation for unfamiliar libraries
- Researching error messages and stack traces
- Finding code examples and best practices
- Verifying compatibility information

---

## Contextual Hooks

Introducing contextual hooks with two new triggers: **Prompt Submit** and **Agent Stop**. These hooks fire at key moments in the agent workflow, letting you inject context or run commands before the agent acts.

### New Hook Triggers

**Prompt Submit**:
- Fires when you submit a prompt to the agent
- Executes before the agent begins processing
- Allows pre-processing and context injection

**Agent Stop**:
- Fires when the agent completes its task
- Executes after agent finishes execution
- Enables post-processing and cleanup tasks

### Hook Actions

**Agent Prompt Action**:
- Instruct the agent with natural language
- Inject additional context dynamically
- Modify agent behavior based on conditions
- Does not consume credits

**Shell Command Action**:
- Run commands locally on your machine
- Execute scripts and automation
- Integrate with external tools
- Does not consume credits

**Benefits**:
- Automate repetitive workflows
- Inject project-specific context automatically
- Run validation checks before/after agent execution
- Integrate with CI/CD pipelines
- Customize agent behavior per project

---

## Subagents

Introducing subagents for parallel task execution. Kiro can now run multiple tasks simultaneously or delegate to specialized subagents. Two built-in subagents are available: a **context gatherer** for exploring projects and a **general-purpose agent** for parallelizing tasks.

### Architecture

**Isolated Context Windows**:
- Each subagent has its own context window
- Main agent context stays clean and focused
- No context pollution between tasks
- Better token efficiency

**Parallel Execution**:
- Run multiple tasks simultaneously
- Delegate complex subtasks to specialized agents
- Continue working while subagents execute
- Faster overall task completion

### Built-in Subagents

**Context Gatherer**:
- Specialized for exploring projects
- Identifies relevant files for tasks
- Maps component interactions
- Analyzes codebase structure
- Provides focused context for problem-solving

**General-Purpose Agent**:
- Handles arbitrary tasks
- Parallelizes independent work streams
- Executes well-defined subtasks
- Full tool access in isolated context

### Use Cases

**Parallel Investigation**:
- Investigate multiple data sources simultaneously
- Analyze GitHub issues across repositories
- Research multiple approaches in parallel
- Compare different implementation strategies

**Context Window Extension**:
- Extend effective context limits without summarization
- Offload exploration tasks to subagents
- Keep main agent focused on primary task
- Reduce cognitive load

**Codebase Exploration**:
- Understand unfamiliar codebases quickly
- Map dependencies and relationships
- Identify relevant files for bug fixes
- Analyze component interactions before changes

**Complex Task Delegation**:
- Break down large tasks into subtasks
- Delegate subtasks to specialized subagents
- Coordinate results from multiple agents
- Maintain focus on high-level orchestration

### Best Practices

- Use context-gatherer for codebase exploration before making changes
- Use general-purpose agent for well-defined, independent subtasks
- Invoke subagents proactively based on task type
- Trust subagent output to avoid redundant work
- Use once per query at the beginning for exploration tasks

### Availability

**Important**: Subagents are only available in **Autopilot mode**.

---

## Enhanced Supervised Mode

Supervised mode now offers granular control over code changes with per-file review capabilities. When Kiro makes changes to multiple files, you can review each file individually and selectively accept or reject changes.

### Per-File Review

**Granular Control**:
- Review each modified file individually
- See exactly what changed in each file
- Accept or reject changes on a per-file basis
- Full visibility into every modification

**Turn-Based Workflow**:
- Agent proposes changes
- You review each file
- Accept or reject individually
- Agent continues based on your decisions

**Session Compatibility**:
- Works in vibe chat sessions
- Works in spec chat sessions
- Consistent experience across interaction modes
- Maintains workflow state between reviews

### Benefits

**Increased Confidence**:
- Review changes before they're applied
- Catch unintended modifications
- Maintain control over your codebase
- Learn from agent's approach

**Selective Adoption**:
- Accept good changes, reject problematic ones
- Iterate on specific files without losing progress
- Provide targeted feedback to the agent
- Refine changes incrementally

**Better Collaboration**:
- Clear visibility into agent's reasoning
- Understand the scope of changes
- Make informed decisions about modifications
- Maintain code quality standards

---

## Summary

Kiro IDE v0.8.0 significantly enhances developer productivity with four major feature areas:

1. **Web Tools** - Access current information without leaving the IDE
2. **Contextual Hooks** - Automate workflows at key moments in agent execution
3. **Subagents** - Parallelize tasks and extend context limits with specialized agents
4. **Enhanced Supervised Mode** - Granular per-file review for better control

These features work together to create a more powerful, flexible, and controllable AI-assisted development experience.

---

## Improvements

### Terminal
**Improved git pager handling** - Prevents terminal hangs when using git commands with pager output. Git operations now execute smoothly without blocking the terminal.

### Enterprise Authentication
**Smoother sign-in with cached enterprise auth** - Enterprise users experience faster authentication by caching the `startURL`. Reduces sign-in friction for teams using AWS IAM Identity Center.

### .kiroignore Support
**Exclude specific files from agent access** - New `.kiroignore` file support using gitignore syntax. Create `.kiroignore` in your project root with patterns for files to skip, then add it to the `agentIgnoreFiles` setting. Gives you fine-grained control over what the agent can access.

**Use Cases**:
- Exclude sensitive configuration files
- Skip large generated files
- Prevent agent from accessing test fixtures
- Hide internal documentation from agent context

### Context Usage Indicator
**See context window usage percentage** - New visual indicator in the chat panel shows what percentage of the model's context window is currently being used. Helps you understand when you're approaching context limits.

### Copy Message Button
**Copy agent responses with a single click** - New copy button on agent messages makes it easy to copy responses to your clipboard. No more manual text selection.

### Model Dropdown
**Press Escape to dismiss** - Improved keyboard navigation for the model selection dropdown. Press Escape to quickly close the dropdown without making a selection.

### Spec Rename
**Rename specifications directly from the Kiro panel** - Rename your spec files without leaving the Kiro interface. Streamlines spec management workflow.

---

## Bug Fixes

### Markdown Tables
**Fixed rendering of tables in chat messages** - Markdown tables now render correctly in chat. Previously, table formatting could break or display incorrectly.

### Chat Fonts
**Fixed inconsistent font styling** - Resolved font inconsistencies in chat messages. Text now displays with consistent styling throughout conversations.

### Context Provider
**Fixed context provider and right-aligned dropdown positioning** - Corrected positioning issues with context provider UI and right-aligned dropdowns. Elements now appear in the correct location.

### Hook Cancellation
**Fixed issue where hook commands couldn't be cancelled** - Hook commands can now be properly cancelled during execution. Previously, some hook commands would continue running even after cancellation attempts.

### Powers Panel
**Fixed UI bugs for Kiro Powers panel** - Resolved various UI issues in the Powers panel, improving stability and visual consistency.

### Enterprise Profiles
**Fixed profile switching for subscribed profiles** - Enterprise users can now switch between subscribed profiles without issues. Previously, profile switching could fail or behave unexpectedly.

---

## Version Information

**Version**: 0.8.0  
**Release Date**: December 18, 2025  
**Release Type**: Major Feature Release

---

**Source**: [Kiro IDE Changelog](https://kiro.dev/changelog/)  
**Content Compliance**: Information paraphrased from official sources to comply with licensing restrictions.
