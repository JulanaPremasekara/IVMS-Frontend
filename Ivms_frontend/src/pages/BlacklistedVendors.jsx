import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, FileText, ShieldAlert, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlacklistedVendors = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchBlacklisted = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:8080/api/v1/vendors");
            const data = await res.json();
            // Filter only blacklisted vendors
            setVendors(Array.isArray(data) ? data.filter(v => v.status === 'BLACKLISTED') : []);
        } catch (err) {
            console.error("Audit fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlacklisted();
    }, []);

    // --- NEW RESTORE LOGIC ---
    const handleRestore = async (id) => {
        if (!window.confirm("Are you sure you want to restore this vendor to the Active Directory?")) return;

        try {
            // Using the approve endpoint to flip status back to ACTIVE/APPROVED
            const res = await fetch(`http://localhost:8080/api/v1/vendors/${id}/approve`, { 
                method: 'PATCH' 
            });
            
            if (res.ok) {
                // Refresh the list after successful restoration
                fetchBlacklisted();
            } else {
                alert("Failed to restore vendor.");
            }
        } catch (err) {
            alert("Connection error.");
        }
    };

    const filteredAudit = vendors.filter(v => 
        v.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => navigate('/supplier/manage')} 
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-red-600" /> Blacklisted Vendors
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Justifications for Partnership Termination</p>
                </div>
            </div>

            <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-slate-400" />
                </div>
                <input 
                    placeholder="Search by vendor name in history..." 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-12 pr-4 py-4 text-sm outline-none focus:ring-2 focus:ring-red-500/10 transition-all shadow-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-red-50/50 border-b border-red-50 text-[10px] font-black text-red-600 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4 w-1/3">Vendor Information</th>
                            <th className="px-6 py-4">Reason for Removal</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="3" className="p-20 text-center animate-pulse text-slate-400 text-[10px] font-bold tracking-widest">Accessing records...</td></tr>
                        ) : filteredAudit.length > 0 ? filteredAudit.map(v => (
                            <tr key={v.id} className="hover:bg-red-50/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-700 text-sm line-through decoration-slate-300">{v.companyName}</div>
                                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">ID: VEN-{v.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-2 text-slate-600 text-xs italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                        <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                                        {v.blacklistReason || "Standard performance review removal"}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-3">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-black text-[9px] border border-red-200 uppercase tracking-widest">
                                            REMOVED
                                        </span>
                                        {/* RESTORE BUTTON */}
                                        <button 
                                            onClick={() => handleRestore(v.id)}
                                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                            title="Restore to Active Directory"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="p-20 text-center text-slate-400 text-xs italic font-medium">No records found in audit trail.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlacklistedVendors;