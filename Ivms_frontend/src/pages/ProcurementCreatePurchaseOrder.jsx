import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { 
  User, ShoppingCart, Plus, Info, Trash2, 
  DollarSign, Clock, Save, X, UploadCloud, 
  Calendar, Sparkles, CheckCircle, TrendingUp, 
  Loader2, MapPin, FileText, Paperclip
} from 'lucide-react';

// Mock UI Components (Ensure these exist or replace with standard divs)
const FormSection = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-900 rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const ProcurementCreatePurchaseOrder = () => {
  // --- State Management ---
  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState("TechSupply Inc.");
  const [deliveryDate, setDeliveryDate] = useState("2026-03-13");
  const [shippingMethod, setShippingMethod] = useState("Standard Shipping");
  const [internalNotes, setInternalNotes] = useState("");
  
  const [items, setItems] = useState([
    { id: 1, name: 'Premium Wireless Headphones', sku: 'SKU-001', stock: 25, safety: 50, ai: 100, qty: 100, price: 85.00 },
    { id: 2, name: 'Smart Watch Series 5', sku: 'SKU-003', stock: 15, safety: 30, ai: 75, qty: 75, price: 299.00 },
    { id: 3, name: 'Bluetooth Speaker', sku: 'SKU-004', stock: 8, safety: 25, ai: 50, qty: 50, price: 45.00 },
  ]);

  // --- Calculations ---
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.price), 0), [items]);
  const tax = subtotal * 0.08;
  const shipping = 150.00;
  const total = subtotal + tax + shipping;
  const budgetRemaining = 50000;

  // --- Handlers ---
  const handleApproveAndSend = async () => {
    setLoading(true);
    const payload = {
      vendorId,
      expectedDeliveryDate: deliveryDate,
      shippingMethod,
      internalNotes,
      items: items.map(item => ({ sku: item.sku, quantity: item.qty, price: item.price })),
      totalAmount: total
    };

    try {
      // Replace with your actual endpoint
      const response = await axios.post('/api/v1/purchaseOrders', payload);
      alert(`PO Created Successfully: ${response.data.id || 'Success'}`);
    } catch (error) {
      alert("Submission failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const updateItemField = (id, field, val) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: (field === 'name' || field === 'sku') ? val : Number(val) } : item));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 pb-24 font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Create Purchase Order</h1>
          <p className="text-slate-500 text-sm">AI-generated purchase order based on inventory forecast</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white shadow-sm">Manual Creation</button>
            <button className="px-4 py-1.5 text-xs font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-600" /> AI Suggested PO
            </button>
        </div>
      </div>

      {/* AI Alert Banner */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg self-start">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">AI Procurement Oracle Generated This PO</h4>
            <p className="text-xs text-slate-500">Low Stock Alert triggered automatic PO suggestion based on forecast demand and safety stock levels.</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold">Accept All Suggestions</button>
            <button className="border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-lg text-xs font-bold bg-white">Modify Before Sending</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Vendor Section */}
          <FormSection title="Vendor Information" icon={User}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Vendor *</label>
                <select className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-50 outline-none">
                  <option>TechSupply Inc. - Active</option>
                </select>
              </div>
              <div className="flex items-center gap-10 p-4 bg-slate-50/50 border border-dashed rounded-xl border-slate-200">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vendor Rating</p>
                   <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">★★★★☆ <span className="text-slate-700 ml-1">4.5</span></div>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Payment Terms</p>
                   <p className="text-xs font-bold text-slate-700">Net 30</p>
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Contract Expiry</p>
                   <p className="text-xs font-bold text-slate-700 text-red-500">2027-06-30</p>
                </div>
                <button className="ml-auto text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
                    <Info className="w-3 h-3" /> View Contract Details
                </button>
              </div>
            </div>
          </FormSection>

          {/* Items Section */}
          <FormSection 
            title="Order Items" 
            icon={ShoppingCart}
            action={<button className="bg-blue-900 text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1"><Plus className="w-3 h-3"/> Add Item</button>}
          >
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-50">
                  <th className="pb-3 px-2">Item Name</th>
                  <th className="pb-3 px-2">SKU</th>
                  <th className="pb-3 px-2 text-center">Stock</th>
                  <th className="pb-3 px-2 text-center text-indigo-600">AI Suggested</th>
                  <th className="pb-3 px-2 text-center">Order Qty</th>
                  <th className="pb-3 px-2">Unit Price</th>
                  <th className="pb-3 px-2 text-right">Subtotal</th>
                  <th className="pb-3 px-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map(item => (
                  <tr key={item.id} className="group">
                    <td className="py-4 px-2 font-medium">{item.name}</td>
                    <td className="py-4 px-2 text-slate-400 font-mono">{item.sku}</td>
                    <td className="py-4 px-2 text-center font-bold text-red-500">{item.stock}</td>
                    <td className="py-4 px-2 text-center">
                      <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-bold border border-indigo-100">{item.ai}</span>
                    </td>
                    <td className="py-4 px-2 text-center">
                      <input 
                        type="number" 
                        value={item.qty} 
                        onChange={(e) => updateItemField(item.id, 'qty', e.target.value)}
                        className="w-16 border rounded p-1 text-center font-bold bg-white"
                      />
                    </td>
                    <td className="py-4 px-2 font-medium">${item.price.toFixed(2)}</td>
                    <td className="py-4 px-2 text-right font-bold text-slate-700">${(item.qty * item.price).toFixed(2)}</td>
                    <td className="py-4 px-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-700">Items Subtotal:</p>
                <p className="text-xl font-black text-slate-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </FormSection>

          {/* Delivery Section - ADDED FROM SCREENSHOT 1 */}
          <FormSection title="Delivery & Additional Information" icon={Calendar}>
            <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                    <label className="text-[10px] font-bold text-red-500 uppercase">Expected Delivery Date *</label>
                    <div className="relative mt-1">
                        <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input 
                            type="date" 
                            className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 ring-blue-50"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-bold text-red-500 uppercase">Shipping Method *</label>
                    <select 
                        className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm outline-none"
                        value={shippingMethod}
                        onChange={(e) => setShippingMethod(e.target.value)}
                    >
                        <option>Standard Shipping</option>
                        <option>Express (2-Day)</option>
                        <option>Overnight</option>
                    </select>
                </div>
            </div>
            <div className="mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Internal Notes (Optional)</label>
                <textarea 
                    className="w-full mt-1 border border-slate-200 rounded-lg p-3 text-sm min-h-[100px] outline-none placeholder:text-slate-300"
                    placeholder="Add any internal notes or special instructions..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                />
            </div>
            <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">Attachments (Optional)</label>
                <div className="mt-1 border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center bg-slate-50/30 hover:bg-slate-50 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-500">Click to upload or drag and drop</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase">PDF, DOC, XLS (Max 10MB)</p>
                </div>
            </div>
          </FormSection>
        </div>

        {/* Right Column / Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          
          {/* Financial Summary - ADDED FROM SCREENSHOT 2 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-2 border-b border-slate-50">
                <div className="p-1.5 bg-emerald-100 rounded-md">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">Financial Summary</h3>
            </div>
            <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm text-slate-500">
                    <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-slate-700">${subtotal.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Tax (8%)</span><span className="font-bold text-slate-700">${tax.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span className="font-bold text-slate-700">${shipping.toLocaleString()}</span></div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <span className="font-bold text-slate-900">Total PO Amount</span>
                    <span className="text-xl font-black text-slate-900">${total.toLocaleString()}</span>
                </div>
                <div className="space-y-2 pt-2">
                    <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">Budget Remaining</span>
                        <span className="text-slate-700">${budgetRemaining.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400 uppercase">After This PO</span>
                        <span className="text-emerald-600">${(budgetRemaining - total).toLocaleString()}</span>
                    </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <div className="leading-tight">
                        <p className="text-[11px] font-bold text-emerald-800">Budget Status: Healthy</p>
                        <p className="text-[10px] text-emerald-600">Sufficient budget available</p>
                    </div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <div className="leading-tight">
                        <p className="text-[11px] font-bold text-blue-800">Pending Ledger Entry</p>
                        <p className="text-[10px] text-blue-600">This amount will be committed upon approval</p>
                    </div>
                </div>
            </div>
          </div>

          {/* Recent Activity - ADDED FROM SCREENSHOT 2 */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 flex items-center gap-2 border-b border-slate-50">
                <Clock className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-700">Recent Activity</h3>
            </div>
            <div className="p-5">
                <div className="relative border-l-2 border-slate-100 ml-2 space-y-6 pb-2">
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white"></div>
                        <p className="text-xs font-bold text-slate-800 leading-none">PO created</p>
                        <p className="text-[10px] text-slate-400 mt-1">Just now</p>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-purple-500 border-4 border-white"></div>
                        <p className="text-xs font-bold text-slate-800 leading-none">AI suggestions generated</p>
                        <p className="text-[10px] text-slate-400 mt-1">2 minutes ago</p>
                    </div>
                    <div className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-orange-500 border-4 border-white"></div>
                        <p className="text-xs font-bold text-slate-800 leading-none">Low stock alert triggered</p>
                        <p className="text-[10px] text-slate-400 mt-1">5 minutes ago</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-8 flex justify-between items-center shadow-lg z-50">
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Total:</span>
            <span className="text-lg font-black text-slate-900">${total.toLocaleString()}</span>
            <span className="text-[10px] text-slate-400 ml-2 font-bold">{items.length} items</span>
        </div>
        <div className="flex gap-3">
            <button className="px-5 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            <button className="px-5 py-2 text-xs font-bold text-blue-900 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50">
                <Save className="w-3.5 h-3.5" /> Save as Draft
            </button>
            <button 
                onClick={handleApproveAndSend}
                disabled={loading}
                className="px-6 py-2 text-xs font-bold text-white bg-emerald-600 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-sm disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {loading ? "Approving..." : "Approve & Send"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCreatePurchaseOrder;