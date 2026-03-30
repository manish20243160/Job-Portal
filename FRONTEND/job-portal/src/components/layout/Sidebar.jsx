import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Plus, Briefcase, Users, Building2, LogOut, Search, Heart, List, User, Briefcase as JobIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ logout }) => {
  const location = useLocation();
  const { user } = useAuth();

  const employerItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/employer-dashboard" },
    { icon: Plus, label: "Post a Job", path: "/post-job" },
    { icon: Briefcase, label: "My Jobs", path: "/manage-jobs" },
    { icon: Users, label: "Applications", path: "/applicants" },
    { icon: Building2, label: "Company Profile", path: "/company-profile" },
  ];

  const jobseekerItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/jobseeker-dashboard" },
    { icon: Search, label: "Job Hub", path: "/find-jobs" },
    { icon: List, label: "My Applications", path: "/my-applications" },
    { icon: Heart, label: "Saved Roles", path: "/saved-jobs" },
    { icon: User, label: "Professional Profile", path: "/profile" },
  ];

  const menuItems = user?.role === "employer" ? employerItems : jobseekerItems;

  return (
    <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md">
            <JobIcon size={18} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            JobPortal
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                  : "text-gray-500 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
