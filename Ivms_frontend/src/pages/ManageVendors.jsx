import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, Edit, Ban, CheckCircle2, AlertCircle, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ManageVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/v1/vendors");
      const data = await response.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Error:", error);
      setVendors([]); 
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

  const handleBlacklist = async (id) => {
    if (!window.confirm("Are you sure you want to blacklist this vendor? They will be moved to the Blacklisted section.")) return;
    
    try {
      const res = await fetch(`http://localhost:8080/api/v1/vendors/${id}/blacklist`, { method: 'PATCH' });
      if (res.ok) {
        fetchVendors();
      } else {
        alert("Failed to blacklist vendor.");
      }
    } catch (err) {
      alert("Connection error.");
    }
  };

  const handleEdit = (id) => {
    // Navigates to the registration form with the vendor ID as a URL parameter
    navigate(`/supplier/register?edit=${id}`);
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

  const blacklisted = safeVendors.filter(v => 
    v.status === 'BLACKLISTED' && 
    v.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/supplier')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600"/>
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Vendors</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border shadow-sm flex gap-4">
        <Search className="w-5 h-5 text-slate-400 self-center" />
        <input 
          placeholder="Search by company name..." 
          className="w-full text-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs animate-pulse">Fetching vendor directory...</div>
      ) : (
        <div className="space-y-10">
          
          {/* PENDING SECTION */}
          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest">
                <Clock className="w-4 h-4"/> Pending Approvals ({pending.length})
              </div>
              <div className="bg-white rounded-xl border-2 border-orange-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {pending.map(v => (
                      <tr key={v.id} className="bg-orange-50/10">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{v.companyName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{v.contactPerson}</td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleApprove(v.id)} 
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
                          >
                            Approve Vendor
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest">
              <CheckCircle2 className="w-4 h-4"/> Active Directory
            </div>
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-black">
                  <tr>
                    <th className="px-6 py-4">Vendor ID</th>
                    <th className="px-6 py-4">Company Name</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {active.length > 0 ? active.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs text-blue-600 font-bold">VEN-{v.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{v.companyName}</td>
                      <td className="px-6 py-4">
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[9px] font-bold border border-emerald-100">
                          ACTIVE
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(v.id)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                            title="Edit Vendor"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleBlacklist(v.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Blacklist Vendor"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-400 italic">No active vendors found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLACKLISTED SECTION */}
          {blacklisted.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest">
                <ShieldAlert className="w-4 h-4"/> Blacklisted Vendors
              </div>
              <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm opacity-80">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {blacklisted.map(v => (
                      <tr key={v.id} className="bg-red-50/5">
                        <td className="px-6 py-4 text-xs font-bold text-slate-500 line-through decoration-slate-300">{v.companyName}</td>
                        <td className="px-6 py-4">
                           <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[9px] font-bold border border-red-200 uppercase">
                            Blacklisted
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => handleEdit(v.id)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageVendors;