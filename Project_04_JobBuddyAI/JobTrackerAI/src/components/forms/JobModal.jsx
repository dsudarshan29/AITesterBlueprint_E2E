import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function JobModal({ isOpen, onClose, onSave, job }) {
  const isEditing = !!job;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: isEditing ? job : {
      company: "",
      role: "",
      url: "",
      resumeUsed: "",
      dateApplied: new Date().toISOString().split('T')[0],
      salary: "",
      notes: "",
      status: "Wishlist"
    }
  });

  // Effect to reset form when modal opens with new job data
  useEffect(() => {
      if (isOpen) {
          reset(job || {
              company: "",
              role: "",
              url: "",
              resumeUsed: "",
              dateApplied: new Date().toISOString().split('T')[0],
              salary: "",
              notes: "",
              status: "Wishlist"
          });
      }
  }, [isOpen, job, reset]);

  if (!isOpen) return null;

  const onSubmit = (data) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background border border-border w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
          <h2 className="text-lg font-bold">{isEditing ? "Edit Job Application" : "Add New Job"}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-4 max-w-full">
          <form id="job-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Company *</label>
                <input 
                  autoFocus
                  {...register("company", { required: "Company is required" })}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="e.g. Stripe"
                />
                {errors.company && <span className="text-xs text-red-500">{errors.company.message}</span>}
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Role *</label>
                <input 
                  {...register("role", { required: "Role is required" })}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="e.g. Senior SWE"
                />
                {errors.role && <span className="text-xs text-red-500">{errors.role.message}</span>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select 
                {...register("status")}
                className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">LinkedIn URL (optional)</label>
              <input 
                {...register("url")}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://linkedin.com/jobs/..."
                type="url"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="text-sm font-medium">Salary (optional)</label>
                <input 
                  {...register("salary")}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="e.g. $150k"
                />
              </div>

               <div className="space-y-1.5">
                <label className="text-sm font-medium">Date Applied</label>
                <input 
                  {...register("dateApplied")}
                  type="date"
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Resume Used</label>
              <input 
                {...register("resumeUsed")}
                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. Software_Eng_v3.pdf"
                list="resumes"
              />
              <datalist id="resumes">
                <option value="Software_Eng_v3.pdf" />
                <option value="Product_Manager.pdf" />
                <option value="QA_Lead_Resume.pdf" />
              </datalist>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes</label>
              <textarea 
                {...register("notes")}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px]"
                placeholder="Recruiter info, referrals, takeaways..."
              />
            </div>

          </form>
        </div>

        <div className="p-4 border-t border-border bg-card flex justify-end space-x-2">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 rounded-md font-medium text-sm border border-input bg-background hover:bg-muted"
          >
            Cancel
          </button>
          <button 
            form="job-form"
            type="submit"
            className="px-4 py-2 rounded-md font-medium text-sm text-primary-foreground bg-primary hover:bg-primary/90 shadow"
          >
            {isEditing ? "Save Changes" : "Add Job"}
          </button>
        </div>
      </div>
    </div>
  );
}
