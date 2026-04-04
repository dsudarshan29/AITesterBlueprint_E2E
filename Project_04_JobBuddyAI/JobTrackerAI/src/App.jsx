import { useState, useMemo } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import KanbanBoard from './components/board/KanbanBoard';
import JobModal from './components/forms/JobModal';
import ReportView from './components/analytics/ReportView';
import { useJobs } from './hooks/useJobs';

function App() {
  const { jobs, loading, error, addJob, updateJob, moveJob, importJobs } = useJobs();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newJobStatus, setNewJobStatus] = useState('Wishlist');
  const [currentView, setCurrentView] = useState('board'); // 'board' or 'analytics'

  const handleAddJobClick = (status = 'Wishlist') => {
    setEditingJob(null);
    setNewJobStatus(status);
    setIsModalOpen(true);
  };

  const handleEditJobClick = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = (jobData) => {
    if (editingJob) {
      updateJob(editingJob.id, jobData);
    } else {
      addJob({ ...jobData, status: jobData.status || newJobStatus });
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredJobs = useMemo(() => {
    if (!searchQuery) return jobs;
    const lowerQuery = searchQuery.toLowerCase();
    return jobs.filter((job) => 
      job.company?.toLowerCase().includes(lowerQuery) || 
      job.role?.toLowerCase().includes(lowerQuery)
    );
  }, [jobs, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-white">
        <div className="animate-spin w-8 h-8 border-4 border-[#818CF8] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] overflow-hidden text-[#E2E8F0] antialiased font-sans selection:bg-[#818CF8]/30">
      
      {/* Top Navigation */}
      <Navbar 
         jobs={jobs} 
         onExport={handleExport} 
         onImport={importJobs} 
         onAddClick={handleAddJobClick}
         searchQuery={searchQuery}
         onSearchChange={setSearchQuery}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content Area Side-by-Side */}
        <Sidebar 
          jobs={jobs} 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        
        <main className="flex-1 overflow-hidden flex flex-col bg-[#0B0F19]">
          
          {error && (
            <div className="m-6 p-4 bg-red-900/50 border border-red-500/50 text-red-200 rounded-lg shrink-0">
              {error}
            </div>
          )}

          {/* Conditional View Rendering */}
          <div className="flex-1 overflow-hidden w-full h-full relative">
            {currentView === 'board' ? (
              <KanbanBoard 
                jobs={filteredJobs} 
                moveJob={moveJob} 
                onEditJob={handleEditJobClick}
              />
            ) : (
              <ReportView jobs={jobs} />
            )}
          </div>
        </main>
      </div>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
        job={editingJob}
      />
    </div>
  );
}

export default App;
