import React from 'react';
import {
    Search, Filter, Database, Ban, Lock, Package,
    ArrowUpRight, ArrowDownRight, History, Trash2,
    AlertTriangle, ShieldAlert, CheckCircle2, XCircle, ArrowLeft
} from 'lucide-react';

const ManageFinancialEntries = ({ onBack }) => {
    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-bold text-xs uppercase tracking-wider mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Reports
            </button>

            {/* Header with Admin Badge */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-slate-800">Manage Financial Entries</h2>
                        <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-bold rounded flex items-center gap-1 uppercase tracking-wider">
                            <ShieldAlert size={10} /> Admin Finance Access
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">Void or correct incorrect transactions</p>
                    <div className="flex items-center gap-1.5 mt-2 text-green-600 font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Audit Logging Enabled
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900 shadow-sm hover:bg-slate-50">
                    <History size={14} /> View Audit Trail
                </button>
            </div>

            {/* Top Metric Row: Status Counts */}
            <div className="grid grid-cols-4 gap-6 mb-4">
                <StatusCard label="Active Records" count="7" sub="Financial entries" icon={<Database size={18} />} color="blue" />
                <StatusCard label="Voided Records" count="1" sub="Soft deleted" icon={<Ban size={18} />} color="red" />
                <StatusCard label="Locked Periods" count="1" sub="Cannot modify" icon={<Lock size={18} />} color="orange" />
                <StatusCard label="Linked to Stock" count="2" sub="Requires stock adjustment" icon={<Package size={18} />} color="purple" />
            </div>

            {/* Large Metric Row: Active Totals */}
            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-green-50/50 border border-green-100 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-green-700/60 uppercase mb-1">Total Revenue (Active)</p>
                        <h3 className="text-2xl font-bold text-green-600">$207,300.00</h3>
                    </div>
                    <ArrowUpRight className="text-green-400" size={32} />
                </div>
                <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-2xl flex justify-between items-center">
                    <div>
                        <p className="text-[10px] font-bold text-purple-700/60 uppercase mb-1">Total Expenses (Active)</p>
                        <h3 className="text-2xl font-bold text-purple-600">$180,500.00</h3>
                    </div>
                    <ArrowDownRight className="text-purple-400" size={32} />
                </div>
            </div>

            {/* Filtering & Search */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Transaction ID, Order ID, Customer..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                    <div className="col-span-2">
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white outline-none">
                            <option>All Types</option>
                            <option>Invoice</option>
                            <option>Expense</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white outline-none">
                            <option>Active Records</option>
                            <option>Voided</option>
                        </select>
                    </div>
                    <div className="col-span-4 flex items-center justify-end gap-3">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900" />
                            <span className="text-xs font-bold text-slate-500 uppercase">Show Voided</span>
                        </label>
                    </div>
                </div>

                {/* Super Admin Banner */}
                <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="text-orange-500" size={20} />
                        <div>
                            <h5 className="text-xs font-bold text-orange-800">Require Super Admin Approval for Deletion</h5>
                            <p className="text-[10px] text-orange-700/70 uppercase">Status changes to "Pending Approval" until reviewed</p>
                        </div>
                    </div>
                    <div className="w-10 h-5 bg-slate-300 rounded-full relative cursor-pointer shadow-inner">
                        <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                </div>
            </div>

            {/* Financial Records Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <Database size={18} className="text-blue-900" />
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Financial Records (7)</h4>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Fiscal Period</th>
                            <th className="px-6 py-4">Stock Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <AdminRow id="INV-2026-001" order="SO-1045" type="Invoice" amt="45,800.00" status="Paid" fiscal="Feb 2026" stock="In Inventory" />
                        <AdminRow id="INV-2026-002" order="SO-1045" type="Invoice" amt="45,800.00" status="Active" fiscal="Feb 2026" stock="N/A" />
                        <AdminRow id="EXP-2026-045" order="PO-1089" type="Expense" amt="78,500.00" status="Active" fiscal="Feb 2026" stock="In Inventory" isExpense />
                        <AdminRow id="INV-2025-089" order="SO-0989" type="Invoice" amt="23,400.00" status="Paid" fiscal="Dec 2025" stock="N/A" isLocked />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Sub-components
const StatusCard = ({ label, count, sub, icon, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-600',
        red: 'bg-red-50 text-red-600',
        orange: 'bg-orange-50 text-orange-600',
        purple: 'bg-purple-50 text-purple-600'
    };
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
            <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-1">{label}</h4>
                <div className="flex items-baseline gap-2">
                    <span className={`text-xl font-bold ${color === 'red' ? 'text-red-600' : 'text-slate-800'}`}>{count}</span>
                    <span className="text-[10px] font-medium text-slate-400">{sub}</span>
                </div>
            </div>
            <div className={`p-2 rounded-lg ${colors[color]}`}>
                {icon}
            </div>
        </div>
    );
};

const AdminRow = ({ id, order, type, amt, status, fiscal, stock, isExpense, isLocked }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4 font-medium text-blue-600 underline cursor-pointer">{id}</td>
        <td className="px-6 py-4 text-slate-500 font-medium">{order}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${isExpense ? 'bg-purple-600' : 'bg-blue-900'}`}>
                {type}
            </span>
        </td>
        <td className="px-6 py-4 font-bold text-slate-800">${amt}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1 w-fit ${status === 'Paid' ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                {status === 'Paid' ? <CheckCircle2 size={10} /> : <div className="w-1.5 h-1.5 rounded-full bg-white/50" />}
                {status}
            </span>
        </td>
        <td className="px-6 py-4">
            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border ${isLocked ? 'bg-orange-50 text-orange-700 border-orange-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                {isLocked ? <Lock size={10} className="text-orange-500" /> : <Lock size={10} className="text-green-500" />}
                {fiscal}
            </span>
        </td>
        <td className="px-6 py-4">
            {stock !== "N/A" ? (
                <span className="px-2 py-1 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[9px] font-bold uppercase flex items-center gap-1 w-fit">
                    <Package size={10} /> {stock}
                </span>
            ) : <span className="text-slate-300 text-xs font-bold">N/A</span>}
        </td>
        <td className="px-6 py-4 text-right">
            <button className="flex items-center gap-1.5 ml-auto px-3 py-1.5 border border-red-200 text-red-600 bg-red-50 rounded-lg text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">
                <Trash2 size={12} /> Void / Delete
            </button>
        </td>
    </tr>
);

export default ManageFinancialEntries;