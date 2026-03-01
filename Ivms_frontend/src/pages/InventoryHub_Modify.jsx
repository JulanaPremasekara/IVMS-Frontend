import React from 'react';
import { ChevronRight, Search } from 'lucide-react';
import BackButton from "../components/ui/BackButton";

const InventoryHub_Modify = () => {
  return (
    <div className="p-10 bg-white min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
        <span>Inventory Hub</span>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-800">Edit SKU</span>
      </nav>
      <BackButton />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Modify Stock & Safety Thresholds</h1>
      <p className="text-gray-500 text-lg mb-10 font-medium">Adjust stock counts and safety thresholds for inventory management</p>

      <div className="border border-gray-100 rounded-2xl p-10 shadow-sm max-w-[100%]">
        <h2 className="text-lg font-bold text-gray-900 mb-8">SKU Selection</h2>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3 uppercase tracking-tight">Search Product</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Enter SKU ID or Product Name" 
              className="w-full pl-12 pr-4 py-4 bg-[#f3f4f6] rounded-xl focus:outline-none placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHub_Modify;