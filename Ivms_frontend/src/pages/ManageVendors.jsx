import React from 'react';
import { ArrowLeft, Search, Filter, Download, MoreHorizontal, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ActionButton } from '../components/ui/ActionButton';

const ManageVendors = () => {
  const navigate = useNavigate();

  const vendors = [
    { id: 'VND-001', name: 'Global Tech Solutions', category: 'Electronics', status: 'Active', reliability: '9.2/10' },
    { id: 'VND-002', name: 'Prime Logistics', category: 'Shipping', status: 'Active', reliability: '8.5/10' },
    { id: 'VND-003', name: 'BuildRight Materials', category: 'Construction', status: 'Pending', reliability: 'N/A' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/supplier')}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Manage Vendors</h1>
            <p className="text-xs text-slate-400 font-medium">Directory of all registered suppliers</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton label="Export Data" icon={Download} variant="secondary" />
          <ActionButton label="Register New" icon={UserPlus} variant="primary" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search vendors by name, ID or category..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">
          <Filter className="w-4 h-4" /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Vendor ID</th>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Reliability</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {vendors.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-xs font-bold text-blue-600">{v.id}</td>
                <td className="px-6 py-4 text-xs font-bold text-slate-700">{v.name}</td>
                <td className="px-6 py-4 text-xs text-slate-500">{v.category}</td>
                <td className="px-6 py-4 text-xs font-bold text-emerald-600">{v.reliability}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-bold border ${
                    v.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageVendors;