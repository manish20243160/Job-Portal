import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, FileText, Briefcase, CheckCircle, Clock,
  Upload, Trash2, SlidersHorizontal, LogOut, Plus, X,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useAuth } from "../../context/AuthContext";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";

// Components
import Sidebar from "../../components/layout/Sidebar";
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";
import Loader from "../../components/Common/Loader";

const UserProfile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: [],
    experience: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USER.GET_PROFILE);
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        bio: res.data.bio || "",
        skills: res.data.skills || [],
        experience: res.data.experience || [],
      });
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchProfile();
  }, []);

  const calculateCompleteness = () => {
    if (!profile) return 0;
    let score = 0;
    if (profile.name) score += 20;
    if (profile.avatar) score += 20;
    if (profile.bio) score += 20;
    if (profile.skills?.length > 0) score += 20;
    if (profile.resume) score += 20;
    return score;
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      let avatarUrl = profile.avatar;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }

      let resumeUrl = profile.resume;
      if (resumeFile) {
        const resumeData = new FormData();
        resumeData.append("resume", resumeFile);
        const resUpload = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, resumeData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resumeUrl = resUpload.data.resume;
      }

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, {
        ...formData,
        avatar: avatarUrl,
        resume: resumeUrl,
      });

      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setResumeFile(null);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try {
      await axiosInstance.delete(API_PATHS.USER.DELETE_RESUME);
      setProfile({ ...profile, resume: "" });
      updateUser({ ...user, resume: "" });
      toast.success("Resume deleted");
    } catch {
      toast.error("Failed to delete resume");
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: "", role: "", duration: "", description: "" }]
    });
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...formData.experience];
    updated[index][field] = value;
    setFormData({ ...formData, experience: updated });
  };

  const removeExperience = (index) => {
    setFormData({ ...formData, experience: formData.experience.filter((_, i) => i !== index) });
  };

  const statusColors = {
    Applied: "bg-blue-50 text-blue-600 border-blue-100",
    "In Review": "bg-yellow-50 text-yellow-600 border-yellow-100",
    Accepted: "bg-green-50 text-green-600 border-green-100",
    Rejected: "bg-red-50 text-red-600 border-red-100",
  };

  if (loading) return <Loader fullPage />;

  const completeness = calculateCompleteness();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 overflow-y-auto">
        {/* Profile Protocol Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 sticky top-0 z-30">
          <div>
            <h1 className="text-2xl font-black text-gray-800 tracking-tight italic uppercase">Professional Identity</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1 pl-1">Syncing identity status to global job market</p>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden md:block text-right">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Completeness</p>
                <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
                   <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                    style={{ width: `${completeness}%` }}
                   ></div>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <span className="text-xl font-black text-blue-600">{completeness}%</span>
                <span className="text-[9px] font-black text-gray-300 uppercase vertical-lr tracking-tighter">Verified</span>
             </div>
          </div>
        </div>

        <div className="p-4 md:p-10">
           <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 xl:grid-cols-4 gap-10">
                 {/* Identity Summary */}
                 <div className="xl:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl text-center relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                       
                       <div className="relative z-10">
                          <div className="relative inline-block mb-8">
                             <div className="w-32 h-32 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100 overflow-hidden shadow-inner mx-auto ring-8 ring-gray-50/50 group-hover:scale-105 transition-transform">
                                {(avatarPreview || profile?.avatar) ? (
                                  <img src={avatarPreview || profile.avatar} className="w-full h-full object-cover" />
                                ) : (
                                  <User size={48} className="text-gray-200" />
                                )}
                             </div>
                             {editing && (
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-2xl shadow-xl cursor-pointer hover:bg-blue-700 transition-colors border-4 border-white">
                                   <Upload size={18} />
                                   <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                                </label>
                             )}
                          </div>
                          
                          <h2 className="text-xl font-black text-gray-800 tracking-tight uppercase italic">{profile?.name}</h2>
                          <div className="flex items-center justify-center gap-2 mt-2 py-1 px-3 bg-gray-50 rounded-full w-fit mx-auto border border-gray-100">
                             <Mail size={12} className="text-blue-400" />
                             <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">{profile?.email}</span>
                          </div>

                          <div className="mt-10 space-y-2 pt-8 border-t border-gray-50">
                             <button
                               onClick={() => setActiveTab("profile")}
                               className={`w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all ${
                                 activeTab === "profile" ? "bg-gray-900 text-white shadow-2xl" : "text-gray-400 hover:bg-gray-50"
                               }`}
                             >
                               <span className="flex items-center gap-3"><User size={16} /> Identity Hub</span>
                               {activeTab === "profile" && <CheckCircle size={14} className="text-blue-400" />}
                             </button>
                             <button
                               onClick={() => setActiveTab("applications")}
                               className={`w-full px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all ${
                                 activeTab === "applications" ? "bg-gray-900 text-white shadow-2xl" : "text-gray-400 hover:bg-gray-50"
                               }`}
                             >
                               <span className="flex items-center gap-3"><Briefcase size={16} /> Submissions</span>
                               {activeTab === "applications" && <CheckCircle size={14} className="text-blue-400" />}
                             </button>
                          </div>
                       </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
                       <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform"></div>
                       <div className="relative z-10">
                          <h3 className="text-sm font-black italic uppercase tracking-widest mb-4">Elite Tier Status</h3>
                          <p className="text-[10px] font-bold text-white/70 uppercase leading-relaxed tracking-wide">
                            Maintaining 80%+ profile completeness grants priority visibility to top-tier recruiters and corporate headquarters.
                          </p>
                       </div>
                    </div>
                 </div>

                 {/* Information Core */}
                 <div className="xl:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    {activeTab === "profile" ? (
                      <div className="space-y-8">
                        <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl">
                          <div className="flex items-center justify-between mb-12 pb-6 border-b border-gray-50">
                            <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] flex items-center gap-4">
                               <span className="w-10 h-1 bg-blue-600 rounded-full"></span> Professional Briefing
                            </h3>
                            {!editing ? (
                              <Button variant="secondary" size="sm" onClick={() => setEditing(true)} icon={SlidersHorizontal} className="!text-[10px] !rounded-xl">
                                Modify Briefing
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" onClick={() => setEditing(false)} icon={X} className="!text-red-500 !text-[10px] !rounded-xl">
                                Discard Changes
                              </Button>
                            )}
                          </div>

                          <div className="space-y-12">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <Input
                                  label="Identity Primary Name"
                                  value={formData.name}
                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                  disabled={!editing}
                                  className="!bg-gray-50/50 !rounded-2xl"
                                />
                                <Input
                                  label="Professional Mission / Bio"
                                  type="textarea"
                                  rows={3}
                                  value={formData.bio}
                                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                  disabled={!editing}
                                  className="!bg-gray-50/50 !rounded-2xl"
                                  placeholder="Short summary of your career objectives..."
                                />
                             </div>

                             {/* Skill Matrix */}
                             <div className="space-y-6">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                   <Plus size={12} className="text-blue-500" /> Competency Matrix
                                </label>
                                <div className="flex flex-wrap gap-3">
                                   {formData.skills.map(skill => (
                                     <span key={skill} className="bg-blue-50/50 text-blue-700 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border border-blue-100 animate-in zoom-in-95 group">
                                        {skill}
                                        {editing && (
                                          <button onClick={() => removeSkill(skill)} className="text-blue-300 hover:text-red-500 transition-colors">
                                            <X size={14} />
                                          </button>
                                        )}
                                     </span>
                                   ))}
                                   {editing && (
                                     <div className="flex items-center gap-3 bg-white p-1 rounded-2xl border-2 border-dashed border-gray-100 pl-4 focus-within:border-blue-400 transition-all">
                                        <input
                                          type="text"
                                          value={skillInput}
                                          onChange={(e) => setSkillInput(e.target.value)}
                                          onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                          placeholder="Define skill..."
                                          className="text-[10px] font-black uppercase tracking-widest outline-none bg-transparent w-24"
                                        />
                                        <button onClick={addSkill} className="bg-blue-600 text-white p-2 rounded-xl"><Plus size={14} /></button>
                                     </div>
                                   )}
                                </div>
                             </div>

                             {/* Experience Timeline */}
                             <div className="space-y-8">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                     <Briefcase size={12} className="text-purple-500" /> Work Architecture
                                  </label>
                                  {editing && <Button variant="ghost" size="sm" onClick={addExperience} icon={Plus} className="!text-[9px] !rounded-lg bg-purple-50 text-purple-600 overflow-hidden">Add Milestone</Button>}
                                </div>
                                
                                <div className="space-y-6 relative before:absolute before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-gray-100">
                                   {formData.experience.length === 0 ? (
                                     <div className="text-center py-12 bg-gray-50/30 rounded-[2rem] border border-dashed border-gray-200">
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Historical data unavailable</p>
                                     </div>
                                   ) : (
                                     formData.experience.map((exp, idx) => (
                                       <div key={idx} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-xl relative ml-16 animate-in slide-in-from-left-4 duration-500">
                                          <div className="absolute -left-[54px] top-10 w-4 h-4 rounded-full bg-purple-600 ring-8 ring-purple-50 border-2 border-white z-10"></div>
                                          {editing && (
                                            <button onClick={() => removeExperience(idx)} className="absolute top-6 right-6 text-gray-300 hover:text-red-500 transition-colors">
                                               <Trash2 size={18} />
                                            </button>
                                          )}
                                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                             <Input
                                               label="Establishment"
                                               value={exp.company}
                                               onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
                                               disabled={!editing}
                                               className="!bg-gray-50/20"
                                             />
                                             <Input
                                               label="Designation / Role"
                                               value={exp.role}
                                               onChange={(e) => handleExperienceChange(idx, "role", e.target.value)}
                                               disabled={!editing}
                                               className="!bg-gray-50/20"
                                             />
                                             <Input
                                               label="Temporal Duration"
                                               value={exp.duration}
                                               onChange={(e) => handleExperienceChange(idx, "duration", e.target.value)}
                                               disabled={!editing}
                                               className="!bg-gray-50/20"
                                             />
                                          </div>
                                          <Input
                                            label="Objective Summary"
                                            type="textarea"
                                            rows={2}
                                            value={exp.description}
                                            onChange={(e) => handleExperienceChange(idx, "description", e.target.value)}
                                            disabled={!editing}
                                            className="!bg-gray-50/20"
                                          />
                                       </div>
                                     ))
                                   )}
                                </div>
                             </div>

                             {/* Resume Asset Management */}
                             <div className="space-y-6 pt-12 border-t border-gray-50">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3">
                                   <FileText size={12} className="text-green-500" /> Identity Asset: Resume
                                </label>
                                <div className="bg-gray-900 rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-8 text-white relative overflow-hidden group">
                                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/20 to-transparent"></div>
                                   <div className="flex items-center gap-6 relative z-10">
                                      <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                         <FileText size={32} />
                                      </div>
                                      <div>
                                         <p className="font-extrabold italic uppercase tracking-tight text-lg">Curriculum Vitae</p>
                                         <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] mt-1">
                                            {profile?.resume ? "Primary Asset Synchronized" : "Asset Required for Mission Entry"}
                                         </p>
                                      </div>
                                   </div>
                                   
                                   <div className="flex items-center gap-4 relative z-10">
                                      {profile?.resume && (
                                       <>
                                         <a
                                           href={profile.resume} target="_blank" rel="noreferrer"
                                           className="bg-white group-hover:bg-blue-50 text-gray-900 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
                                         >
                                           View Asset
                                         </a>
                                         <button
                                           onClick={handleDeleteResume}
                                           className="p-3 text-white/40 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all"
                                         >
                                           <Trash2 size={20} />
                                         </button>
                                       </>
                                      )}
                                      <label className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-900/40 hover:bg-blue-500 transition-all flex items-center gap-3 cursor-pointer">
                                        <Upload size={16} /> {profile?.resume ? "Sync New Asset" : "Import Asset"}
                                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="hidden" />
                                      </label>
                                   </div>
                                </div>
                                {resumeFile && (
                                  <div className="flex items-center gap-3 px-6 py-3 bg-green-50/50 rounded-2xl border border-green-100 animate-in slide-in-from-top-2">
                                     <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                     <span className="text-[10px] text-green-600 font-black uppercase tracking-widest">Awaiting Transmission: {resumeFile.name} (Identity Package Complete)</span>
                                  </div>
                                )}
                             </div>
                          </div>

                          {editing && (
                            <div className="mt-12 pt-8 border-t border-gray-50 animate-in fade-in slide-in-from-bottom-4">
                              <Button onClick={handleUpdate} loading={saving} size="lg" className="w-full !rounded-2xl shadow-2xl shadow-blue-100" icon={CheckCircle}>
                                Push Technical Briefing Updates
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-[3rem] p-10 border border-gray-100 shadow-2xl min-h-[600px]">
                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.3em] mb-12 pb-6 border-b border-gray-50 flex items-center justify-between">
                           Mission Submission History
                           <span className="bg-gray-50 text-gray-500 text-[9px] px-4 py-1.5 rounded-full border border-gray-100 shadow-inner">{profile?.applications?.length || 0} DEPLOYMENTS</span>
                        </h3>

                        {(!profile?.applications || profile.applications.length === 0) ? (
                          <div className="text-center py-32 opacity-20">
                            <SlidersHorizontal size={64} className="mx-auto mb-6" />
                            <p className="font-black uppercase tracking-[0.4em] text-[10px]">Registry is currently inactive</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {profile.applications.map((app) => (
                              <div key={app._id} className="group bg-gray-50/20 hover:bg-white p-6 rounded-[2rem] border border-gray-50 hover:border-blue-100 hover:shadow-2xl transition-all duration-500 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-6 relative z-10">
                                  <div className="w-16 h-16 rounded-[1.25rem] bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform overflow-hidden">
                                    {app.job?.company?.companyLogo || app.job?.company?.avatar ? (
                                      <img src={app.job.company.companyLogo || app.job.company.avatar} className="w-full h-full object-cover" />
                                    ) : (
                                      <Briefcase size={28} className="text-gray-200" />
                                    )}
                                  </div>
                                  <div>
                                    <h4 className="font-black text-gray-800 text-sm italic uppercase tracking-tight group-hover:text-blue-600 transition-colors">{app.job?.title}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                                       {app.job?.company?.companyName || app.job?.company?.name}
                                       <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                                       {app.job?.location || "Remote"}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-3 relative z-10">
                                  <span className={`text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-[0.2em] border shadow-sm ${statusColors[app.status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
                                    {app.status}
                                  </span>
                                  <div className="flex items-center gap-2 text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                                     <Clock size={12} className="text-gray-200" /> MISSION INITIATED: {new Date(app.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
