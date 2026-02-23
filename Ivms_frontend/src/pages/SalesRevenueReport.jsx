import React from 'react';
import {
    FileSpreadsheet, TrendingUp, FileText, DollarSign, Target, Hash, Eye
} from 'lucide-react';

const SalesRevenueContent = () => {
    return (
        <>
            {/* Sales Specific Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <SalesSummaryCard
                    icon={<DollarSign className="text-green-600" size={18} />}
                    label="Total Revenue"
                    amount="$169,620.00"
                    subtext="+15.3% from last period"
                    color="green"
                    trend="up"
                />
                <SalesSummaryCard
                    icon={<Target className="text-blue-500" size={18} />}
                    label="Average Order Value"
                    amount="$56,540.00"
                    subtext="Per transaction"
                    color="blue"
                />
                <SalesSummaryCard
                    icon={<Hash className="text-purple-500" size={18} />}
                    label="Total Invoices"
                    amount="3"
                    subtext="Issued this period"
                    color="purple"
                />
            </div>

            {/* Detailed Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <FileSpreadsheet size={18} className="text-slate-400" />
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Detailed Transactions (8)</h4>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Transaction ID</th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer/Vendor</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <SalesRow id="INV-2026-001" order="SO-1045" party="Acme Corporation" type="Revenue" cat="Product Sales" amt="54,900.00" status="Paid" date="2026-02-18" />
                        <SalesRow id="EXP-2026-045" order="PO-2089" party="TechSupply Co." type="Expense" cat="Procurement" amt="34,200.00" status="Pending" date="2026-02-19" />
                        <SalesRow id="INV-2026-002" order="SO-1046" party="Global Enterprises Ltd." type="Revenue" cat="Product Sales" amt="74,880.00" status="Pending" date="2026-02-20" />
                        <SalesRow id="EXP-2026-046" order="PO-2090" party="QuickShip Electronics" type="Expense" cat="Procurement" amt="22,500.00" status="Paid" date="2026-02-20" />
                        <SalesRow id="INV-2026-003" order="SO-1047" party="SmartTech Solutions" type="Revenue" cat="Product Sales" amt="39,840.00" status="Paid" date="2026-02-21" />
                    </tbody>
                </table>
            </div>
        </>
    );
};

// Sub-components
const SalesSummaryCard = ({ icon, label, amount, subtext, color, trend }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <div className={`p-1.5 rounded-lg bg-${color}-50`}>
                {icon}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-800">{amount}</h3>
            {trend === 'up' && (
                <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded">
                    +15.3%
                </span>
            )}
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-1">{subtext}</p>
    </div>
);

const SalesRow = ({ id, order, party, type, cat, amt, status, date }) => (
    <tr className="hover:bg-slate-50 transition-colors">
        <td className="px-6 py-4 font-medium text-blue-600">{id}</td>
        <td className="px-6 py-4 text-slate-500 font-medium">{order}</td>
        <td className="px-6 py-4 font-semibold text-slate-700">{party}</td>
        <td className="px-6 py-4">
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${type === 'Revenue' ? 'bg-blue-900' : 'bg-purple-600'}`}>
                {type === 'Revenue' ? '↗ Revenue' : '↘ Expense'}
            </span>
        </td>
        <td className="px-6 py-4 text-slate-500 text-xs">{cat}</td>
        <td className="px-6 py-4 font-bold text-slate-800">${amt}</td>
        <td className="px-6 py-4">
            <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                {status}
            </span>
        </td>
        <td className="px-6 py-4 text-slate-500 text-xs tabular-nums">{date}</td>
        <td className="px-6 py-4 text-right">
            <button className="flex items-center gap-1 ml-auto px-2 py-1 border border-slate-200 rounded text-[10px] font-bold text-slate-400 hover:text-blue-900 hover:border-blue-900 transition-all">
                <Eye size={12} /> View
            </button>
        </td>
    </tr>
);

export default SalesRevenueContent;