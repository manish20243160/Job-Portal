import React from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import Button from "./Button";
import Input from "./Input";

const SearchHeader = ({ 
  filters, 
  setFilters, 
  onSearch, 
  showFilters, 
  setShowFilters,
  title = "Find Your Next Big Opportunity",
  subtitle = "Explore thousands of high-quality job postings"
}) => {
  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 py-16 px-4 relative overflow-hidden">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter italic uppercase drop-shadow-lg">
          {title}
        </h1>
        <p className="text-blue-100 mb-10 text-lg font-bold opacity-80 max-w-2xl mx-auto uppercase tracking-widest text-[11px]">
          {subtitle}
        </p>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); onSearch(); }} 
          className="flex flex-col lg:flex-row gap-4 bg-white/10 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl border border-white/20 animate-in zoom-in-95 duration-500"
        >
          <div className="flex-1 relative group">
            <Input
              placeholder="Job title, keywords, or company..."
              icon={Search}
              className="!bg-white/95 !border-none !h-14 !rounded-2xl !pl-12 !text-gray-800 shadow-inner group-hover:shadow-lg transition-shadow"
              value={filters.keyword}
              onChange={(e) => setFilters((p) => ({ ...p, keyword: e.target.value }))}
            />
          </div>
          
          <div className="lg:w-72 relative group">
            <Input
              placeholder="City, State, or Remote"
              icon={MapPin}
              className="!bg-white/95 !border-none !h-14 !rounded-2xl !pl-12 !text-gray-800 shadow-inner group-hover:shadow-lg transition-shadow"
              value={filters.location}
              onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
            />
          </div>

          <div className="flex gap-3">
             <Button 
               type="submit" 
               className="flex-1 lg:flex-none px-12 h-14 !rounded-2xl !bg-white !text-blue-600 font-black uppercase tracking-widest hover:!bg-blue-50 shadow-xl"
             >
               Find Jobs
             </Button>
             
             {setShowFilters && (
               <Button
                 type="button"
                 variant="secondary"
                 onClick={() => setShowFilters(!showFilters)}
                 className={`!p-4 !rounded-2xl h-14 transition-all ${
                   showFilters ? "!bg-blue-500 !text-white shadow-inner" : "!bg-white/10 !text-white border-white/20 hover:!bg-white/20"
                 }`}
               >
                 <SlidersHorizontal size={22} strokeWidth={2.5} />
               </Button>
             )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchHeader;
