import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Upload, ChevronRight, ArrowLeft } from 'lucide-react';
import BackButton from "../components/ui/BackButton";

// --- Reusable UI Components ---
const FormSection = ({ title, children }) => (
  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm mb-6">
    <h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const InputField = ({ label, placeholder, name, value, onChange, type = "text", required = false }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400"
      required={required}
    />
  </div>
);

const InventoryHub_Register = () => {
  // --- States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    length: '',
    width: '',
    height: '',
    powerUsage: '',
    weight: '',
    description: '',
    unitPrice: '',
    initialStock: '',
    warehouseLocation: '',
    reorderThreshold: ''
  });

  // --- 1. Load Categories from DB on page load ---
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8083/api/v1/categories');
      // Always good to log the response to see what the backend is actually sending
      console.log("Categories from DB:", response.data); 
      
      // Ensure we are mapping correctly based on your Category.java 'name' field
      setCategories(response.data.map(cat => cat.name));
    } catch (err) {
      console.error("Connection failed. Is the backend running?", err);
    }
  };

  // --- 2. Handle Add Category (Saves to DB) ---
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      try {
        const response = await axios.post('http://localhost:8083/api/v1/categories', {
          name: newCategory
        });
        setCategories([...categories, response.data.name]);
        setFormData({ ...formData, category: response.data.name }); // Auto-select new
        setNewCategory('');
        setIsModalOpen(false);
      } catch (err) {
        alert("Category already exists or server error.");
      }
    }
  };

  const handleRegisterProduct = async (e) => {
  e.preventDefault();
  
  // Create a copy of the data and convert empty strings to null for numeric fields
  const submissionData = { ...formData };
  
  const numericFields = ['length', 'width', 'height', 'powerUsage', 'weight', 'unitPrice', 'initialStock', 'reorderThreshold'];
  
  numericFields.forEach(field => {
    if (submissionData[field] === '') {
      submissionData[field] = null;
    } else {
      // Ensure values sent are actually numbers
      submissionData[field] = Number(submissionData[field]);
    }
  });

  try {
    const response = await axios.post('http://localhost:8083/api/v1/products', submissionData);
    alert(`Success! Product registered with SKU: ${response.data.skuCode}`);
    // Optional: setFormData(initialState) here to reset
  } catch (err) {
    console.error(err);
    alert("Error registering product. Check console for details.");
  }
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
  {/* Back Button */}
  <button 
    type="button"
    onClick={() => window.history.back()} 
    className="flex items-center hover:text-blue-600 transition-colors mr-4 group text-gray-600"
  >
    <ArrowLeft size={18} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
    <span className="font-semibold">Back</span>
  </button>

  {/* Vertical Divider Line */}
  <div className="h-4 w-[1px] bg-gray-300 mx-3"></div> 

  {/* Breadcrumbs */}
  <span className="hover:text-gray-700 cursor-pointer">Inventory Hub</span>
  <ChevronRight size={14} className="mx-2" />
  <span className="text-gray-900 font-bold">Add New Item</span>
</nav>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Register New SKU</h1>
      </div>

      <form onSubmit={handleRegisterProduct}>
        <FormSection title="Product Identification">
          <InputField label="SKU Code" placeholder="Auto-generated" name="skuCode" value="Auto-generated" onChange={() => {}} required />
          <InputField 
            label="Product Name" 
            placeholder="e.g., Samsung Fridge" 
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required 
          />
          
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
              > + </button>
            </div>
          </div>
        </FormSection>

        <FormSection title="Technical Specifications">
  <InputField 
    label="Length (cm)" 
    name="length" 
    value={formData.length} 
    onChange={handleInputChange} 
    placeholder="Optional" 
    type="number" 
  />
  <InputField 
    label="Width (cm)" 
    name="width" 
    value={formData.width} 
    onChange={handleInputChange} 
    placeholder="Optional" 
    type="number" 
  />
  <InputField 
    label="Height (cm)" 
    name="height" 
    value={formData.height} 
    onChange={handleInputChange} 
    placeholder="Optional" 
    type="number" 
  />
  <InputField 
    label="Power Usage (Watts)" 
    name="powerUsage" 
    value={formData.powerUsage} 
    onChange={handleInputChange} 
    placeholder="Optional" 
    type="number" 
  />
  <InputField 
    label="Weight (kg)" 
    name="weight" 
    value={formData.weight} 
    onChange={handleInputChange} 
    placeholder="Optional" 
    type="number" 
  />
  <div className="md:col-span-2 lg:col-span-3">
    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
    <textarea 
      name="description"
      value={formData.description}
      onChange={handleInputChange}
      placeholder="Enter product description (Optional)..." 
      rows="3" 
      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
    />
  </div>
</FormSection>

        <FormSection title="Pricing & Stock">
          <InputField label="Unit Price ($)" name="unitPrice" value={formData.unitPrice} onChange={handleInputChange} placeholder="0.00" required type="number" />
          <InputField label="Initial Stock Level" name="initialStock" value={formData.initialStock} onChange={handleInputChange} placeholder="0" required type="number" />
          <InputField label="Warehouse Location" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleInputChange} placeholder="e.g., A-12-03" required />
          <InputField label="Reorder Threshold" name="reorderThreshold" value={formData.reorderThreshold} onChange={handleInputChange} placeholder="Optional" type="number" />
        </FormSection>

        <div className="flex items-center space-x-6 mt-4">
          <button type="submit" className="bg-[#0b0e14] text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">
            Register Product
          </button>
          <button type="button" onClick={() => setFormData({})} className="px-6 py-3 border border-gray-200 bg-white rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Reset Form
          </button>
        </div>
      </form>

      {/* --- ADD CATEGORY MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Category</h3>
            <input 
              type="text"
              autoFocus
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g., Kitchenware"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600">Cancel</button>
              <button onClick={handleAddCategory} className="flex-1 px-4 py-2 bg-[#0b0e14] text-white rounded-lg font-bold">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryHub_Register;