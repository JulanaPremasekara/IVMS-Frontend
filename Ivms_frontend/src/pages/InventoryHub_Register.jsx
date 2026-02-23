import React from 'react';
import { Upload, ChevronRight } from 'lucide-react';

const FormSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, placeholder, type = "text", required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
    />
  </div>
);

const InventoryHub_Register = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <span>Inventory Hub</span>
        <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-800 font-medium">Add New Item</span>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Register New SKU</h1>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-700 bg-white hover:bg-gray-50">
          <Upload size={18} className="mr-2" /> Bulk Upload via CSV
        </button>
      </div>

      <form>
        <FormSection title="Product Identification">
          <InputField label="SKU Code" placeholder="Auto-generated" required />
          <InputField label="Product Name" placeholder="e.g., Samsung French Door Refrigerator" required />
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-400 appearance-none">
              <option>Select a category</option>
            </select>
          </div>
        </FormSection>

        <FormSection title="Technical Specifications">
          <InputField label="Length (cm)" placeholder="0.00" required />
          <InputField label="Width (cm)" placeholder="0.00" required />
          <InputField label="Height (cm)" placeholder="0.00" required />
          <InputField label="Power Usage (Watts)" placeholder="e.g., 150" required />
          <InputField label="Weight (kg)" placeholder="Optional" />
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea placeholder="Enter product description..." rows="3" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400" />
          </div>
        </FormSection>

        <FormSection title="Pricing & Stock">
          <InputField label="Unit Price ($)" placeholder="0.00" required />
          <InputField label="Initial Stock Level" placeholder="0" required />
          <InputField label="Warehouse Location" placeholder="e.g., A-12-03" required />
          <InputField label="Reorder Threshold" placeholder="Optional - Advanced" />
        </FormSection>

        <div className="flex items-center space-x-6 mt-4">
          <button className="bg-[#0b0e14] text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">Register Product</button>
          <button className="px-6 py-3 border border-gray-200 bg-white rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">Reset Form</button>
          <button className="text-gray-600 font-semibold hover:text-gray-900 transition-colors">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default InventoryHub_Register;