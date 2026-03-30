import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Briefcase, MapPin, DollarSign, Calendar, Clock,
  ArrowLeft, Building2, Send, Bookmark, BookmarkCheck,
  CheckCircle, ShieldCheck, Globe, Users,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";
import JobCard from "../../components/Common/JobCard";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);

  const fetchJobDetails = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_BY_ID(jobId));
      setJob(res.data);
      
      // Fetch related jobs (same category or recent)
      const relatedRes = await axiosInstance.get(API_PATHS.JOBS.GET_ALL, {
        params: { category: res.data.category, limit: 3 }
      });
      setRelatedJobs(relatedRes.data.filter(j => j._id !== jobId).slice(0, 3));

      if (user) {
        const checkSavedRes = await axiosInstance.get(API_PATHS.SAVED_JOBS.GET_ALL);
        setIsSaved(checkSavedRes.data.some((s) => s.job?._id === jobId));

        if (user.role === "jobseeker") {
          const myAppsRes = await axiosInstance.get(API_PATHS.APPLICATIONS.MY_APPLICATIONS);
          setHasApplied(myAppsRes.data.some((a) => a.job?._id === jobId));
        }
      }
    } catch {
      toast.error("Job details could not be retrieved");
      navigate("/find-jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const handleApply = async () => {
    if (!user) { navigate("/login"); return; }
    if (user.role !== "jobseeker") { toast.error("Only Job Seekers can apply"); return; }
    
    setApplying(true);
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY(jobId));
      setHasApplied(true);
      toast.success("Application successfully submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.SAVED_JOBS.UNSAVE(jobId));
        setIsSaved(false);
        toast.success("Removed from bookmarks");
      } else {
        await axiosInstance.post(API_PATHS.SAVED_JOBS.SAVE(jobId));
        setIsSaved(true);
        toast.success("Added to bookmarks");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullPage />;
  if (!job) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header Breadcrumb */}
        <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            icon={ArrowLeft}
            className="!text-gray-400 font-black uppercase tracking-widest text-[10px] hover:!text-blue-600 group"
          >
            Leave Intelligence Briefing
          </Button>
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Position Active</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-10">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* Main Intelligence Profile */}
            <div className="xl:col-span-2 space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl relative overflow-hidden group">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-3xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner overflow-hidden">
                        {job.company?.companyLogo || job.company?.avatar ? (
                          <img src={job.company.companyLogo || job.company.avatar} className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={36} className="text-gray-200" />
                        )}
                      </div>
                      <div>
                        <h1 className="text-4xl font-black text-gray-800 tracking-tighter italic leading-none mb-3 uppercase">{job.title}</h1>
                        <div className="flex items-center gap-4">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">{job.company?.companyName || job.company?.name}</p>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-200"></span>
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck size={14} className="text-green-500" /> Identity Verified
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSaveToggle}
                      className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isSaved ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-110" : "bg-white border-gray-100 text-gray-300 hover:border-blue-100 hover:text-blue-600"
                      }`}
                    >
                      {isSaved ? <BookmarkCheck size={24} fill="currentColor" /> : <Bookmark size={24} />}
                    </button>
                  </div>

                  {/* Positioning Data */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 bg-gray-50/30 rounded-[2rem] border border-gray-100 mb-12 backdrop-blur-sm">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Model</p>
                      <p className="text-sm font-black text-gray-700 uppercase">{job.type}</p>
                    </div>
                    <div className="space-y-1 md:border-l md:border-gray-100 md:pl-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Base</p>
                      <p className="text-sm font-black text-gray-700 uppercase truncate">{job.location || "Remote"}</p>
                    </div>
                    <div className="space-y-1 md:border-l md:border-gray-100 md:pl-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Reward</p>
                      <p className="text-sm font-black text-green-600 uppercase">${job.salaryMin?.toLocaleString()}+</p>
                    </div>
                    <div className="space-y-1 md:border-l md:border-gray-100 md:pl-6">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Posted</p>
                      <p className="text-sm font-black text-gray-700 uppercase">{new Date(job.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Technical Breakdown */}
                  <div className="space-y-12">
                     <section>
                       <h2 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                         <span className="w-12 h-1 bg-blue-600 rounded-full"></span> Role Objectives
                       </h2>
                       <div className="text-gray-600 font-medium leading-relaxed bg-gray-50/20 p-8 rounded-[2rem] border border-gray-50 text-sm whitespace-pre-line">
                         {job.description}
                       </div>
                     </section>

                     <section>
                       <h2 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] mb-6 flex items-center gap-4">
                         <span className="w-12 h-1 bg-purple-600 rounded-full"></span> Competency Stack
                       </h2>
                       <div className="text-gray-600 font-medium leading-relaxed bg-gray-50/20 p-8 rounded-[2rem] border border-gray-50 text-sm whitespace-pre-line">
                         {job.requirements}
                       </div>
                     </section>
                  </div>
                </div>
              </div>

              {/* Related Discovery Section */}
              {relatedJobs.length > 0 && (
                <div className="space-y-8 mt-16">
                   <h2 className="text-lg font-black text-gray-800 italic uppercase tracking-tight px-2">Related Horizons</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {relatedJobs.map(j => (
                       <JobCard key={j._id} job={j} isSaved={false} onSaveToggle={() => {}} />
                     ))}
                   </div>
                </div>
              )}
            </div>

            {/* Application Command Center */}
            <div className="xl:col-span-1">
              <div className="sticky top-24 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-8 border-b border-gray-50 pb-6">Mission Onboarding</h3>
                  
                  <div className="space-y-6">
                    {hasApplied ? (
                      <div className="bg-green-50 border border-green-100 rounded-[2rem] p-8 text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
                          <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <h4 className="text-xs font-black text-green-600 uppercase tracking-widest mb-1">Assets Transmitted</h4>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-tight">Identity briefing is currently in review.</p>
                      </div>
                    ) : job.isClosed ? (
                      <div className="bg-red-50 border border-red-100 rounded-[2rem] p-8 text-center">
                        <p className="text-red-600 font-black text-xs uppercase tracking-widest">Horizon Closed</p>
                        <p className="text-[10px] text-red-500 font-bold mt-2 uppercase">No longer accepting mission requests.</p>
                      </div>
                    ) : (
                      <>
                        <Button
                          onClick={handleApply}
                          loading={applying}
                          size="lg"
                          className="w-full h-16 !rounded-[1.5rem] text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100"
                          icon={Send}
                        >
                          Send Application
                        </Button>
                        <p className="text-[10px] text-gray-300 font-bold text-center italic uppercase leading-relaxed px-2">
                          By transmitting, you confirm technical alignment with the prerequisites listed.
                        </p>
                      </>
                    )}

                    <div className="pt-8 border-t border-gray-50 space-y-6">
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Urgency</span>
                          <span className="text-[10px] font-black text-orange-500 uppercase bg-orange-50 px-3 py-1 rounded-full">High</span>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Status</span>
                          <span className="text-[10px] font-black text-blue-500 uppercase bg-blue-50 px-3 py-1 rounded-full">Remote</span>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Brand Preview */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                   <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px] group-hover:scale-110 transition-transform"></div>
                   <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                         <Globe size={24} className="text-blue-400" />
                      </div>
                      <h3 className="text-lg font-black italic uppercase tracking-tight mb-4">Corporate Ecosystem</h3>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-8">
                        Join an elite network of professionals driving global innovation in the technical sector.
                      </p>
                      <Button 
                        variant="secondary" 
                        className="w-full !rounded-xl !bg-white/5 !text-white border border-white/10 hover:!bg-white/15 !text-[10px]"
                        onClick={() => navigate(`/user/public/${job.company?._id}`)}
                      >
                        Visit Headquarters
                      </Button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
