# LocalLLMTestGenBudday — Walkthrough

## What Was Built

A full-stack AI Test Case Generator that takes Jira requirements as input and produces functional and non-functional test cases in Jira format, powered by local/cloud LLMs.

| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript + Tailwind v4 (Vite) |
| Backend | Node.js + Express + TypeScript |
| LLM | Ollama SDK (Groq/OpenAI stubs ready) |

---

## Phase Completion Summary

- **Phase 1** — Discovery & blueprint approved
- **Phase 2** — Scaffolded frontend (Vite/React/TS) and backend (Express/TS)
- **Phase 3** — Settings UI + `/api/settings` and `/api/settings/test` endpoints
- **Phase 4** — Generator UI + `/api/generate` endpoint with Jira-format system prompt
- **Bugfix** — Added dynamic model selection (was hardcoded to `mistral`)

---

## Key Files

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Express server with settings, test-connection, models, and generate endpoints |
| `frontend/src/App.tsx` | React Router with sidebar navigation |
| `frontend/src/components/Generator.tsx` | Main chat UI with history sidebar |
| `frontend/src/components/Settings.tsx` | API configuration panel with model dropdown |

## How to Run

```bash
# Terminal 1 — Backend (port 3001)
cd LocalLLMTestGenBudday/backend && npm run dev

# Terminal 2 — Frontend (port 5173)
cd LocalLLMTestGenBudday/frontend && npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Healthcheck |
| GET | `/api/settings` | Load saved LLM configurations |
| POST | `/api/settings` | Save LLM configurations |
| POST | `/api/settings/test` | Test connection to a provider |
| GET | `/api/models` | List available Ollama models |
| POST | `/api/generate` | Generate test cases from a requirement |

## Verification Results

- ✅ Backend starts on port 3001
- ✅ Frontend starts on port 5173
- ✅ Generator page renders with History sidebar, display area, and input box
- ✅ Settings page renders with Ollama/Groq/OpenAI fields, model dropdown, Test Connection, and Save buttons
- ✅ Navigation between pages works via sidebar icons
- ✅ Model dropdown populated from Ollama
