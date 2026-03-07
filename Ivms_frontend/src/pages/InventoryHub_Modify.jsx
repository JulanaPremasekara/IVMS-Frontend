import React, { useState, useEffect } from 'react';
import { ChevronRight, Search, Save, Package } from 'lucide-react';
import axios from 'axios';
import BackButton from "../components/ui/BackButton";

const InventoryHub_Modify = () => {
    const [query, setQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState("");

    const handleSearch = async () => {
    if (query.length < 2) return; // Don't search for single letters
    try {
        // This endpoint now checks both Name and SKU in the backend
        const res = await axios.get(`http://localhost:8083/api/v1/products/inventory/search?query=${query}`);
        
        if (res.data.length > 0) {
            setResults(res.data); // Show a list of matches
            setSelectedProduct(null); // Clear previous selection
        } else {
            alert("No matches found for that Name or SKU.");
        }
    } catch (err) {
        console.error("Search failed", err);
    }
};

const handleUpdate = async () => {
    try {
        // TRIGGER THE QUEUE: This PUT request calls the service that notifies RabbitMQ
        await axios.put(`http://localhost:8083/api/v1/products/stock/update/${selectedProduct.id}?quantity=${newQuantity}`);
        
        alert("Stock Update Processed! RabbitMQ has notified the Procurement listener.");
        
        // Clear everything after success
        setResults([]);
        setSelectedProduct(null);
        setQuery("");
    } catch (err) {
        alert("Update Error: " + err.message);
    }
};

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

            <div className="border border-gray-100 rounded-2xl p-10 shadow-sm max-w-[100%] bg-gray-50">
                <h2 className="text-lg font-bold text-gray-900 mb-8">SKU Selection</h2>
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter SKU ID or Product Name" 
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button onClick={handleSearch} className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700">Search</button>
                </div>

                {/* Edit Form (Appears after search) */}
                {selectedProduct && (
                    <div className="bg-white p-8 rounded-2xl border border-blue-100 shadow-md animate-in fade-in slide-in-from-top-4">
                        <div className="flex items-center mb-6 text-blue-600">
                            <Package size={24} className="mr-2" />
                            <h3 className="text-xl font-bold">Modifying: {selectedProduct.name} ({selectedProduct.skuCode})</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Current Stock Level</label>
                                <input 
                                    type="number" 
                                    value={newQuantity}
                                    onChange={(e) => setNewQuantity(e.target.value)}
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="mt-2 text-sm text-gray-500">Threshold: {selectedProduct.reorderThreshold} units</p>
                            </div>
                            
                            <div className="flex items-end">
                                <button 
                                    onClick={handleUpdate}
                                    className="w-full flex items-center justify-center bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg"
                                >
                                    <Save size={20} className="mr-2" /> Update & Notify Queue
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryHub_Modify;