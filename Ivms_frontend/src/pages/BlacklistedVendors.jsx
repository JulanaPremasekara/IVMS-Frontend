import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShieldAlert, Search, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlacklistedVendors = () => {
    const navigate = useNavigate();
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlacklisted = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/vendors");
                const data = await res.json();
                // Filter only blacklisted for this specific audit view
                setVendors(data.filter(v => v.status === 'BLACKLISTED'));
            } catch (err) {
                console.error("Audit fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlacklisted();
    }, []);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/supplier/manage')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-5 h-5 text-slate-600"/>
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Blacklist Audit Trail</h1>
                    <p className="text-xs text-slate-500 font-medium">Historical records of removed vendors and justifications</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-red-50/50 text-[10px] font-black text-red-600 uppercase tracking-widest">
                        <tr>
                            <th className="px-6 py-4">Vendor</th>
                            <th className="px-6 py-4">Reason for Removal</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan="3" className="p-10 text-center animate-pulse text-slate-400">Loading audit logs...</td></tr>
                        ) : vendors.length > 0 ? vendors.map(v => (
                            <tr key={v.id} className="hover:bg-slate-50/50">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-700 text-sm">{v.companyName}</div>
                                    <div className="text-[10px] text-slate-400 uppercase">ID: VEN-{v.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600 text-sm italic">
                                        <FileText className="w-4 h-4 text-slate-300" />
                                        {v.blacklistReason || "No reason specified"}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded font-bold text-[10px] border border-red-200">
                                        REMOVED
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="3" className="p-10 text-center text-slate-400 text-sm italic">No blacklisted vendors found in history.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BlacklistedVendors;