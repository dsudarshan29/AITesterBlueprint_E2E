import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export const Settings = () => {
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [groqKey, setGroqKey] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [provider, setProvider] = useState('ollama');
  const [statusMsg, setStatusMsg] = useState('');

  const fetchModels = async () => {
    setModelsLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/models');
      const data = await res.json();
      if (data.models && data.models.length > 0) {
        setAvailableModels(data.models);
        setStatusMsg(`Found ${data.models.length} model(s)`);
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        setAvailableModels([]);
        setStatusMsg('No models found. Make sure Ollama is running.');
      }
    } catch {
      setStatusMsg('Failed to fetch models. Is Ollama running?');
    } finally {
      setModelsLoading(false);
    }
  };

  useEffect(() => {
    // Load config on mount
    fetch('http://localhost:3001/api/settings')
      .then((res) => res.json())
      .then((data) => {
        setOllamaUrl(data.ollamaUrl || '');
        setOllamaModel(data.ollamaModel || '');
        setGroqKey(data.groqApiKey || '');
        setOpenAiKey(data.openAiApiKey || '');
        setProvider(data.provider || 'ollama');
      })
      .catch((err) => console.error('Error loading settings', err));
    
    // Also fetch available models
    fetchModels();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ollamaUrl, ollamaModel, groqApiKey: groqKey, openAiApiKey: openAiKey, provider }),
      });
      const data = await res.json();
      setStatusMsg(data.message || 'Saved successfully');
      setTimeout(() => setStatusMsg(''), 3000);
    } catch (err) {
      setStatusMsg('Failed to save settings');
    }
  };

  const handleTestConnection = async (provider: string) => {
    try {
      setStatusMsg(`Testing connection to ${provider}...`);
      const bodyConfig = { ollamaUrl, groqApiKey: groqKey, openAiApiKey: openAiKey };
      const res = await fetch('http://localhost:3001/api/settings/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, config: bodyConfig }),
      });
      const data = await res.json();
      setStatusMsg(data.message || 'Test complete');
    } catch (err) {
      setStatusMsg(`Connection test failed for ${provider}`);
    }
  };

  return (
    <div className="h-full w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-2xl font-semibold mb-8 text-slate-800 tracking-tight">API Configurations</h2>
        
        <div className="space-y-6">
          {/* Active Provider Selection */}
          <div className="flex flex-col gap-2 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <label className="text-sm font-semibold text-indigo-900">Active AI Provider (Used for Generator)</label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="px-4 py-3 rounded-xl border border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all bg-white text-slate-700 font-medium"
            >
              <option value="ollama">Ollama (Local)</option>
              <option value="groq">Groq (Cloud)</option>
              <option value="openai">OpenAI (Cloud)</option>
            </select>
          </div>

          {/* Ollama Setting */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Ollama API URL</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <button 
                onClick={() => handleTestConnection('ollama')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
            </div>
          </div>

          {/* Ollama Model Selection */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Ollama Model</label>
            <div className="flex gap-4">
              <select
                value={ollamaModel}
                onChange={(e) => setOllamaModel(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all bg-white"
              >
                <option value="">-- Select a model --</option>
                {availableModels.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <button
                onClick={fetchModels}
                disabled={modelsLoading}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors whitespace-nowrap flex items-center gap-2"
              >
                <RefreshCw size={16} className={modelsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>

          {/* Groq Setting */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">Groq API Key</label>
            <div className="flex gap-4">
              <input
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <button 
                onClick={() => handleTestConnection('groq')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
            </div>
          </div>

          {/* OpenAI Setting */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600">OpenAI API Key</label>
            <div className="flex gap-4">
              <input
                type="password"
                value={openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
              />
              <button 
                onClick={() => handleTestConnection('openai')}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors whitespace-nowrap"
              >
                Test Connection
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="mt-6 p-4 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-medium text-center">
            {statusMsg}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-10 flex justify-end">
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
