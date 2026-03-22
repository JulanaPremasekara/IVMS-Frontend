import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Plus, Archive, Search, Loader2 } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton";

const InventoryHub = () => {
  const navigate = useNavigate(); 
  
  // --- 1. Create state for real products ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // --- 2. Fetch data from Spring Boot ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8083/api/v1/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

 // Inside InventoryHub.jsx - Update the filter logic
// Inside InventoryHub.jsx
const filteredProducts = products.filter(p => {
    const matchesSearch = 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.skuCode?.toLowerCase().includes(searchTerm.toLowerCase());

    // Fix: In your Product.java, the field is 'isActive'. 
    // JSON usually serializes this as 'active' or 'isActive'. 
    // Let's check for both to be safe:
    const isActuallyActive = p.isActive !== false && p.active !== false;

    return matchesSearch && isActuallyActive;
});

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <span className="ml-3 text-gray-600 font-medium">Syncing Inventory...</span>
    </div>
  );
  // --- 4. Archiving Logic ---
const handleArchiveRequest = async (product) => {
    const confirmed = window.confirm(`Archive ${product.name}? This will remove it from AI forecasts.`);
    
    if (confirmed) {
        try {
            // 1. Correct PATCH call to port 8083
            await axios.patch(`http://localhost:8083/api/v1/archive/${product.id}`);
            
            alert("Product archived successfully.");
            
            // 2. Remove the archived product from the UI list immediately
            setProducts(prevProducts => prevProducts.filter(p => p.id !== product.id));
            
        } catch (err) {
            const message = err.response?.data || "Archive failed. Ensure backend is running on 8083.";
            alert("Action Blocked: " + message);
        }
    }
};
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <BackButton />
        <h1 className="text-4xl font-bold text-gray-900">Inventory Hub</h1>
        <div className="flex space-x-3">
          <button onClick={() => navigate("/inventory/modify")} className="flex items-center px-4 py-2 bg-[#5fb368] text-white rounded-lg font-semibold hover:bg-green-700 transition-all">
            <Edit size={16} className="mr-2"/> Modify Stock
          </button>
          
          <button onClick={() => navigate('/inventory/register')} 
            className="flex items-center px-4 py-2 bg-[#4c6ef5] text-white rounded-lg font-semibold hover:opacity-90 transition-all shadow-md"
          >
            <Plus size={16} className="mr-2"/> Register New SKU
          </button>

          <button onClick={() => navigate('/inventory/archive')} className="flex items-center px-4 py-2 bg-[#d9822b] text-white rounded-lg font-semibold hover:bg-orange-700 transition-all">
            <Archive size={16} className="mr-2"/> Archive Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Products ({filteredProducts.length})</h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search SKU or product..." 
              value={searchTerm || ""}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" 
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-900 font-bold border-b border-gray-100">
              <tr>
                <th className="py-4 px-2">SKU Code</th>
                <th className="py-4 px-2">Product Name</th>
                <th className="py-4 px-2">Category</th>
                <th className="py-4 px-2">Stock</th>
                <th className="py-4 px-2">Price</th>
                <th className="py-4 px-2">Status</th>
                <th className="py-4 px-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
  {filteredProducts.map((p) => (
    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-2 font-mono text-sm text-blue-600 font-bold">{p.skuCode}</td>
      <td className="py-4 px-2 font-medium text-gray-800">{p.name}</td>
      <td className="py-4 px-2 text-gray-500">{p.category?.name}</td>
      <td className="py-4 px-2 font-semibold">{p.initialStock} units</td>
      <td className="py-4 px-2 font-medium">${p.unitPrice?.toFixed(2)}</td>
      <td className="py-4 px-2">
        <span className={`px-4 py-1 rounded-lg text-xs font-bold text-white shadow-sm ${
          p.initialStock > (p.reorderThreshold || 5) ? 'bg-slate-900' : 'bg-red-500'
        }`}>
          {p.initialStock > (p.reorderThreshold || 5) ? 'In Stock' : 'Low Stock'}
        </span>
      </td>
      {/* --- ADD THE ACTIONS CELL HERE --- */}
      {/* Inside your table's tbody map function */}
<td className="py-4 px-2 text-center">
  <div className="flex justify-center space-x-2">
    {/* Archive Button */}
    <button 
      onClick={() => handleArchiveRequest(p)} 
      className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all"
      title="Archive Product"
    >
      <Archive size={18} />
    </button>
  </div>
</td>
    </tr>
  ))}
</tbody>
          </table>
        </div>
        
        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-400">
            No products found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHub;