import React from "react";
import { X, Tag, Briefcase, DollarSign } from "lucide-react";
import Button from "./Button";
import { CATEGORIES, JOB_TYPES, SALARY_RANGES } from "../../utils/data";

const FilterPanel = ({ filters, setFilters, onClear, onApply }) => {
  const isAnyFilterActive = Object.values(filters).some(v => v && v !== "");

  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center justify-between mb-8 px-2">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <Tag size={14} className="text-blue-500" /> Refine Discovery
        </h3>
        {isAnyFilterActive && (
          <button 
            onClick={onClear}
            className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-500 transition-colors flex items-center gap-1"
          >
            Reset All <X size={12} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Industry Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest ml-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Industry Sector
          </label>
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
              className="w-full h-14 border-none rounded-2xl px-6 text-sm font-bold text-gray-600 outline-none bg-gray-50/50 hover:bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Industries</option>
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
               <Briefcase size={16} />
            </div>
          </div>
        </div>

        {/* Job Type Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest ml-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Employment Model
          </label>
          <div className="relative">
            <select
              value={filters.type}
              onChange={(e) => setFilters((p) => ({ ...p, type: e.target.value }))}
              className="w-full h-14 border-none rounded-2xl px-6 text-sm font-bold text-gray-600 outline-none bg-gray-50/50 hover:bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
            >
              <option value="">All Types</option>
              {JOB_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
               <Tag size={16} />
            </div>
          </div>
        </div>

        {/* Salary Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-gray-800 uppercase tracking-widest ml-1 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Compensation
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <select
                value={filters.salaryRange}
                onChange={(e) => setFilters((p) => ({ ...p, salaryRange: e.target.value }))}
                className="w-full h-14 border-none rounded-2xl px-6 text-sm font-bold text-gray-600 outline-none bg-gray-50/50 hover:bg-gray-50 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
              >
                <option value="">Any Salary</option>
                {SALARY_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                 <DollarSign size={16} />
              </div>
            </div>
            
            <Button 
              onClick={onApply} 
              className="h-14 px-8 !rounded-2xl shadow-xl shadow-blue-50"
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
