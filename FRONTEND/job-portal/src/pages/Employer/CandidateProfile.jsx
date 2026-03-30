import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  User, Mail, FileText, Briefcase, MapPin, Globe,
  ShieldCheck, ArrowLeft, Download, Award, History,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";

// Components
import Navbar from "../../components/layout/Navbar";
import Button from "../../components/Common/Button";
import Loader from "../../components/Common/Loader";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPublicProfile = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USER.GET_PUBLIC_PROFILE(id));
      setProfile(res.data);
    } catch {
      toast.error("Candidate profile inaccessible");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProfile();
  }, [id]);

  if (loading) return <Loader fullPage />;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
          className="mb-10 !rounded-full bg-white border-gray-100 shadow-sm"
        >
          Return to Pipeline
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Info */}
          <div className="lg:col-span-2 space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-2xl relative overflow-hidden">
               {/* Aesthetic Background */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-bl-[8rem] -mr-12 -mt-12"></div>
               
               <div className="relative z-10">
                <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
                   <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-2xl overflow-hidden border-4 border-white">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} />
                      )}
                   </div>
                   <div className="text-center sm:text-left">
                      <h1 className="text-4xl font-black text-gray-800 tracking-tight leading-none mb-3">{profile.name}</h1>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                         <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1.5">
                            <Mail size={14} /> {profile.email}
                         </span>
                         <span className="bg-green-50 text-green-600 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border border-green-100 flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Identity Verified
                         </span>
                      </div>
                   </div>
                </div>

                <div className="space-y-12">
                   {/* Bio */}
                   <section>
                      <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-3">
                         <span className="w-8 h-1 bg-blue-600 rounded-full"></span> Professional Moto
                      </h2>
                      <p className="text-gray-600 font-medium leading-relaxed bg-gray-50/50 p-6 rounded-3xl border border-gray-50">
                         {profile.bio || "No biography provided by the candidate."}
                      </p>
                   </section>

                   {/* Skills */}
                   <section>
                      <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-4 flex items-center gap-3">
                         <span className="w-8 h-1 bg-purple-600 rounded-full"></span> Core Architecture
                      </h2>
                      <div className="flex flex-wrap gap-2">
                         {(!profile.skills || profile.skills.length === 0) ? (
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2">No specialized expertise listed.</p>
                         ) : (
                           profile.skills.map(skill => (
                              <span key={skill} className="bg-white px-5 py-2.5 rounded-2xl text-xs font-extrabold text-gray-700 shadow-sm border border-gray-100 flex items-center gap-2">
                                 <Award size={14} className="text-blue-500" /> {skill}
                              </span>
                           ))
                         )}
                      </div>
                   </section>

                   {/* Experience */}
                   <section>
                      <h2 className="text-lg font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-3">
                         <span className="w-8 h-1 bg-green-500 rounded-full"></span> Operational History
                      </h2>
                      <div className="space-y-6">
                         {(!profile.experience || profile.experience.length === 0) ? (
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 italic">Standard record entry missing.</p>
                         ) : (
                            profile.experience.map((exp, idx) => (
                               <div key={idx} className="relative pl-8 border-l-2 border-dashed border-gray-100 pb-8 last:pb-0">
                                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-sm"></div>
                                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                        <div>
                                           <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight">{exp.role}</h4>
                                           <p className="text-xs font-bold text-blue-600">{exp.company}</p>
                                        </div>
                                        <div className="bg-gray-50 px-3 py-1 rounded-full text-[9px] font-black text-gray-400 uppercase tracking-widest w-fit">
                                           {exp.duration}
                                        </div>
                                     </div>
                                     <p className="text-xs text-gray-500 leading-relaxed font-medium">{exp.description}</p>
                                  </div>
                               </div>
                            ))
                         )}
                      </div>
                   </section>
                </div>
               </div>
            </div>
          </div>

          {/* Action Sidebar */}
          <div className="lg:col-span-1 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl sticky top-24">
               <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8 border-b border-gray-50 pb-4 italic">Security Assets</h3>
               
               <div className="space-y-6">
                 {profile.resume ? (
                   <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden group">
                      <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform"></div>
                      <FileText size={40} className="mb-6 opacity-30 group-hover:rotate-12 transition-transform" />
                      <h4 className="font-extrabold mb-2 tracking-tight">Verified Resume</h4>
                      <p className="text-[10px] text-blue-100 leading-relaxed font-medium mb-8">Asset validated and secured within the decentralized hub.</p>
                      <a
                        href={profile.resume} target="_blank" rel="noreferrer"
                        className="flex items-center justify-center gap-3 w-full bg-white text-blue-600 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-transform"
                      >
                         <Download size={18} /> Download Asset
                      </a>
                   </div>
                 ) : (
                   <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center italic text-gray-400 text-xs">
                      Candidate has not attached a primary resume asset.
                   </div>
                 )}

                 <div className="bg-white rounded-2xl p-6 border border-gray-100">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Meta Analysis</h5>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                          <MapPin size={16} className="text-blue-400" /> Geography: <b>Not Specified</b>
                       </div>
                       <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                          <Globe size={16} className="text-purple-400" /> Availability: <b>High Priority</b>
                       </div>
                       <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                          <History size={16} className="text-green-500" /> Engagement: <b>Active</b>
                       </div>
                    </div>
                 </div>
               </div>
               
               <div className="mt-10 pt-8 border-t border-gray-50 text-center">
                  <p className="text-[10px] text-gray-300 font-bold italic uppercase tracking-tighter leading-relaxed">
                     Candidate metadata is strictly for internal logistics and recruitment purposes.
                  </p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;
