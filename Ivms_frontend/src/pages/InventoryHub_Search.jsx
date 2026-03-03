import React, { useState } from 'react'; // Added useState
import axios from 'axios'; // Added axios
import { Search, Mic, ChevronDown, ChevronRight, Warehouse, PackageCheck, Clock } from 'lucide-react';
import BackButton from "../components/ui/BackButton";

const InventoryHub_Search = () => {
  // --- 1. State for logic ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // --- 2. Search Function ---
  const handleSearch = async () => {
  console.log("Search button clicked! Query:", query); // Check 1
  if (!query) {
    alert("Please enter a SKU or Name");
    return;
  }

  try {
    const response = await axios.get(`http://localhost:8080/api/v1/inventory/search`, {
      params: { query: query }
    });
    
    console.log("Backend Response:", response.data); // Check 2
    setResults(response.data);
    setHasSearched(true);
  } catch (err) {
    console.error("Connection Failed:", err);
    alert("Cannot connect to Backend. Is Spring Boot running?");
  }
};
  return (
    <div className="p-10 bg-white min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-6 font-medium">
        <span>Dashboard</span>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-800">Search Inventory</span>
      </nav>
      <BackButton />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Search Inventory</h1>
      <p className="text-gray-500 text-lg mb-10 font-medium">Real-Time Stock Availability</p>

      {/* Search Panel */}
      {/* Replace your current search div with this */}
<form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-4">
  <div className="relative flex-1">
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
    <input 
      type="text" 
      value={query}
      onChange={(e) => setQuery(e.target.value)} 
      placeholder="Enter Product Name or SKU ID" 
      className="w-full pl-12 pr-12 py-4 bg-[#f3f4f6] rounded-xl focus:outline-none"
    />
  </div>
  <button 
    type="submit" 
    className="bg-[#4b70f5] text-white px-10 py-4 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md"
  >
    Search
  </button>
</form>

      {/* --- 3. Dynamic Results Section --- */}
      <div className="space-y-6">
        {results.length > 0 ? (
          results.map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center animate-in fade-in slide-in-from-bottom-4">
              <div className="mt-4 pt-4 border-t border-gray-50">
  <p className="text-xs font-bold text-gray-400 uppercase mb-2">Location Breakdown</p>
  <div className="flex flex-wrap gap-2">
    {item.warehouseBreakdown && Object.entries(item.warehouseBreakdown).map(([loc, qty]) => (
      <div key={loc} className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
        <Warehouse size={14} className="mr-1.5" />
        {loc}: <span className="ml-1 font-bold">{qty}</span>
      </div>
    ))}
  </div>
</div>

              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Available to Promise</p>
                <div className="flex items-center justify-end gap-3">
                  <span className={`text-5xl font-black ${item.availableToPromise > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {item.availableToPromise}
                  </span>
                </div>
                {item.availableToPromise === 0 && item.nextExpectedShipment && (
                  <p className="text-amber-600 text-sm mt-2 font-bold flex items-center justify-end">
                    <Clock size={14} className="mr-1" />
                    Restock: {item.nextExpectedShipment}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : hasSearched ? (
          <div className="text-center py-20 text-gray-500">No products found.</div>
        ) : (
          /* Your original Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
              <Search className="text-blue-500" size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Ready to Search</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHub_Search;