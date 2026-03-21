import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, RotateCcw, Loader2 } from 'lucide-react';
import BackButton from "../components/ui/BackButton";

const InventoryHub_Archive = () => {
    const [archivedProducts, setArchivedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    // 1. Fetch only ARCHIVED products
    useEffect(() => {
        const fetchArchived = async () => {
            try {
                // You'll need an endpoint that calls productRepository.findAllByIsActiveFalse()
                const res = await axios.get('http://localhost:8083/api/v1/products/archive');
                setArchivedProducts(res.data);
            } catch (err) {
                console.error("Fetch failed", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArchived();
    }, []);

    // 2. Restore Action
    const handleRestore = async (id, name) => {
        if (window.confirm(`Restore ${name} to active inventory?`)) {
            try {
                await axios.patch(`http://localhost:8083/api/v1/archive/restore/${id}`);
                alert("Product restored!");
                // Remove from this list immediately
                setArchivedProducts(prev => prev.filter(p => p.id !== id));
            } catch (err) {
                alert("Restore failed: " + (err.response?.data || "Server error"));
            }
        }
    };

    const filtered = archivedProducts.filter(p => 
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.skuCode?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <BackButton />
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Archive Management</h1>

            <div className="bg-white rounded-2xl shadow-sm p-8">
                <div className="relative mb-6 w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search archived SKUs..." 
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-100 text-gray-900 font-bold">
                            <tr>
                                <th className="py-4 px-2">SKU Code</th>
                                <th className="py-4 px-2">Product Name</th>
                                <th className="py-4 px-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                                    <td className="py-4 px-2 font-mono text-blue-600 font-bold">{p.skuCode}</td>
                                    <td className="py-4 px-2 text-gray-800">{p.name}</td>
                                    <td className="py-4 px-2 text-center">
                                        <button 
                                            onClick={() => handleRestore(p.id, p.name)}
                                            className="flex items-center mx-auto px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                        >
                                            <RotateCcw size={16} className="mr-2" /> Undo Archive
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InventoryHub_Archive;