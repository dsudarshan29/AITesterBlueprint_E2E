# 📜 Gemini Project Constitution

## Data Schemas

### 📥 1. Input Schema (UI -> Next.js API)
```json
{
  "integration_config": {
    "jira": {
      "url": "https://yourdomain.atlassian.net",
      "email": "user@domain.com",
      "api_token": "secret_token",
      "status": "connected"
    },
    "llm": {
      "provider": "groq", // "groq", "ollama", "openai"
      "model": "llama3-70b-8192",
      "api_key": "gsk_...", 
      "base_url": "http://localhost:11434", // For Ollama
      "status": "connected"
    }
  },
  "execution_payload": {
    "jira_ticket_id": "TEST-123",
    "additional_context": "Focus heavily on edge cases for the login form."
  }
}
```

### 📤 2. Output Schema (Next.js API -> UI)
```json
{
  "status": "success",
  "jira_story": {
    "title": "User Login",
    "description": "As a user, I want to login...",
    "acceptance_criteria": "..."
  },
  "test_plan": "Markdown representation matching the 'Test Plan - Template.docx'",
  "test_cases": [
    {
      "id": "TC-01",
      "title": "Valid Login",
      "steps": ["Enter username", "Enter password", "Click Login"],
      "expected_result": "Redirect to dashboard"
    }
  ],
  "automation_script": {
    "language": "python",
    "framework": "selenium",
    "code": "from selenium import webdriver..."
  }
}
```

## Behavioral Rules
1. **Never guess Jira IDs:** The app must explicitly fetch via the provided Jira instance URL and credentials.
2. **LLM Agnostic:** Always abstract the LLM calls so the user can freely toggle between local Ollama and cloud Groq.
3. **Template Strictness:** When generating the Test Plan, strictly adhere to the structure derived from `Test Plan - Template.docx`.
4. **Code Generation:** Default the automation code generator to standard Selenium/Playwright Python unless instructed otherwise via the UI settings.

## Architectural Invariants
1. **A.N.T. 3-Layer Structure:** The backend logic MUST reside in the `tools/` directory as atomic, deterministic TypeScript scripts, served via Next.js API routes.
2. **Stateless Tooling:** TypeScript tools should accept the `Input Schema` via standard arguments or a temporary JSON file, and output the `Output Schema`. They do not maintain persistent database state; the React frontend holds the session state.
3. **Local First:** All intermediate testing artifacts (raw Jira JSON, raw LLM outputs) must be dumped to `.tmp/` for easy debugging.
