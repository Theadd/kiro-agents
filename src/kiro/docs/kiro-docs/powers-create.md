Create powers

Developers can use our curated powers from launch partners like Datadog, Figma, Neon, Netlify, Postman, Supabase, and Stripe—or build and share their own powers for any tool or framework. Community members have also created powers for building SaaS applications, managing AWS CDK infrastructure, and developing with Amazon Aurora DSQL.

Powers package your tools, workflows, and best practices into a format that Kiro can activate on-demand. When you mention relevant keywords, Kiro loads the power's context and tools automatically.

View our curated powers at github.com/kirodotdev/powers
What you need

Every power needs a POWER.md file. Optionally, you can add:

    mcp.json - MCP server configuration for tool integrations
    steering/ - Workflow-specific guidance files

Creating POWER.md

Your POWER.md file has two parts: frontmatter and instructions for the agent. We recommend structuring the instructions as onboarding steps (e.g., install CLI, hooks) and steering instructions that contain workflows and best practices. If your power is complex enough, you can separate it into multiple steering files.
Frontmatter: When to activate

The frontmatter tells Kiro when to load your power. Use keywords that match how developers talk about your tool.
markdown

---
name: "supabase"
displayName: "Supabase with local CLI"
description: "Build fullstack applications with Supabase's Postgres database, authentication, storage, and real-time subscriptions"
keywords: ["database", "postgres", "auth", "storage", "realtime", "backend", "supabase", "rls"]
---

When someone says "Let's set up the database," Kiro sees "database" in the keywords and activates the Supabase power. The power's MCP tools and documentation load into context automatically.
Onboarding instructions

The onboarding section runs when someone first uses your power. Use it to validate dependencies, explain setup steps, or create workspace hooks.
markdown

# Onboarding

## Step 1: Validate tools work
Before using Supabase Local MCP, ensure the following are installed and running:
- **Docker Desktop**: Supabase CLI requires Docker to run the local development stack
  - Verify with: `docker --version`
  - **CRITICAL**: If Docker is not installed or not running, DO NOT proceed with Supabase setup.
- **Supabase CLI**: Install via npm, Homebrew, or other package managers
  - Verify with: `supabase --version`

## Step 2: Add hooks
Add a hook to `.kiro/hooks/review-advisors.kiro.hook`

\`\`\`json
{
  "enabled": true,
  "name": "Review Database Performance & Security",
  "description": "Verify database follows performance/security best practices",
  "version": "1",
  "when": {
    "type": "userTriggered"
  },
  "then": {
    "type": "askAgent",
    "prompt": "Execute `get_advisors` via MCP to check for performance and security concerns"
  }
}
\`\`\`

Kiro follows these instructions automatically: checks if Docker is running, validates the CLI installation, and creates the performance review hook in the workspace.
Steering instructions

Steering files are optional. For simple powers, include all guidance directly in your POWER.md. For complex tools with many workflows, split guidance into separate steering files.

Simple approach (no separate steering files):

Include all your guidance directly in POWER.md after the onboarding section:
markdown

# Best Practices

## Database Schema Design
- Use UUIDs for primary keys
- Always add timestamps (created_at, updated_at)
- Enable RLS on all tables with user data

## Example: Creating a table
\`\`\`sql
create table profiles (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  created_at timestamptz default now()
);
\`\`\`

Advanced approach (multiple steering files):

For tools with many distinct workflows, map each workflow to a specific steering file:
markdown

# When to Load Steering Files
- Setting up a database → `database-setup-workflow.md`
- Writing or formatting SQL code → `supabase-code-format-sql.md`
- Creating or modifying RLS policies → `supabase-database-rls-policies.md`
- Creating PostgreSQL functions → `supabase-database-functions.md`
- Working with declarative schema (`supabase/schemas/` directory) → `supabase-declarative-database-schema.md`
- Setting up or modifying Next.js authentication with Supabase SSR → `supabase-nextjs-supabase-auth.md`
- Implementing realtime features (broadcast, presence, channels, subscriptions) → `supabase-use-realtime.md`

When you're working on RLS policies, Kiro loads supabase-database-rls-policies.md. When you switch to authentication, it loads supabase-nextjs-supabase-auth.md instead. This prevents overwhelming context with every pattern upfront.
Adding MCP servers

If your power uses MCP tools, create an mcp.json file. Server names must match the mcpServers list in your POWER.md frontmatter.
json

{
  "mcpServers": {
    "supabase-local": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server-supabase"],
      "env": {
        "SUPABASE_URL": "${SUPABASE_URL}",
        "SUPABASE_ANON_KEY": "${SUPABASE_ANON_KEY}"
      }
    }
  }
}

Use environment variables for API keys and secrets. During installation, Kiro automatically namespaces server names to avoid conflicts (e.g., supabase-local becomes power-supabase-supabase-local).
Directory structure

Here's what a complete power looks like:

power-supabase/
├── POWER.md                              # Metadata, onboarding, steering mappings
├── mcp.json                              # MCP server configuration
└── steering/                             # Workflow-specific guidance
    ├── database-setup-workflow.md
    ├── supabase-code-format-sql.md
    ├── supabase-database-rls-policies.md
    └── supabase-edge-functions.md

Testing locally

    Create your power directory with the files above

    Open Kiro → Powers panel → Add power from Local Path

    Select your power directory

    Test activation by using keywords from your power in a conversation

Sharing your power

Push your power to a public GitHub repository:
bash

git init
git add POWER.md mcp.json steering/
git commit -m "Initial release"
git push origin main

Important: Make sure your repository is public if you want to share it broadly. Private repositories require users to have access permissions.

Others can install it via Add power from GitHub using your repository URL.
Examples

Simple power (no steering files):

power-simple-tool/
├── POWER.md          # All guidance included here
└── mcp.json          # Optional MCP configuration

Single-tool power with steering:

power-prisma/
├── POWER.md
├── mcp.json
└── steering/
    └── schema-patterns.md

Multi-tool power:

power-full-stack/
├── POWER.md
├── mcp.json
└── steering/
    ├── database-setup.md
    ├── deployment.md
    └── api-integration.md

Documentation-only power:

power-react-patterns/
├── POWER.md          # No MCP servers needed
└── steering/
    ├── component-patterns.md
    └── hooks-patterns.md
