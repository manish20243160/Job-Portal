import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Briefcase, Clock, Calendar, ArrowRight, XCircle } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Loader from "../../components/Common/Loader";

const MyApplications = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.APPLICATIONS.MY_APPLICATIONS);
      setApplications(res.data);
    } catch {
      toast.error("Failed to load your applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter((app) => 
    app.job?.title.toLowerCase().includes(filter.toLowerCase()) ||
    app.job?.company?.companyName?.toLowerCase().includes(filter.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "Accepted": return "bg-green-50 text-green-600 border-green-100";
      case "Rejected": return "bg-red-50 text-red-600 border-red-100";
      case "In Review": return "bg-blue-50 text-blue-600 border-blue-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Your Career Progress</h1>
            <p className="text-gray-500 font-medium">Track all your active job applications in one place.</p>
          </div>
          <div className="max-w-xs w-full">
            <Input
              placeholder="Filter by job or company..."
              icon={Search}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </header>

        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-20 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-200 mx-auto mb-6">
              <Briefcase size={40} strokeWidth={1} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No applications found</h2>
            <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 font-medium italic">
              You haven't applied to any jobs that match your filter. Start your search now!
            </p>
            <Button onClick={() => navigate("/find-jobs")} variant="primary" icon={ArrowRight}>
              Explore Opportunities
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {filteredApplications.map((app) => (
              <div key={app._id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group animate-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:border-blue-200 transition-colors">
                      {app.job?.company?.companyLogo ? (
                        <img src={app.job.company.companyLogo} alt="Logo" className="w-full h-full object-cover" />
                      ) : (
                        <Briefcase size={24} className="text-blue-200" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">
                        {app.job?.title}
                      </h3>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mt-0.5">
                        {app.job?.company?.companyName || "Anonymous Company"}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tighter bg-gray-50 px-3 py-2 rounded-xl">
                    <MapPin size={12} className="text-blue-400" />
                    {app.job?.location || "Remote"}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-tighter bg-gray-50 px-3 py-2 rounded-xl">
                    <Clock size={12} className="text-purple-400" />
                    {app.job?.type}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Calendar size={12} />
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                   </div>
                   <Link to={`/job/${app.job?._id}`} className="text-xs font-black text-blue-600 hover:text-blue-700 flex items-center gap-1 group/link">
                      Job Details <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                   </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyApplications;
