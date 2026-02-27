import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/vendors");
      const data = await response.json();
      // Safeguard: Ensure data is an array
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setVendors([]); // Set to empty array on error to prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/vendors/${id}/approve`, { method: 'PATCH' });
      if (res.ok) {
        fetchVendors();
      } else {
        alert("Server returned an error during approval.");
      }
    } catch (err) {
      alert("Check if backend is running.");
    }
  };

  // Safe filtering logic
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  
  const pending = safeVendors.filter(v => 
    v.status === 'PENDING' && 
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const active = safeVendors.filter(v => 
    v.status === 'APPROVED' && 
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/supplier')} className="p-2 hover:bg-slate-100 rounded-full">
          <ArrowLeft className="w-5 h-5"/>
        </button>
        <h1 className="text-xl font-bold">Manage Vendors</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-4 rounded-xl border flex gap-4">
        <Search className="w-4 h-4 text-slate-400 self-center" />
        <input 
          placeholder="Search by company name..." 
          className="w-full text-xs outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs animate-pulse">Fetching vendor directory...</div>
      ) : (
        <>
          {/* PENDING SECTION */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase">
                <Clock className="w-4 h-4"/> Pending Approvals ({pending.length})
              </div>
              <div className="bg-white rounded-xl border-2 border-orange-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {pending.map(v => (
                      <tr key={v.id} className="bg-orange-50/10">
                        <td className="px-6 py-4 text-xs font-bold">{v.companyName}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleApprove(v.id)} 
                            className="bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ACTIVE DIRECTORY */}
          <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
            <div className="px-6 py-4 bg-slate-50 border-b font-bold text-xs text-slate-400 uppercase">
              Active Directory
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Company</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {active.length > 0 ? active.map(v => (
                  <tr key={v.id}>
                    <td className="px-6 py-4 text-xs text-blue-600 font-bold">VEN-{v.id}</td>
                    <td className="px-6 py-4 text-xs font-bold">{v.companyName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[9px] font-bold border border-emerald-100">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-10 text-center text-xs text-slate-400">No active vendors found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageVendors;