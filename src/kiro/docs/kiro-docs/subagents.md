# Subagents

Subagents allow Kiro to run multiple tasks in parallel, or delegate specific tasks to subagents that specialize in those tasks. Kiro will automatically launch subagents as appropriate. You can also launch subagents manually by instructing Kiro to do so via a prompt such as "Run subagents to...".

 

Kiro has two built-in subagents: a "context gathering" subagent used to explore a project and gather relevant context, and a "general purpose" subagent used for parallelizing all other tasks.

 

Subagents run in parallel; however, the main Kiro agent will wait until all subagents have completed before proceeding. Each subagent has its own context window, ensuring that the main agent context is not polluted by the subagent's execution. Subagents automatically return their results back to the main agent once they finish.

 

[Steering files](https://kiro.dev/docs/steering/) and [MCP servers](https://kiro.dev/docs/mcp/) work in subagents exactly as they do in the main agent. However, subagents do not have access to [Specs](https://kiro.dev/docs/specs/), and [Hooks](https://kiro.dev/docs/hooks/) will not trigger in subagents.

 

You can significantly speed up development by leveraging subagents to perform multiple tasks simultaneously. In the following example, subagents are used to fetch and analyze several tickets in parallel. Not only is this faster than analyzing the tickets sequentially, the tool call and ticket details stay within each subagent and do not pollute the main agent's context.

## Custom subagents

 

You can define your own custom agent by creating a markdown (.md) file in `~/.kiro/agents` (global) or `<workspace>/.kiro/agents` (workspace scope). Enter the prompt for the custom agent in the body of the markdown file, and define additional attributes as YAML front matter.

 

For example, to create a simple "code reviewer" custom agent, create `~/.kiro/agents/code-reviewer.md` with the following content:

```

---

name: code-reviewer

description: Expert code review assistant.

tools: ["read", "@context7"]

model: claude-sonnet-4

---

You are a senior code reviewer.

## Your Responsibilities

- Review code for correctness, performance, and security

...

```

### Invocation

 

When launching subagents, Kiro will automatically select the appropriate custom agent configuration for each subagent, based on the `description` field. You can also explicitly ask Kiro to use a specific subagent, for example, "Use the code-reviewer subagent to find performance issues in my code". Subagents also appear as slash commands, so you can also use "/code-reviewer find performance issues in my code".

 

### Attributes

 

Below is a list of attributes you can use in the frontmatter. The **name** attribute is mandatory; all others are optional.

| Attribute      | Description                                        | Example value                | Default value, if omitted      |

|----------------|----------------------------------------------------|------------------------------|--------------------------------|

| name           | Name of the agent                                  | code-reviewer                | Name of the .md file           |

| description    | Description of the agent                           | Expert code review assistant | No description                 |

| tools          | List (array) of tools the agent can access         | ["@builtin", "@context7"]    | No tools                       |

| model          | The model to use                                   | claude-sonnet-4              | LLM currently selected in chat |

| includeMcpJson | If true, then all MCP tools are included           | true                         | false                          |

| includePowers  | If true, then all MCP tools in Powers are included | true                         | false                          |

In the **tools** field, you can use the following:

 

- **read**: all built-in file read tools

- **write**: all built-in file write tools

- **shell**: all built-in shell command-related tools

- **web**: all built-in web tools

- **spec**: all built-in spec-related tools (only valid in Spec mode)

- **@builtin**: all built-in tools

- **@<mcp_server>**: all tools from a specific MCP server, e.g., **@figma**

- **@<mcp_server>/<tool>**: a specific tool from a specific MCP server, e.g., **@figma/get_figjam**

Wildcarding is supported, e.g., `tools: ["*"]` to include all built-in and MCP tools, or `tools: ["@figma/*"]` to include all tools from the **figma** MCP server.
