import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Mail, Phone, Calendar, 
  Download, Activity, Star, TrendingUp, Clock, AlertTriangle, FileText
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { ActionButton } from '../components/ui/ActionButton';

const VendorAnalytics = () => {
  const navigate = useNavigate();
  
  const [allVendors, setAllVendors] = useState([]);      
  const [searchQuery, setSearchQuery] = useState("");    
  const [selectedVendor, setSelectedVendor] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/v1/vendors");
        const data = await response.json();
        // Filters only vendors ready for analytics view
        const activeVendors = data.filter(v => v.status === 'APPROVED' || v.status === 'ACTIVE');
        setAllVendors(activeVendors);
        if (activeVendors.length > 0) setSelectedVendor(activeVendors[0]);
      } catch (error) {
        console.error("Error fetching vendors for analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  const filteredVendors = allVendors.filter(v => 
    v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.id.toString().includes(searchQuery)
  );

  // Logic to determine if a vendor is "New" based on backend data
  const getGraphData = (vendor) => {
    // If totalOrders is 0, render flat 0 lines as requested
    const isNew = !vendor.totalOrders || vendor.totalOrders === 0; 
    const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
    
    const performanceData = months.map((month, idx) => ({
      month,
      // Existing vendors get mock data; New vendors get strictly 0
      delay: isNew ? 0 : [25, 22, 20, 18, 15, 18][idx],
      leadTime: isNew ? 0 : [5.2, 4.8, 4.5, 4.2, 3.9, 4.1][idx]
    }));

    const pieData = [
      { name: 'On-Time', value: isNew ? 0 : 82, color: '#10b981' },
      { name: 'Delayed', value: isNew ? 0 : 18, color: '#f97316' },
      ...(isNew ? [{ name: 'No History', value: 100, color: '#f1f5f9' }] : [])
    ];

    return { performanceData, pieData, isNew };
  };

  // Maps numeric data from backend to UI components
  const metrics = selectedVendor ? {
    score: selectedVendor.performanceScore || 0,
    leadTime: (selectedVendor.avgLeadTime || 0.0).toFixed(1),
    delayProb: selectedVendor.delayProbability || 0,
    reliability: (selectedVendor.reliabilityRating || 0.0).toFixed(1)
  } : null;

  const graphData = selectedVendor ? getGraphData(selectedVendor) : null;

  return (
    <div className="space-y-6 pb-10">
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
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[1000px]">
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
              ) : filteredVendors.map((vendor) => (
                <div 
                  key={vendor.id}
                  onClick={() => setSelectedVendor(vendor)}
                  className={`p-4 cursor-pointer transition-all border-l-4 ${selectedVendor?.id === vendor.id ? "bg-blue-50/50 border-l-blue-500" : "hover:bg-slate-50 border-l-transparent"}`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-slate-700 truncate mr-2">{vendor.companyName}</h4>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${(!vendor.totalOrders || vendor.totalOrders === 0) ? "bg-slate-100 text-slate-400" : "bg-emerald-50 text-emerald-500"}`}>
                      {vendor.performanceScore || 0}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">VEN-{vendor.id}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-9 space-y-6">
          {selectedVendor ? (
            <>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 bg-blue-50/30 flex items-center gap-2">
                  <div className="p-1 bg-blue-600 rounded text-white"><User className="w-3 h-3" /></div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Vendor Overview</h3>
                </div>
                <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6">
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor Name</p><p className="text-sm font-bold text-slate-800">{selectedVendor.companyName}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor ID</p><p className="text-sm font-bold text-slate-800">VEN-{selectedVendor.id}</p></div>
                   <div><p className="text-[10px] text-slate-400 font-bold uppercase">Contact Person</p><p className="text-sm font-medium text-slate-600">{selectedVendor.contactPerson}</p></div>
                   <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">{selectedVendor.email}</p></div>
                   <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">{selectedVendor.phone}</p></div>
                   <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">Active Status</p></div>
                </div>
              </div>

              <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 p-1">
                  <div className="bg-white rounded-lg p-4 flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-violet-500 rounded-lg text-white"><Activity className="w-4 h-4" /></div>
                      <h3 className="text-sm font-bold text-slate-800">AI Performance Summary</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3">
                    <StatBox 
                      label="Reliability Rating" 
                      value={`${metrics.reliability} / 5`} 
                      sub={(!selectedVendor.totalOrders || selectedVendor.totalOrders === 0) ? "☆☆☆☆☆" : "⭐⭐⭐⭐☆"} 
                      icon={Star} 
                      color="text-yellow-500" 
                    />
                    <StatBox label="Vendor Score (AI)" value={`${metrics.score}%`} icon={TrendingUp} color="text-emerald-500" />
                    <StatBox label="Avg Lead Time" value={`${metrics.leadTime} Days`} icon={Clock} color="text-blue-500" />
                    <StatBox label="Delay Probability" value={`${metrics.delayProb}%`} icon={AlertTriangle} color="text-orange-500" />
                  </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-8">
                <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  AI-Generated Historical Performance Analysis
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="h-48 w-full">
                    <div className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-tight">Delay Probability Over Time</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={graphData.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={[0, 30]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="delay" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#f97316' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="h-48 w-full">
                    <div className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-tight">Lead Time by Month</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={graphData.performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} domain={[0, 8]} />
                        <Tooltip />
                        <Bar dataKey="leadTime" fill="#6366f1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-800">Transaction History</h3>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white transition-all shadow-sm">
                    <Download className="w-3 h-3" /> Export to CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">PO Number</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Lead Time</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Outcome</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {graphData.isNew ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-20 text-center text-xs text-slate-400 italic font-medium">
                            No transaction records found for this new vendor.
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-20 text-center text-xs text-slate-400 italic font-medium">
                            Awaiting sync with Procurement Hub...
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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

const StatBox = ({ label, value, sub, icon: Icon, color }) => (
  <div className="bg-white border border-slate-100 p-4 rounded-xl shadow-sm text-center">
    <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
    <p className="text-lg font-black text-slate-800">{value}</p>
    {sub && <p className="text-[10px] mb-1 text-slate-400">{sub}</p>}
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
  </div>
);

export default VendorAnalytics;