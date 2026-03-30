import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, User, LogOut, Search, Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAvatarOpen, setIsAvatarOpen] = React.useState(false);
  const avatarRef = React.useRef(null);

  React.useEffect(() => {
    const handler = (e) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return (
    <nav className="relative bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all">
                <Briefcase size={20} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                JobPortal
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/find-jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Find Jobs</Link>
            {user?.role === "jobseeker" && (
              <Link to="/saved-jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Saved Jobs</Link>
            )}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to={user.role === "employer" ? "/employer-dashboard" : "/profile"} className="flex items-center gap-2 text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 hover:bg-white hover:border-blue-200 transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                  <span className="text-sm font-semibold">{user.name}</span>
                </Link>
                <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors" title="Logout">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-600 font-medium hover:text-blue-600 px-4 py-2">Login</Link>
                <Link to="/signup" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-500">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Floating corner avatar for quick access */}
          {user && (
            <div ref={avatarRef} className="absolute right-4 top-3 z-40 block md:block">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setIsAvatarOpen((s) => !s); }}
                className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md bg-white flex items-center justify-center"
                aria-haspopup="true"
                aria-expanded={isAvatarOpen}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-gray-400" />
                )}
              </button>

              {isAvatarOpen && (
                <div className="absolute right-0 mt-12 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-2 text-sm">
                  <Link
                    to={user.role === "employer" ? "/employer-dashboard" : "/profile"}
                    onClick={() => setIsAvatarOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                  >
                    {user.role === "employer" ? "Dashboard" : "Profile"}
                  </Link>
                  <button
                    onClick={() => { setIsAvatarOpen(false); logout(); }}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 animate-in slide-in-from-top duration-300">
          <Link to="/find-jobs" className="block text-gray-600 font-medium py-2">Find Jobs</Link>
          {user?.role === "jobseeker" && (
            <Link to="/saved-jobs" className="block text-gray-600 font-medium py-2">Saved Jobs</Link>
          )}
          {user ? (
             <>
               <Link to={user.role === "employer" ? "/employer-dashboard" : "/profile"} className="block text-gray-600 font-medium py-2">Profile</Link>
               <button onClick={logout} className="block text-red-500 font-medium py-2">Logout</button>
             </>
          ) : (
            <>
              <Link to="/login" className="block text-gray-600 font-medium py-2">Login</Link>
              <Link to="/signup" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-bold">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
