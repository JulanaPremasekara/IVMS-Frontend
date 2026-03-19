import React from 'react';
import { Sparkles, CheckCircle } from 'lucide-react';

export const AIBanner = () => (
  <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-r-xl p-4 mb-6 flex items-center justify-between shadow-sm">
    <div className="flex items-center gap-3">
      <div className="bg-white p-2 rounded-lg shadow-sm">
        <Sparkles className="text-purple-500 w-5 h-5" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800">AI Procurement Oracle Generated This PO</h4>
        <p className="text-xs text-slate-500">Low Stock Alert triggered automatic PO suggestion based on forecast demand and safety stock levels.</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all">
        <CheckCircle className="w-4 h-4" /> Accept All Suggestions
      </button>
      <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
        Modify Before Sending
      </button>
    </div>
  </div>
);