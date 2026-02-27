import React from 'react';
import { 
  History, Search, ArrowLeft, Download, RefreshCw, 
  Filter, Calendar, User, Database, AlertCircle, Info, Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuditLogs = () => {
  const navigate = useNavigate();

  const auditLogs = [
    { timestamp: '2026-02-22 14:35:22', userId: 'USR-1021', user: 'John Doe', module: 'Inventory', action: 'Update', entity: 'SKU-2048', oldValue: '{"stock_qty": 500, "unit_price"...', newValue: '{"stock_qty": 450, "unit_price"...', severity: 'Info', status: 'Normal' },
    { timestamp: '2026-02-22 13:22:10', userId: 'USR-1035', user: 'Sarah Chen', module: 'Procurement', action: 'Delete', entity: 'PO-8821', oldValue: '{"po_number": "PO-8821", "tota...', newValue: 'null...', severity: 'Warning', status: 'Flagged' },
    { timestamp: '2026-02-22 11:15:48', userId: 'USR-9999', user: 'Unknown User', module: 'Auth', action: 'Login Attempt', entity: 'admin@company.com', oldValue: 'null...', newValue: '{"status": "failed", "reason":...', severity: 'Critical', status: 'Flagged' },
    { timestamp: '2026-02-22 10:42:33', userId: 'USR-1023', user: 'Michael Torres', module: 'Finance', action: 'Create', entity: 'INV-5024', oldValue: 'null...', newValue: '{"invoice_number": "INV-5024",...', severity: 'Info', status: 'Normal' },
    { timestamp: '2026-02-22 09:18:55', userId: 'USR-0001', user: 'Admin User', module: 'Inventory', action: 'Stock Adjustment', entity: 'SKU-3041', oldValue: '{"stock_qty": 1200}...', newValue: '{"stock_qty": 1100, "adjustmen...', severity: 'Warning', status: 'Normal' },
    { timestamp: '2026-02-21 16:45:12', userId: 'USR-1007', user: 'Emily Johnson', module: 'Inventory', action: 'Update', entity: 'SKU-1825', oldValue: '{"location": "A-12", "stock_qt...', newValue: '{"location": "B-05", "stock_qt...', severity: 'Info', status: 'Normal' },
  ];

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Warning': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const getStatusStyle = (status) => {
    return status === 'Flagged' ? 'text-rose-600 font-bold' : 'text-emerald-600 font-medium';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
              <History size={10} /> Compliance & Security
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Track and monitor all system activities</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50">
            <RefreshCw size={14} /> Refresh Logs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 shadow-lg shadow-blue-100">
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* SMS Alert Security Feature */}
      <div className="bg-white border-l-4 border-rose-500 rounded-xl shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-rose-50 text-rose-500 rounded-lg">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">Enable SMS Alerts for Critical Actions</h3>
              <span className="bg-rose-50 text-rose-600 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">Security Feature</span>
            </div>
            <p className="text-xs text-slate-500">Automatically notify Super Admin via SMS for high risk activities such as mass deletion or failed login attempts</p>
          </div>
        </div>
        <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer">
          <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2 text-emerald-600">
          <Filter size={16} />
          <h3 className="text-sm font-bold">Filter Audit Logs</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Date From</label>
            <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-100" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Calendar size={12}/> Date To</label>
            <input type="date" className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-emerald-100" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><User size={12}/> User ID / Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input type="text" placeholder="Search user..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Action Type</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none appearance-none">
              <option>All actions</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Module</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
              <option>All modules</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Severity Level</label>
            <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none">
              <option>All levels</option>
            </select>
          </div>
          <div className="md:col-span-2 flex items-end justify-end gap-2">
            <button className="px-6 py-2 border border-slate-200 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 flex items-center gap-2">
              ✕ Reset
            </button>
            <button className="px-6 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 flex items-center gap-2">
              <Search size={14} /> Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={16} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-800">Audit Log Results</h3>
          </div>
          <span className="bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-black uppercase">6 Records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-bold border-b border-slate-100">
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Action Type</th>
                <th className="px-4 py-3">Entity Affected</th>
                <th className="px-4 py-3">Old Value</th>
                <th className="px-4 py-3">New Value</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className={`text-[11px] hover:bg-slate-50/50 transition-colors ${log.status === 'Flagged' ? 'bg-rose-50/30' : ''}`}>
                  <td className="px-4 py-4 text-slate-500">{log.timestamp}</td>
                  <td className="px-4 py-4">
                    <div className="font-bold text-slate-700">{log.user}</div>
                    <div className="text-[9px] text-slate-400 uppercase">{log.userId}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      log.module === 'Inventory' ? 'bg-blue-50 text-blue-600' : 
                      log.module === 'Procurement' ? 'bg-purple-50 text-purple-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {log.module}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-600">{log.action}</td>
                  <td className="px-4 py-4 font-mono text-blue-600">{log.entity}</td>
                  <td className="px-4 py-4 text-slate-400 truncate max-w-[120px]">{log.oldValue}</td>
                  <td className="px-4 py-4 text-slate-400 truncate max-w-[120px]">{log.newValue}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border flex items-center w-fit gap-1 ${getSeverityStyle(log.severity)}`}>
                      <Info size={10} /> {log.severity}
                    </span>
                  </td>
                  <td className={`px-4 py-4 ${getStatusStyle(log.status)} flex items-center gap-1 uppercase text-[9px]`}>
                    {log.status === 'Flagged' && <span className="w-1 h-1 bg-rose-600 rounded-full"></span>}
                    {log.status}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button className="flex items-center justify-center gap-1 text-blue-600 hover:text-blue-800 font-bold transition-colors">
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;