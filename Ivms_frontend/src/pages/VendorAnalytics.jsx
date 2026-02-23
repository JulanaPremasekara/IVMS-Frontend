import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Search, User, Mail, Phone, Calendar, 
  Download, PieChart, Activity, RefreshCw, ChevronRight,
  Star, TrendingUp, Clock, AlertTriangle, FileText, Layout // Layout added to fix error
} from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

const VendorAnalytics = () => {
  const navigate = useNavigate();

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
            <p className="text-xs text-slate-400 font-medium tracking-tight">View vendor history, AI-generated ratings, and performance analytics</p>
          </div>
        </div>
        <ActionButton label="Export Report" icon={Download} variant="secondary" />
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* SIDEBAR: VENDORS LIST */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="Search Vendor..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
              </div>
            </div>
            <div className="max-h-[600px] overflow-y-auto divide-y divide-slate-50">
              <div className="p-4 bg-blue-50/50 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                  <h4 className="text-xs font-bold text-slate-700">TechSupply Co.</h4>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">82%</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium mt-1">VEN-1001</p>
                <span className="text-[9px] font-bold text-emerald-600 uppercase mt-2 block">Active</span>
              </div>
              {/* Repeat for other vendors */}
            </div>
          </div>
        </div>

        {/* MAIN ANALYTICS AREA */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* VENDOR OVERVIEW CARD */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 bg-blue-50/30 flex items-center gap-2">
              <div className="p-1 bg-blue-600 rounded text-white"><User className="w-3 h-3" /></div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Vendor Overview</h3>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-y-6">
               <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor Name</p><p className="text-sm font-bold text-slate-800">TechSupply Co.</p></div>
               <div><p className="text-[10px] text-slate-400 font-bold uppercase">Vendor ID</p><p className="text-sm font-bold text-slate-800">VEN-1001</p></div>
               <div><p className="text-[10px] text-slate-400 font-bold uppercase">Contact Person</p><p className="text-sm font-medium text-slate-600">John Anderson</p></div>
               <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">john@techsupply.com</p></div>
               <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">+1 (555) 123-4567</p></div>
               <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><p className="text-xs text-slate-600">Renewal: 2026-12-15</p></div>
            </div>
          </div>

          {/* AI PERFORMANCE SUMMARY (Image_aa155d) */}
          <div className="bg-emerald-50/30 rounded-xl border border-emerald-100 p-1">
             <div className="bg-white rounded-lg p-4 flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-violet-500 rounded-lg text-white"><Activity className="w-4 h-4" /></div>
                  <h3 className="text-sm font-bold text-slate-800">AI Performance Summary</h3>
                </div>
                <button className="text-[10px] font-bold text-blue-600 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50">Request Score Review</button>
             </div>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3">
                <StatBox label="Reliability Rating" value="4.5 / 5" sub="⭐⭐⭐⭐☆" icon={Star} color="text-yellow-500" />
                <StatBox label="Vendor Score (AI)" value="82%" icon={TrendingUp} color="text-emerald-500" />
                <StatBox label="Avg Lead Time" value="4.2 Days" icon={Clock} color="text-blue-500" />
                <StatBox label="Delay Probability" value="18%" icon={AlertTriangle} color="text-orange-500" />
             </div>
          </div>

          {/* AI GENERATED HISTORICAL ANALYSIS (Charts Layout) */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-bold text-slate-800">AI-Generated Historical Performance Analysis</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                 <ChartPlaceholder title="Delay Probability Over Time" type="line" />
                 <ChartPlaceholder title="Lead Time by Month" type="bar" />
              </div>
              <div className="border-t border-slate-50 pt-8 flex flex-col items-center">
                 <h4 className="text-xs font-bold text-slate-700 mb-6">On-Time vs Delayed Deliveries</h4>
                 <div className="relative w-48 h-48 bg-slate-50 rounded-full border-8 border-emerald-500 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">On-Time</p>
                      <p className="text-xl font-black text-slate-800">82%</p>
                    </div>
                 </div>
                 <div className="flex gap-4 mt-6">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded"></div><span className="text-[10px] font-bold text-slate-500">On-Time</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-orange-500 rounded"></div><span className="text-[10px] font-bold text-slate-500">Delayed</span></div>
                 </div>
              </div>
            </div>
          </div>

          {/* TRANSACTION HISTORY TABLE */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-blue-50/10">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Transaction History</h3>
              </div>
              <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-slate-50">
                <Download className="w-3 h-3" /> Export to CSV
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                  <TableRow id="PO-5001" date="2026-01-15" items="Samsung Refrigerators (50 units)" time="4 days" status="Delivered" outcome="On-Time" />
                  <TableRow id="PO-5003" date="2026-02-03" items="Sony TVs (20 units)" time="6 days" status="Delivered" outcome="Delayed" />
                  <TableRow id="PO-5005" date="2026-02-18" items="Air Conditioners (25 units)" time="4 days" status="In Transit" outcome="Pending" />
                </tbody>
              </table>
            </div>
          </div>
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

const ChartPlaceholder = ({ title }) => (
  <div className="space-y-4">
    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</h4>
    <div className="h-40 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-center">
      <Activity className="w-6 h-6 text-slate-200" />
    </div>
  </div>
);

const TableRow = ({ id, date, items, time, status, outcome }) => (
  <tr className="text-xs group hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 font-bold text-blue-600">{id}</td>
    <td className="px-6 py-4 text-slate-500 font-medium">{date}</td>
    <td className="px-6 py-4 text-slate-700 font-bold">{items}</td>
    <td className="px-6 py-4 text-slate-500">{time}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4">
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${outcome === 'On-Time' ? 'bg-emerald-500 text-white' : outcome === 'Delayed' ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {outcome}
      </span>
    </td>
  </tr>
);

export default VendorAnalytics;