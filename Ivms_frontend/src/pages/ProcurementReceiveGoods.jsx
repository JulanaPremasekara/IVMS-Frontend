import React, { useEffect, useState } from 'react';
import { Package, Search as SearchIcon, Clock,ArrowLeft } from 'lucide-react';
import { POIncomingCard } from '../components/ui/POIncomingCard';
import { SearchInputGroup } from '../components/ui/SearchInputGroup';
import ReceiveGoodsVerification from './ReceiveGoodsVerification';
import axios from 'axios';

const ProcurementReceiveGoods = () => {
  const [selectedPO, setSelectedPO] = useState(null);

  const [incomingPOs, setIncomingPOs] = useState([]);
  const [poDataLoading, setPoDataLoading] = useState(false);

  useEffect(() => {
        const loadincomingPoData = async () => {
          setPoDataLoading(true);
          try {
            // Expected data shape example:
            // [{ id, name, sku, stock, safety, ai, price }, ...]
            const res = await axios.get("http://localhost:8081/api/v1/shipments/incoming");
            setIncomingPOs(Array.isArray(res.data) ? res.data : []);
          } catch (e) {
            console.error("Failed to load incoming purchase orders", e);
            setIncomingPOs([]);
          } finally {
            setPoDataLoading(false);
          }
        };
    
        loadincomingPoData();
      }, []);

  // If a PO is selected, show the full Verification Screen (update1.jpeg)
  if (selectedPO) {
    return (
      <div className="space-y-4">
        {/* Back Button to return to list */}
        <button 
          onClick={() => setSelectedPO(null)}
          className="flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-blue-600 uppercase tracking-widest px-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search
        </button>
        
        {/* Pass the selected PO data to the verification form */}
        <ReceiveGoodsVerification po={selectedPO} items={selectedPO.items || []} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
     

      {/* 2. Search Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <div className="bg-blue-600 p-1.5 rounded-md text-white">
            <SearchIcon className="w-4 h-4" />
          </div>
          Search Purchase Order
        </div>
        
        <SearchInputGroup placeholder="Enter PO Number (e.g., PO-2026-1001)" />
      </div>

      {/* 3. Recent Incoming POs */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
          <Clock className="w-3.5 h-3.5" /> Recent Incoming POs
        </div>
        
        <div className="space-y-3">
          {incomingPOs.map((po) => (
            <div 
              key={po.id} 
              onClick={() => setSelectedPO(po)}
              className="cursor-pointer active:scale-[0.99] transition-transform"
            >
              <POIncomingCard {...po} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcurementReceiveGoods;