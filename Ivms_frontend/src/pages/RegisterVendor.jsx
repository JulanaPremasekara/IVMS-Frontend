import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Building2, Phone, CreditCard, Truck } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';

const RegisterVendor = () => {
  const navigate = useNavigate();

  const FormSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
        <Icon className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );

  const InputField = ({ label, placeholder, type = "text" }) => (
    <div className="space-y-1.5">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <input 
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">New Vendor Registration</h1>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Enter official supplier details to onboard into system</p>
          </div>
        </div>
        <div className="flex gap-2">
          <ActionButton label="Cancel" onClick={() => navigate(-1)} variant="secondary" />
          <ActionButton label="Save Vendor" icon={Save} variant="primary" />
        </div>
      </div>

      <form className="max-w-5xl">
        {/* 1. General Information */}
        <FormSection title="General Information" icon={Building2}>
          <InputField label="Company Name" placeholder="e.g. Global Tech Solutions" />
          <InputField label="Trade License Number" placeholder="e.g. TRD-8821-XX" />
          <InputField label="Category" placeholder="e.g. Electronics / Logistics" />
          <InputField label="Tax ID (VAT)" placeholder="e.g. 100-XXX-XXX" />
        </FormSection>

        {/* 2. Contact Details */}
        <FormSection title="Contact Details" icon={Phone}>
          <InputField label="Primary Contact Person" placeholder="Full Name" />
          <InputField label="Email Address" placeholder="vendor@example.com" type="email" />
          <InputField label="Phone Number" placeholder="+94 XX XXX XXXX" />
          <InputField label="Office Address" placeholder="Street, City, Country" />
        </FormSection>

        {/* 3. Banking & Payment */}
        <FormSection title="Banking & Financials" icon={CreditCard}>
          <InputField label="Bank Name" placeholder="Commercial Bank / HNB" />
          <InputField label="Account Number" placeholder="XXXX-XXXX-XXXX" />
          <InputField label="SWIFT/BIC Code" placeholder="CELYBKLX" />
          <InputField label="Payment Terms" placeholder="e.g. Net 30, COD" />
        </FormSection>

        {/* 4. Logistics */}
        <FormSection title="Logistics & Compliance" icon={Truck}>
          <InputField label="Lead Time (Days)" placeholder="e.g. 7" type="number" />
          <InputField label="Shipping Method" placeholder="Air / Sea / Road" />
        </FormSection>
      </form>
    </div>
  );
};

export default RegisterVendor;