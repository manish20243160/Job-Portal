import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Mail, Edit2, CheckCircle, Upload, FileText, X, Globe, MapPin, Tag, Users,
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

const EmployerProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    companyDescription: "",
    companyWebsite: "",
    location: "",
    industry: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.USER.GET_PROFILE);
      setProfile(res.data);
      setFormData({
        name: res.data.name || "",
        companyName: res.data.companyName || "",
        companyDescription: res.data.companyDescription || "",
        companyWebsite: res.data.companyWebsite || "",
        location: res.data.location || "",
        industry: res.data.industry || "",
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

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let companyLogo = profile.companyLogo;
      if (logoFile) {
        companyLogo = await uploadImage(logoFile);
      }

      const res = await axiosInstance.put(API_PATHS.USER.UPDATE_PROFILE, {
        ...formData,
        companyLogo,
      });

      setProfile(res.data);
      updateUser(res.data);
      setEditing(false);
      setLogoFile(null);
      setLogoPreview(null);
      toast.success("Company profile updated!");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const calculateCompletion = () => {
    if (!profile) return 0;
    const fields = ['companyName', 'companyDescription', 'companyLogo', 'companyWebsite', 'location', 'industry'];
    const filled = fields.filter(f => profile[f]).length;
    return Math.round((filled / fields.length) * 100);
  };

  if (loading) return <Loader fullPage />;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar logout={logout} />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight italic uppercase">Corporate Identity Hub</h1>
              <p className="text-gray-500 font-medium">Manage your organization's global footprint and brand assets.</p>
            </div>
            {!editing && (
              <Button variant="secondary" onClick={() => setEditing(true)} icon={Edit2}>
                Modify Identity
              </Button>
            )}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
            {/* Left Col: Primary Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-8 pb-10 border-b border-gray-50/50">
                  <div className="w-28 h-28 rounded-[2rem] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border border-gray-100 overflow-hidden shrink-0 shadow-inner group relative">
                    {(logoPreview || profile?.companyLogo) ? (
                      <img src={logoPreview || profile.companyLogo} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <Building2 size={40} className="text-blue-200" />
                    )}
                    {editing && (
                      <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload size={24} className="text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    {editing ? (
                      <Input
                        label="Organization Name"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Organization Name"
                        className="mb-2"
                      />
                    ) : (
                      <h2 className="text-3xl font-black text-gray-800 tracking-tight leading-tight">
                        {profile?.companyName || "Organization Hub"}
                      </h2>
                    )}
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3">
                       <span className="text-xs text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                         <Mail size={14} className="text-blue-500" /> {profile?.email}
                       </span>
                       <span className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-full font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
                         Verified Partner
                       </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {editing ? (
                       <>
                        <Input
                          label="Official Website"
                          icon={Globe}
                          value={formData.companyWebsite}
                          onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                          placeholder="https://company.com"
                        />
                        <Input
                          label="Headquarters Location"
                          icon={MapPin}
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          placeholder="e.g. London, UK"
                        />
                        <Input
                          label="Primary Industry"
                          icon={Tag}
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          placeholder="e.g. Artificial Intelligence"
                        />
                        <Input
                          label="Representative Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                       </>
                     ) : (
                       <>
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Globe size={12} className="text-blue-500" /> Digital Domain
                           </p>
                           <p className="text-sm font-bold text-gray-800 truncate">{profile?.companyWebsite || "Not provided"}</p>
                        </div>
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <MapPin size={12} className="text-red-400" /> Global HQ
                           </p>
                           <p className="text-sm font-bold text-gray-800">{profile?.location || "Not provided"}</p>
                        </div>
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                              <Tag size={12} className="text-purple-400" /> Industry
                           </p>
                           <p className="text-sm font-bold text-gray-800">{profile?.industry || "Not provided"}</p>
                        </div>
                        <div className="bg-gray-50/50 p-6 rounded-3xl border border-gray-100 space-y-2">
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Representative</p>
                           <p className="text-sm font-bold text-gray-800">{profile?.name}</p>
                        </div>
                       </>
                     )}
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 mb-4 block">Organization Mission</label>
                    {editing ? (
                      <Input
                        type="textarea"
                        value={formData.companyDescription}
                        onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
                        rows={6}
                        placeholder="Tell the world about your mission and team culture..."
                      />
                    ) : (
                      <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-5 group-hover:opacity-10 transition duration-1000"></div>
                        <p className="relative bg-white text-gray-600 text-sm leading-relaxed whitespace-pre-line p-8 rounded-[2rem] border border-gray-100 italic">
                          {profile?.companyDescription || "No company mission statement added. Share your vision to attract top talent!"}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {editing && (
                <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <Button onClick={handleSave} loading={saving} className="flex-1 h-14 !rounded-2xl shadow-xl shadow-blue-100" icon={CheckCircle}>
                    Publish Brand Identity
                  </Button>
                  <Button variant="secondary" onClick={() => setEditing(false)} className="h-14 !rounded-2xl" icon={X}>
                    Discard
                  </Button>
                </div>
              )}
            </div>

            {/* Right Col: Promotion / Status */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                
                <div className="space-y-6 relative z-10">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <FileText size={24} className="text-blue-300" />
                   </div>
                   <h3 className="text-xl font-black italic tracking-tighter">HIRING<br/>VANTAGE</h3>
                   <p className="text-blue-100 text-[11px] leading-relaxed font-bold uppercase tracking-widest opacity-70">
                     Verified premium corporate profiles attract 40% more high-tier talent.
                   </p>
                   
                   <div className="pt-8 border-t border-white/10">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-blue-300">Brand Power</span>
                         <span className="text-xs font-black">{calculateCompletion()}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                         <div 
                           className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-1000 shadow-lg"
                           style={{ width: `${calculateCompletion()}%` }}
                         />
                      </div>
                   </div>
                </div>
              </div>

              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mx-auto">
                   <Users size={20} />
                </div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Growth Partnership</h4>
                <p className="text-gray-500 text-[11px] font-bold leading-relaxed px-2">Need help optimizing your brand presence? Our team is standing by.</p>
                <Button variant="ghost" size="sm" className="w-full !rounded-xl border border-gray-100 hover:bg-gray-50">Support Hub</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmployerProfilePage;
