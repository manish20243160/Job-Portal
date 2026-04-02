import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Briefcase, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

// Components
import Button from "../../components/Common/Button";
import Input from "../../components/Common/Input";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Credentials required");
      return;
    }

    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      toast.success(`Welcome back, ${userData.name}!`);
      
      if (userData.role === "employer") {
        navigate("/employer-dashboard");
      } else {
        navigate("/find-jobs");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Access denied. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="bg-white w-full max-w-lg p-12 rounded-[3rem] shadow-2xl border border-gray-100 flex flex-col items-center animate-in zoom-in duration-500 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
        
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white mb-8 shadow-2xl ring-8 ring-blue-50">
          <Briefcase size={40} />
        </div>

        <h1 className="text-4xl font-black text-gray-800 italic uppercase tracking-tighter mb-2">PORTAL ACCESS</h1>
        <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-[0.3em] mb-12">Logistics & Recruitment Management</p>

        <form onSubmit={handleSubmit} className="w-full space-y-8">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="operator@system.io"
            icon={Mail}
            required
          />

          <div className="relative">
            <Input
              label="Secret Key"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={Lock}
              required
            />
            <button
               type="button"
               onClick={() => setShowPassword(!showPassword)}
               className="absolute right-4 top-9 text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              loading={loading}
              className="w-full h-16 !rounded-3xl text-lg uppercase font-black tracking-widest shadow-2xl hover:translate-y-[-2px] active:translate-y-[1px] transition-all"
              icon={ChevronRight}
            >
              Authorize Access
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 pt-8">
             <Link to="/signup" className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
               Initialize New Account
             </Link>
             <Link to="/" className="text-[10px] font-black text-blue-600 uppercase tracking-tighter bg-blue-50 px-4 py-2 rounded-xl">
               Return to Landing
             </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
