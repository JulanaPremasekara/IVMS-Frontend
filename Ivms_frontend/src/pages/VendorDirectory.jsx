import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Building2, AlertCircle, ChevronDown, 
  ArrowLeft, Globe, ShieldCheck 
} from 'lucide-react';

const VendorDirectory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const quickSelects = [
    "TechSupply Co.", "GlobalParts Corp", "ElectroWholesale Ltd", 
    "AsiaElectronics Co", "Premium Supplies Inc"
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* Breadcrumb / Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/supplier')}>Supplier Portal</span>
          <span>/</span>
          <span className="text-slate-600">Vendor Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Vendor Profile Viewer</h1>
        <p className="text-sm text-slate-500 font-medium">Search and view detailed vendor contract information</p>
      </div>

      {/* Main Search Card */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Search Vendor</h3>
        </div>
        
        <div className="p-8 space-y-8">
          {/* Input Grid */}
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-5 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Search by ID or Company Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Enter vendor ID or company name..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Select Vendor</label>
              <div className="relative">
                <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer">
                  <option>Choose a vendor...</option>
                  {quickSelects.map(v => <option key={v}>{v}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <button className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98]">
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Quick Select Chips */}
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Quick Select:</p>
            <div className="flex flex-wrap gap-2">
              {quickSelects.map((vendor) => (
                <button 
                  key={vendor}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all group"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
                  {vendor}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Empty State / Result Placeholder */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-slate-800" />
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">No Vendor Selected</h3>
        </div>
        <div className="p-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
             <Building2 className="w-8 h-8 text-slate-200" />
          </div>
          <p className="text-sm font-medium text-slate-400 italic">
            Please use the search bar above to select a vendor and view their profile.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VendorDirectory;