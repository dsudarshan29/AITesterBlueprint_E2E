import { Globe, Link, PieChart, Briefcase, Pin, LayoutGrid } from "lucide-react";

export default function Sidebar({ jobs, currentView, onViewChange }) {
  const getSource = (url) => {
    if (!url) return "Other";
    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes('linkedin')) return "LinkedIn";
      if (hostname.includes('naukri')) return "Naukri";
      return "Other";
    } catch {
      return "Other";
    }
  };

  const sourceCounts = { "All Sites": jobs.length };
  jobs.forEach(job => {
     const src = getSource(job.url);
     sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const sitesList = [
      { name: "All Sites", icon: Globe, forceActive: true },
      { name: "LinkedIn", icon: Link },
      { name: "Naukri", icon: Briefcase },
      { name: "Other", icon: Pin },
  ];

  return (
    <aside className="w-[280px] border-r border-[#1E293B] bg-[#0B0F19] hidden md:flex flex-col h-full overflow-y-auto custom-scrollbar">
      
      {/* Board View Shortcut */}
      <div className="p-4 pt-6 border-b border-[#1E293B]">
         <button 
            onClick={() => onViewChange('board')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
               currentView === 'board' ? 'bg-[#1E293B] text-white font-bold' : 'text-[#94A3B8] hover:bg-[#1E293B]'
            }`}
         >
            <span className="flex items-center space-x-3 text-sm">
                <LayoutGrid size={16} className={currentView === 'board' ? 'text-[#818CF8]' : 'text-[#64748B]'}/>
                <span>Dashboard</span>
            </span>
         </button>
      </div>

      <div className="p-5 flex-1">
        <h3 className="text-xs tracking-widest text-[#64748B] font-bold mb-4 ml-2 mt-2">JOB SITES</h3>
        <ul className="space-y-1 mb-8">
            {sitesList.map((site) => {
              const count = sourceCounts[site.name] || 0;
              const isActive = site.forceActive && currentView === 'board';
              const Icon = site.icon;
              return (
                <li key={site.name}>
                  <button 
                    onClick={() => onViewChange('board')}
                    className={`w-full flex justify-between items-center text-sm py-2.5 px-3 rounded-lg transition-all ${
                     isActive 
                     ? "bg-[#1E293B] text-[#818CF8] border-l-2 border-[#818CF8]" 
                     : "text-[#94A3B8] hover:bg-[#1E293B] border-l-2 border-transparent"
                  }`}>
                    <span className="flex items-center space-x-3 font-semibold text-[13px]">
                      <Icon size={16} className={isActive ? "text-[#818CF8]" : "text-[#64748B]"} />
                      <span>{site.name}</span>
                    </span>
                    <span className={`text-xs font-bold leading-none py-1.5 px-2.5 rounded-md ${
                        isActive ? "bg-[#818CF8]/20 text-[#A5B4FC]" : "bg-[#1E293B] text-[#64748B]"
                    }`}>
                      {count}
                    </span>
                  </button>
                </li>
             );
            })}
        </ul>

        <h3 className="text-xs tracking-widest text-[#64748B] font-bold mb-4 ml-2 mt-8">ANALYTICS</h3>
        <ul className="space-y-1">
             <li>
                 <button 
                  onClick={() => onViewChange('analytics')}
                  className={`w-full flex justify-between items-center text-sm py-2.5 px-3 rounded-lg transition-all ${
                    currentView === 'analytics' 
                      ? "bg-[#1E293B] text-white" 
                      : "text-[#94A3B8] hover:bg-[#1E293B]"
                  }`}>
                    <span className="flex items-center space-x-3 font-semibold text-[13px]">
                      <PieChart size={16} className={currentView === 'analytics' ? 'text-white' : 'text-[#64748B]'} />
                      <span>Charts & Stats</span>
                    </span>
                 </button>
             </li>
        </ul>
      </div>
    </aside>
  );
}
