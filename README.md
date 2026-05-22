# Discord AI Bug Triage Bot

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6.svg)](https://www.typescriptlang.org/)
[![Merge Unified API](https://img.shields.io/badge/Powered%20by-Merge%20Unified%20API-7c3aed.svg)](https://merge.dev)

> An event-driven Developer Experience (DX) agent that automatically monitors **Discord** channels for software bug reports, extracts structured issue metadata using **generative AI**, and channels them directly into your engineering backlog via a unified API layer made with **[Merge's Unified API](https://www.merge.dev/)**.

## Why this Exists

Community channels are where bugs surface first but they're also where they die in the noise. This agent bridges the gap between developer community spaces and internal engineering workflows, turning unstructured Discord messages into clean, actionable GitHub issues without any manual lift.
It's a practical demonstration of a problem that DevRel teams feel daily: the friction between community feedback and the tools engineers actually use. Merge's Unified API makes the integration layer trivial, so the focus stays on the developer experience.

## What It Does

1. Ingests messages from a monitored Discord channel, filtering for bug-relevant content
2. Triages each message using Gemini's structured output, determining legitimacy, assigning urgency, and generating a concise technical summary
3. Syncs the structured issue with Discord tracking links directly to GitHub (or any connected ticketing system) via Merge's Unified Ticketing API

### Community View:

![Screenshot](/assets/bot-demo.png)

### Engineering View:

![Screenshot](/assets/issue-demo.png)

---

## Tech Stack

| Category              | Technology                                                  |
| :-------------------- | :---------------------------------------------------------- |
| Core Engine / Runtime | Node.js, TypeScript (`tsx`)                                 |
| Generative AI Layer   | Google Gen AI SDK (`gemini-2.5-flash`)                      |
| Integrations Pipeline | Merge Unified Ticketing API (`@mergeapi/merge-node-client`) |
| Gateway Listener      | Discord.js (v14)                                            |

![MermaidDiagram](/assets/dx-data-flow.png)

---

## Getting Started

### Prerequisites

Ensure you have the following configuration tools and access points active:

- **[Node.js](https://nodejs.org/)** (v18.0 or higher recommended)
- A **[Google AI Studio API Key](https://aistudio.google.com/)** for the Gemini triage layer [can also be your LLM of choice]
- A **[Merge Developer Account](https://app.merge.dev/)** with an authenticated Production Linked Account matching your target GitHub repo
- A **[Discord Application Token](https://discord.com/developers/applications)** with `MessageContent` and `GuildMessages` gateway intents enabled

### 1. Install Dependencies

```bash
npm install discord.js @mergeapi/merge-node-client @google/genai dotenv
npm install -D typescript tsx @types/node
```

### 2. Configure Environment

Create a `.env` file in the project root:

```bash
# Discord Connection Config
DISCORD_TOKEN=your_discord_bot_application_token
TARGET_CHANNEL_ID=your_monitored_discord_channel_snowflake_id

# Generative AI Credentials
GEMINI_API_KEY=your_google_ai_studio_api_key
#OPENAI_API_KEY=your_open_ai_studio_api_key

# Merge Platform Unified Sync Keys
MERGE_API_KEY=your_global_merge_dashboard_api_key
MERGE_ACCOUNT_TOKEN=your_production_linked_account_token
TARGET_COLLECTION_ID=your_github_repository_collection_id
```

> **Note**: MERGE_ACCOUNT_TOKEN is the per-integration token for your authenticated Linked Account, separate from your global Merge API key. Find it in your Merge dashboard under Linked Accounts.

### 3. Run the Agent

```bash
npx tsx src/index.ts
```

The agent will authenticate, connect to your Discord gateway, and begin triage loops immediately.

---

## How the Merge Integration Works

This project uses [Merge's Unified Ticketing API](https://docs.merge.dev/merge-unified/ticketing/overview) to decouple the agent from any specific issue tracker. By authenticating one Linked Account in the Merge dashboard, the same agent code works against GitHub Issues, Jira, Linear, or any other supported ticketing system — with no changes to the integration logic.
The key endpoint used is `POST /ticketing/v1/tickets`, which accepts a normalized issue schema regardless of the underlying platform.
This pattern is directly applicable to AI agent tooling: rather than building and maintaining N integrations for N ticketing tools, a single Merge integration gives the agent access to all of them through one API surface.

## Extending this Agent

Some directions worth exploring:

- **Swap the AI layer:** The triage module is isolated — drop in OpenAI or Anthropic instead of Gemini with minimal changes (an OPENAI_API_KEY env var is already stubbed in)
- **Add more Merge categories:** Merge supports CRM, HRIS, file storage, and more — the same pattern extends to syncing feedback to Salesforce or Notion
- **Add a severity routing layer:** Route P0 bugs to a dedicated Slack channel or PagerDuty alert using a second integration
- **Bring to production:** Wrap the agent in a lightweight Express server for health checks and deploy to Railway or Fly.io

## Contributing

Ideas, refinements to the triage prompts, or new integration targets are welcome.

1. **Fork** the repo

2. **Create** a Feature Branch (`git checkout -b feature/NewFeature`)

3. **Commit** your Changes (`git commit -m 'Add your feature`)

4. **Push** to the Branch and open a pull request (`git push origin feature/NewFeature`)

Have questions or want to discuss the integration patterns? Reach out on [X](https://x.com/Audrey_Iterates) or [LinkedIn](https://www.linkedin.com/in/akendr/).

---

Built by [Audrey](https://audrkendr.com/) as a demonstration of Merge's integration patterns.
