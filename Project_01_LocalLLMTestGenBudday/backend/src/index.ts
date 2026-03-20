import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Ollama } from 'ollama';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const SETTINGS_FILE = path.join(__dirname, 'settings.json');

// Helper to get settings
const getSettings = () => {
  if (fs.existsSync(SETTINGS_FILE)) {
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  }
  return { ollamaUrl: 'http://localhost:11434', ollamaModel: '', groqApiKey: '', openAiApiKey: '' };
};

// GET /api/settings
app.get('/api/settings', (req, res) => {
  res.json(getSettings());
});

// POST /api/settings
app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(newSettings, null, 2));
  res.json({ status: 'success', message: 'Settings saved' });
});

// POST /api/settings/test
app.post('/api/settings/test', async (req, res) => {
  const { provider, config } = req.body;
  try {
    if (provider === 'ollama') {
      const ollama = new Ollama({ host: config.ollamaUrl || 'http://localhost:11434' });
      // Simple list models request to test connection
      const models = await ollama.list();
      return res.json({ status: 'success', message: 'Connected to Ollama', models: models.models.length });
    }
    // TODO: Add Groq, OpenAI test connections
    res.json({ status: 'success', message: `Simulated connection to ${provider}` });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET /api/models - List available Ollama models
app.get('/api/models', async (req, res) => {
  try {
    const settings = getSettings();
    const ollama = new Ollama({ host: settings.ollamaUrl || 'http://localhost:11434' });
    const result = await ollama.list();
    const modelNames = result.models.map((m: any) => m.name);
    res.json({ status: 'success', models: modelNames });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message, models: [] });
  }
});

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  const { requirement } = req.body;
  if (!requirement) {
    return res.status(400).json({ status: 'error', message: 'Requirement is missing' });
  }

  try {
    const settings = getSettings();
    const ollamaUrl = settings.ollamaUrl || 'http://localhost:11434';
    const ollama = new Ollama({ host: ollamaUrl });

    const systemPrompt = `You are an expert QA tester. Create comprehensive test cases based on the given requirement.
You MUST output the test cases in a standard Jira format, including both Functional and Non-Functional test cases.
Format each test case exactly like this:
Summary: [Brief description]
Type: [Functional / Non-Functional]
Preconditions: [If any]
Steps:
1. ...
2. ...
Expected Result: [What should happen]
Priority: [High/Medium/Low]

Generate the test cases clearly. Do not output anything else.`;

    const modelName = settings.ollamaModel || 'llama2';

    const response = await ollama.chat({
      model: modelName,
      messages: [
         { role: 'system', content: systemPrompt },
         { role: 'user', content: `Requirement: ${requirement}` }
      ],
    });

    res.json({ status: 'success', testCases: response.message.content });
  } catch (error: any) {
    console.error('Generation Error:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Simple healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
