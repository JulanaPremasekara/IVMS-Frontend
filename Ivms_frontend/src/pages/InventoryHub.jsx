import React from 'react';
import { Edit, Plus, Archive, Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const InventoryHub = () => {
  const navigate = useNavigate(); 
  const products = [
    { sku: "SKU-1001", name: "Samsung French Door Refrigerator", category: "Refrigerators", stock: "45 units", price: "$1299.99", status: "In Stock" },
    { sku: "SKU-1002", name: "LG Front Load Washing Machine", category: "Washing Machines", stock: "8 units", price: "$899.99", status: "Low Stock" },
    { sku: "SKU-1003", name: "Daikin Split AC 1.5 Ton", category: "Air Conditioners", stock: "32 units", price: "$749.99", status: "In Stock" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Inventory Hub</h1>
        <div className="flex space-x-3">

          <button onClick={() => navigate("/inventory/modify")}className="flex items-center px-4 py-2 bg-[#5fb368] text-white rounded-lg font-semibold"
>          <Edit size={16} className="mr-2"/> Modify Stock</button>
          <button onClick={() => navigate('/inventory/register')} // This is the fix
            className="flex items-center px-4 py-2 bg-[#4c6ef5] text-white rounded-lg font-semibold hover:opacity-90 transition-all"
>          <Plus size={16} className="mr-2"/> Register New SKU
        </button>
        <button onClick={() => navigate('/inventory/archive')} 
        className="flex items-center px-4 py-2 bg-[#d9822b] text-white rounded-lg font-semibold"
      >
        <Archive size={16} className="mr-2"/> Archive Product
      </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">All Products</h2>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search SKU or product..." className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none" />
          </div>
        </div>

        <table className="w-full text-left">
          <thead className="text-gray-900 font-bold border-b border-gray-50">
            <tr>
              <th className="py-4 px-2">SKU Code</th>
              <th className="py-4 px-2">Product Name</th>
              <th className="py-4 px-2">Category</th>
              <th className="py-4 px-2">Stock</th>
              <th className="py-4 px-2">Price</th>
              <th className="py-4 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-4 px-2">{p.sku}</td>
                <td className="py-4 px-2 font-medium">{p.name}</td>
                <td className="py-4 px-2 text-gray-600">{p.category}</td>
                <td className="py-4 px-2">{p.stock}</td>
                <td className="py-4 px-2 font-medium">{p.price}</td>
                <td className="py-4 px-2">
                  <span className={`px-4 py-1 rounded-lg text-xs font-bold text-white ${p.status === 'In Stock' ? 'bg-[#0f172a]' : 'bg-[#c94b4b]'}`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryHub;