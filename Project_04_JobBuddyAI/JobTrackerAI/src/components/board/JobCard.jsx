import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, File, MapPin, DollarSign, User } from "lucide-react";
import { cn, getDaysAgo } from "../../lib/utils";

export default function JobCard({ job, onEdit, columnStyle }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: job.id,
    data: {
      type: "Card",
      job,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn("opacity-40 border border-dashed rounded-xl h-40 w-full mb-4 bg-transparent", `border-[${columnStyle?.bg}]`)}
      />
    );
  }

  // Derive source
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

  const source = getSource(job.url);

  // Extract a name from notes if it's short (simple heuristic for "Sarah", "Rahul")
  const referralName = (job.notes && job.notes.length < 15 && !job.notes.includes(" ")) ? job.notes : null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(job)}
      className={cn(
        "bg-[#0B0F19] border-t-2 border border-[#1E293B] rounded-xl p-4 mb-4 shadow-sm cursor-grab active:cursor-grabbing hover:bg-[#111827] transition-all group flex flex-col",
        columnStyle?.borderTop.split(' ')[0] // e.g., 'border-t-[#A855F7]'
      )}
    >
      {/* Top Source Bar */}
      <div className="flex items-center justify-between mb-3 text-xs font-semibold">
        <div className="flex items-center space-x-2">
            <span className={cn("w-2 h-2 rounded-full", `bg-[${columnStyle?.bg.replace('bg-', '')}]`)}></span>
            <span className="text-[#94A3B8] uppercase flex items-center">
               <MapPin size={12} className="mr-1 hidden" /> {source}
            </span>
        </div>
      </div>

      {/* Main Details */}
      <div className="mb-4">
          <h4 className="font-bold text-white text-lg leading-tight mb-1">{job.company}</h4>
          <span className="text-[#94A3B8] text-sm block mb-1.5">{job.role}</span>
          <span className="text-[#64748B] text-xs flex items-center">
            <MapPin size={12} className="mr-1" />
            Remote {/* Hardcoded remote format for visual fidelity, could map to location prop */}
          </span>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.resumeUsed && (
           <span className="flex items-center bg-[#312E81] text-[#A5B4FC] text-xs font-semibold px-2.5 py-1 rounded">
               <File size={12} className="mr-1" />
               {job.resumeUsed}
           </span>
        )}
        {job.salary && (
           <span className="flex items-center bg-[#064E3B] text-[#34D399] text-xs font-semibold px-2.5 py-1 rounded">
               <DollarSign size={12} className="mr-1" />
               {job.salary}
           </span>
        )}
      </div>

      {/* Footer Area */}
      <div className="mt-auto flex justify-between items-center text-xs font-medium border-t border-[#1E293B] pt-3 text-[#64748B]">
         <span>{getDaysAgo(job.dateApplied)}</span>
         
         {referralName && (
             <span className="flex items-center text-[#A5B4FC]">
                 <User size={12} className="mr-1" />
                 {referralName}
             </span>
         )}
      </div>
    </div>
  );
}
