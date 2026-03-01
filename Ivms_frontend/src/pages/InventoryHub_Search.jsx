import React from 'react';
import { Search, Mic, ChevronDown, ChevronRight } from 'lucide-react';
import BackButton from "../components/ui/BackButton";

const InventoryHub_Search = () => {
  return (
    <div className="p-10 bg-white min-h-screen">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
        <span>Dashboard</span>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-800">Search Inventory</span>
      </nav>
      <BackButton />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Inventory</h1>
      <p className="text-gray-500 text-lg mb-10 font-medium">Real-Time Stock Availability</p>

      {/* Search Panel Card */}
      <div className="border border-gray-100 rounded-3xl p-10 shadow-sm mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Search Panel</h2>
        
        <div className="space-y-8">
          {/* Main Search Input */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-3">Product Search</label>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Enter Product Name or SKU ID" 
                  className="w-full pl-12 pr-12 py-4 bg-[#f3f4f6] rounded-xl focus:outline-none placeholder-gray-400"
                />
                <Mic className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" size={20} />
              </div>
              <button className="bg-[#4b70f5] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md">
                Search
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Category</label>
              <div className="relative">
                <select className="w-full p-4 bg-[#f3f4f6] rounded-xl text-gray-800 focus:outline-none appearance-none font-medium">
                  <option>All Categories</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Warehouse Location</label>
              <div className="relative">
                <select className="w-full p-4 bg-[#f3f4f6] rounded-xl text-gray-800 focus:outline-none appearance-none font-medium">
                  <option>All Locations</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">Include Reserved Stock</label>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-6 bg-black rounded-full p-1 relative cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm absolute left-1"></div>
                </div>
                <span className="text-gray-500 font-medium text-sm">Showing Reserved Stock</span>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed">
                Reserved stock includes items sold but not yet shipped.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
          <Search className="text-blue-500" size={48} strokeWidth={1.5} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Ready to Search</h2>
      </div>
    </div>
  );
};

export default InventoryHub_Search;