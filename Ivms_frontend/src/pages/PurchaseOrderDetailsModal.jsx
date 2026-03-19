import { Download, Package, X } from 'lucide-react';
import React from 'react'
import { StatusBadge } from '../components/ui/StatusBadge';

export default function PurchaseOrderDetailsModal({ po, onClose, onVoid }) {
   if (!po) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">
                Purchase Order Details
              </h2>
              <div className="flex gap-2 mt-0.5">
                <StatusBadge status={po.status} />
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                PO Number
              </p>
              <p className="font-bold text-blue-600 mt-1">{po.id}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Vendor
              </p>
              <p className="font-bold text-slate-800 mt-1">{po.vendor}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Created Date
              </p>
              <p className="font-bold text-slate-800 mt-1">{po.date}</p>
            </div>
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Expected Delivery
              </p>
              <p className="font-bold text-slate-800 mt-1">{po.delivery}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3">Items</h3>
            <div className="space-y-2">
              {po.items?.length ? (
                po.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-3 border border-slate-100 rounded-lg text-slate-600 font-medium"
                  >
                    {item}
                  </div>
                ))
              ) : (
                <div className="p-3 border border-dashed border-slate-200 rounded-lg text-slate-400 text-xs">
                  No items listed
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 hover:bg-white transition-all text-xs"
          >
            Close
          </button>
          <button className="px-6 py-2 border border-slate-200 rounded-lg font-bold text-slate-600 bg-white flex items-center gap-2 hover:bg-slate-50 transition-all text-xs">
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => onVoid(po)}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold flex items-center gap-2 hover:bg-black transition-all text-xs"
          >
            <X className="w-4 h-4" /> Void / Cancel Order
          </button>
        </div>
      </div>
    </div>
  );
}
