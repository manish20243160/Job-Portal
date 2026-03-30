import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Plus, CheckCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const EmployerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ANALYTICS.EMPLOYER);
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchStats();
  }, []);

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Welcome, {user?.companyName || user?.name}! 👋</h1>
            <p className="text-gray-500 font-medium">Capture the best talent for your team.</p>
          </div>
          <Button onClick={() => navigate("/post-job")} icon={Plus}>
            Post New Job
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
              <Plus size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Jobs</p>
              <h3 className="text-3xl font-extrabold text-gray-800">{stats?.analytics?.totalJobsPosted || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 animate-in fade-in zoom-in duration-500">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
              <Users size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Applications</p>
              <h3 className="text-3xl font-extrabold text-gray-800">{stats?.analytics?.totalApplicationsReceived || 0}</h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 animate-in fade-in zoom-in duration-700">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 shadow-inner">
              <CheckCircle size={28} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hired</p>
              <h3 className="text-3xl font-extrabold text-gray-800">{stats?.analytics?.totalHired || 0}</h3>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
              <h3 className="font-bold text-gray-800">Recently Posted Jobs</h3>
              <Link to="/manage-jobs" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stats?.recentJobs?.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <p className="font-medium italic">No jobs posted recently.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {stats?.recentJobs?.map((job) => (
                    <div key={job._id} className="p-5 hover:bg-blue-50/30 transition-colors flex items-center justify-between group">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 group-hover:text-blue-600 transition-colors">{job.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{job.type} • {job.location || "Remote"}</p>
                      </div>
                      <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${job.isClosed ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {job.isClosed ? "Closed" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0">
              <h3 className="font-bold text-gray-800">New Applications</h3>
              <Link to="/applicants" className="text-sm font-bold text-blue-600 hover:text-blue-700">View All</Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              {stats?.recentApplications?.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <p className="font-medium italic">No applications received yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {stats?.recentApplications?.map((app) => (
                    <div key={app._id} className="p-5 hover:bg-purple-50/30 transition-colors flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden border border-gray-50 group-hover:border-purple-200 group-hover:shadow-sm transition-all">
                          {app.applicant?.avatar ? (
                            <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Users size={18} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-800">{app.applicant?.name}</h4>
                          <p className="text-[10px] text-gray-500 font-medium">applied for <span className="text-blue-600">{app.job?.title}</span></p>
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;
