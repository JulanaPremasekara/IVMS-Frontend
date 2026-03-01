import React from 'react';
import { X, FileText, ArrowUpRight, ArrowDownLeft, CheckCircle2, Clock, Download } from 'lucide-react';

const TransactionModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  // Mapping the data object to the table rows
  const details = [
    { label: 'Transaction ID', value: data.id || 'N/A', isLink: true },
    { label: 'Order ID', value: data.order || 'N/A', isLink: true },
    { label: 'Customer/Vendor', value: data.party || 'N/A', isLink: true },
    { label: 'Type', value: data.type || 'N/A', isBadge: true, badgeType: 'type' },
    { label: 'Category', value: data.category || 'N/A' },
    { label: 'Amount', value: data.amount || '$0.00', isBold: true },
    { label: 'Status', value: data.status || 'N/A', isBadge: true, badgeType: 'status' },
    { label: 'Date', value: data.date || 'N/A', isLink: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FileText className="text-indigo-600" size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Transaction Details</h2>
              <p className="text-[10px] text-slate-500">Detailed view of the selected transaction</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Sync Banner */}
        <div className="m-4 p-3 bg-blue-50/50 rounded-lg border-l-4 border-blue-500">
          <h4 className="text-[11px] font-bold text-slate-700">Linked to Ledger Records</h4>
          <p className="text-[10px] text-slate-500">
            This transaction is automatically synced from the Financial Ledger (UC-501)
          </p>
        </div>

        {/* Data Table */}
        <div className="px-4 pb-4">
          <div className="border border-slate-100 rounded-lg overflow-hidden">
            <div className="grid grid-cols-2 bg-slate-50 border-b border-slate-100 px-3 py-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Field</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Value</span>
            </div>
            
            {details.map((item, index) => (
              <div key={index} className="grid grid-cols-2 px-3 py-2.5 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/50 transition-colors">
                <span className={`text-[11px] ${item.isLink ? 'text-blue-600 font-medium cursor-pointer hover:underline' : 'text-slate-500'}`}>
                  {item.label}
                </span>
                
                <div className="text-[11px] text-slate-800">
                  {item.isBadge ? (
                    item.badgeType === 'type' ? (
                      // Type Badge Logic (Revenue vs Expense)
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold italic tracking-tighter uppercase ${item.value.toLowerCase() === 'revenue' ? 'bg-indigo-900 text-white' : 'bg-rose-100 text-rose-700'}`}>
                        {item.value.toLowerCase() === 'revenue' ? <ArrowUpRight size={10} /> : <ArrowDownLeft size={10} />}
                        {item.value}
                      </span>
                    ) : (
                      // Status Badge Logic (Paid vs Pending)
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.value.toLowerCase() === 'paid' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-700'}`}>
                        {item.value.toLowerCase() === 'paid' ? <CheckCircle2 size={10} fill="currentColor" className="bg-white text-emerald-500 rounded-full" /> : <Clock size={10} />}
                        {item.value}
                      </span>
                    )
                  ) : (
                    <span className={item.isBold ? 'font-bold text-slate-900' : ''}>{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={onClose}
            className="px-6 py-2 border border-indigo-900 text-indigo-900 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-all active:scale-95"
          >
            Close
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-950 transition-all active:scale-95 shadow-md">
            <Download size={14} /> Export Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;