import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Settings as SettingsIcon, MessageSquare } from 'lucide-react';
import { Settings } from './components/Settings';
import { Generator } from './components/Generator';

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 text-slate-900 border-none min-h-screen">
        {/* Sidebar Nav */}
        <nav className="w-16 flex flex-col items-center py-6 bg-white border-r border-slate-200 gap-6">
          <Link to="/" className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all" title="Generator">
            <MessageSquare size={24} />
          </Link>
          <Link to="/settings" className="p-3 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all" title="Settings">
            <SettingsIcon size={24} />
          </Link>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative border-none">
          <Routes>
            <Route path="/" element={<Generator />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
