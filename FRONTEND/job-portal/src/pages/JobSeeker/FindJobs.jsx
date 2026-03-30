import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { CATEGORIES, JOB_TYPES, SALARY_RANGES } from "../../utils/data";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

import FilterPanel from "../../components/Common/FilterPanel";
import Sidebar from "../../components/layout/Sidebar";
import SearchHeader from "../../components/Common/SearchHeader";
import JobCard from "../../components/Common/JobCard";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const FindJobs = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    keyword: "", location: "", category: "", type: "", salaryRange: "",
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.keyword) params.keyword = filters.keyword;
      if (filters.location) params.location = filters.location;
      if (filters.category) params.category = filters.category;
      if (filters.type) params.type = filters.type;
      if (filters.salaryRange) params.salaryRange = filters.salaryRange;

      const res = await axiosInstance.get(API_PATHS.JOBS.GET_ALL, { params });
      setJobs(res.data);
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.get(API_PATHS.SAVED_JOBS.GET_ALL);
      setSavedJobIds(res.data.map((s) => s.job?._id));
    } catch {}
  };

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  const handleSearch = () => {
    fetchJobs();
  };

  const handleSaveToggle = async (jobId) => {
    if (!user) { navigate("/login"); return; }
    try {
      if (savedJobIds.includes(jobId)) {
        await axiosInstance.delete(API_PATHS.SAVED_JOBS.UNSAVE(jobId));
        setSavedJobIds((prev) => prev.filter((id) => id !== jobId));
        toast.success("Job removed from saved");
      } else {
        await axiosInstance.post(API_PATHS.SAVED_JOBS.SAVE(jobId));
        setSavedJobIds((prev) => [...prev, jobId]);
        toast.success("Job saved!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const clearFilters = () => {
    setFilters({ keyword: "", location: "", category: "", type: "", salaryRange: "" });
    setTimeout(fetchJobs, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto">
        <SearchHeader
          filters={filters}
          setFilters={setFilters}
          onSearch={handleSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          title="Opportunity Engine"
          subtitle="Precision search across 150K+ open horizons"
        />

        <div className="p-4 md:p-8">
          {/* Reusable Filter Panel */}
          {showFilters && (
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              onClear={clearFilters}
              onApply={fetchJobs}
            />
          )}
        </div>

        {/* Results Grid */}
        <div className="flex items-center justify-between mb-8 px-2">
           <div>
              <h2 className="text-xl font-black text-gray-800 tracking-tight italic uppercase">Curated Feed</h2>
              <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">Found {jobs.length} Matching Roles</p>
           </div>
           <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mt-1"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Live Updates</span>
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size={64} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-gray-200 shadow-inner">
            <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
              <Briefcase size={40} className="text-gray-100" />
            </div>
            <h3 className="text-xl font-bold text-gray-300">No matching horizons found</h3>
            <p className="text-gray-400 mt-2 text-sm italic">Try broadening your search or clearing filters.</p>
            <Button variant="secondary" onClick={clearFilters} className="mt-8 !rounded-xl">Clear All Filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedJobIds.includes(job._id)}
                onSaveToggle={handleSaveToggle}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FindJobs;
