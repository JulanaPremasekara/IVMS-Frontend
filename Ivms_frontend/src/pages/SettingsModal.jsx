import React, { useState } from 'react';
import { Settings, X, Mail, ChevronDown, Zap, CheckCircle2 } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, taxRate, setTaxRate }) => {
  // Use a local state if you want a "Save" button to commit changes,
  // or use the props directly for immediate updates.
  const [localTax, setLocalTax] = useState(taxRate);

  const handleSave = () => {
    setTaxRate(localTax); // Persist the change to the parent
    onClose();
  };
  const [autoEmail, setAutoEmail] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          
          {/* Modal Card */}
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Header */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <span className="text-blue-600">⚙️</span> Ledger Automation Settings
                </h3>
                <p className="text-sm text-slate-500 mt-1">Configure automated invoice and expense record generation</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Toggle Section */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">Email Notifications</label>
                <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-600 p-2 rounded-md text-xs">✉️</span>
                    <div>
                       <p className="text-sm font-medium text-slate-700">Auto-Notify Finance Team</p>
                       <p className="text-xs text-slate-500">Send internal notification when invoices are generated</p>
                    </div>
                  </div>
                  {/* Simple Tailwind Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                  </label>
                </div>
              </div>

              {/* Dropdown Section */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">Default Tax Rate (VAT)</label>
                <select 
                  value={localTax} 
                  onChange={(e) => setLocalTax(e.target.value)}
                  className="w-full p-2.5 ..."
                >
                  <option value="20">20% - Standard Rate</option>
                  <option value="5">5% - Reduced Rate</option>
                  <option value="0">0% - Zero Rated</option>
                </select>
                <p className="text-[11px] text-slate-400 mt-2 italic">This rate will be applied to all auto-generated transactions.</p>
              </div>

              {/* Status Box */}
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex gap-3">
                <span className="text-emerald-500 text-lg">⚡</span>
                <div>
                  <p className="text-sm font-bold text-emerald-800">Automation Active</p>
                  <p className="text-xs text-emerald-700/80">Invoices are auto-generated when SO status = "Shipped"</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-gray-300 bg-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-5 py-2 text-sm font-medium text-white bg-[#1e3a8a] hover:bg-blue-900 rounded-lg shadow-sm transition-colors">
                Save Settings
              </button>
            </div>

          </div>
        </div>
      )
    };
 

export default SettingsModal;