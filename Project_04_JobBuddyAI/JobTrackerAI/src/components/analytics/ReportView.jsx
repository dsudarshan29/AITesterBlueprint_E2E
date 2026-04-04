import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Target, CheckCircle2, TrendingUp, Briefcase } from 'lucide-react';

const COLORS = {
  Wishlist: '#A855F7',
  Applied: '#3B82F6',
  'Follow-up': '#EAB308',
  Interview: '#10B981',
  Offer: '#8B5CF6',
  Rejected: '#EF4444'
};

const PIE_COLORS = ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#60A5FA'];

export default function ReportView({ jobs }) {
  // Aggregate data for Status Bar Chart
  const statusCounts = { Wishlist: 0, Applied: 0, 'Follow-up': 0, Interview: 0, Offer: 0, Rejected: 0 };
  jobs.forEach(job => {
    if (statusCounts[job.status] !== undefined) {
      statusCounts[job.status] += 1;
    }
  });

  const barData = Object.keys(statusCounts).map(status => ({
    name: status,
    Count: statusCounts[status],
    fill: COLORS[status] || '#818CF8'
  }));

  // Aggregate data for Job Sources Pie Chart
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

  const sourceCounts = {};
  jobs.forEach(job => {
    const src = getSource(job.url);
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });

  const pieData = Object.keys(sourceCounts).map(src => ({
    name: src,
    value: sourceCounts[src]
  })).sort((a,b) => b.value - a.value);

  // KPIs
  const totalJobs = jobs.length;
  const appliedAndBeyond = jobs.filter(j => j.status !== 'Wishlist').length;
  const totalInterviews = jobs.filter(j => j.status === 'Interview' || j.status === 'Offer' || j.status === 'Rejected').length; // Assuming offer/rejected had an interview
  const totalOffers = jobs.filter(j => j.status === 'Offer').length;

  const interviewRate = appliedAndBeyond > 0 ? Math.round((totalInterviews / appliedAndBeyond) * 100) : 0;
  const offerRate = totalInterviews > 0 ? Math.round((totalOffers / totalInterviews) * 100) : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1E293B] border border-[#334155] p-3 rounded-lg shadow-xl text-white text-sm">
          <p className="font-semibold mb-1">{payload[0].payload.name}</p>
          <p className="text-[#94A3B8]">Count: <span className="text-white font-bold">{payload[0].value}</span></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar bg-[#0B0F19]">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Analytics & Reports</h2>
        <p className="text-[#94A3B8] text-sm">A statistical breakdown of your job application pipeline.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#94A3B8] text-sm font-semibold tracking-wide">TOTAL JOBS</h3>
              <div className="p-2 bg-[#818CF8]/20 rounded-lg text-[#818CF8]"><Briefcase size={20}/></div>
           </div>
           <p className="text-3xl font-bold text-white">{totalJobs}</p>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#94A3B8] text-sm font-semibold tracking-wide">APPLICATIONS</h3>
              <div className="p-2 bg-[#3B82F6]/20 rounded-lg text-[#3B82F6]"><TrendingUp size={20}/></div>
           </div>
           <p className="text-3xl font-bold text-white">{appliedAndBeyond}</p>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#10B981] text-sm font-semibold tracking-wide">INTERVIEW RATE</h3>
              <div className="p-2 bg-[#10B981]/20 rounded-lg text-[#10B981]"><Target size={20}/></div>
           </div>
           <div className="flex items-baseline space-x-2">
             <p className="text-3xl font-bold text-white">{interviewRate}%</p>
             <span className="text-xs text-[#64748B]">of applied</span>
           </div>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-5 shadow-sm">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#A855F7] text-sm font-semibold tracking-wide">OFFER RATE</h3>
              <div className="p-2 bg-[#A855F7]/20 rounded-lg text-[#A855F7]"><CheckCircle2 size={20}/></div>
           </div>
           <div className="flex items-baseline space-x-2">
             <p className="text-3xl font-bold text-white">{offerRate}%</p>
             <span className="text-xs text-[#64748B]">of interviews</span>
           </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
        
        {/* Bar Chart: Status Distribution */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 shadow-sm">
          <h3 className="text-white font-semibold mb-6">Pipeline Distribution</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1E293B', opacity: 0.4 }} />
                <Bar dataKey="Count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Source Breakdown */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-xl p-6 shadow-sm">
          <h3 className="text-white font-semibold mb-6">Applications by Source</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="text-[#64748B] text-sm">No data available yet.</div>
            )}
           </div>
        </div>

      </div>
    </div>
  );
}
