import { useState } from 'react';
import { Send, Loader2, Sparkles, FileText, CheckCircle } from 'lucide-react';

interface HistoryItem {
  id: string;
  prompt: string;
  result: string;
  timestamp: string;
}

export const Generator = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setCurrentResult('');
    
    try {
      // API call to backend generator endpoint
      const res = await fetch('http://localhost:3001/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requirement: prompt }),
      });
      
      const data = await res.json();
      
      if (data.status === 'success') {
        const textResult = data.testCases;
        setCurrentResult(textResult);
        
        // Save to history
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          prompt,
          result: textResult,
          timestamp: new Date().toLocaleTimeString()
        };
        setHistory([newItem, ...history]);
        setActiveId(newItem.id);
      } else {
        setCurrentResult(`Error generating test cases: ${data.message}`);
      }
    } catch (err) {
      setCurrentResult('Error computing test cases. Check if backend is running.');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setActiveId(item.id);
    setCurrentResult(item.result);
  };

  return (
    <div className="h-full w-full flex bg-slate-50 overflow-hidden">
      
      {/* History Sidebar */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shadow-sm z-10">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
            <Sparkles size={20} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">History</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 text-sm px-6 text-center">
              <FileText size={32} className="opacity-40" />
              <p>No past generations. Start testing requirements!</p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => loadHistoryItem(item)}
                className={`w-full text-left p-4 rounded-xl transition-all border ${
                  activeId === item.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-sm' 
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <p className={`text-sm font-medium line-clamp-2 ${activeId === item.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {item.prompt}
                </p>
                <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
                  <span>{item.timestamp}</span>
                  {activeId === item.id && <CheckCircle size={14} className="text-indigo-500" />}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat / Display Area */}
      <div className="flex-1 flex flex-col h-full bg-slate-50/50 relative">
        
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
          
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-slate-800 tracking-tight">AI Test Case Generator</h1>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium text-slate-600 border border-slate-200 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Ready
              </div>
            </div>

            {/* Display Area */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 overflow-y-auto flex flex-col relative">
              {loading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl gap-4 z-10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium animate-pulse">Generating robust test cases...</p>
                </div>
              ) : null}

              {!currentResult && !loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400">
                  <Sparkles size={48} className="opacity-20 mb-4" />
                  <p className="text-lg">Generated Test Cases will appear here in Jira format.</p>
                </div>
              ) : (
                <div className="prose prose-slate max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-700">
                  {currentResult}
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Input Box */}
        <div className="p-8 pt-0 mt-auto">
          <div className="max-w-4xl mx-auto w-full relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste Jira Requirement here..."
              className="w-full bg-white rounded-2xl border border-slate-200 shadow-lg px-6 py-5 pr-20 resize-none min-h-[120px] focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="absolute right-4 bottom-4 p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <Send size={20} className={prompt.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};
