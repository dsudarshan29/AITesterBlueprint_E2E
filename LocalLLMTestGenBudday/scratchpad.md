# Scratchpad

## Notes & Ideas
- Consider adding Claude API and Gemini API integration in the Settings (currently stubs).
- LM Studio API support is on the roadmap but not yet implemented.
- The system prompt enforces Jira format output — may need tuning per model.
- History is currently in-memory (React state). Consider persisting to backend/DB later.

## Quick Commands
```bash
# Start backend
cd backend && npm run dev

# Start frontend
cd frontend && npm run dev

# Pull a model for Ollama
ollama pull llama3
```

## TODO
- [ ] Add Claude API provider support
- [ ] Add Gemini API provider support
- [ ] Add LM Studio API provider support
- [ ] Persist generation history to backend/database
- [ ] Add export to CSV/Jira import format
- [ ] Add model selection per-generation (not just global settings)
