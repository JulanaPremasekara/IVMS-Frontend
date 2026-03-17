import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Clock, Edit, Ban, CheckCircle2, History, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- INTERNAL MODAL COMPONENT ---
const BlacklistModal = ({ isOpen, onClose, onConfirm, vendorName }) => {
  const [reason, setReason] = useState("");
  if (!isOpen) return null;

  const reasons = ["Quality Issues", "Fraud Detected", "Consistent Poor Performance", "Bankruptcy", "Contract Violation", "Other"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-red-100 animate-in fade-in zoom-in duration-200">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-red-50 p-3 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-lg transition-colors"><X className="w-5 h-5 text-slate-400" /></button>
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">Blacklist Vendor</h3>
          <p className="text-sm text-slate-500 mb-6 font-medium">Termination for: <span className="text-red-600 font-bold">{vendorName}</span></p>
          <select 
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          >
            <option value="">Select a reason...</option>
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="bg-slate-50 p-4 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
          <button 
            disabled={!reason} 
            onClick={() => onConfirm(reason)} 
            className="flex-1 px-4 py-3 text-sm font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-red-200"
          >
            Confirm Removal
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [vendorToBlacklist, setVendorToBlacklist] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/v1/vendors");
      const data = await res.json();
      setVendors(Array.isArray(data) ? data : []);
    } catch (err) { setVendors([]); } finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleApprove = async (id) => {
    const res = await fetch(`http://localhost:8080/api/v1/vendors/${id}/approve`, { method: 'PATCH' });
    if (res.ok) fetchVendors();
  };

  const handleConfirmBlacklist = async (reason) => {
    const res = await fetch(`http://localhost:8080/api/v1/vendors/${vendorToBlacklist.id}/blacklist`, { 
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchVendors();
    }
  };

  const query = searchQuery.toLowerCase();
  const pending = vendors.filter(v => v.status === 'PENDING' && v.companyName?.toLowerCase().includes(query));
  const active = vendors.filter(v => v.status === 'APPROVED' && v.companyName?.toLowerCase().includes(query));

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <BlacklistModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmBlacklist} vendorName={vendorToBlacklist?.companyName} />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/supplier')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600"/>
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manage Vendors</h1>
        </div>
        <button 
            onClick={() => navigate('/supplier/blacklisted')} 
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all shadow-lg shadow-slate-200"
        >
            <History className="w-4 h-4" /> Blacklisted Vendors
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-slate-400" />
        </div>
        <input 
          placeholder="Filter active or pending vendors..." 
          className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 text-[10px] font-black tracking-widest animate-pulse">Synchronizing database...</div>
      ) : (
        <div className="space-y-10">
          {pending.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-orange-600 font-bold text-[10px] uppercase tracking-[0.2em] px-1"><Clock className="w-4 h-4"/> Pending Approval</div>
              <div className="bg-white rounded-xl border border-orange-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-orange-50">
                    {pending.map(v => (
                      <tr key={v.id} className="bg-orange-50/10">
                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{v.companyName}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleApprove(v.id)} className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">Approve</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-[10px] uppercase tracking-[0.2em] px-1"><CheckCircle2 className="w-4 h-4"/> Active Directory</div>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] text-slate-400 uppercase font-black">
                  <tr><th className="px-6 py-4 w-32">ID</th><th className="px-6 py-4">Company</th><th className="px-6 py-4 text-right">Actions</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {active.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 text-xs font-bold text-indigo-600">VEN-{v.id}</td>
                      <td className="px-6 py-4 text-xs font-bold text-slate-700">{v.companyName}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate(`/supplier/register?edit=${v.id}`)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => { setVendorToBlacklist(v); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-all"><Ban className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVendors;