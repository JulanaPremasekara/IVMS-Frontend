import React from 'react';
import { 
  Package, User, ShoppingCart, Truck, 
  Plus, Sparkles, DollarSign, Clock, Save, Send, X 
} from 'lucide-react';
import { FormSection } from '../components/ui/FormSection';
import { SummaryCard } from '../components/ui/SummaryCard';


const ProcurementCreatePurchaseOrder = () => {
  return (
    <div className="space-y-6">
     

      {/* 2. Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Column: Form Fields */}
        <div className="col-span-12 lg:col-span-9">
          
          {/* AI Suggestion Banner */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-purple-500 w-5 h-5" />
              <p className="text-xs text-slate-700">
                <span className="font-bold text-purple-700 underline cursor-pointer">AI Procurement Oracle</span> generated this PO based on low stock alerts.
              </p>
            </div>
            <button className="bg-emerald-500 text-white px-3 py-1 rounded text-[10px] font-bold">Accept All Suggestions</button>
          </div>

          <FormSection title="Vendor Information" icon={User}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Vendor *</label>
                <select className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50">
                  <option>TechSupply Inc. - Active</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Payment Terms</p>
                  <p className="font-medium text-slate-700">Net 30</p>
                </div>
                <div className="text-xs">
                  <p className="text-slate-400 text-[10px] uppercase font-bold">Contract Expiry</p>
                  <p className="font-medium text-slate-700">2027-05-30</p>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Order Items" 
            icon={ShoppingCart} 
            action={<button className="text-blue-600 text-[10px] font-bold flex items-center gap-1"><Plus className="w-3 h-3" /> Add Item</button>}
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-50">
                  <th className="pb-3">Item Name</th>
                  <th className="pb-3">Current Stock</th>
                  <th className="pb-3">Order Qty</th>
                  <th className="pb-3">Unit Price</th>
                  <th className="pb-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {[
                  { name: 'Premium Wireless Headphones', stock: 25, qty: 100, price: 85.00 },
                  { name: 'Smart Watch Series 5', stock: 15, qty: 75, price: 299.00 }
                ].map((item, i) => (
                  <tr key={i}>
                    <td className="py-4 font-medium text-slate-800">{item.name}</td>
                    <td className="py-4 text-red-500 font-bold">{item.stock}</td>
                    <td className="py-4">
                      <input type="number" defaultValue={item.qty} className="w-16 border border-slate-200 rounded p-1 text-center" />
                    </td>
                    <td className="py-4">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-bold">${(item.qty * item.price).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </FormSection>

          <FormSection title="Delivery & Additional Information" icon={Truck}>
             <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expected Delivery Date *</label>
                  <input type="date" className="w-full border border-slate-200 rounded-lg p-2 text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Shipping Method</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2 text-xs">
                    <option>Standard Shipping</option>
                  </select>
                </div>
             </div>
          </FormSection>
        </div>

        {/* Right Column: Sidebar */}
        <div className="col-span-12 lg:col-span-3">
          <SummaryCard title="Financial Summary" icon={DollarSign} footer={
            <div className="bg-emerald-50 p-2 rounded border border-emerald-100 text-[10px] text-emerald-700 font-bold">
              ✓ Budget Status: Healthy
            </div>
          }>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>$33,175.00</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax (8%)</span><span>$2,654.00</span></div>
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span>$150.00</span></div>
              <div className="flex justify-between font-bold text-slate-800 text-sm pt-2 border-t border-slate-50">
                <span>Total Amount</span><span>$35,979.00</span>
              </div>
            </div>
          </SummaryCard>

          <SummaryCard title="Recent Activity" icon={Clock}>
            <div className="space-y-4">
              {[
                { label: 'PO Created', time: 'Just now', color: 'bg-blue-500' },
                { label: 'AI Suggestions generated', time: '2 mins ago', color: 'bg-purple-500' },
                { label: 'Low stock alert triggered', time: '5 mins ago', color: 'bg-red-500' },
              ].map((act, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${act.color}`}></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-700">{act.label}</p>
                    <p className="text-[10px] text-slate-400">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </SummaryCard>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-4 border-t border-slate-100 flex justify-end gap-3 rounded-b-xl">
        <button className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <X className="w-4 h-4" /> Cancel
        </button>
        <button className="px-6 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save as Draft
        </button>
        <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-md shadow-emerald-100 flex items-center gap-2">
          <Send className="w-4 h-4" /> Approve & Send
        </button>
      </div>
    </div>
  );
};

export default ProcurementCreatePurchaseOrder;