import React, { useState, useEffect } from 'react';
import {
    Ban, FileSpreadsheet, Wallet, Clock, Users,
    Eye, FileText
} from 'lucide-react';
import TransactionModal from './TransactionModal';

/*const apTransactions = [
  {
    id: "INV-2026-001",
    order: "SO-1045",
    party: "Acme Corporation",
    type: "Revenue",
    category: "Product Sales",
    amount: 54900,
    status: "Paid",
    date: "2026-02-18",
  },
  {
    id: "EXP-2026-045",
    order: "PO-2089",
    party: "TechSupply Co.",
    type: "Expense",
    category: "Procurement",
    amount: 34200,
    status: "Pending",
    date: "2026-02-19",
  },
  {
    id: "INV-2026-002",
    order: "SO-1046",
    party: "Global Enterprises Ltd.",
    type: "Revenue",
    category: "Product Sales",
    amount: 74880,
    status: "Pending",
    date: "2026-02-20",
  },
  {
    id: "EXP-2026-046",
    order: "PO-2090",
    party: "QuickShip Electronics",
    type: "Expense",
    category: "Procurement",
    amount: 22500,
    status: "Paid",
    date: "2026-02-21",
  },
];*/

/*// Total Outstanding Payables (Pending Expenses)
const totalOutstandingPayables = apTransactions
  .filter(t => t.type === "Expense" && t.status === "Pending")
  .reduce((sum, t) => sum + t.amount, 0);

// Overdue Payments (Pending Expenses with past date)
const today = new Date();

const overduePayments = apTransactions
  .filter(
    t =>
      t.type === "Expense" &&
      t.status === "Pending" &&
      new Date(t.date) < today
  )
  .reduce((sum, t) => sum + t.amount, 0);

// Active Vendors (unique vendors with pending expenses)
const activeVendors = new Set(
  apTransactions
    .filter(t => t.type === "Expense" && t.status === "Pending")
    .map(t => t.party)
).size;*/

const AccountsPayableContent = () => {
    const [selectedReport, setSelectedReport] = useState(null); // Modal State
    const [ledgerData, setLedgerData] = useState([]);
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
        fetch('http://localhost:8080/api/ledger/transactions')
        .then(res => res.json())
        .then(data => {
            setLedgerData(Array.isArray(data) ? data : []);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    if (loading) {
    return (
        <div className="flex items-center justify-center text-slate-500 py-10">
        Loading accounts payable...
        </div>
    );
    }

    const apTransactions = ledgerData
    .filter(t => (t.status === 'Pending' || t.status === 'Overdue') && t.type === 'Purchase')
    .map(t => ({
        id: t.id,
        order: t.order,
        party: t.party,
        type: t.type === 'Sale' ? 'Revenue' : 'Expense',
        category: t.category,
        amount: t.total,
        status: t.status,
        date: t.time ? t.time.split(' ')[0] : 'N/A'
    }));
    // Total Outstanding Payables (Pending Expenses)
    const totalOutstandingPayables = apTransactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0);

    // Overdue Payments (Pending Expenses with past date)
    const today = new Date();

    const overduePayments = apTransactions
    .filter(
        t =>
        t.status === 'Pending' &&
        new Date(t.date) < today
    )
    .reduce((sum, t) => sum + t.amount, 0);
    // Active Vendors (unique vendors with pending expenses)
    const activeVendors = new Set(
    apTransactions
        .filter(t => t.status === 'Pending')
        .map(t => t.party)
    ).size;

    return (
        <>
            {/* AP Specific Summary Cards */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                <APSummaryCard
                    icon={<Clock className="text-orange-500" size={18} />}
                    label="Total Outstanding Payables"
                    amount={`$${totalOutstandingPayables.toLocaleString()}.00`}
                    subtext="Pending vendor payments"
                    color="orange"
                    />

                    <APSummaryCard
                    icon={<Ban className="text-red-500" size={18} />}
                    label="Overdue Payments"
                    amount={`$${overduePayments.toLocaleString()}.00`}
                    subtext={
                        overduePayments === 0
                        ? "No overdue payments"
                        : "Pending overdue vendor payments"
                    }
                    color="red"
                    isSuccess={overduePayments === 0}
                    />

                    <APSummaryCard
                    icon={<Users className="text-purple-500" size={18} />}
                    label="Active Vendors"
                    amount={activeVendors.toString()}
                    subtext="Vendors with pending payments"
                    color="purple"
                    />
            </div>

            {/* Detailed Transactions Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <FileSpreadsheet size={18} className="text-slate-400" />
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Detailed Transactions ({apTransactions.length})</h4>
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
                    {apTransactions.map(t => (
                        <APRow
                        key={t.id}
                        id={t.id}
                        order={t.order}
                        party={t.party}
                        type={t.type}
                        cat={t.category}
                        amt={t.amount.toLocaleString()}
                        status={t.status}
                        date={t.date}
                        onView={() => setSelectedReport(t)}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
            {/* Modal Logic (One place) */}
                {selectedReport && (
                    <TransactionModal 
                    isOpen={true} 
                    data={selectedReport} 
                    onClose={() => setSelectedReport(null)} 
                    />
                )}
        </>
    );
};

// Helper Components
const APSummaryCard = ({ icon, label, amount, subtext, color, isSuccess }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            {icon}
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1">{amount}</h3>
        <p className={`text-[11px] font-medium ${isSuccess ? 'text-green-500' : 'text-slate-400'}`}>{subtext}</p>
    </div>
);

const APRow = ({ id, order, party, type, cat, amt, status, date, onView }) => (
    <tr className="hover:bg-slate-50 transition-colors group">
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
        <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
        <td className="px-6 py-4 text-right">
            <button 
            onClick={() => onView({ id, order, party, type, category:cat, amount:amt, status, date })} className="flex items-center gap-1 ml-auto px-2 py-1 border border-slate-200 rounded text-[10px] font-bold text-slate-400 hover:text-blue-900 hover:border-blue-900 transition-all">
                <Eye size={12} /> View
            </button>
        </td>
    </tr>
);

export default AccountsPayableContent;