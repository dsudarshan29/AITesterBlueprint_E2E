# Task Plan

## Phases
- **Phase 1: Discovery & Initialization** (Complete)
  - Goal: Define the project blueprint, requirements, and constraints.
  - Checklist:
    - [x] Ask discovery questions.
    - [x] Receive blueprint and initial requirements from the user.
    - [x] Document the approved blueprint in this file.

- **Phase 2: Scaffolding & Setup** (Complete)
  - Goal: Setup the Node.js+TypeScript backend and React frontend.
  - Checklist:
    - [x] Initialize the Node.js/TypeScript backend project.
    - [x] Initialize the React frontend project.
    - [x] Setup necessary dependencies (Express, React Router, Tailwind for styling, etc.).

- **Phase 3: Settings & LLM Integration** (Complete)
  - Goal: Build the settings UI and connect to the multi-LLM backend.
  - Checklist:
    - [x] Build the Setting UI (based on design: Ollama, Groq, OpenAI settings, Save, Test Connection).
    - [x] Build backend endpoints to save configurations.
    - [x] Build backend endpoints to test connections for each LLM provider.

- **Phase 4: Test Case Generator UI & Logic** (Complete)
  - Goal: Build the main chat UI and generate test cases in Jira format.
  - Checklist:
    - [x] Build the Generator UI (History sidebar, Chat display, Input area).
    - [x] Implement backend logic to receive requirement text and prompt the selected LLM.
    - [x] Ensure the prompt forces output in standard Jira test case format (functional and non-functional).
    - [x] Display the generated test cases in the UI history.
    - [x] Add dynamic model selection from Ollama (bugfix: model was hardcoded).

## Goals
- Determine the objective of the project. (Complete)
- Establish the technology stack. (Complete)
- Create an actionable blueprint for development. (Complete)

## Approved Blueprint
**LocalLLMTestGenBudday Application Blueprint**

1. **Architecture**:
   - Web application divided into a frontend and a backend.
   - **Backend**: Node.js + TypeScript (likely using Express or similar to serve REST endpoints).
   - **Frontend**: React + TypeScript.

2. **Core Functionality**:
   - Generate test cases (functional and non-functional) for APIs and Web Applications.
   - Output style must strictly adhere to Jira format.
   - The user inputs Jira requirements via copy-paste/chat.

3. **Multi-LLM Support**:
   - The user can configure the application to use Ollama API, LM Studio API, Groq, OpenAI, Claude, or Gemini.

4. **User Interface (per provided design)**:
   - **Main View**:
     - `History` sidebar to track past generations.
     - `Chat/Display Area` showing generated test cases from the active model.
     - `Input Box` for pasting Jira requirements.
   - **Settings View**:
     - Configuration fields for various models (Ollama, Groq, OpenAI etc.).
     - `Save` button.
     - `Test Connection` button to validate API keys/local server connectivity.
