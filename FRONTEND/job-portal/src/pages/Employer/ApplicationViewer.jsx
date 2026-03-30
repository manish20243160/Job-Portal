import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users, CheckCircle, XCircle, Clock, Download, ExternalLink,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const ApplicationViewer = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.APPLICATIONS.EMPLOYER_APPLICATIONS);
      setApplications(res.data);
    } catch {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchApplications();
  }, []);

  const handleStatusUpdate = async (appId, status) => {
    try {
      await axiosInstance.patch(API_PATHS.APPLICATIONS.UPDATE_STATUS(appId), { status });
      setApplications((prev) => prev.map((a) => a._id === appId ? { ...a, status } : a));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Applied": return "bg-blue-50 text-blue-600 border-blue-100";
      case "In Review": return "bg-yellow-50 text-yellow-600 border-yellow-100";
      case "Accepted": return "bg-green-50 text-green-600 border-green-100";
      case "Rejected": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const filteredApps = filterStatus === "All"
    ? applications
    : applications.filter((a) => a.status === filterStatus);

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Hiring Pipeline</h1>
          <p className="text-gray-500 font-medium">Screen candidates and move them through your hiring stages.</p>
        </header>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "Applied", "In Review", "Accepted", "Rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-5 py-2 rounded-2xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                filterStatus === s 
                  ? "bg-blue-600 text-white shadow-lg border-transparent" 
                  : "bg-white text-gray-400 border border-gray-100 hover:border-blue-200 hover:text-blue-500 shadow-sm"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Candidate Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredApps.length === 0 ? (
            <div className="xl:col-span-2 text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-inner">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-gray-100" />
              </div>
              <p className="text-gray-400 font-medium italic">No candidates found in this stage.</p>
            </div>
          ) : (
            filteredApps.map((app) => (
              <div key={app._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 hover:shadow-xl transition-all duration-300 group animate-in slide-in-from-right-4">
                {/* Avatar / Initials */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center shrink-0 border border-gray-50 group-hover:scale-105 transition-transform duration-300 overflow-hidden shadow-inner">
                  {app.applicant?.avatar ? (
                    <img src={app.applicant.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Users size={32} className="text-blue-200" />
                  )}
                </div>

                <div className="flex-1 min-w-0 text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-gray-800 text-lg truncate group-hover:text-blue-600 transition-colors">{app.applicant?.name}</h3>
                    <span className={`text-[10px] px-3 py-1 rounded-full font-extrabold uppercase tracking-widest border self-center sm:self-auto ${getStatusStyle(app.status)} shadow-sm`}>
                      {app.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 font-medium">{app.applicant?.email}</p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-blue-500 shadow-sm">
                      <Clock size={12} />
                    </div>
                    <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">Applied for <span className="text-gray-700">{app.job?.title}</span></p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-6 pt-6 border-t border-gray-50">
                    {app.applicant?.resume && (
                      <a
                        href={app.applicant.resume} target="_blank" rel="noreferrer"
                        className="text-[10px] flex items-center gap-2 text-blue-600 hover:text-blue-700 font-black uppercase tracking-widest bg-blue-50 px-4 py-2.5 rounded-xl transition-all shadow-sm border border-blue-100/50"
                      >
                        <Download size={14} /> Resume
                      </a>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/candidate/${app.applicant?._id}`)}
                      className="text-[10px] font-black uppercase tracking-widest border border-gray-100 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <ExternalLink size={14} className="text-purple-500" /> Full Profile
                    </Button>

                    <div className="flex gap-2 ml-auto">
                      {app.status !== "Accepted" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(app._id, "Accepted")}
                          title="Hire Candidate"
                          className="!p-2 !rounded-xl text-green-500 border-green-100 hover:bg-green-50"
                        >
                          <CheckCircle size={18} />
                        </Button>
                      )}
                      {app.status === "Applied" && (
                         <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(app._id, "In Review")}
                          title="Start Interview"
                          className="!p-2 !rounded-xl text-yellow-500 border-yellow-100 hover:bg-yellow-50"
                        >
                          <ExternalLink size={18} />
                        </Button>
                      )}
                      {app.status !== "Rejected" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusUpdate(app._id, "Rejected")}
                          title="Reject Candidate"
                          className="!p-2 !rounded-xl text-red-400 border-red-100 hover:bg-red-50"
                        >
                          <XCircle size={18} />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default ApplicationViewer;
