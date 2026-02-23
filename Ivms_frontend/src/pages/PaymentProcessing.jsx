import React from 'react';
import {
    Search, Filter, RotateCcw, History, CreditCard,
    FileText, ArrowDownLeft, ShieldCheck, Download,
    AlertCircle, CheckCircle2, Clock, ArrowLeft
} from 'lucide-react';

const PaymentProcessing = ({ onBack }) => {
    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-bold text-xs uppercase tracking-wider mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Reports
            </button>

            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-2xl font-bold text-slate-800">Outstanding Debts & Payment Processing</h2>
                        <span className="px-2 py-0.5 bg-blue-900 text-white text-[10px] font-bold rounded flex items-center gap-1">
                            <CreditCard size={10} /> Finance Manager
                        </span>
                    </div>
                    <p className="text-sm text-slate-500">Log payments and clear vendor liabilities</p>
                    <div className="flex items-center gap-1.5 mt-2 text-green-600 font-bold text-[10px] uppercase tracking-wider">
                        <CheckCircle2 size={12} /> Accounts Payable Module Active
                    </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900 shadow-sm hover:bg-slate-50">
                    <Download size={14} /> Export Report
                </button>
            </div>

            {/* Metric Cards Grid */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <DebtMetric
                    label="Total Outstanding Debt"
                    amount="$398,700.00"
                    subtext="7 active liabilities"
                    icon={<ArrowDownLeft className="text-red-500" size={18} />}
                    bg="bg-red-50/50"
                />
                <DebtMetric
                    label="Total Paid This Month"
                    amount="$100,000.00"
                    subtext="February 2026"
                    icon={<CheckCircle2 className="text-green-500" size={18} />}
                    bg="bg-green-50/50"
                    isPositive
                />
                <DebtMetric
                    label="Partially Paid Amount"
                    amount="$50,000.00"
                    subtext="2 pending invoices"
                    icon={<AlertCircle className="text-orange-500" size={18} />}
                    bg="bg-orange-50/50"
                />
                <DebtMetric
                    label="Overdue Payments"
                    amount="3"
                    subtext="Requires immediate attention"
                    icon={<AlertCircle className="text-red-600" size={18} />}
                    bg="bg-red-100/40"
                    isAlert
                />
            </div>

            {/* Filter Bar */}
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search vendor, expense ID, or order..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>
                <div className="col-span-3 relative">
                    <label className="absolute -top-2 left-3 px-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">Filter by Status</label>
                    <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm appearance-none focus:outline-none">
                        <option>All Status</option>
                        <option>Overdue</option>
                        <option>Partially Paid</option>
                        <option>Pending</option>
                    </select>
                </div>
                <div className="col-span-5 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2.5 border-2 border-blue-900 rounded-xl text-blue-900 text-xs font-bold hover:bg-blue-50 transition-colors">
                        <RotateCcw size={14} /> Clear Filters
                    </button>
                </div>
            </div>

            {/* Main Outstanding Debts Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <FileText size={18} className="text-blue-900" />
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Outstanding Debts (7)</h4>
                </div>
                <table className="w-full text-left text-sm">
                    <thead className="bg-white text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Expense ID</th>
                            <th className="px-6 py-4">Vendor Name</th>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Original Amount</th>
                            <th className="px-6 py-4">Paid Amount</th>
                            <th className="px-6 py-4">Remaining Balance</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <ProcessingRow id="EXP-2026-045" vendor="ABC Supplies Ltd." order="PO-1089" original="45,800.00" paid="0.00" status="Overdue" date="2026-02-25" />
                        <ProcessingRow id="EXP-2026-046" vendor="Global Traders Inc." order="PO-1092" original="78,500.00" paid="30,000.00" status="Partially Paid" date="2026-02-28" />
                        <ProcessingRow id="EXP-2026-047" vendor="TechWorld Distribution" order="PO-1095" original="34,200.00" paid="0.00" status="Pending" date="2026-03-05" />
                        <ProcessingRow id="EXP-2026-048" vendor="Metro Electronics Corp." order="PO-1098" original="92,300.00" paid="0.00" status="Overdue" date="2026-02-22" />
                        <ProcessingRow id="EXP-2026-049" vendor="Premier Supplies Co." order="PO-1101" original="56,700.00" paid="20,000.00" status="Partially Paid" date="2026-03-01" />
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Component Helpers
const DebtMetric = ({ label, amount, subtext, icon, bg, isPositive, isAlert }) => (
    <div className={`p-6 rounded-2xl border border-slate-200 bg-white relative overflow-hidden`}>
        <div className={`absolute top-0 right-0 p-4 opacity-10 ${isAlert ? 'text-red-600' : ''}`}>
            {React.cloneElement(icon, { size: 48 })}
        </div>
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className={`p-2 rounded-full ${bg}`}>
                {icon}
            </div>
        </div>
        <h3 className={`text-2xl font-bold ${isAlert ? 'text-red-600' : 'text-slate-800'}`}>{amount}</h3>
        <p className={`text-[11px] font-medium mt-1 ${isPositive ? 'text-green-500' : isAlert ? 'text-red-500' : 'text-slate-400'}`}>
            {subtext}
        </p>
    </div>
);

const ProcessingRow = ({ id, vendor, order, original, paid, status, date }) => {
    const remaining = (parseFloat(original.replace(',', '')) - parseFloat(paid.replace(',', ''))).toLocaleString('en-US', { minimumFractionDigits: 2 });

    return (
        <tr className="hover:bg-slate-50 transition-colors">
            <td className="px-6 py-4 font-medium text-blue-600 underline cursor-pointer">{id}</td>
            <td className="px-6 py-4 flex items-center gap-2">
                <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                    <ShieldCheck size={14} />
                </div>
                <span className="font-semibold text-slate-700">{vendor}</span>
            </td>
            <td className="px-6 py-4 text-slate-500 font-medium">{order}</td>
            <td className="px-6 py-4 font-bold text-slate-800">${original}</td>
            <td className="px-6 py-4 font-bold text-green-600">${paid}</td>
            <td className="px-6 py-4 font-bold text-red-600">${remaining}</td>
            <td className="px-6 py-4 flex items-center gap-2 text-slate-400">
                <Clock size={14} /> <span className="text-xs font-medium">{date}</span>
            </td>
            <td className="px-6 py-4">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white hover:text-blue-900 transition-all">
                        <History size={12} /> History
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800 transition-all shadow-sm">
                        <CreditCard size={12} /> Log Payment
                    </button>
                </div>
            </td>
        </tr>
    );
};

const StatusBadge = ({ status }) => {
    const styles = {
        'Overdue': 'bg-red-600 text-white',
        'Partially Paid': 'bg-orange-500 text-white',
        'Pending': 'bg-blue-500 text-white'
    };
    return (
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1 w-fit ${styles[status]}`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
            {status}
        </span>
    );
};

export default PaymentProcessing;