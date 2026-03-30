import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Briefcase, Heart, CheckCircle, Clock, ArrowRight, 
  TrendingUp, User, Search, MapPin
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const JobSeekerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.ANALYTICS.JOBSEEKER);
      setData(res.data);
    } catch {
      toast.error("Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchDashboardData();
  }, []);

  if (loading) return <Loader fullPage />;

  const stats = [
    { label: "Total Applications", value: data?.totalApplied || 0, icon: Briefcase, color: "blue" },
    { label: "Saved Roles", value: data?.totalSaved || 0, icon: Heart, color: "pink" },
    { label: "Interviews/Reviews", value: data?.statusBreakdown?.["In Review"] || 0, icon: Clock, color: "yellow" },
    { label: "Offers Accepted", value: data?.statusBreakdown?.["Accepted"] || 0, icon: CheckCircle, color: "green" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">Career Mission Control</h1>
            <p className="text-gray-500 font-medium">Welcome back, <span className="text-blue-600">@{user?.name.split(' ')[0]}</span>. Your next career milestone is within reach.</p>
          </div>
          <Button onClick={() => navigate("/find-jobs")} icon={Search} className="!rounded-2xl shadow-xl shadow-blue-100">
            Explore New Roles
          </Button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-3xl font-black text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          {/* Recent Applications Feed */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-black text-gray-800 italic uppercase tracking-tight">Active Applications</h2>
              <Link to="/my-applications" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center gap-1">
                View Full History <ArrowRight size={12} />
              </Link>
            </div>

            <div className="space-y-4">
              {data?.recentApplications?.length === 0 ? (
                <div className="bg-white rounded-[2.5rem] border border-dashed border-gray-100 p-12 text-center">
                  <p className="text-gray-400 font-medium italic mb-6">No active applications currently.</p>
                  <Button variant="secondary" onClick={() => navigate("/find-jobs")} className="!rounded-xl">Start Your Search</Button>
                </div>
              ) : (
                data.recentApplications.map((app) => (
                  <div key={app._id} className="bg-white rounded-3xl p-6 border border-gray-50 shadow-sm flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden">
                        {app.job?.company?.companyLogo ? (
                           <img src={app.job.company.companyLogo} className="w-full h-full object-cover" />
                        ) : (
                          <Briefcase size={20} className="text-gray-200" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-gray-800">{app.job?.title}</h4>
                        <p className="text-xs text-gray-400 font-medium">{app.job?.company?.companyName || "Unknown Company"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className={`text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-widest border ${
                         app.status === 'Accepted' ? 'bg-green-50 text-green-600 border-green-100' :
                         app.status === 'Rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                         app.status === 'In Review' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                         'bg-gray-50 text-gray-500 border-gray-100'
                       }`}>
                         {app.status}
                       </span>
                       <p className="text-[10px] text-gray-300 font-bold mt-2">{new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar Area: Profile & Tips */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform"></div>
               <User size={40} className="opacity-20 mb-6" />
               <h3 className="text-xl font-black italic mb-3">PROFILE STRENGTH</h3>
               <p className="text-blue-100 text-xs font-bold leading-relaxed mb-8">
                 Candidates with complete experience and skills profiles are 60% more likely to be contacted by top recruiters.
               </p>
               <Button 
                variant="secondary" 
                className="w-full !rounded-2xl !bg-white/10 !text-white border border-white/20 hover:!bg-white/20"
                onClick={() => navigate("/profile")}
               >
                 Optimize Profile
               </Button>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                   <TrendingUp size={20} className="text-purple-500" />
                   <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Market Insights</h3>
                </div>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>
                      <p className="text-xs font-bold text-gray-600">Demand for <span className="text-blue-600">React Developers</span> increased by 12% this month.</p>
                   </div>
                   <div className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div>
                      <p className="text-xs font-bold text-gray-600">Remote roles now account for 45% of software job postings.</p>
                   </div>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobSeekerDashboard;
