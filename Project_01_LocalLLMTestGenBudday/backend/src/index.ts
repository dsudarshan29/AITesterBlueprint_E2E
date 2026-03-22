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
  return { ollamaUrl: 'http://localhost:11434', ollamaModel: '', groqApiKey: '', openAiApiKey: '', provider: 'ollama' };
}

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
    } else if (provider === 'groq') {
      const response = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${config.groqApiKey}` }
      });
      if (response.ok) {
        return res.json({ status: 'success', message: 'Connected to Groq successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API Error: ${response.status} ${JSON.stringify(errorData)}`);
      }
    } else if (provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${config.openAiApiKey}` }
      });
      if (response.ok) {
        return res.json({ status: 'success', message: 'Connected to OpenAI successfully' });
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenAI API Error: ${response.status} ${JSON.stringify(errorData)}`);
      }
    } else {
      res.json({ status: 'success', message: `Simulated connection to ${provider}` });
    }
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
    const provider = settings.provider || 'ollama';
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

    let finalContent = '';

    if (provider === 'groq') {
      const gRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.groqApiKey}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Requirement: ${requirement}` }
          ]
        })
      });
      if (!gRes.ok) {
        const errText = await gRes.text();
        throw new Error(`Groq API Error: ${gRes.status} ${errText}`);
      }
      const gData: any = await gRes.json();
      finalContent = gData.choices[0].message.content;
    } else if (provider === 'openai') {
      const oRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.openAiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Requirement: ${requirement}` }
          ]
        })
      });
      if (!oRes.ok) {
        const errText = await oRes.text();
        throw new Error(`OpenAI API Error: ${oRes.status} ${errText}`);
      }
      const oData: any = await oRes.json();
      finalContent = oData.choices[0].message.content;
    } else {
      const ollamaUrl = settings.ollamaUrl || 'http://localhost:11434';
      const ollama = new Ollama({ host: ollamaUrl });
      const modelName = settings.ollamaModel || 'llama2';
      const response = await ollama.chat({
        model: modelName,
        messages: [
           { role: 'system', content: systemPrompt },
           { role: 'user', content: `Requirement: ${requirement}` }
        ],
      });
      finalContent = response.message.content;
    }

    res.json({ status: 'success', testCases: finalContent });
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
