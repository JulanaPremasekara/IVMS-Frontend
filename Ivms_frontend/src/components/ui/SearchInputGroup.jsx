import React from 'react';
import { Search, ScanLine, Mic } from 'lucide-react';

export const SearchInputGroup = ({ placeholder, onSearch }) => (
  <div className="flex items-center gap-3">
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
      />
    </div>
    <button className="bg-[#1e3a8a] text-white px-8 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-900 transition-all shadow-md">
      <Search className="w-4 h-4" /> Search
    </button>
    <button className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 text-slate-600 font-bold text-xs">
      <ScanLine className="w-5 h-5 text-blue-600" /> Scan
    </button>
    <button className="bg-white border border-slate-200 p-3 rounded-xl hover:bg-slate-50 transition-all">
      <Mic className="w-5 h-5 text-blue-600" />
    </button>
  </div>
);