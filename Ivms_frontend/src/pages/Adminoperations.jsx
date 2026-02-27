import React, { useState } from 'react';
import { 
  ArrowLeft, Search, UserCheck, RefreshCw, Package, 
  MapPin, ClipboardList, ShieldCheck, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOperations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'warehouse'

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div>
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-2 text-[10px] font-bold text-blue-600 mb-2 border border-blue-100 px-2 py-1 rounded bg-blue-50/50 hover:bg-blue-100 transition-colors"
        >
          <ArrowLeft size={12} /> Back to Admin Control
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Admin Operations</h1>
          <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <ShieldCheck size={10} /> Admin Control
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">Reset passwords, change roles, and execute warehouse stock transfers</p>
      </div>

      {/* Modern Tab Switcher */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('user')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'user' 
            ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
            : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <UserCheck size={16} /> User Access Management
        </button>
        <button 
          onClick={() => setActiveTab('warehouse')}
          className={`flex items-center gap-2 px-6 py-3 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'warehouse' 
            ? 'border-blue-600 text-blue-600 bg-blue-50/30' 
            : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <RefreshCw size={16} /> Warehouse Stock Transfer
        </button>
      </div>

      {/* Dynamic Content Area */}
      {activeTab === 'user' ? (
        /* User Access Management View */
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 text-slate-800 border-b border-slate-50 pb-4">
            <Search size={18} className="text-blue-600" />
            <h3 className="text-sm font-bold">Search User</h3>
          </div>
          
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search by Name / Email / User ID..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-4 py-2 rounded-lg outline-none cursor-pointer">
              <option>All Roles</option>
              <option>Administrator</option>
              <option>Procurement Manager</option>
              <option>Warehouse Staff</option>
            </select>
            <button className="bg-[#1e3a8a] text-white px-8 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all">
              <Search size={14} /> Search
            </button>
          </div>

          <div className="mt-12 py-20 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl">
             <div className="p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
                <UserCheck size={40} />
             </div>
             <p className="text-slate-400 text-sm font-medium">Search for a user to manage their access rights</p>
          </div>
        </div>
      ) : (
        /* Inter-Warehouse Stock Transfer View */
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 text-blue-900 flex items-center gap-2">
            <RefreshCw size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold uppercase tracking-tight">Inter-Warehouse Stock Transfer</h3>
          </div>
          
          <div className="p-8 space-y-10">
            {/* Stock Selection Section */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <Package size={14} className="text-slate-400"/> Stock Selection
              </h4>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Item Search (SKU / Product Name)</label>
                <div className="relative">
                   <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 outline-none appearance-none cursor-pointer">
                      <option>Search and select product...</option>
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Search size={14} />
                   </div>
                </div>
              </div>
            </div>

            {/* Transfer Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <h4 className="col-span-full text-xs font-bold text-slate-800 flex items-center gap-2">
                <MapPin size={14} className="text-slate-400"/> Transfer Details
              </h4>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Source Warehouse *</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 outline-none">
                  <option>Select source...</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Destination Warehouse *</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 outline-none">
                  <option>Select destination...</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Quantity *</label>
                <input 
                  type="number" 
                  placeholder="Enter quantity..." 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Transfer Reason *</label>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-500 outline-none">
                  <option>Select reason...</option>
                  <option>Stock Replenishment</option>
                  <option>Order Fulfillment</option>
                  <option>Damaged Goods Return</option>
                </select>
              </div>

              <div className="col-span-full space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Notes (Optional)</label>
                <textarea 
                  rows="3" 
                  placeholder="Add any additional notes for this transfer..." 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:ring-1 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="require-approval" 
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="require-approval" className="text-xs font-medium text-slate-600 cursor-pointer">
                  Require Receiving Warehouse Approval
                </label>
              </div>
              
              <button className="bg-slate-100 text-slate-400 px-8 py-2.5 rounded text-xs font-bold flex items-center gap-2 cursor-not-allowed transition-all">
                <RefreshCw size={14} /> Proceed to Confirmation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOperations;