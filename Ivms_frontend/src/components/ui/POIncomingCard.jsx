import React from 'react';
import { Box } from 'lucide-react';

export const POIncomingCard = ({ id, poNumber, vendor, dueDate, status }) => {
  const statusStyles = {
    'Due Today': 'bg-blue-50 text-blue-600 border-blue-100',
    'Overdue': 'bg-red-50 text-red-600 border-red-100',
    'Upcoming': 'bg-slate-50 text-slate-500 border-slate-100',
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className="bg-blue-50 p-2 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Box className="w-5 h-5 text-blue-600 group-hover:text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{poNumber}</h4>
          <p className="text-xs text-slate-400 font-medium">{vendor}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Due Date</p>
          <p className="text-xs font-bold text-slate-700">{dueDate}</p>
        </div>
        <span className={`px-2 py-1 rounded-md text-[9px] font-black border uppercase tracking-tighter ${statusStyles[status]}`}>
          {status}
        </span>
      </div>
    </div>
  );
};