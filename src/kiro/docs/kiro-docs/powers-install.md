Install powers

Powers are designed for easy discovery and installation, whether you're using curated partners, community-built powers, or your team's private tooling. Discovery, installation, and configuration happen through the IDE or the kiro.dev website.

⚠️ Note: Kiro powers are third-party tools that may be subject to separate terms. Only install servers from trusted sources and review their documentation and licensing. Kiro is not responsible for third-party powers.
Install curated powers

Browse powers from launch partners including Datadog, Dynatrace, Figma, Neon, Netlify, Postman, Supabase, Stripe, Strands SDK, and AWS Aurora.
From kiro.dev

    Browse powers at kiro.dev/powers
    Select a power and click Install
    The Kiro IDE will open, allowing you to complete the installation with one click

From the IDE

    Open the powers panel → click on the Ghosty icon with the lightning bolt 👻⚡
    Choose a power to view details
    Choose Install → Confirm

You can now Try the power to run through the power onboarding. Any time you ask a question related to that power, the Kiro agent will automatically activate and use it.
Powers with MCPs

When you install a power that includes Model Context Protocol (MCP) integrations, Kiro automatically registers the MCP server in your ~/.kiro/settings/mcp.json configuration file under the Powers section.
Install custom powers

Custom powers require at minimum:

    POWER.md - Metadata and documentation
    mcp.json - MCP server configuration (if using MCP tools)
    steering/ - Workflow-specific guidance files (optional but recommended)

From public GitHub URL

    Powers panel → Add power from GitHub
    Enter repository URL: https://github.com/user/power-repo
    Click Install

The power must have a valid POWER.md file in the repository root.
From local path

For powers you create or manage in private repositories, clone the repository locally and install from the local path.

    Powers panel → Add power from Local Path
    Select power directory containing POWER.md
    Click Install

Example structure:

my-custom-power/
├── POWER.md              # Required
├── mcp.json              # If using MCP servers
└── steering/             # Optional guidance files
    └── workflow.md

Update powers

To update a power to the latest version:

    Powers panel → power → Check for updates
    Review changes
    Click Update

The power refreshes from the remote repository and applies the latest version.
