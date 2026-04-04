import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Star, Briefcase, Phone, Target, CheckCircle2, Ban, ArrowDownUp } from "lucide-react";
import JobCard from "./JobCard";
import { cn } from "../../lib/utils";

const columnStyles = {
  Wishlist: {
      color: "text-[#A855F7]",
      bg: "bg-[#A855F7]",
      icon: Star,
      borderTop: "border-t-[#A855F7] shadow-[0_-2px_15px_-3px_rgba(168,85,247,0.3)]"
  },
  Applied: {
      color: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]",
      icon: Briefcase,
      borderTop: "border-t-[#3B82F6] shadow-[0_-2px_15px_-3px_rgba(59,130,246,0.3)]"
  },
  "Follow-up": {
      color: "text-[#EAB308]",
      bg: "bg-[#EAB308]",
      icon: Phone,
      borderTop: "border-t-[#EAB308] shadow-[0_-2px_15px_-3px_rgba(234,179,8,0.3)]"
  },
  Interview: {
      color: "text-[#10B981]",
      bg: "bg-[#10B981]",
      icon: Target,
      borderTop: "border-t-[#10B981] shadow-[0_-2px_15px_-3px_rgba(16,185,129,0.3)]"
  },
  Offer: {
      color: "text-[#8B5CF6]",
      bg: "bg-[#8B5CF6]",
      icon: CheckCircle2,
      borderTop: "border-t-[#8B5CF6] shadow-[0_-2px_15px_-3px_rgba(139,92,246,0.3)]"
  },
  Rejected: {
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]",
      icon: Ban,
      borderTop: "border-t-[#EF4444] shadow-[0_-2px_15px_-3px_rgba(239,68,68,0.3)]"
  },
};

export default function Column({ id, title, originalStatus, jobs, onEdit }) {
  const { setNodeRef } = useDroppable({ id });
  
  const style = columnStyles[originalStatus] || columnStyles.Wishlist;
  const Icon = style.icon;

  return (
    <div className={cn("flex flex-col w-[320px] shrink-0 bg-[#161C2C] rounded-xl border-t-2 border-transparent transition-all", style.borderTop)}>
      {/* Column Header */}
      <div className="p-4 flex items-center justify-between border-b border-[#1E293B]">
        <div className="flex items-center space-x-2">
          {Icon && <Icon size={16} fill="currentColor" className={style.color} />}
          <h3 className={cn("font-bold text-sm tracking-wider", style.color)}>{title}</h3>
          <span className="text-xs font-bold text-[#818CF8] bg-[#312E81] px-2 py-0.5 rounded-full ml-1">
            {jobs.length}
          </span>
        </div>
        <button className="text-[#64748B] hover:text-[#94A3B8] transition-colors">
            <ArrowDownUp size={14} />
        </button>
      </div>

      {/* Drop Zone */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 min-h-[500px] overflow-y-auto custom-scrollbar"
      >
        <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEdit} columnStyle={style} />
          ))}
        </SortableContext>
        
        {/* Empty state visually distinct */}
        {jobs.length === 0 && (
          <div className="h-32 rounded-xl border border-dashed border-[#334155] flex flex-col items-center justify-center text-[#64748B] bg-transparent">
            <span className="text-xs font-semibold">Drop here to move</span>
          </div>
        )}
      </div>
    </div>
  );
}
