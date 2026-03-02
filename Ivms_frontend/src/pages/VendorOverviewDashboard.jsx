import React, { useState } from 'react';
import { 
  ArrowLeft, LayoutDashboard, Edit3, Building2, 
  CreditCard, Calendar, TrendingUp, Star, CheckCircle2,
  Save, X, Info, Phone, Mail, MapPin, Clock, Box, RotateCcw
} from 'lucide-react';

const VendorOverviewDashboard = ({ vendor, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    ...vendor,
    phone: vendor.phone || "+1 (555) 123-4567",
    email: vendor.email || "john@techsupply.com",
    address: vendor.address || "123 Business Park, Tech City, TC 12345",
    creditPeriod: vendor.creditPeriod || "30 Days",
    paymentTerms: vendor.paymentTerms || "Net 30",
    endDate: vendor.endDate || "2027-03-15"
  });

  // Sample SKU data
  const [skus] = useState([
    { code: 'SKU-1001', name: 'Samsung Refrigerator 320L', price: 899.99, unit: 'unit' },
    { code: 'SKU-1002', name: 'LG Washing Machine 8kg', price: 549.99, unit: 'unit' },
    { code: 'SKU-1003', name: 'Sony 55 inch Smart TV', price: 799.99, unit: 'unit' },
    { code: 'SKU-1004', name: 'Panasonic Microwave 25L', price: 199.99, unit: 'unit' },
  ]);

  // --- NEW: Sample Purchase Order Data ---
  const [purchaseOrders] = useState([
    { poNumber: 'PO-5001', date: '2026-02-15', amount: 45250, status: 'Delivered' },
    { poNumber: 'PO-5002', date: '2026-02-10', amount: 32100, status: 'Delivered' },
    { poNumber: 'PO-5003', date: '2026-02-05', amount: 28500, status: 'In Transit' },
    { poNumber: 'PO-5004', date: '2026-01-28', amount: 51200, status: 'Delivered' },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving updated vendor data:", formData);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Navigation Header */}
        <div className="bg-white border border-slate-100 rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-50 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-indigo-600" />
            </button>
            <div className="flex items-center gap-3 border-l pl-4 border-slate-100">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-slate-800 text-lg">Vendor Overview</h2>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-900 text-white rounded-lg text-xs font-bold hover:bg-indigo-800 transition-all shadow-md"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Contract Terms
          </button>
        </div>

        {/* Top Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard label="Vendor ID" value={`VEN-${formData.id}`} icon={<Building2 className="w-4 h-4 text-slate-400" />} />
          <MetricCard label="Company Name" value={formData.companyName} icon={<Box className="w-4 h-4 text-slate-400" />} />
          <MetricCard label="Tax ID" value={formData.taxId || "TAX-987654321"} icon={<CreditCard className="w-4 h-4 text-slate-400" />} />
          <MetricCard label="Active Since" value={formData.startDate || "2024-03-15"} icon={<Calendar className="w-4 h-4 text-slate-400" />} />
        </div>

        {/* Performance & Status Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-emerald-50/50 border-2 border-emerald-100 p-6 rounded-2xl">
            <p className="text-[11px] font-bold text-emerald-800/60 uppercase tracking-widest mb-2">Vendor Score</p>
            <h3 className="text-5xl font-black text-emerald-600">82%</h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase mt-2">AI-Generated Performance</p>
          </div>

          <div className="bg-amber-50/50 border-2 border-amber-100 p-6 rounded-2xl">
            <p className="text-[11px] font-bold text-amber-800/60 uppercase tracking-widest mb-2">Reliability Rating</p>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
              <Star className="w-5 h-5 text-slate-200" />
            </div>
            <h3 className="text-3xl font-black text-slate-800">4.5 / 5.0</h3>
          </div>

          <div className="bg-white border-2 border-slate-50 p-6 rounded-2xl shadow-sm space-y-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Contract Status</p>
            <span className="px-5 py-2 bg-emerald-500 text-white text-xs font-black rounded-lg inline-block uppercase tracking-widest">Active</span>
            <p className="text-[11px] text-slate-400 font-bold italic">Valid until {formData.endDate}</p>
          </div>
        </div>

        {/* Contact & Terms Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border-l-4 border-emerald-500 shadow-sm overflow-hidden border border-slate-100">
            <div className="bg-emerald-50/30 px-6 py-4 flex items-center gap-3 border-b border-slate-100">
              <Phone className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-800 text-sm">Contact Information</h3>
            </div>
            <div className="p-6 space-y-4">
              <InfoRow icon={<Phone className="w-4 h-4" />} label="Phone" value={formData.phone} />
              <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={formData.email} />
              <InfoRow icon={<MapPin className="w-4 h-4" />} label="Address" value={formData.address} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border-l-4 border-indigo-500 shadow-sm overflow-hidden border border-slate-100">
            <div className="bg-indigo-50/30 px-6 py-4 flex items-center gap-3 border-b border-slate-100">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-slate-800 text-sm">Current Contract Terms</h3>
            </div>
            <div className="p-6 space-y-4">
              <InfoRow icon={<Calendar className="w-4 h-4" />} label="Contract Period" value={`${formData.startDate} → ${formData.endDate}`} />
              <InfoRow icon={<Clock className="w-4 h-4" />} label="Credit Period" value={formData.creditPeriod} />
              <InfoRow icon={<CreditCard className="w-4 h-4" />} label="Payment Terms" value={formData.paymentTerms} />
            </div>
          </div>
        </div>

        {/* SKU Pricing Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-slate-50/50 px-6 py-4 flex items-center gap-3 border-b border-slate-100">
            <Box className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-800 text-sm">Current SKU Pricing</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU Code</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Item Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Current Unit Price</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {skus.map((sku, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{sku.code}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{sku.name}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800 text-right">${sku.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-400 text-center">{sku.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- NEW SECTION: RECENT PURCHASE ORDERS --- */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-emerald-50/30 px-6 py-4 flex items-center gap-3 border-b border-slate-100">
            <RotateCcw className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-sm">Recent Purchase Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">PO Number</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {purchaseOrders.map((po, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">{po.poNumber}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{po.date}</td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800 text-right">${po.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                        po.status === 'Delivered' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        {po.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Edit Mode Logic
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500 rounded-lg text-white"><Edit3 className="w-5 h-5" /></div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Edit Contract Terms</h2>
            <p className="text-xs text-slate-500 font-medium">Update company details, contact info and terms</p>
          </div>
        </div>
        <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
      </div>

      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <EditField label="Company Name" name="companyName" value={formData.companyName} onChange={handleInputChange} />
        <EditField label="Tax ID" name="taxId" value={formData.taxId} onChange={handleInputChange} />
        <EditField label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
        <EditField label="Email Address" name="email" value={formData.email} onChange={handleInputChange} />
        <EditField label="Credit Period" name="creditPeriod" value={formData.creditPeriod} onChange={handleInputChange} />
        <EditField label="Payment Terms" name="paymentTerms" value={formData.paymentTerms} onChange={handleInputChange} />
      </div>

      <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
        <button onClick={() => setIsEditing(false)} className="px-6 py-2 text-sm font-bold text-slate-500">Cancel</button>
        <button onClick={handleSave} className="flex items-center gap-2 px-8 py-2 bg-indigo-900 text-white rounded-lg text-sm font-bold hover:bg-indigo-800 shadow-md active:scale-95 transition-all">
          <Save className="w-4 h-4" /> Update Records
        </button>
      </div>
    </div>
  );
};

// Helpers
const MetricCard = ({ label, value, icon }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-1">
    <div className="flex items-center gap-2 mb-1">
      {icon} <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
    </div>
    <p className="text-sm font-black text-slate-800 truncate">{value}</p>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-slate-50/50 p-3 rounded-xl border border-slate-50 transition-hover hover:border-slate-200">
    <div className="text-slate-400 bg-white p-2 rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{label}</p>
      <p className="text-sm font-bold text-slate-700">{value}</p>
    </div>
  </div>
);

const EditField = ({ label, name, value, onChange }) => (
  <label className="block">
    <span className="text-[11px] font-black text-slate-500 uppercase tracking-tighter ml-1">{label}</span>
    <input name={name} value={value} onChange={onChange} className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 outline-none transition-all" />
  </label>
);

export default VendorOverviewDashboard;