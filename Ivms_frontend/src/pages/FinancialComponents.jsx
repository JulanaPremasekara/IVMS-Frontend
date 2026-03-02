import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, ChevronDown, Check, Clock, 
  FileText, Building2, X 
} from 'lucide-react';

const FinancialComponents = ({ isOpen, onClose, data }) => {
  // 1. State and Refs
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('Last 7 Days');
  const dropdownRef = useRef(null);

  const dateOptions = [
    'Last 7 Days', 'Last 30 Days', 'This Month', 
    'Last Month', 'This Quarter', 'Custom Range'
  ];

  // 2. Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isDropdownOpen]);

  // If modal isn't open or no data is passed, don't render anything
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Modal Header */}
        <div className="p-5 flex items-start justify-between border-b border-slate-100">
          <div className="flex gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="text-blue-600" size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Payment History - {data.id}
              </h3>
              <p className="text-[11px] text-slate-400">Transaction timeline and payment records</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-300 hover:text-slate-500 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6">
          {/* Vendor Card - Using Dynamic Data */}
          <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-xl shadow-sm">
            <div className="w-10 h-10 bg-white border border-slate-100 rounded-full flex items-center justify-center shadow-sm">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">{data.vendor}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight">Order: {data.order}</p>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="relative pl-8 space-y-4">
            <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-100"></div>

            {/* Timeline Step 1 */}
            <div className="relative">
              <div className="absolute -left-[28px] top-1 w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center z-10 border-2 border-white shadow-sm">
                <FileText size={12} className="text-blue-600" />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-slate-700">Invoice Created</p>
                <p className="text-[10px] font-medium text-slate-400 mb-2">{data.date}</p>
                <p className="text-sm font-bold text-green-600">${data.original}</p>
              </div>
            </div>

            {/* Timeline Step 2 */}
            <div className="relative">
              <div className="absolute -left-[28px] top-1 w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center z-10 border-2 border-white shadow-sm">
                <Clock size={12} className="text-orange-600" />
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-xs font-bold text-slate-700">Payment Due Date</p>
                <p className="text-[10px] font-medium text-slate-400">{data.date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-50/50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-2.5 border-2 border-slate-800 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-800 hover:text-white transition-all shadow-sm active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinancialComponents;