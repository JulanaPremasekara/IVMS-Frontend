import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, Edit, Ban, CheckCircle2, ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- INTERNAL MODAL COMPONENT ---
const BlacklistModal = ({ isOpen, onClose, onConfirm, vendorName }) => {
  const [reason, setReason] = useState("");
  if (!isOpen) return null;

  const reasons = [
    "Quality Issues",
    "Fraud Detected",
    "Consistent Poor Performance",
    "Bankruptcy",
    "Contract Violation",
    "Other"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-3 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <h3 className="text-xl font-black text-slate-800 mb-2">Blacklist Vendor</h3>
          <p className="text-sm text-slate-500 mb-6">
            Blacklisting <span className="font-bold text-slate-700">{vendorName}</span> will prevent the system from selecting them for future orders.
          </p>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Reason for Removal</label>
            <select 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            >
              <option value="">Select a reason...</option>
              {reasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-slate-50 p-4 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
          <button 
            disabled={!reason}
            onClick={() => onConfirm(reason)}
            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-red-200"
          >
            Confirm Blacklist
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const ManageVendors = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorToBlacklist, setVendorToBlacklist] = useState(null);

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
      if (res.ok) fetchVendors();
    } catch (err) { alert("Check if backend is running."); }
  };

  // Open Modal Logic
  const handleBlacklistClick = (vendor) => {
    setVendorToBlacklist(vendor);
    setIsModalOpen(true);
  };

  // Confirm Logic (Sends Reason to Backend)
  const handleConfirmBlacklist = async (reason) => {
    try {
      const res = await fetch(`http://localhost:8080/api/v1/vendors/${vendorToBlacklist.id}/blacklist`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason })
      });
      
      if (res.ok) {
        setIsModalOpen(false);
        fetchVendors();
      } else if (res.status === 409) {
        alert("Blocked: This vendor has active/pending Purchase Orders.");
      } else {
        alert("Failed to blacklist vendor.");
      }
    } catch (err) { alert("Connection error."); }
  };

  const handleEdit = (id) => navigate(`/supplier/register?edit=${id}`);

  const safeVendors = Array.isArray(vendors) ? vendors : [];
  const query = searchQuery.toLowerCase();
  
  const pending = safeVendors.filter(v => v.status === 'PENDING' && v.companyName?.toLowerCase().includes(query));
  const active = safeVendors.filter(v => v.status === 'APPROVED' && v.companyName?.toLowerCase().includes(query));
  const blacklisted = safeVendors.filter(v => v.status === 'BLACKLISTED' && v.companyName?.toLowerCase().includes(query));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <BlacklistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmBlacklist}
        vendorName={vendorToBlacklist?.companyName}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/supplier')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600"/>
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Vendors</h1>
        </div>
      </div>

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
              <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest"><Clock className="w-4 h-4"/> Pending Approvals ({pending.length})</div>
              <div className="bg-white rounded-xl border-2 border-orange-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {pending.map(v => (
                      <tr key={v.id} className="bg-orange-50/10">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{v.companyName}</td>
                        <td className="px-6 py-4 text-xs text-slate-500">{v.contactPerson}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleApprove(v.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100">Approve Vendor</button>
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
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest"><CheckCircle2 className="w-4 h-4"/> Active Directory</div>
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
                      <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[9px] font-bold border border-emerald-100">ACTIVE</span></td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(v.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit Vendor"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleBlacklistClick(v)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Blacklist Vendor"><Ban className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="px-6 py-10 text-center text-xs text-slate-400 italic">No active vendors found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLACKLISTED SECTION */}
          {blacklisted.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-widest"><ShieldAlert className="w-4 h-4"/> Blacklisted Vendors</div>
              <div className="bg-white rounded-xl border border-red-100 overflow-hidden shadow-sm opacity-80">
                <table className="w-full text-left">
                  <tbody className="divide-y">
                    {blacklisted.map(v => (
                      <tr key={v.id} className="bg-red-50/5">
                        <td className="px-6 py-4 text-xs font-bold text-slate-500 line-through decoration-slate-300">{v.companyName}</td>
                        <td className="px-6 py-4">
                           <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-[9px] font-bold border border-red-200 uppercase">Blacklisted</span>
                           <span className="ml-2 text-[8px] text-slate-400">Reason: {v.blacklistReason || 'N/A'}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleEdit(v.id)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
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