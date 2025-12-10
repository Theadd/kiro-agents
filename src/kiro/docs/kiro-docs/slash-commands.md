# Slash commands

Slash commands let you run [hooks](https://kiro.dev/docs/hooks) and pull in [steering files](https://kiro.dev/docs/steering) on demand, directly from the chat. Type `/` in the chat input to see available commands and execute them instantly.
 
## Command types[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#command-types)

## https://kiro.dev/docs/chat/slash-commands/#command-types
 
### Hooks[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#hooks)

### https://kiro.dev/docs/chat/slash-commands/#hooks
 
[Hooks](https://kiro.dev/docs/hooks) with manual triggers appear in the slash command menu. When you select a hook, Kiro executes it immediately in your current session. Here are some examples of hooks you might create:

| Command | Description |
| --- | --- |
| `/sync-source-to-docs` | Syncs source file changes to documentation |
| `/run-tests` | Executes your configured test suite |
| `/generate-changelog` | Creates changelog from recent commits |

### Steering files[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#steering-files)

### https://kiro.dev/docs/chat/slash-commands/#steering-files
 
[Steering files](https://kiro.dev/docs/steering) configured with [manual inclusion](https://kiro.dev/docs/steering#manual-inclusion) appear as slash commands. Unlike always-on steering that's automatically included in every conversation, manual steering files let you pull in specific guidance only when you need it. When selected, the file's contents are added to your current conversation context. Here are some examples:

| Command | Description |
| --- | --- |
| `/accessibility` | Accessibility guidelines for UI components |
| `/code-review` | Code review checklist and feedback principles |
| `/performance` | React and Next.js performance optimization tips |
| `/refactor` | Refactoring rules and common patterns |
| `/testing` | Testing standards and Jest/RTL conventions |

## How it works[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#how-it-works)

## https://kiro.dev/docs/chat/slash-commands/#how-it-works
 
### Adding hooks[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#adding-hooks)

### https://kiro.dev/docs/chat/slash-commands/#adding-hooks
 
To add a hook as a slash command, set its trigger type to **Manual**. See [Hook types](https://kiro.dev/docs/hooks/types) for details.
 
### Adding steering files[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#adding-steering-files)

### https://kiro.dev/docs/chat/slash-commands/#adding-steering-files
 
To add a steering file as a slash command, set `inclusion: manual` in the frontmatter. See [Steering](https://kiro.dev/docs/steering#manual-inclusion) for configuration options.
 
### Using slash commands[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#using-slash-commands)

### https://kiro.dev/docs/chat/slash-commands/#using-slash-commands
 
1. Type `/` in the chat input field
2. Browse or search the available commands
3. Select a command and press Enter

 <video autoplay="autoplay" loop="" playsinline="" class="mt-6 w-full rounded-lg" src="https://kiro.dev/videos/slash-commands.mp4?h=3ff76010"></video> 
## Best practices[<svg class="anchor-icon" viewbox="0 0 16 17" width="16" height="17" fill="#C6A0FF"></svg>](https://kiro.dev/docs/chat/slash-commands/#best-practices)

## https://kiro.dev/docs/chat/slash-commands/#best-practices

- **Use descriptive names** — Clear names like `/run-e2e-tests` or `/accessibility` make commands easy to find
- **Context switching** — Create [steering files](https://kiro.dev/docs/steering) for different workflows (frontend, backend, testing) and switch between them as needed
- **Combine with `#` providers** — Slash commands work alongside [context providers](https://kiro.dev/docs/chat#context-management) for maximum control
