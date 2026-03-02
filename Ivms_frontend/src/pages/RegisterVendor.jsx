import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, Building2, Phone, CreditCard, 
  Truck, CheckCircle2, Loader2, AlertCircle, Plus 
} from 'lucide-react';

const ActionButton = ({ label, icon: Icon, onClick, variant, disabled, type = "button" }) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95 disabled:opacity-50 ${
      variant === 'primary' 
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200' 
        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label}
  </button>
);

const RegisterVendor = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    companyName: '',
    taxId: '',
    address: '',
    contactPerson: '',
    email: '',
    phone: '',
    paymentTerms: '',
    startDate: '',
    endDate: '',
    sku: '',
    unitPrice: '',
    addSKU: 0,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  // Load vendor data if "edit" ID is present in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const editId = queryParams.get('edit');
    
    if (editId) {
      setIsEditMode(true);
      fetch(`http://localhost:8080/api/v1/vendors`)
        .then(res => res.json())
        .then(data => {
          const vendorToEdit = data.find(v => v.id.toString() === editId);
          if (vendorToEdit) {
            setFormData(vendorToEdit);
          }
        })
        .catch(err => console.error("Error fetching vendor for edit:", err));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleAddSKU = () => {
    if (!formData.sku || !formData.unitPrice) {
      alert("Please enter both SKU and Unit Price before adding.");
      return;
    }
    setFormData(prev => ({
        ...prev,
        sku: '',
        unitPrice: '',
        addSKU: (prev.addSKU || 0) + 1
    }));
    alert("SKU data updated.");
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    
    const newErrors = {};
    if (!formData.companyName?.trim()) newErrors.companyName = true;
    if (!formData.contactPerson?.trim()) newErrors.contactPerson = true;
    if (!formData.email?.trim()) newErrors.email = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);

    try {
      // Determine if we are updating an existing vendor or creating a new one
      const url = isEditMode 
        ? `http://localhost:8080/api/v1/vendors/${formData.id}` 
        : "http://localhost:8080/api/v1/vendors/register";
      
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => navigate('/supplier/manage'), 2000);
      } else {
        const errorData = await response.json();
        alert(`Server Error: ${errorData.message || "Could not save vendor"}`);
      }
    } catch (error) {
      alert("Connection error. Ensure your Spring Boot app is running on port 8080.");
    } finally {
      setIsSaving(false);
    }
  };

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
        value={formData[name] || ''}
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
      {showSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold tracking-wide">
                {isEditMode ? "Vendor Updated Successfully!" : "Vendor Registered Successfully!"}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                {isEditMode ? "Edit Vendor Details" : "New Vendor Registration"}
            </h1>
            <p className="text-sm text-slate-400 font-medium">
                {isEditMode ? `Updating information for ${formData.companyName}` : "Onboard a new supplier to the system"}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ActionButton label="Cancel" onClick={() => navigate(-1)} variant="secondary" />
          <ActionButton 
            label={isSaving ? "Saving..." : isEditMode ? "Update Vendor" : "Save Vendor"} 
            icon={isSaving ? Loader2 : Save} 
            variant="primary" 
            onClick={handleSave}
            disabled={isSaving}
          />
        </div>
      </div>

      <form className={`space-y-6 pb-20 transition-all ${isSaving ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
        
        {/* Company Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Company Details</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Company Name", "companyName", "e.g. Global Tech Solutions", "text", true)}
            {RenderInput("Tax ID", "taxId", "e.g. 100-XXX-XXX", "text", true)}
            {RenderInput("Business Address", "address",  "Street, City, Country")}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Phone className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contact Information</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            {RenderInput("Contact Person Name", "contactPerson", "Full Name", "text", true)}
            {RenderInput("Email Address", "email", "vendor@example.com", "email", true)}
            {RenderInput("Phone Number", "phone", "+94 XX XXX XXXX")}
          </div>
        </div>

        {/* Contract Terms */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Contract Terms</h3>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {RenderInput("Payment Terms", "paymentTerms","e.g. Net 30")}
            {RenderInput("Start Date", "startDate", "", "date")}
            {RenderInput("End Date", "endDate", "", "date")}
          </div>
        </div>

        {/* SKU Pricing Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">SKU Pricing Details</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {RenderInput("Select SKU", "sku", "e.g. SKU001 - Sony TV", "text")}
                {RenderInput("Unit Price (USD)", "unitPrice", "0.00", "number")}
            </div>
            <div className="flex justify-end">
                <ActionButton 
                    label={isEditMode ? "Update SKU Info" : "Add SKU"} 
                    icon={Plus} 
                    variant="secondary" 
                    onClick={handleAddSKU}
                />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterVendor;