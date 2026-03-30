import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail, Lock, User as UserIcon, Eye, EyeOff, Briefcase, Users, Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  validateEmail, validatePassword, validateAvatar,
} from "../../utils/helper";
import uploadImage from "../../utils/uploadImage";

// Components
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";

const Signup = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    avatar: null,
    avatarPreview: null,
    loading: false,
    errors: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormState((prev) => ({
      ...prev,
      avatar: file,
      avatarPreview: URL.createObjectURL(file),
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formState.name.trim()) errors.name = "Identity required";
    const emailError = validateEmail(formState.email);
    if (emailError) errors.email = emailError;
    const passwordError = validatePassword(formState.password);
    if (passwordError) errors.password = passwordError;
    const avatarError = validateAvatar(formState.avatar);
    if (avatarError) errors.avatar = avatarError;
    if (!formState.role) errors.role = "Selection required";
    setFormState((prev) => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setFormState((prev) => ({ ...prev, loading: true }));

    try {
      let avatarUrl = "";
      if (formState.avatar) {
        avatarUrl = await uploadImage(formState.avatar);
      }

      const userData = await register({
        name: formState.name,
        email: formState.email,
        password: formState.password,
        role: formState.role,
        avatar: avatarUrl,
      });

      toast.success("Identity Secured! Welcome 🎉");

      if (userData.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/find-jobs");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration sequence failed.";
      toast.error(msg);
      setFormState((prev) => ({ ...prev, loading: false, errors: { submit: msg } }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="bg-white w-full max-w-lg p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in zoom-in duration-500 relative overflow-hidden">
        {/* Aesthetic background element */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>
        
          <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 mb-6 shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Briefcase className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight italic">JOBPORTAL</h2>
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Initialize your professional footprint</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            placeholder="e.g. Alexander Pierce"
            icon={UserIcon}
            error={formState.errors.name}
            required
          />

          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            icon={Mail}
            error={formState.errors.email}
            required
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              error={formState.errors.password}
              required
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-4 top-9 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Identity Profile</label>
            <div className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shadow-inner shrink-0 group relative">
                {formState.avatarPreview ? (
                  <img src={formState.avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon className="text-blue-200" size={32} />
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                   <Upload size={18} className="text-white" />
                   <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div className="flex-1">
                 <p className="text-xs font-bold text-gray-700">Digital Avatar</p>
                 <p className="text-[10px] text-gray-400 font-medium">Standard JPG/PNG accepted.</p>
              </div>
            </div>
            {formState.errors.avatar && <p className="text-[10px] text-red-500 font-bold ml-1">{formState.errors.avatar}</p>}
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Operational Role</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormState((prev) => ({ ...prev, role: "jobseeker", errors: { ...prev.errors, role: "" } }))}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all group ${formState.role === "jobseeker" ? "bg-blue-600 text-white border-blue-600 shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:text-blue-500 shadow-sm"}`}
              >
                <Users size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Seeker</span>
              </button>
              <button
                type="button"
                onClick={() => setFormState((prev) => ({ ...prev, role: "employer", errors: { ...prev.errors, role: "" } }))}
                className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border-2 transition-all group ${formState.role === "employer" ? "bg-purple-600 text-white border-purple-600 shadow-xl scale-105" : "bg-white border-gray-100 text-gray-400 hover:border-purple-200 hover:text-purple-500 shadow-sm"}`}
              >
                <Briefcase size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Recruiter</span>
              </button>
            </div>
            {formState.errors.role && <p className="text-[10px] text-red-500 font-bold text-center mt-1">{formState.errors.role}</p>}
          </div>

          <Button type="submit" loading={formState.loading} className="w-full h-14 !rounded-2xl shadow-xl mt-4">
            Sign Up
          </Button>

          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest pt-4">
            Already registered?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;