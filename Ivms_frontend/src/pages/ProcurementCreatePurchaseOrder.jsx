import React, { useState, useMemo } from 'react';
import axios from 'axios'; // 1. Added Axios
import { 
  User, ShoppingCart, Plus, Info, Trash2, 
  DollarSign, Clock, Save, X, UploadCloud, Calendar, Sparkles, CheckCircle, TrendingUp, Loader2
} from 'lucide-react';

// Note: Ensure these UI components are in your project
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

  const [loading, setLoading] = useState(false);
  const [vendorId, setVendorId] = useState("TechSupply Inc.");

  // 2. Calculations
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (item.qty * item.price), 0), [items]);
  const tax = subtotal * 0.08;
  const shipping = 150.00;
  const total = subtotal + tax + shipping;
  const budgetRemaining = 50000;

  // 3. API Submission Handler
  const handleApproveAndSend = async () => {
    setLoading(true);
    
    // Mapping local state to match the Spring Boot DTO
    const purchaseOrderPayload = {
      vendorId: vendorId,
      expectedDeliveryDate: "2026-03-08", // Matching your UI default
      items: items.map(item => ({
        sku: item.sku,
        quantity: item.qty,
        price: item.price
      }))
    };

    try {
      const response = await axios.post('/api/v1/purchaseOrders', purchaseOrderPayload);
      alert(`Success! Purchase Order Created with ID: ${response.data.id}`);
    } catch (error) {
      console.error("Error creating PO:", error);
      alert("Failed to create Purchase Order. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Handlers for UI
  const addItem = () => {
    const newItem = { id: Date.now(), name: '', sku: '', stock: 0, safety: 0, ai: 0, qty: 1, price: 0.00, trend: 'Manual' };
    setItems([...items, newItem]);
  };

  const removeItem = (id) => setItems(items.filter(item => item.id !== id));

  const updateItemField = (id, field, val) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: (field === 'name' || field === 'sku') ? val : Number(val) } : item
    ));
  };

  const applyAISuggestion = (id, aiVal) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: aiVal } : item));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-24 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create Purchase Order</h1>
          <p className="text-sm text-slate-500 font-medium">AI-generated purchase order based on inventory forecast</p>
        </div>
        <CreationModeToggle />
      </div>

      <AIBanner />

      <div className="grid grid-cols-12 gap-6">
        {/* Main Form */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          <FormSection title="Vendor Information" icon={User}>
            <div className="space-y-4">
              <div className="w-full">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Vendor *</label>
                <select 
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50/50 mt-1"
                  onChange={(e) => setVendorId(e.target.value)}
                >
                  <option value="TechSupply Inc.">TechSupply Inc. - Active</option>
                  <option value="GlobalParts">GlobalParts Co. - Active</option>
                </select>
              </div>
              <div className="flex items-center gap-8 py-3 px-4 bg-slate-50/30 rounded-xl border border-dashed border-slate-200">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vendor Rating</p>
                  <div className="flex items-center gap-1"><span className="text-yellow-500">★★★★☆</span><span className="text-xs font-bold text-slate-700">4.5</span></div>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-slate-400 uppercase">Payment Terms</p>
                   <p className="text-xs font-bold text-slate-700 uppercase">Net 30</p>
                </div>
                <button className="ml-auto text-blue-600 text-[10px] font-bold underline flex items-center gap-1">
                  <Info className="w-3 h-3" /> View Contract Details
                </button>
              </div>
            </div>
          </FormSection>

          <FormSection 
            title="Order Items" 
            icon={ShoppingCart} 
            action={
              <button onClick={addItem} className="bg-[#1e3a8a] text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1">
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
                    <th className="pb-3 px-2 text-center w-[12%] text-purple-600">AI Suggest</th>
                    <th className="pb-3 px-2 text-center w-[10%]">Order Qty</th>
                    <th className="pb-3 px-4 w-[12%]">Price</th>
                    <th className="pb-3 px-4 text-right w-[15%]">Subtotal</th>
                    <th className="pb-3 px-4 w-[5%]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.id} className="group hover:bg-slate-50/30">
                      <td className="py-3 px-4">
                        <input type="text" value={item.name} onChange={(e) => updateItemField(item.id, 'name', e.target.value)} className="w-full bg-transparent font-medium outline-none" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={item.sku} onChange={(e) => updateItemField(item.id, 'sku', e.target.value)} className="w-full bg-transparent text-slate-400 font-mono outline-none" />
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-red-500">{item.stock}</td>
                      <td className="py-3 px-2 text-center">
                        <button onClick={() => applyAISuggestion(item.id, item.ai)} className="bg-purple-50 text-purple-600 px-2 py-1 rounded font-bold">{item.ai}</button>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input type="number" value={item.qty} onChange={(e) => updateItemField(item.id, 'qty', e.target.value)} className="w-16 border rounded p-1 text-center font-bold" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" value={item.price} onChange={(e) => updateItemField(item.id, 'price', e.target.value)} className="w-full bg-transparent" />
                      </td>
                      <td className="py-3 px-4 text-right font-bold">
                        ${(item.qty * item.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                         <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>
        </div>

        {/* Sidebar */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <SummaryCard title="Financial Summary" icon={DollarSign}>
             <div className="space-y-3 text-xs">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">${subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between border-b pb-3"><span>Tax (8%)</span><span className="font-bold">${tax.toLocaleString()}</span></div>
                <div className="flex justify-between items-center py-2">
                   <span className="font-bold text-sm">Total PO Amount</span>
                   <span className="font-black text-base">${total.toLocaleString()}</span>
                </div>
                <div className="bg-emerald-50 p-3 rounded-lg flex items-center gap-2">
                   <CheckCircle className="w-3 h-3 text-emerald-500" />
                   <p className="text-[10px] font-bold text-emerald-700">Budget Status: Healthy</p>
                </div>
             </div>
          </SummaryCard>
        </div>
      </div>

      {/* Footer Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t p-4 flex items-center justify-between z-50">
        <div className="text-xs font-bold text-slate-400">
           Total: <span className="text-slate-900 font-black text-sm">${total.toLocaleString()}</span>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-2 border rounded-lg text-xs font-bold">Cancel</button>
          <button 
            onClick={handleApproveAndSend}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
            {loading ? "Processing..." : "Approve & Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProcurementCreatePurchaseOrder;