import { DndContext, closestCenter, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useState } from "react";
import Column from "./Column";
import JobCard from "./JobCard";

export default function KanbanBoard({ jobs, moveJob, onEditJob }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const activeJob = activeId ? jobs.find((j) => j.id === activeId) : null;

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    const activeJob = jobs.find((j) => j.id === active.id);
    const overId = over.id;

    const isOverAColumn = COLUMNS.includes(overId);
    
    let newStatus = activeJob.status;
    if (isOverAColumn) {
        newStatus = overId;
    } else {
        const overJob = jobs.find((j) => j.id === overId);
        if (overJob) {
            newStatus = overJob.status;
        }
    }

    if (activeJob.status !== newStatus) {
      moveJob(active.id, newStatus);
    }
  };

  const COLUMNS = ["Wishlist", "Applied", "Follow-up", "Interview", "Offer", "Rejected"];

  // Mapping specific titles to fit the design requirement
  const headerTitles = {
    "Wishlist": "WISHLIST",
    "Applied": "APPLIED",
    "Follow-up": "FOLLOW-UP",
    "Interview": "INTERVIEW",
    "Offer": "OFFERS",
    "Rejected": "REJECTED"
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-5 overflow-x-auto pb-6 h-full p-6 pt-4 items-start custom-scrollbar">
        {COLUMNS.map((colName) => (
          <Column
            key={colName}
            id={colName}
            title={headerTitles[colName]}
            originalStatus={colName}
            jobs={jobs.filter((j) => j.status === colName)}
            onEdit={onEditJob}
          />
        ))}
      </div>
      
      <DragOverlay>
        {activeJob ? (
            <div className="w-[320px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-[#111827] rounded-xl z-50 transform rotate-2">
                 <JobCard job={activeJob} onEdit={() => {}} />
            </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
