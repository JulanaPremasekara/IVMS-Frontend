import React from 'react';
import { 
  FileText, Package, Database, DollarSign, 
  CheckCircle, X, Save, Upload, Camera, Info 
} from 'lucide-react';
import { VerificationInput } from '../components/ui/VerificationInput';
import { ImpactCard } from '../components/ui/ImpactCard';

const ReceiveGoodsVerification = () => {
  return (
    <div className="space-y-6 pb-24 max-w-[1600px] mx-auto">
      {/* 1. Header Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Receive Goods (GRN)</h1>
          <p className="text-sm text-slate-500 font-medium">Verify physical delivery and update inventory</p>
        </div>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-[10px] font-bold border border-blue-100 uppercase">Sent</span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Verification Form */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* PO Summary Section */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Purchase Order Summary</h2>
              </div>
              <button className="text-[10px] font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50">✕ Change PO</button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">PO Number</p>
                <p className="text-sm font-black text-blue-600">PO-2026-1001</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vendor</p>
                <p className="text-sm font-bold text-slate-700">TechSupply Inc.</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Shipment Reference</p>
                <p className="text-sm font-bold text-slate-700">SHP-001</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expected Delivery</p>
                <p className="text-sm font-bold text-slate-700">Feb 25, 2026</p>
              </div>
              <div className="col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100 flex items-center gap-2">
                <Info className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Warehouse Location</p>
                  <p className="text-sm font-bold text-slate-800">Warehouse A - New York</p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Verification Table */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Items Verification</h2>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> Receive All Remaining
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-50">
                  <tr>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3">SKU</th>
                    <th className="px-4 py-3">Ordered</th>
                    <th className="px-4 py-3">Remaining</th>
                    <th className="px-4 py-3 text-center">Received Qty</th>
                    <th className="px-4 py-3 text-center">Damaged/Rejected</th>
                    <th className="px-4 py-3">Bin Location</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Premium Wireless Headphones', sku: 'SKU-001', ordered: 100, remaining: 100, bin: 'A-12-03' },
                    { name: 'Smart Watch Series 5', sku: 'SKU-003', ordered: 75, remaining: 75, bin: 'B-08-15' },
                  ].map((item, i) => (
                    <tr key={i} className="group">
                      <td className="px-4 py-4 font-bold text-slate-800">{item.name}</td>
                      <td className="px-4 py-4 text-slate-400">{item.sku}</td>
                      <td className="px-4 py-4 font-medium">{item.ordered}</td>
                      <td className="px-4 py-4 font-bold text-blue-600">{item.remaining}</td>
                      <td className="px-4 py-4"><VerificationInput label="" /></td>
                      <td className="px-4 py-4"><VerificationInput label="" color="red" /></td>
                      <td className="px-4 py-4"><span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-mono">{item.bin}</span></td>
                      <td className="px-4 py-4"><span className="text-slate-400 italic">Pending</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit & Compliance Section */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100">
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">Audit & Compliance</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                  <Upload className="w-6 h-6 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Upload Delivery Note</span>
                </button>
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                  <Upload className="w-6 h-6 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Upload Invoice Copy</span>
                </button>
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-slate-50 transition-all">
                  <Camera className="w-6 h-6 text-slate-300" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Attach Photos</span>
                </button>
              </div>
              <div className="flex items-center gap-2 py-3 px-4 bg-red-50/50 rounded-lg border border-red-100">
                <input type="checkbox" className="w-4 h-4 rounded border-red-200" />
                <label className="text-xs font-medium text-slate-600">Delivery Note Verified</label>
                <span className="ml-auto text-[10px] font-black text-red-500 uppercase tracking-tighter">Required</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Impacts & Summary */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ImpactCard title="Inventory Impact Preview" icon={Database}>
            <div className="flex flex-col items-center justify-center py-10 text-slate-300">
              <Package className="w-12 h-12 mb-2 opacity-20" />
              <p className="text-xs font-medium italic">Enter received quantities to see impact</p>
            </div>
          </ImpactCard>

          <ImpactCard 
            title="Financial Impact" 
            icon={DollarSign}
            statusBadge={<span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded border border-orange-100 uppercase">Pending Creation</span>}
          >
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500"><span>Bill to Pay Amount:</span><span className="font-bold text-slate-800 text-sm">$0.00</span></div>
              <div className="flex justify-between text-slate-500"><span>Invoice Expected:</span><span className="bg-blue-50 text-blue-600 text-[9px] px-2 rounded font-bold uppercase">Pending</span></div>
              <div className="flex justify-between text-slate-500 pb-3 border-b border-slate-50"><span>Payment Terms:</span><span className="font-bold text-slate-700">Net 30</span></div>
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-700 leading-tight">Bill to Pay will be auto-created upon confirmation</p>
              </div>
            </div>
          </ImpactCard>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Receipt Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Received:</span>
                <span className="font-bold text-emerald-600">0 units</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Damaged:</span>
                <span className="font-bold text-red-600">0 units</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Items Updated:</span>
                <span className="font-bold text-slate-800">0 / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Sticky Actions */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-between z-50 px-8">
        <div className="flex gap-4 text-[11px] font-bold">
          <span className="text-emerald-600">Received: 0</span>
          <span className="text-red-600">Damaged: 0</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 border border-[#1e3a8a] text-[#1e3a8a] font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button className="flex items-center gap-2 px-6 py-2 border border-[#1e3a8a] text-[#1e3a8a] font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">
            <Save className="w-4 h-4" /> Save as Partial
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
            <CheckCircle className="w-4 h-4" /> Mark as Received
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveGoodsVerification;