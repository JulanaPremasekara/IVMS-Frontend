import React from 'react';
import { Search, ChevronRight } from 'lucide-react';

const InventoryHub_Archive = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <span>Inventory Hub</span> <ChevronRight size={14} className="mx-2" /> 
        <span>Manage Products</span> <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-800 font-medium">Archive</span>
      </nav>

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Archive / Discontinue Product</h1>
      <p className="text-gray-500 mb-8">Soft delete process for discontinued products</p>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Archive Management View</h2>
          <p className="text-gray-500 text-sm">Toggle to view and restore archived products</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-500 text-sm">Showing Active</span>
          <div className="w-12 h-6 bg-gray-200 rounded-full p-1 relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute right-1"></div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6">SKU Selection</h2>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Search Product</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Enter SKU ID or Product Name" className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none" />
        </div>
      </div>
    </div>
  );
};

export default InventoryHub_Archive;