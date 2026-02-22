import React from 'react';
import { 
  Package, Plus, MoreVertical, FileText, 
  Filter, Copy, Eye, Trash2, Calendar
} from 'lucide-react';
import { SearchFilter } from '../components/ui/SearchFilter';
import { StatusBadge } from '../components/ui/StatusBadge';


const ProcurementManagePurchaseOrders = () => {
  const poData = [
    { id: 'PO-2026-1001', vendor: 'TechSupply Inc.', status: 'Sent', date: 'Feb 01, 2026', delivery: 'Feb 25, 2026', total: 38250, creator: 'John Smith' },
    { id: 'PO-2026-1002', vendor: 'GlobalParts Corp', status: 'Draft', date: 'Feb 20, 2026', delivery: 'Mar 05, 2026', total: 12450, creator: 'Sarah Johnson' },
    { id: 'PO-2026-1003', vendor: 'TechSupply Inc.', status: 'Draft', date: 'Feb 21, 2026', delivery: 'Mar 10, 2026', total: 38250, creator: 'John Smith', flag: 'Duplicate' },
    { id: 'PO-2026-1004', vendor: 'ElectroWholesale Ltd', status: 'Received', date: 'Jan 15, 2026', delivery: 'Feb 10, 2026', total: 54800, creator: 'Mike Davis' },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
    

      {/* 2. Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
          <Filter className="w-3.5 h-3.5 text-blue-500" /> Filters & Search
        </div>
        <div className="flex items-end gap-6">
          <SearchFilter placeholder="Search by PO# or Vendor..." />
          
          <div className="flex flex-col gap-1 w-48">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Status</label>
            <select className="border border-slate-200 rounded-lg p-2 text-xs text-slate-600 bg-white outline-none">
              <option>All Status</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Received</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" id="voided" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100" />
            <label htmlFor="voided" className="text-xs font-medium text-slate-600">Include Voided</label>
          </div>
        </div>
      </div>

      {/* 3. Management Table Container */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Purchase Orders ({poData.length})</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-3">PO Number</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Expected Delivery</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Flags</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-50">
              {poData.map((po) => (
                <tr key={po.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-blue-600 hover:underline cursor-pointer">{po.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{po.vendor}</td>
                  <td className="px-6 py-4"><StatusBadge status={po.status} /></td>
                  <td className="px-6 py-4 text-slate-500">{po.date}</td>
                  <td className="px-6 py-4 text-slate-500">{po.delivery}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">${po.total.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-500">{po.creator}</td>
                  <td className="px-6 py-4">
                    {po.flag && (
                      <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100 flex items-center gap-1 w-fit">
                        <Copy className="w-2.5 h-2.5" /> {po.flag}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1 rounded hover:bg-slate-100 text-slate-400 group-hover:text-slate-600 transition-all">
                      <MoreVertical className="w-4 h-4" />
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

export default ProcurementManagePurchaseOrders;