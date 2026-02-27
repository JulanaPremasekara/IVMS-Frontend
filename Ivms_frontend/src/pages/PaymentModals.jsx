import React, { useState } from 'react';
import { 
  X, CreditCard, DollarSign, Calendar, 
  FileText, Bell, CheckCircle2, RefreshCcw, 
  TrendingDown, Check, AlertCircle
} from 'lucide-react';

const PaymentModals = ({ isOpen, onClose, data }) => {
  const [step, setStep] = useState('form'); 
  const [isNotifying, setIsNotifying] = useState(true);
  
  // 1. Form State Management
  const [formData, setFormData] = useState({
    date: "02/26/2026",
    amount: "",
    reference: ""
  });
  
  // 2. Error State Management
  const [errors, setErrors] = useState({});

  if (!isOpen || !data) return null;

  // 3. Validation Logic
  const handleConfirm = () => {
    const newErrors = {};
    if (!formData.date.trim()) newErrors.date = true;
    if (!formData.amount.trim()) newErrors.amount = true;
    if (!formData.reference.trim()) newErrors.reference = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop execution if fields are missing
    }

    // If valid, proceed to success screen
    setErrors({});
    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setFormData({ date: "02/26/2026", amount: "", reference: "" });
    setErrors({});
    onClose();
  };

  // Helper to update form and clear specific error
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {step === 'form' ? (
          <>
            <div className="p-5 flex items-start justify-between border-b border-slate-100">
              <div className="flex gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <CreditCard className="text-blue-900" size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Log Payment - {data.id}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">Record vendor payment and update accounts payable</p>
                </div>
              </div>
              <button onClick={handleClose} className="text-slate-300 hover:text-slate-500 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vendor Name</p>
                  <p className="text-xs font-bold text-slate-700">{data.vendor}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expense ID</p>
                  <p className="text-xs font-bold text-slate-700">{data.id}</p>
                </div>
              </div>

              <div className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Outstanding Balance</p>
                  <p className="text-xl font-black text-red-600">${data.remaining || data.original}</p>
                </div>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <DollarSign className="text-red-500" size={20} />
                </div>
              </div>

              <div className="space-y-3">
                {/* Payment Date Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Payment Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.date ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input 
                      type="text" 
                      value={formData.date}
                      onChange={(e) => updateField('date', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.date ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`} 
                    />
                  </div>
                </div>

                {/* Payment Amount Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Payment Amount <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.amount ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input 
                      type="text" 
                      placeholder="0.00" 
                      value={formData.amount}
                      onChange={(e) => updateField('amount', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.amount ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`} 
                    />
                  </div>
                </div>

                {/* Bank Reference Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Bank Reference Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.reference ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input 
                      type="text" 
                      placeholder="BTX-4589024" 
                      value={formData.reference}
                      onChange={(e) => updateField('reference', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.reference ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Notes (Optional)</label>
                  <textarea rows="2" placeholder="Add payment notes or comments..." className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none resize-none" />
                </div>
              </div>

              <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Bell className="text-blue-600" size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-blue-900">Notify Procurement Manager</p>
                    <p className="text-[9px] text-blue-600 font-medium">Send payment confirmation email</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsNotifying(!isNotifying)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${isNotifying ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isNotifying ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              
              {/* Optional: Visual Alert when form is invalid */}
              {Object.keys(errors).length > 0 && (
                <div className="flex items-center gap-2 text-red-600 text-[10px] font-bold justify-center bg-red-50 py-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
                  <AlertCircle size={12} /> Please fill in all required fields
                </div>
              )}
            </div>

            <div className="p-5 bg-slate-50/50 flex gap-3">
              <button onClick={handleClose} className="flex-1 py-2.5 border-2 border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition-all">
                Cancel
              </button>
              <button onClick={handleConfirm} className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200 transition-all">
                <Check size={16} /> Confirm Payment
              </button>
            </div>
          </>
        ) : (
          /* --- SUCCESS MODAL --- */
          <div className="p-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 size={32} />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-green-600 italic tracking-tight">Payment Successfully Logged!</h3>
              <p className="text-xs text-slate-400 font-medium">Accounts payable has been updated</p>
            </div>

            <div className="space-y-2 mt-4 text-left">
              <SuccessRow icon={<CheckCircle2 size={14} />} color="bg-green-50 text-green-700" title="Payment Confirmed" sub="Partial payment recorded" />
              <SuccessRow icon={<RefreshCcw size={14} />} color="bg-blue-50 text-blue-700" title="Financial Record Updated" sub="Accounts Payable ledger synchronized" />
              <SuccessRow icon={<TrendingDown size={14} />} color="bg-emerald-50 text-emerald-700" title="Debt Balance Reduced" sub="Outstanding liability updated" />
              <SuccessRow icon={<Bell size={14} />} color="bg-purple-50 text-purple-700" title="Procurement Manager Notified" sub="Payment confirmation email sent" />
            </div>

            <button 
              onClick={handleClose}
              className="w-full mt-4 py-3 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-lg shadow-green-200"
            >
              <CheckCircle2 size={16} /> Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const SuccessRow = ({ icon, color, title, sub }) => (
  <div className={`p-3 rounded-xl border border-slate-100 flex items-center justify-between text-left`}>
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-bold text-slate-700">{title}</p>
        <p className="text-[9px] text-slate-400 font-medium">{sub}</p>
      </div>
    </div>
    <div className="w-5 h-5 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
      <Check size={10} strokeWidth={4} />
    </div>
  </div>
);

export default PaymentModals;