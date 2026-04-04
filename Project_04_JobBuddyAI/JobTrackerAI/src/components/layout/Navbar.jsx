import { Download, Upload, Plus, Search } from "lucide-react";
import { useRef } from "react";

export default function Navbar({ jobs, onExport, onImport, onAddClick, searchQuery, onSearchChange }) {
  const fileInputRef = useRef(null);

  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const data = JSON.parse(event.target.result);
              onImport(data);
          } catch (err) {
              alert("Invalid JSON file.");
          }
      };
      reader.readAsText(file);
      e.target.value = '';
  };


  return (
    <header className="h-[72px] border-b border-[#1E293B] bg-[#0F172A] flex items-center justify-between px-6 shrink-0 w-full z-10 relative">
      <div className="flex items-center space-x-8">
        {/* Branding */}
        <div className="flex flex-col">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#818CF8] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-[0_0_15px_rgba(129,140,248,0.4)]">
                    J
                </div>
                <div>
                   <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">JobBuddyAI</h1>
                   <span className="text-xs text-[#94A3B8] font-medium">{jobs.length} total jobs</span>
                </div>
            </div>
        </div>


      </div>

      <div className="flex items-center space-x-4">
        
        {/* Search */}
        <div className="relative hidden sm:block w-64">
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
           <input
             type="text"
             placeholder="Search jobs..."
             value={searchQuery}
             onChange={(e) => onSearchChange(e.target.value)}
             className="w-full h-10 pl-9 pr-4 text-sm bg-[#1E293B] border border-[#334155] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#818CF8] transition-all"
           />
        </div>

        {/* Action Buttons */}
        <button
           onClick={() => onAddClick('Wishlist')}
           className="h-10 px-5 flex-shrink-0 bg-[#818CF8] hover:bg-[#6366F1] text-white rounded-lg flex items-center text-sm font-semibold shadow-[0_0_15px_rgba(129,140,248,0.3)] transition-all"
        >
           <Plus size={16} className="mr-2 stroke-[3px]" /> Add Job
        </button>

        <div className="flex items-center space-x-2 border-l border-[#334155] pl-4">
            <button 
                onClick={handleImportClick}
                className="p-2 text-[#94A3B8] hover:bg-[#1E293B] rounded-lg transition-colors"
                title="Import JSON"
            >
                <Upload size={18} />
                <input 
                    type="file" 
                    accept=".json" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                />
            </button>
            <button 
                onClick={onExport}
                className="p-2 text-[#94A3B8] hover:bg-[#1E293B] rounded-lg transition-colors"
                title="Export JSON"
            >
                <Download size={18} />
            </button>
        </div>

      </div>
    </header>
  );
}
