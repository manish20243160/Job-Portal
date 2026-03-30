import { useState, useEffect } from "react";
import { Briefcase, SlidersHorizontal, ArrowLeft } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import JobCard from "../../components/Common/JobCard";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const SavedJobs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedJobs = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.SAVED_JOBS.GET_ALL);
      // Backend returns SavedJob objects with job field populated
      setSavedJobs(res.data.map(item => item.job).filter(Boolean));
    } catch {
      toast.error("Failed to load your collection");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchSavedJobs();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await axiosInstance.delete(API_PATHS.SAVED_JOBS.UNSAVE(jobId));
      setSavedJobs((prev) => prev.filter((job) => job._id !== jobId));
      toast.success("Identity removed from favorites");
    } catch {
      toast.error("Operation failed");
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto">
        {/* Header Protocol */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">Career Shortlist</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 pl-1">Precision monitoring for {savedJobs.length} active prospects</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-blue-50/50 px-4 py-2.5 rounded-2xl border border-blue-50 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none">Market Synchronization Active</span>
             </div>
             <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate("/find-jobs")} 
              icon={Briefcase}
              className="!rounded-xl"
             >
                Find More
             </Button>
          </div>
        </div>

        <div className="p-4 md:p-10">
          {savedJobs.length === 0 ? (
            <div className="max-w-3xl mx-auto text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200 shadow-xl animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Briefcase size={40} className="text-gray-100" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-3 tracking-tighter uppercase italic">The Collection is Empty</h2>
              <p className="text-gray-400 font-bold text-sm mb-10 max-w-sm mx-auto uppercase tracking-wide leading-relaxed">
                Your career mission requires persistent discovery. Secure high-impact roles in the Hub to monitor them here.
              </p>
              <Button 
                  onClick={() => navigate("/find-jobs")} 
                  size="lg" 
                  className="shadow-2xl shadow-blue-100 !rounded-2xl px-12"
              >
                  Start Discovery
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
              {savedJobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={true}
                  onSaveToggle={handleUnsave}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SavedJobs;
