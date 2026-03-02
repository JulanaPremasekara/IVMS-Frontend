import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Building2, AlertCircle, ChevronDown, 
  Loader2, ArrowLeft 
} from 'lucide-react';

// IMPORTANT: Ensure the path matches where you save the second file
import VendorOverviewDashboard from './VendorOverviewDashboard';

const VendorDirectory = () => {
  const navigate = useNavigate();
  
  // Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDropdownId, setSelectedDropdownId] = useState("");
  const [vendorList, setVendorList] = useState([]); 
  
  // UI & Data States
  const [selectedVendor, setSelectedVendor] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load Active Vendors for dropdown on mount
  useEffect(() => {
    const fetchActiveVendors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/vendors/active");
        if (!response.ok) throw new Error("Could not load vendor list");
        const data = await response.json();
        setVendorList(data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchActiveVendors();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const term = searchQuery.trim() || selectedDropdownId;
    
    if (!term) {
      setError("Please enter a Vendor Name or ID to search.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const isId = !isNaN(term);
      const url = isId 
        ? `http://localhost:8080/api/v1/vendors/${term}`
        : `http://localhost:8080/api/v1/vendors/search?query=${encodeURIComponent(term)}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(response.status === 404 ? "Vendor not found." : "Server error.");

      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : data;
      
      if (!result) throw new Error("No matching record found.");
      setSelectedVendor(result);
    } catch (err) {
      setError(err.message);
      setSelectedVendor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSearch = () => {
    setSelectedVendor(null);
    setSearchQuery("");
    setSelectedDropdownId("");
    setError(null);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/supplier')}>Supplier Portal</span>
          <span>/</span>
          <span className="text-slate-600">Vendor Profile</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Vendor Directory</h1>
        <p className="text-sm text-slate-500 font-medium">Search and manage verified vendor agreements</p>
      </div>

      {/* Search Bar - Only shows if no vendor is selected */}
      {!selectedVendor && (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-8 animate-in fade-in duration-300">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-12 lg:col-span-5 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Search by ID or Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Enter vendor name or ID..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 space-y-2">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-tighter">Quick Select</label>
              <div className="relative">
                <select 
                  value={selectedDropdownId}
                  onChange={(e) => setSelectedDropdownId(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
                >
                  <option value="">Choose a registered vendor...</option>
                  {vendorList.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-12 lg:col-span-3">
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-indigo-900 hover:bg-indigo-800 text-white font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Results Area */}
      {selectedVendor ? (
        <VendorOverviewDashboard 
          vendor={selectedVendor} 
          onEdit={() => navigate(`/supplier/edit/${selectedVendor.id}`)} 
          onBack={resetSearch}
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${error ? 'bg-red-50' : 'bg-slate-50'}`}>
             {error ? <AlertCircle className="w-8 h-8 text-red-400" /> : <Building2 className="w-8 h-8 text-slate-200" />}
          </div>
          <h3 className="text-slate-800 font-bold">{error ? "Vendor Not Found" : "No Vendor Selected"}</h3>
          <p className="text-sm font-medium text-slate-400 italic mt-1 max-w-xs">
            {error ? error : "Please search for a vendor above to view their performance dashboard."}
          </p>
        </div>
      )}
    </div>
  );
};

export default VendorDirectory;