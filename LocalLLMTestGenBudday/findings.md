# Findings

## Discoveries & Context
- The project is named `LocalLLMTestGenBudday`.
- Development is occurring in the directory `e:\AITesterBlueprint_E2E\LocalLLMTestGenBudday`.
- The core purpose of the application is to generate both functional and non-functional API and web application test cases based on Jira requirements.
- The user provides Jira requirements via copy-paste or chat inputs.
- The application will format the generated test cases in a standard Jira format.
- **Tech Stack**:
  - Backend: Node.js with TypeScript.
  - Frontend: React with TypeScript.
- **Supported LLMs**:
  - Local: Ollama API, LM Studio API.
  - Cloud: Grok API, OpenAI, Claude API, Gemini API.
- **UI Design Discoveries (from Image)**:
  - Top Window (Main Generator):
    - Left sidebar for History.
    - Large central text area/display for "Test Case generated with Ollama API / groq / open AI".
    - Input text box below for "Ask here is here TC for Requiremnt".
  - Bottom Window (Settings):
    - Central area with input fields for "Ollama Setting", "Groq Setting", and "Open AI API keys".
    - "Save Button" to persist settings.
    - "Test Connection" button to verify API connectivity.

## Constraints
- **Protocol 0**: No scripts or code can be written until discovery questions are answered and a blueprint is approved in `task_plan.md`.
- Output constraint: The generated prompt/response test cases must adhere to a Jira format.
- Output constraint: Capable of providing functional and non-functional test cases.

## Bugs Found & Fixed
- **Model not found**: The Ollama model was hardcoded to `mistral`. Fixed by adding a `/api/models` endpoint and a model dropdown selector in Settings UI.
