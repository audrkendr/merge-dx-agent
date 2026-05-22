# Discord AI Bug Triage Bot

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://semver.org)

## Project Overview

> An event-driven Developer Experience (DX) agent that automatically monitors **Discord** channels for software bug reports, extracts structured issue metadata using **generative AI**, and channels them directly into your engineering backlog via a unified API layer made with **Merge's Unified Integration Pipe**.

Built to bridge the gap between community-facing channels and internal developer tools, this bot ensures community feedback is instantly documented without manual intervention.

### Customer View:

![Screenshot](/assets/bot-demo.png)

### Dev View:

![Screenshot](/assets/issue-demo.png)

---

## Tech Stack

| Category              | Technology                                                  |
| :-------------------- | :---------------------------------------------------------- |
| Core Engine / Runtime | Node.js, TypeScript (`tsx`)                                 |
| Generative AI Layer   | Google Gen AI SDK (`gemini-2.5-flash`)                      |
| Integrations Pipeline | Merge Unified Ticketing API (`@mergeapi/merge-node-client`) |
| Gateway Listener      | Discord.js (v14)                                            |

### Pipeline Architecture

1. **Ingest:** Filters inbound community messages matching a targeted channel ID, isolating bug data from general chatting.
2. **Triage:** Uses Gemini's structured JSON schemas to parse raw text, determining if the context is a legitimate bug, assigning urgency, and generating concise technical summaries.
3. **Sync:** Gives the metadata with explicit Discord tracking URLs and pushes the schema to the target GitHub repository or ticketing board via Merge's platform.

---

## Getting Started

### Prerequisites

Ensure you have the following configuration tools and access points active:

- **[Node.js](https://nodejs.org/)** (v18.0 or higher recommended)
- A **[Google AI Studio API Key](https://aistudio.google.com/)**
- A **[Merge Developer Account](https://app.merge.dev/)** with an authenticated Production Linked Account matching your target GitHub repo.
- A **[Discord Application Token](https://discord.com/developers/applications)** with `MessageContent` and `GuildMessages` gateway intents enabled.

---

## Installation and Setup

Follow these steps to configure your environment keys and start the live sync daemon locally.

### 1. Dependency Installation

Navigate to your workspace root directory and install the required core SDK blocks:

```bash
npm install discord.js @mergeapi/merge-node-client @google/genai dotenv
npm install -D typescript tsx @types/node
```

## 2. Environment Configurations

Create a .env file in your root folder and supply your explicit platform secrets:

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

## 3. Running the Sync Daemon

Boot up the live background worker:

```bash
npx tsx src/index.ts
```

The bot will authenticate, sync with your Discord channel gateway, and begin running triage loops instantly.

---

## Contributing and Community

Whether you want to refine the system prompting structures, add fallback timeout networks, or adjust the embed styles, your contributions are welcome!

1. **Fork** the Project (▶️ Fork)

2. **Create** your Feature Branch (`git checkout -b feature/NewFeature`)

3. **Commit** your Changes (`git commit -m 'Add some NewFeature`)

4. **Push** to the Branch (`git push origin feature/NewFeature`)

5. **Open** a Pull Request

Have ideas on how to make this tool better for developers? Open an issue or reach out to me directly on [X](https://x.com/Audrey_Iterates) or [LinkedIn](https://www.linkedin.com/in/akendr/).
