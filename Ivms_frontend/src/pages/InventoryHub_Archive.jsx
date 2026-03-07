import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import BackButton from "../components/ui/BackButton";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs'; // Make sure this matches exactly


const InventoryHub_Archive = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showActive, setShowActive] = useState(true);

  // 1. Search Logic: Calls the Backend as you type
  useEffect(() => {
    const searchProducts = async () => {
      if (query.length > 2) {
        try {
          const res = await axios.get(`http://localhost:8083/api/v1/archive/search?query=${query}&active=${showActive}`);
          setResults(res.data);
        } catch (err) {
          console.error("Search failed", err);
        }
      } else {
        setResults([]);
      }
    };
    searchProducts();
  }, [query, showActive]);

  // 2. WebSocket Logic: Place this HERE
  useEffect(() => {
    const socket = new SockJS('http://localhost:8083/ws-inventory');
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
      console.log('Connected to WebSocket: ' + frame);
      const subscription = stompClient.subscribe('/topic/updates', (sdkEvent) => {
        alert("Inventory Update: " + sdkEvent.body);
      });
    });

    // Cleanup: This closes the connection if you leave the page
    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect();
        console.log("Disconnected WebSocket");
      }
    };
  }, []); // The empty array [] ensures this ONLY runs once when the page loads

  // 2. Archive Logic: The "Confirm" Action
  const handleArchive = async (productId) => {
    const confirmed = window.confirm("This will remove the item from active AI forecasts. Confirm?");
    if (confirmed) {
      try {
        await axios.patch(`http://localhost:8083/api/v1/archive/${productId}`);
        alert("Product archived successfully.");
        setQuery(''); // Reset search
      } catch (err) {
        //FIX: Use optional chaining and a fallback message
        const errorMessage = err.response?.data || err.message || "Network Error: Is the server running?";
        alert("Action Blocked: " + errorMessage);
      }
    }
  };
  const socket = new SockJS('http://localhost:8083/ws-inventory');
const stompClient = Stomp.over(socket);

stompClient.connect({}, (frame) => {
    stompClient.subscribe('/topic/updates', (sdkEvent) => {
        alert("Inventory Update: " + sdkEvent.body);
    });
});

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        <span>Inventory Hub</span> <ChevronRight size={14} className="mx-2" /> 
        <span>Manage Products</span> <ChevronRight size={14} className="mx-2" />
        <span className="text-gray-800 font-medium">Archive</span>
      </nav>
      <BackButton />

      <h1 className="text-4xl font-bold text-gray-900 mb-2">Archive / Discontinue Product</h1>
      <p className="text-gray-500 mb-8">Soft delete process for discontinued products</p>

      {/* Toggle View */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Archive Management View</h2>
          <p className="text-gray-500 text-sm">Toggle to view and restore archived products</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-gray-500 text-sm">{showActive ? 'Showing Active' : 'Showing Archived'}</span>
          <div 
            onClick={() => setShowActive(!showActive)}
            className={`w-12 h-6 rounded-full p-1 relative cursor-pointer transition-colors ${showActive ? 'bg-blue-500' : 'bg-gray-400'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm absolute transition-all ${showActive ? 'right-1' : 'left-1'}`}></div>
          </div>
        </div>
      </div>

      {/* SKU Search Selection */}
      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-6">SKU Selection</h2>
        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-tight">Search Product</label>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter SKU ID or Product Name" 
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none" 
          />
        </div>

        {/* Results Dropdown */}
        {results.length > 0 && (
          <div className="border border-gray-100 rounded-lg overflow-hidden">
            {results.map((product) => (
              <div key={product.id} className="p-4 border-b border-gray-50 flex justify-between items-center hover:bg-gray-50">
                <div>
                  <p className="font-bold text-gray-800">{product.skuCode}</p>
                  <p className="text-sm text-gray-500">{product.name}</p>
                </div>
                <button 
                  onClick={() => handleArchive(product.id)}
                  className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-100"
                >
                  {showActive ? 'Discontinue' : 'Restore'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHub_Archive;