# Best practices

<!--$-->

## How do I import existing requirements?[](#how-do-i-import-existing-requirements)

If your requirements or designs already exist in another system (such as JIRA, Confluence, or Word documents), you have two options:

1. __Using MCP integration__: If your requirements tool has an [MCP server](/docs/mcp), you can connect directly to import requirements into your spec session. Kiro supports both local and remote MCP servers.

2. __Manual import__: Simply copy your existing requirements (e.g. `foo-prfaq.md`) into a new file in your repo and open a spec chat session and say `#foo-prfaq.md Generate a spec from it`. Kiro will read your requirements, and generate requirement and design specs.

## How do I iterate on my specs?[](#how-do-i-iterate-on-my-specs)

Kiro's specifications are designed for continuous refinement, allowing you to update and enhance them as your project evolves. This iterative approach ensures that specifications remain synchronized with changing requirements and technical designs, providing a reliable foundation for development.

1. __Update Requirements__: Either modify the `requirements.md` file directly or initiate a spec session and instruct Kiro to add new requirements or design elements.

2. __Update Design__: Navigate to the `design.md` file for your spec and select __Refine__. This action will update both the design documentation and the associated task list to reflect your modified requirements.

3. __Update tasks__: Navigate to the `tasks.md` file and choose __Update tasks__. This will create new tasks that map to the new requirements.

## How do I share specs with my team?[](#how-do-i-share-specs-with-my-team)

Specs are designed to be version-controlled, making them easily shareable across your team. Store specs directly in your project repository alongside the code they describe. This keeps all project artifacts together and maintains the connection between requirements and implementation.

## Can I share specs across multiple teams?[](#can-i-share-specs-across-multiple-teams)

Yes, you can share specs across multiple teams by leveraging Git submodules or package references. Here are some best practices for managing shared specs across teams:

1. __Create a central specs repository__ - Establish a dedicated repository for shared specifications that multiple projects can reference.

2. __Use Git submodules or package references__ - Link your central specs to individual projects using Git submodules, package references, or symbolic links depending on your development environment.

3. __Implement cross-repository workflows__ - Develop processes for proposing, reviewing, and updating shared specs that affect multiple projects.

If you have specific needs for cross-project spec management, please share your requirements on our [GitHub issue tracker](https://github.com/kirodotdev) so we can prioritize features that support your workflow.

## Can I start a spec session from a vibe session?[](#can-i-start-a-spec-session-from-a-vibe-session)

Yes. You can have a vibe conversation and then say `Generate spec`. Kiro will then ask you if you want to start a spec session. If you say yes, it will proceed with generating requirements based on the context of your vibe session.

## Can I execute all the tasks in my spec in a single shot?[](#can-i-execute-all-the-tasks-in-my-spec-in-a-single-shot)

Yes, you can execute all the tasks in your `tasks.md` file by clicking the "Run all tasks" button. Note: this will only run incomplete tasks that are marked as required.

## What if some tasks are already implemented?[](#what-if-some-tasks-are-already-implemented)

When working on an existing codebase, you might find that some tasks in your spec are already complete because a coworker or you ended up doing it in another session. Here are two ways to handle this:

__Option 1: Click on Update tasks in your tasks.md__

* Open your `tasks.md` file
* Click __Update tasks__
* Kiro will automatically mark completed tasks.

__Option 2: Let Kiro scan for you in a spec chat session__

* In a spec session, ask Kiro: "Check which tasks are already complete"
* Kiro will analyze your codebase and identify implemented functionality
* Kiro will automatically mark completed tasks

This keeps your task spec accurate.

## How do I reference a spec in chat?[](#how-do-i-reference-a-spec-in-chat)

You can reference any spec from your specs list in chat conversations using the `#spec` context provider. Type `#spec` and press Enter to see a list of available specs, then select the one you want to include. Kiro automatically includes all spec files (requirements.md, design.md, and tasks.md) in the conversation context to ensure responses align with your documented specifications.

## When should I use #spec in chat?[](#when-should-i-use-spec-in-chat)

Using `#spec` is particularly helpful when you need context-aware assistance:

* __Implementing tasks__ - Generate code that aligns with your design decisions and meets acceptance criteria
* __Refining specs__ - Request changes to requirements, design, or tasks based on new insights
* __Validating work__ - Check if your implementation matches the spec's requirements
* __Asking questions__ - Get answers about your feature's architecture or design

__Examples:__

```
#spec:user-authentication implement task 2.3
#spec:user-authentication update the design file to include password reset flow
#spec:user-authentication does my current implementation meet the acceptance criteria for task 7.1?
#spec:user-authentication why did we choose JWT over session-based authentication?
```

## How many specs can I have in a single repo?[](#how-many-specs-can-i-have-in-a-single-repo)

You can have as many specs as you want in a single repo. We recommend creating multiple specs for different features for your project rather than attempting to just have a single one for your entire codebase.

For example, in an e-commerce application, you might organize your specs like this:

```
.kiro/specs/
├── user-authentication/       # Login, signup, password reset
├── product-catalog/           # Product listing, search, filtering
├── shopping-cart/             # Add to cart, quantity updates, checkout
├── payment-processing/        # Payment gateway integration, order confirmation
└── admin-dashboard/           # Product management, user analytics
```

This approach allows you to:

* Work on features independently without conflicts
* Maintain focused, manageable spec documents
* Iterate on specific functionality without affecting other areas
* Collaborate with team members on different features simultaneously

Page updated: January 14, 2026