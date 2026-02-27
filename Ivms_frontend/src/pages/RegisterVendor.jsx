import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Building2, Phone, CreditCard, 
  Truck, CheckCircle2, Loader2, AlertCircle 
} from 'lucide-react';

// Note: Ensure ActionButton is imported correctly from your UI folder
const ActionButton = ({ label, icon: Icon, onClick, variant, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
      variant === 'primary' 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' 
        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
    }`}
  >
    {Icon && <Icon className={`w-4 h-4 ${variant === 'primary' ? 'animate-none' : ''}`} />}
    {label}
  </button>
);

const RegisterVendor = () => {
  const navigate = useNavigate();
  
  // Single state object for the whole form
  const [formData, setFormData] = useState({
    companyName: '',
    license: '',
    category: '',
    taxId: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    bankName: '',
    accountNumber: '',
    swiftCode: '',
    paymentTerms: '',
    leadTime: '',
    shippingMethod: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  // FIXED: Stable change handler for smooth typing
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Direct update without re-creating the function scope
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Remove error border when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

 const handleSave = async (e) => {
  if (e) e.preventDefault();
  
  // 1. Validate Required Fields
  const newErrors = {};
  if (!formData.companyName.trim()) newErrors.companyName = true;
  if (!formData.license.trim()) newErrors.license = true;
  if (!formData.email.trim()) newErrors.email = true;

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setIsSaving(true);

  try {
    // 2. Map Frontend State to Backend DTO Names
    const payload = {
      companyName: formData.companyName,
      tradeLicenseNumber: formData.license, 
      category: formData.category,
      taxId: formData.taxId,
      contactPerson: formData.contactPerson,
      email: formData.email,
      phoneNumber: formData.phone,      
      officeAddress: formData.address,  
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      swiftCode: formData.swiftCode,
      paymentTerms: formData.paymentTerms,
      leadTime: parseInt(formData.leadTime) || 0,
      shippingMethod: formData.shippingMethod
    };

    const response = await fetch("http://localhost:8080/api/v1/vendors/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("Success:", result);
      setShowSuccess(true);
      // Redirect after success
      setTimeout(() => navigate('/supplier'), 2000);
    } else {
      const errorData = await response.json();
      console.error("Server Error:", errorData);
      alert(`Server Error: ${errorData.message || "Could not save vendor"}`);
    }
  } catch (error) {
    console.error("Connection Error:", error);
    alert("Connection error. Ensure your Spring Boot app is running on port 8080.");
  } finally {
    setIsSaving(false);
  }
};

  // Internal Input Component defined inside to keep it simple and reactive
  const RenderInput = (label, name, placeholder, type = "text", required = false) => (
    <div className="space-y-1.5" key={name}>
      <div className="flex justify-between">
        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {errors[name] && (
          <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Required
          </span>
        )}
      </div>
      <input 
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-2.5 bg-slate-50 border rounded-lg text-sm outline-none transition-all ${
          errors[name] 
            ? 'border-red-500 bg-red-50/30 focus:ring-2 focus:ring-red-500/10' 
            : 'border-slate-200 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500'
        }`}
      />
    </div>
  );

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 relative min-h-screen bg-slate-50/50">
      {/* Success Banner */}
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold tracking-wide">Vendor Registered Successfully!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">New Vendor Registration</h1>
            <p className="text-sm text-slate-400 font-medium">Onboard a new supplier to the Intelligent Management System</p>
          </div>
        </div>
        <div className="flex gap-3">
          <ActionButton label="Cancel" onClick={() => navigate(-1)} variant="secondary" />
          <ActionButton 
            label={isSaving ? "Saving..." : "Save Vendor"} 
            icon={isSaving ? Loader2 : Save} 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
          />
        </div>
      </div>

      <form className={`space-y-6 pb-20 transition-all ${isSaving ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        
        {/* General Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">General Information</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Company Name", "companyName", "e.g. Global Tech Solutions", "text", true)}
            {RenderInput("Trade License Number", "license", "e.g. TRD-8821-XX", "text", true)}
            {RenderInput("Business Category", "category", "e.g. Electronics / Logistics")}
            {RenderInput("Tax ID (VAT)", "taxId", "e.g. 100-XXX-XXX")}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contact Details</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Primary Contact Person", "contactPerson", "Full Name")}
            {RenderInput("Email Address", "email", "vendor@example.com", "email", true)}
            {RenderInput("Phone Number", "phone", "+94 XX XXX XXXX")}
            {RenderInput("Office Address", "address", "Street, City, Country")}
          </div>
        </div>

        {/* Banking */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Banking & Financials</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Bank Name", "bankName", "e.g. Commercial Bank")}
            {RenderInput("Account Number", "accountNumber", "0012345678")}
            {RenderInput("SWIFT Code", "swiftCode", "CELYBKLX")}
            {RenderInput("Payment Terms", "paymentTerms", "e.g. Net 30")}
          </div>
        </div>

        {/* Logistics */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Logistics</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Lead Time (Days)", "leadTime", "7", "number")}
            {RenderInput("Shipping Method", "shippingMethod", "e.g. Air Freight")}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterVendor;