import React, { useState, useEffect } from 'react';
import {
  X, CreditCard, DollarSign, Calendar,
  FileText, Bell, CheckCircle2, RefreshCcw,
  TrendingDown, Check, AlertCircle
} from 'lucide-react';

const PaymentModals = ({ isOpen, onClose, data, onUpdate }) => {

  const [step, setStep] = useState('form');
  const [isNotifying, setIsNotifying] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Form State Management
  const [formData, setFormData] = useState({
    paymentDate: "",
    totalPaidAmount: "",
    referenceNumber: "",
    notes: "",
    remainingBalance: data?.remaining || "0.00"
  });

  // 2. Error State Management
  const [errors, setErrors] = useState({});

  // Debug: Log data to console
  useEffect(() => {
    if (isOpen && data) {
      console.log('PaymentModals data:', data);
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;


  // 3. Validation Logic
  const handleConfirm = async () => {
    console.log('Form data before validation:', formData);
    const newErrors = {};

    // Stricter validation: check for actual values
    if (!formData.paymentDate) {
      newErrors.paymentDate = true;
    }
    if (!formData.totalPaidAmount || parseFloat(formData.totalPaidAmount) <= 0) {
      newErrors.totalPaidAmount = true;
    }
    if (!formData.referenceNumber) {
      newErrors.referenceNumber = true;
    }

    console.log('Errors found:', newErrors);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return; // Stop execution if fields are missing
    }

    const currentRemaining = parseFloat(data.remaining?.replace(/,/g, '') || 0);
    const paidAmountValue = parseFloat(formData.totalPaidAmount) || 0;
    const remaining = currentRemaining - paidAmountValue;


    const paymentPayload = {
      transactionId: data.id,
      paymentDate: formData.paymentDate ? `${formData.paymentDate}T00:00:00` : null,
      amountPaid: paidAmountValue,
      referenceNumber: formData.referenceNumber,
      remainingBalance: remaining,
      dueDate: data.date ? `${new Date(data.date).toISOString().split('T')[0]}T00:00:00` : null,
      paymentMethod: "Bank Transfer" // Default or could be a field
    };


    try {
      setIsSaving(true);
      const response = await fetch('http://localhost:8080/api/ledger/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentPayload)
      });

      if (!response.ok) throw new Error('Failed to save payment');
      if (onUpdate) onUpdate();

      setErrors({});
      setStep('success');

    } catch (err) {
      console.error('Payment save error:', err);
      setErrors({ submit: 'Failed to save payment. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setFormData({
      paymentDate: "",
      totalPaidAmount: "",
      referenceNumber: "",
      notes: "",
      remainingBalance: data?.remaining || "0.00"
    });
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
                {/* Display Due Date */}
                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</p>
                  <p className="text-sm font-bold text-slate-700">{data.dueDate || data.date || '-'}</p>
                </div>

                {/* Payment Date Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Payment Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.paymentDate ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input
                      type="date"
                      value={formData.paymentDate}
                      onChange={(e) => updateField('paymentDate', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.paymentDate ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`}
                    />
                  </div>
                </div>

                {/* Total Paid Amount Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Total Paid Amount <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <DollarSign className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.totalPaidAmount ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      value={formData.totalPaidAmount}
                      onChange={(e) => updateField('totalPaidAmount', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.totalPaidAmount ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`}
                    />

                  </div>
                </div>

                {/* Reference Number Field */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Reference Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.referenceNumber ? 'text-red-500' : 'text-slate-400'}`} size={14} />
                    <input
                      type="text"
                      placeholder="BTX-4589024"
                      value={formData.referenceNumber}
                      onChange={(e) => updateField('referenceNumber', e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-xs font-semibold outline-none transition-all
                        ${errors.referenceNumber ? 'border-red-500 ring-2 ring-red-500/10' : 'border-slate-200 focus:ring-2 focus:ring-blue-500/20'}`}
                    />
                  </div>
                </div>

                {/* Display Remaining Balance */}
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Remaining Balance</p>
                  <p className="text-lg font-black text-red-600">
                    ${(parseFloat(data.remaining?.replace(/,/g, '') || 0) - parseFloat(formData.totalPaidAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>

                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5 ml-1">Notes (Optional)</label>
                  <textarea
                    rows="2"
                    placeholder="Add payment notes or comments..."
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium outline-none resize-none"
                  />
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
              <button
                onClick={handleConfirm}
                disabled={isSaving}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-green-700 shadow-lg shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} /> {isSaving ? 'Saving...' : 'Confirm Payment'}
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
              <SuccessRow icon={<CheckCircle2 size={14} />} color="bg-green-50 text-green-700" title={`Payment Recorded: $${formData.totalPaidAmount}`} sub={`Ref: ${formData.referenceNumber}`} />
              <SuccessRow icon={<RefreshCcw size={14} />} color="bg-blue-50 text-blue-700" title="Financial Record Updated" sub="Accounts Payable ledger synchronized" />
              <SuccessRow icon={<TrendingDown size={14} />} color="bg-emerald-50 text-emerald-700" title="Debt Balance Reduced" sub={`Remaining: $${(parseFloat(data.remaining?.replace(/,/g, '') || 0) - parseFloat(formData.totalPaidAmount || 0)).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />

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