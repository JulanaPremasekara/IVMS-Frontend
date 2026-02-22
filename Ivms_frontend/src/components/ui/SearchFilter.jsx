import React from 'react';
import { Search } from 'lucide-react';

export const SearchFilter = ({ placeholder, onSearchChange }) => (
  <div className="flex flex-col gap-1 w-full max-w-md">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Search</label>
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input 
        type="text" 
        placeholder={placeholder}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-100 outline-none transition-all"
      />
    </div>
  </div>
);