## Context management

Kiro's power comes from its deep understanding of your codebase context. It automatically analyzes open files in the editor, including their dependencies and structure, but you can also explicitly provide additional context.
Context providers

Use the # symbol in the chat input to access context providers:

| Provider | Description | Example |
| --- | --- | --- |
| `#codebase` | Allow Kiro to automatically find relevant files across your project | `#codebase explain the authentication flow` |
| `#file` | Reference specific files in your codebase | `#auth.ts explain this implementation` |
| `#folder` | Reference a specific folder and its contents | `#components/ what components do we have?` |
| `#git diff` | Reference the current Git changes | `#git diff explain what changed in this PR` |
| `#terminal` | Include recent output from your active terminal and command history | `#terminal help me fix this build error` |
| `#problems` | Include all problems in the current file | `#problems help me resolve these issues` |
| `#url` | Include web documentation | `#url:https://docs.example.com/api explain this API` |
| `#code` | Include specific code snippets in the context | `#code:const sum = (a, b) => a + b; explain this function` |
| `#repository` | Include a map of your repository structure | `#repository how is this project organized?` |
| `#current` | Reference the currently active file in the editor | `#current explain this component` |
| `#steering` | Include specific steering files for guidance | `#steering:coding-standards.md review my code` |
| `#docs` | Reference documentation files and content | `#docs:api-reference.md explain this API endpoint` |
| `#spec` | Reference all files from a specific spec (requirements, design, tasks) | `#spec:user-authentication update the design file to include password reset flow` |
| `#mcp` | Access Model Context Protocol tools and services | `#mcp:aws-docs how do I configure S3 buckets?` |

You can combine multiple context providers in a single request:

```
#codebase #auth.ts explain how authentication works with our database
```

### Tip

The #terminal context provider is particularly powerful for debugging and troubleshooting. When you include #terminal in your message, Kiro can access your recent command history, outputs, and error messages to provide targeted assistance.

Common scenarios:

    Build failures: #terminal My build is failing, what's the issue?
    Test debugging: #terminal These tests aren't passing, help me understand why
    Git issues: #terminal I'm stuck on this merge conflict
    Dependency problems: #terminal npm install is throwing errors

Kiro can analyze the actual terminal output, understand error patterns, and suggest specific solutions based on what happened in your terminal session. For detailed examples and best practices, see the Terminal Integration guide.
