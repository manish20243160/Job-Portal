import { Briefcase, MapPin, Clock, DollarSign, Building2, Calendar } from "lucide-react";
import Button from "../Common/Button";

const JobPreviewCard = ({ data, user }) => {
  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden h-full flex flex-col animate-in fade-in zoom-in duration-500">
      {/* Header Banner */}
      <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        <div className="absolute -bottom-10 left-8">
          <div className="w-20 h-20 rounded-3xl bg-white p-1 shadow-2xl border border-gray-50 flex items-center justify-center">
            {user?.companyLogo ? (
              <img src={user.companyLogo} alt="Company" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className="w-full h-full bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <Building2 size={32} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-16 p-8 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-tight mb-2">
              {data.title || "Untitled Opportunity"}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
              <span className="text-blue-600">{user?.companyName || "Your Company"}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{data.location || "Remote"}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{data.type || "Full-time"}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Budget Range</p>
              <h4 className="text-lg font-black text-gray-800">
                ${data.salaryMin || "0"} - ${data.salaryMax || "0"}
              </h4>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-50">
          <div className="md:col-span-2 space-y-10">
            <section>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                The Mission
              </h4>
              <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {data.description || "Describe the core mission and impact of this role..."}
              </div>
            </section>

            <section>
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-purple-600 rounded-full"></span>
                Expertise Required
              </h4>
              <div className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">
                {data.requirements || "Define the technical and professional prerequisites..."}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
             <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 space-y-4">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metadata</h4>
                <div className="space-y-3">
                   <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-blue-600">
                         <Calendar size={16} />
                      </div>
                      <span>Posted Today</span>
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                      <div className="w-8 h-8 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-purple-600">
                         <Briefcase size={16} />
                      </div>
                      <span>{data.category || "General"}</span>
                   </div>
                </div>
             </div>

             <Button className="w-full !rounded-2xl shadow-xl shadow-blue-100 disabled:opacity-50" disabled>
                Submit Application
             </Button>
             <p className="text-[10px] text-center font-bold text-gray-400 uppercase tracking-tighter">Application button disabled in preview mode</p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default JobPreviewCard;
