import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, ArrowUpRight } from "lucide-react";

const formatTimeAgo = (dateString) => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInMs = now - past;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInDays > 0) return `${diffInDays}d ago`;
  if (diffInHours > 0) return `${diffInHours}h ago`;
  return "Just now";
};

const JobCard = ({ job, isSaved, onSaveToggle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 group relative flex flex-col h-full"
    >
      {/* Top Section: Logo & Save */}
      <div className="flex items-start justify-between mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center border border-gray-50 group-hover:rotate-6 transition-transform duration-500 overflow-hidden shadow-inner">
          {job.company?.companyLogo || job.company?.avatar ? (
            <img src={job.company.companyLogo || job.company.avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <Briefcase size={28} className="text-blue-200" />
          )}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSaveToggle(job._id); }}
          className={`p-3.5 rounded-2xl border transition-all duration-300 ${
            isSaved 
              ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100 scale-110" 
              : "bg-white border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/50"
          }`}
        >
          {isSaved ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
        </button>
      </div>

      {/* Main Info */}
      <div className="flex-1">
        <h3 className="font-black text-gray-800 text-xl mb-2 tracking-tight line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
          <Link to={`/job/${job._id}`}>{job.title}</Link>
        </h3>
        <p className="text-sm text-gray-400 font-black uppercase tracking-widest mb-6">
          {job.company?.companyName || job.company?.name || "Global Enterprise"}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <MapPin size={12} className="text-red-400" />
            <span>{job.location || "Remote"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <Clock size={12} className="text-purple-400" />
            <span>{job.type}</span>
          </div>
          {job.salaryMin && (
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-2 rounded-xl border border-blue-100">
              <DollarSign size={12} />
              <span>{job.salaryMin}{job.salaryMax ? `-${job.salaryMax}` : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
           <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
             {formatTimeAgo(job.createdAt)}
           </span>
        </div>
        <Link
          to={`/job/${job._id}`}
          className="bg-gray-900 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-gray-100 hover:shadow-blue-200"
        >
          View Details
          <ArrowUpRight size={14} strokeWidth={3} />
        </Link>
      </div>
    </motion.div>
  );
};

export default JobCard;
