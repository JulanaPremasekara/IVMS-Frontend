import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Mail, Phone, Calendar, 
  Download, Activity, Star, TrendingUp, Clock, AlertTriangle, FileText
} from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

const VendorAnalytics = () => {
  const navigate = useNavigate();
  
  // --- STATE MANAGEMENT ---
  const [allVendors, setAllVendors] = useState([]);      // All vendors from DB
  const [searchQuery, setSearchQuery] = useState("");    // Search input value
  const [selectedVendor, setSelectedVendor] = useState(null); // The vendor being viewed
  const [loading, setLoading] = useState(true);

  // --- FETCH VENDORS ON LOAD ---
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/vendors");
        const data = await response.json();
        const activeVendors = data.filter(v => v.status === 'APPROVED' || v.status === 'ACTIVE');
        setAllVendors(activeVendors);
        
        // Auto-select the first vendor if available
        if (activeVendors.length > 0) setSelectedVendor(activeVendors[0]);
      } catch (error) {
        console.error("Error fetching vendors for analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  // --- SEARCH FILTERING ---
  const filteredVendors = allVendors.filter(v => 
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toString().includes(searchQuery)
  );

  // --- MOCK AI DATA GENERATOR (Until Backend is ready) ---
  // This generates consistent mock data based on the vendor's ID
  const getMockMetrics = (id) => {
    const seed = id % 10;
    return {
      score: 75 + seed * 2,
      leadTime: (3 + seed / 2).toFixed(1),
      delayProb: 25 - seed * 2,
      reliability: (4 + seed / 10).toFixed(1)
    };
  };

  const metrics = selectedVendor ? getMockMetrics(selectedVendor.id) : null;

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Analytics</h1>
            <p className="text-xs text-slate-400 font-medium tracking-tight">AI-generated ratings and performance analytics</p>
          </div>
        </div>
        <ActionButton label="Export Report" icon={Download} variant="secondary" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR: VENDORS LIST */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[750px]">
            <div className="p-4 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input 
                  type="text" 
                  placeholder="Search Vendor..." 
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="overflow-y-auto divide-y divide-slate-50 flex-1">
              {loading ? (
                <div className="p-10 text-center text-[10px] text-slate-400 animate-pulse uppercase font-bold">Syncing Directory...</div>
              ) : filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <div 
                    key={vendor.id}
                    onClick={() => setSelectedVendor(vendor)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      selectedVendor?.id === vendor.id 
                        ? "bg-blue-50/50 border-l-blue-500" 
                        : "hover:bg-slate-50 border-l-transparent"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-slate-700 truncate mr-2">{vendor.companyName}</h4>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {getMockMetrics(vendor.id).score}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-1">VEN-{vendor.id}</p>
                  </div>
                ))
              ) : (
                <div className="p-10 text-center text-xs text-slate-400">No vendors found</div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN ANALYTICS AREA */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          {selectedVendor ? (
            <>
              {/* VENDOR OVERVIEW CARD */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="px-6 py-4 border-b border-slate-50 bg-blue-50/30 flex items-center gap-2">
                  <div className="p-1 bg-blue-600 rounded text-white"><User className="w-3 h-3" /></div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Vendor Overview</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6">
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor Name</p><p className="text-sm font-bold text-slate-800">{selectedVendor.companyName}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor ID</p><p className="text-sm font-bold text-slate-800">VEN-{selectedVendor.id}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Contact Person</p><p className="text-sm font-medium text-slate-600">{selectedVendor.contactPerson}</p></div>
                   <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">{selectedVendor.email}</p></div>
                   <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">{selectedVendor.phoneNumber}</p></div>
                   <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">Active Status</p></div>
                </div>
              </div>

              {/* AI PERFORMANCE SUMMARY */}
              <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 p-1">
                  <div className="bg-white rounded-lg p-4 flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-violet-500 rounded-lg text-white"><Activity className="w-4 h-4" /></div>
                      <h3 className="text-sm font-bold text-slate-800">AI Performance Summary</h3>
                    </div>
                    <button className="text-[10px] font-bold text-blue-600 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50">Request Score Review</button>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3">
                    <StatBox label="Reliability Rating" value={`${metrics.reliability} / 5`} sub="⭐⭐⭐⭐☆" icon={Star} color="text-yellow-500" />
                    <StatBox label="Vendor Score (AI)" value={`${metrics.score}%`} icon={TrendingUp} color="text-emerald-500" />
                    <StatBox label="Avg Lead Time" value={`${metrics.leadTime} Days`} icon={Clock} color="text-blue-500" />
                    <StatBox label="Delay Probability" value={`${metrics.delayProb}%`} icon={AlertTriangle} color="text-orange-500" />
                  </div>
              </div>

              {/* Charts and History (Remain same but could be filtered by selectedVendor.id later) */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-10 text-center text-slate-400 text-xs italic">
                Transaction history and charts for {selectedVendor.companyName} would be fetched from PO backend.
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-20 text-slate-300">
              Select a vendor to view detailed AI analytics
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// HELPER COMPONENTS
const StatBox = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
    <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
    <p className="text-lg font-black text-slate-800">{value}</p>
    {sub && <p className="text-[10px] mb-1">{sub}</p>}
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
  </div>
);

export default VendorAnalytics;