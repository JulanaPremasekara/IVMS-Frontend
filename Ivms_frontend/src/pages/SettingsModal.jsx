import React, { useState } from 'react';
import { Settings, X, Mail, ChevronDown, Zap, CheckCircle2 } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose }) => {
  const [autoEmail, setAutoEmail] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 flex justify-between items-start">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Settings size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Ledger Automation Settings</h3>
              <p className="text-xs text-slate-500">Configure automated invoice and expense record generation</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-6">
          
          {/* Email Notifications Section */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Email Notifications
            </label>
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-blue-500 rounded-lg shadow-sm border border-slate-100">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Auto-Email Invoices</p>
                  <p className="text-[11px] text-slate-500">Send invoice to customer automatically</p>
                </div>
              </div>
              
              {/* Custom Toggle Switch */}
              <button 
                onClick={() => setAutoEmail(!autoEmail)}
                className={`w-11 h-6 rounded-full transition-colors relative ${autoEmail ? 'bg-blue-900' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 bg-white w-4 h-4 rounded-full transition-all ${autoEmail ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>

          {/* Tax Rate Section */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Default Tax Rate (VAT)
            </label>
            <div className="relative group">
              <div className="w-full p-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex justify-between items-center cursor-pointer group-hover:border-slate-300 transition-colors">
                20% - Standard Rate (Default)
                <ChevronDown size={16} className="text-slate-400" />
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-400 leading-relaxed">
              This rate will be applied to all auto-generated transactions. Can be overridden per product category.
            </p>
          </div>

          {/* Status Box */}
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex gap-4">
            <div className="text-green-600 mt-0.5">
              <Zap size={20} fill="currentColor" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-green-800">Automation Active</h4>
              <p className="text-[11px] text-green-700 leading-tight">
                Invoices are auto-generated when SO status = <span className="font-bold">"Shipped"</span>
              </p>
              <p className="text-[11px] text-green-700 leading-tight">
                Expenses are auto-generated when PO status = <span className="font-bold">"Received"</span>
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-blue-900 border border-blue-900 rounded-lg hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-shadow shadow-md shadow-blue-900/20"
          >
            <CheckCircle2 size={18} />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;