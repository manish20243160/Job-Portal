import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase, Search, MapPin, Edit, Trash2, Power, PowerOff,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Loader from "../../components/Common/Loader";

const ManageJobs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.JOBS.GET_MY_JOBS);
      setJobs(res.data);
    } catch {
      toast.error("Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchJobs();
  }, []);

  const handleToggleStatus = async (jobId) => {
    try {
      await axiosInstance.patch(API_PATHS.JOBS.TOGGLE_STATUS(jobId));
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, isClosed: !j.isClosed } : j));
      toast.success("Job status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await axiosInstance.delete(API_PATHS.JOBS.DELETE(jobId));
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success("Job deleted successfully");
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const filteredJobs = jobs.filter((j) => j.title.toLowerCase().includes(filter.toLowerCase()));

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Your Postings</h1>
            <p className="text-gray-500 font-medium">Keep your job listings up to date.</p>
          </div>
          <Button onClick={() => navigate("/post-job")} icon={Briefcase}>
            Post New Job
          </Button>
        </header>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="max-w-sm">
              <Input
                placeholder="Search jobs by title..."
                icon={Search}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-5">Job Details</th>
                  <th className="px-8 py-5">Current Status</th>
                  <th className="px-8 py-5">Created At</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-20 text-center text-gray-400">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search size={32} strokeWidth={1} />
                      </div>
                      <p className="font-medium">No results matching your query.</p>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-1 font-medium">
                          <span className="flex items-center gap-1"><MapPin size={12} className="text-blue-400" /> {job.location || "Remote"}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                          <span>{job.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest ${job.isClosed ? "bg-red-50 text-red-600 border border-red-100" : "bg-green-50 text-green-600 border border-green-100"}`}>
                          {job.isClosed ? "Inactive" : "Active"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-xs text-gray-500 font-medium">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/edit-job/${job._id}`)}
                            title="Edit Listing"
                            className="!p-2 !rounded-xl"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleToggleStatus(job._id)}
                            title={job.isClosed ? "Re-activate" : "De-activate"}
                            className={`!p-2 !rounded-xl ${job.isClosed ? "text-green-500 hover:text-green-600" : "text-yellow-500 hover:text-yellow-600"}`}
                          >
                            {job.isClosed ? <Power size={16} /> : <PowerOff size={16} />}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleDelete(job._id)}
                            title="Delete Permanently"
                            className="!p-2 !rounded-xl text-red-400 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageJobs;
