import React, { useState, useMemo } from 'react';
import { 
  User, ShoppingCart, Plus, Info, Trash2, 
  DollarSign, Clock, Save, X, UploadCloud, Calendar, Sparkles, CheckCircle, TrendingUp
} from 'lucide-react';
import { FormSection } from '../components/ui/FormSection';
import { SummaryCard } from '../components/ui/SummaryCard';
import { CreationModeToggle } from '../components/ui/CreationModeToggle';
import { AIBanner } from '../components/ui/AIBanner';

const ProcurementCreatePurchaseOrder = () => {
  // 1. State for Order Items
  const [items, setItems] = useState([
    { id: 1, name: 'Premium Wireless Headphones', sku: 'SKU-001', stock: 25, safety: 50, ai: 100, qty: 100, price: 85.00, trend: '120 units/month based on 3-month trend' },
    { id: 2, name: 'Smart Watch Series 5', sku: 'SKU-003', stock: 15, safety: 30, ai: 75, qty: 75, price: 299.00, trend: '85 units/month based on 3-month trend' },
    { id: 3, name: 'Bluetooth Speaker', sku: 'SKU-004', stock: 8, safety: 25, ai: 50, qty: 50, price: 45.00, trend: '60 units/month based on 3-month trend' },
  ]);

  // 2. Calculations (Memoized for performance)
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.price), 0), [items]);
  const tax = subtotal * 0.08;
  const shipping = 150.00;
  const total = subtotal + tax + shipping;
  const budgetRemaining = 50000;

  // 3. Handlers
  const addItem = () => {
    const newItem = {
      id: Date.now(),
      name: '', 
      sku: '',  
      stock: 0,
      safety: 0,
      ai: 0,
      qty: 1,
      price: 0.00, 
      trend: 'Manual entry - no historical data'
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItemField = (id, field, val) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: (field === 'name' || field === 'sku') ? val : Number(val) } : item
    ));
  };

  const applyAISuggestion = (id, aiVal) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: aiVal } : item));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create Purchase Order</h1>
          <p className="text-sm text-slate-500 font-medium">AI-generated purchase order based on inventory forecast</p>
        </div>
        <CreationModeToggle />
      </div>

      <AIBanner />

      <div className="grid grid-cols-12 gap-6">
        {/* Main Form (Left) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          <FormSection title="Vendor Information" icon={User}>
            <div className="space-y-4">
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Vendor *</label>
                <select className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50/50 mt-1">
                  <option>TechSupply Inc. - Active</option>
                </select>
              </div>
              <div className="flex items-center gap-8 py-3 px-4 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vendor Rating</p>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★★★★☆</span>
                    <span className="text-xs font-bold text-slate-700">4.5</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Terms</p>
                  <p className="text-xs font-bold text-slate-700 uppercase">Net 30</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Contract Expiry</p>
                  <p className="text-xs font-bold text-slate-700">2027-05-30</p>
                </div>
                <button className="ml-auto text-blue-600 text-[10px] font-bold underline flex items-center gap-1">
                  <Info className="w-3 h-3" /> View Contract Details
                </button>
              </div>
            </div>
          </FormSection>

          {/* Order Items Section */}
          <FormSection 
            title="Order Items" 
            icon={ShoppingCart} 
            action={
              <button 
                onClick={addItem}
                className="bg-[#1e3a8a] hover:bg-blue-900 transition-colors text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed border-collapse">
                <thead className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-50">
                  <tr>
                    <th className="pb-3 px-4 w-[25%]">Item Name</th>
                    <th className="pb-3 px-4 w-[12%]">SKU</th>
                    <th className="pb-3 px-2 text-center w-[10%]">Stock</th>
                    <th className="pb-3 px-2 text-center w-[10%]">Safety</th>
                    <th className="pb-3 px-2 text-center w-[12%] text-purple-600"><Sparkles className="inline w-3 h-3 mr-1" /> AI Suggest</th>
                    <th className="pb-3 px-2 text-center w-[10%]">Order Qty</th>
                    <th className="pb-3 px-4 w-[12%]">Price</th>
                    <th className="pb-3 px-4 text-right w-[15%]">Subtotal</th>
                    <th className="pb-3 px-4 w-[10%]"><TrendingUp className="w-3 h-3" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4">
                        <input 
                          type="text"
                          value={item.name}
                          placeholder="Item name..."
                          onChange={(e) => updateItemField(item.id, 'name', e.target.value)}
                          className="w-full bg-transparent font-medium text-slate-800 outline-none border-b border-transparent focus:border-blue-400 py-0.5"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <input 
                          type="text"
                          value={item.sku}
                          placeholder="SKU..."
                          onChange={(e) => updateItemField(item.id, 'sku', e.target.value)}
                          className="w-full bg-transparent text-slate-400 font-mono outline-none py-0.5"
                        />
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-red-500">{item.stock}</td>
                      <td className="py-3 px-2 text-center text-slate-400">{item.safety}</td>
                      <td className="py-3 px-2 text-center">
                        <button 
                           onClick={() => applyAISuggestion(item.id, item.ai)}
                           className="bg-purple-50 text-purple-600 px-2 py-1 rounded border border-purple-100 font-bold hover:bg-purple-100 transition-colors"
                        >
                          {item.ai}
                        </button>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input 
                          type="number" 
                          value={item.qty} 
                          onChange={(e) => updateItemField(item.id, 'qty', e.target.value)}
                          className="w-16 border border-slate-200 rounded p-1 text-center font-bold outline-none focus:ring-1 focus:ring-blue-400 bg-white" 
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span className="text-slate-400">$</span>
                          <input 
                            type="number" 
                            value={item.price} 
                            onChange={(e) => updateItemField(item.id, 'price', e.target.value)}
                            className="w-full bg-transparent text-slate-600 outline-none py-0.5"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2 group/tooltip relative">
                          <span className="font-bold text-slate-800">
                            ${(item.qty * item.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right group/tooltip relative">
                        <div className="relative cursor-help">
                            <Info className="w-3.5 h-3.5 text-blue-400 hover:text-blue-600 transition-colors" />
                            {/* Tooltip Popup */}
                            <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tooltip:block z-50 w-48 bg-[#1e3a8a] text-white text-[10px] p-2.5 rounded-lg shadow-xl font-normal leading-relaxed text-left">
                              <p>{item.trend}</p>
                              <div className="absolute top-full right-1.5 border-[6px] border-transparent border-t-[#1e3a8a]"></div>
                            </div>
                          </div>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/50">
                    <td colSpan="7" className="py-4 px-4 font-bold text-slate-800">Items Subtotal:</td>
                    <td className="py-4 px-4 text-right font-black text-slate-900 text-sm">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </FormSection>

          {/* Delivery Section */}
          <FormSection title="Delivery & Additional Information" icon={Calendar}>
             <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Expected Delivery Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                    <input type="text" defaultValue="March 8th, 2026" className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-xs text-blue-800 font-medium" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Shipping Method *</label>
                  <select className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-medium">
                    <option>Standard Shipping</option>
                  </select>
                </div>
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Internal Notes (Optional)</label>
                  <textarea placeholder="Add any internal notes or special instructions..." className="w-full border border-slate-200 rounded-lg p-3 text-xs min-h-[100px] outline-none" />
                </div>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/30 group hover:border-blue-400 transition-all cursor-pointer">
                   <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2" />
                   <p className="text-xs font-bold text-slate-500">Click to upload or drag and drop</p>
                   <p className="text-[10px] text-slate-400">PDF, DOC, XLS (max. 10MB)</p>
                </div>
             </div>
          </FormSection>
        </div>

        {/* Sidebar (Right) */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <SummaryCard title="Financial Summary" icon={DollarSign}>
             <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="font-bold text-slate-800">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-slate-500"><span>Tax (8%)</span><span className="font-bold text-slate-800">${tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
                <div className="flex justify-between text-slate-500 border-b border-slate-50 pb-3"><span>Shipping</span><span className="font-bold text-slate-800">${shipping.toFixed(2)}</span></div>
                <div className="flex justify-between items-center py-2">
                   <span className="font-bold text-slate-900 text-sm">Total PO Amount</span>
                   <span className="font-black text-slate-900 text-base">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="space-y-2 pt-3 border-t border-slate-50">
                   <div className="flex justify-between text-[10px] text-slate-400 uppercase font-bold"><span>Budget Remaining</span><span>${budgetRemaining.toLocaleString()}</span></div>
                   <div className="flex justify-between text-[10px] text-emerald-500 uppercase font-bold"><span>After This PO</span><span>${(budgetRemaining - total).toLocaleString()}</span></div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2">
                   <div className="bg-emerald-500 rounded-full p-1 text-white"><CheckCircle className="w-3 h-3" /></div>
                   <p className="text-[10px] font-bold text-emerald-700">Budget Status: Healthy <br/><span className="font-normal opacity-80">Sufficient budget available</span></p>
                </div>
                <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-2">
                   <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                   <p className="text-[10px] font-bold text-blue-700">Pending Ledger Entry<br/><span className="font-normal opacity-80 text-[9px]">This amount will be committed upon approval</span></p>
                </div>
             </div>
          </SummaryCard>

          <SummaryCard title="Recent Activity" icon={Clock}>
            <div className="space-y-5">
                {[
                  { label: 'PO created', time: 'Just now', dot: 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' },
                  { label: 'AI suggestions generated', time: '2 minutes ago', dot: 'bg-purple-500' },
                  { label: 'Low stock alert triggered', time: '5 minutes ago', dot: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 relative">
                    <div className={`w-2 h-2 rounded-full mt-1.5 z-10 ${item.dot}`}></div>
                    {i !== 2 && <div className="absolute left-[3.5px] top-4 w-[1px] h-8 bg-slate-100"></div>}
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{item.label}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          </SummaryCard>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-64 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-between z-50">
        <div className="text-xs font-bold text-slate-400 flex items-center gap-4">
            <span>Total: <span className="text-slate-900 font-black text-sm ml-1">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{items.length} Items</span>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">
            <X className="w-4 h-4" /> Cancel
          </button>
          <button className="flex items-center gap-2 px-6 py-2 border border-[#1e3a8a] text-[#1e3a8a] font-bold text-xs rounded-lg hover:bg-blue-50 transition-all">
            <Save className="w-4 h-4" /> Save as Draft
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all">
            <CheckCircle className="w-4 h-4" /> Approve & Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCreatePurchaseOrder;