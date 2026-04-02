# Proposify — AI Proposal Generator

Generate winning proposals with AI. Paste a job description, pick a tone, and get a polished proposal with your portfolio auto-attached.

## Getting Started

### 1. Install dependencies

```bash
cd Proposify
npm install
```

### 2. Configure API key

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```
OPENAI_API_KEY=sk-your-key-here
AI_PROVIDER=openai
```

Or use Claude instead:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
AI_PROVIDER=claude
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with features and CTA |
| `/app` | Proposal generator |
| `/settings` | Portfolio links and default tone |

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/generateProposal` | POST | Generate proposal via AI |
| `/api/savePortfolio` | POST | Save portfolio (placeholder) |

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** (VS Code theme)
- **OpenAI GPT-4** or **Claude** for AI generation
