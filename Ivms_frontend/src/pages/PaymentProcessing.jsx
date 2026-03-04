import React, { useState, useRef, useEffect } from 'react';
import {
    Search, RotateCcw, History, CreditCard,
    FileText, ArrowDownLeft, ShieldCheck, Download,
    AlertCircle, CheckCircle2, Clock, ArrowLeft,
    ChevronDown, Check, FileDown, FileSpreadsheet
} from 'lucide-react';
import FinancialComponents from './FinancialComponents';
import PaymentModals from './PaymentModals';

const PaymentProcessing = ({ onBack }) => {
    const [selectedReport, setSelectedReport] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('All Status');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isLogOpen, setIsLogOpen] = useState(false);
    const filterRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState('');

    /*const debtsData = [
    {
        id: "EXP-2026-045",
        vendor: "ABC Supplies Ltd.",
        order: "PO-1089",
        original: "45,800.00",
        paid: "0.00",
        status: "Overdue",
        date: "2026-02-25"
    },
    {
        id: "EXP-2026-046",
        vendor: "Global Traders Inc.",
        order: "PO-1092",
        original: "78,500.00",
        paid: "30,000.00",
        status: "Partially Paid",
        date: "2026-02-28"
    },
    {
        id: "EXP-2026-047",
        vendor: "TechWorld Distribution",
        order: "PO-1095",
        original: "34,200.00",
        paid: "0.00",
        status: "Pending",
        date: "2026-03-05"
    },
    {
        id: "EXP-2026-048",
        vendor: "Metro Electronics Corp.",
        order: "PO-1098",
        original: "92,300.00",
        paid: "35,755.75",
        status: "Partially Paid",
        date: "2026-11-17"
    }
];*/

    const [debtsData, setDebtsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [ledgerData, setLedgerData] = useState([]);

    const fetchPayments = () => {
        setLoading(true);
        fetch('http://localhost:8080/api/ledger/payments')
            .then(r => r.json())
            .then(data => {
                const mapped = data.map(tx => {
                    const originalVal = tx.totalAmount ?? 0;
                    const paidVal = tx.amountPaid ?? 0;
                    const remainingVal = tx.remainingBalance ?? originalVal;
                    const dueDateObj = tx.dueDate ? new Date(tx.dueDate) : null;
                    const formattedDueDate = dueDateObj ? dueDateObj.toLocaleDateString() : '-';

                    // Refine Status in Frontend
                    let derivedStatus = tx.status ?? 'Pending';
                    if (paidVal === 0) {
                        derivedStatus = 'Pending';
                    } else if (paidVal >= originalVal) {
                        derivedStatus = 'Paid';
                    } else {
                        derivedStatus = 'Partially Paid';
                    }

                    // Check if Overdue (only if not Paid)
                    if (derivedStatus !== 'Paid' && dueDateObj && dueDateObj < new Date()) {
                        derivedStatus = 'Overdue';
                    }

                    return {
                        id: tx.id,
                        vendor: tx.partyName ?? '-',
                        order: tx.orderId ?? '-',
                        original: originalVal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
                        paid: paidVal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
                        remaining: remainingVal.toLocaleString('en-US', { minimumFractionDigits: 2 }),
                        status: derivedStatus,
                        date: formattedDueDate,
                        paymentDate: tx.paymentDate ? new Date(tx.paymentDate).toLocaleDateString() : '-',
                        referenceNumber: tx.referenceNumber || '-',
                        totalPaidAmount: paidVal,
                        dueDate: formattedDueDate
                    };
                });


                setDebtsData(mapped);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const downloadExport = async (format) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ledger/export/payments/${format}`);
            if (!response.ok) throw new Error("Server error occurred during export");
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Vendor_Payments_Report_${new Date().toISOString().slice(0, 10)}.${format === 'excel' ? 'xlsx' : 'pdf'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error("Export failed", error);
        }
    };

    // 🔹 ALL HOOKS FIRST
    useEffect(() => {
        fetchPayments();
    }, []);





    const toNumber = (value) => {
        if (value == null) return 0;
        if (typeof value === 'number') return value;
        return parseFloat(String(value).replace(/,/g, '')) || 0;
    };

    const totalOutstandingDebt = debtsData.reduce(
        (sum, d) => sum + (toNumber(d.original) - toNumber(d.paid)),
        0
    );

    // Total Paid This Month (sum of paid amounts)
    const totalPaidThisMonth = debtsData.reduce(
        (sum, d) => sum + toNumber(d.paid),
        0
    );

    // Partially Paid Amount (remaining of partially paid)
    const partiallyPaidAmount = debtsData
        .filter(d => d.status === "Partially Paid")
        .reduce((sum, d) => sum + (toNumber(d.original) - toNumber(d.paid)), 0);

    // Overdue Payments (count)
    const overduePaymentsCount = debtsData.filter(
        d => d.status === "Overdue"
    ).length;

    const filteredDebts = debtsData.filter(item => {
        // Search filter
        const matchesSearch =
            item.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.order.toLowerCase().includes(searchTerm.toLowerCase());

        // Status filter
        const matchesStatus =
            selectedStatus === 'All Status' || item.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const statusOptions = ['All Status', 'Overdue', 'Partially Paid', 'Pending'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Helper to open specific modals
    const openHistory = (data) => {
        setSelectedReport(data);
        setIsHistoryOpen(true);
    };

    const openLogPayment = (data) => {
        setSelectedReport(data);
        setIsLogOpen(true);
    };

    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8">
            {/* Navigation */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 hover:text-blue-900 font-bold text-xs uppercase tracking-wider mb-6 transition-colors"
            >
                <ArrowLeft size={16} /> Back to Reports
            </button>

            {/* Header */}
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
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => downloadExport('pdf')}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900 shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <FileDown size={14} /> Export PDF
                    </button>
                    <button
                        onClick={() => downloadExport('excel')}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900 shadow-sm hover:bg-slate-50 transition-all"
                    >
                        <FileSpreadsheet size={14} /> Export Excel
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                <DebtMetric
                    label="Total Outstanding Debt"
                    amount={`$${totalOutstandingDebt.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtext={`${overduePaymentsCount + 3} active liabilities`}
                    icon={<ArrowDownLeft size={18} />}
                    bg="bg-red-500"
                    isAlert
                />

                <DebtMetric
                    label="Total Paid This Month"
                    amount={`$${totalPaidThisMonth.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtext="February 2026"
                    icon={<CheckCircle2 size={18} />}
                    bg="bg-green-500"
                    isPositive
                />

                <DebtMetric
                    label="Partially Paid Amount"
                    amount={`$${partiallyPaidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    subtext="Partially settled invoices"
                    icon={<AlertCircle size={18} />}
                    bg="bg-orange-500"
                />

                <DebtMetric
                    label="Overdue Payments"
                    amount={`${overduePaymentsCount}`}
                    subtext="Requires immediate attention"
                    icon={<AlertCircle size={18} />}
                    bg="bg-red-600"
                    isAlert
                />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search vendor, expense ID, or order..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                </div>

                <div className="col-span-3 relative" ref={filterRef}>
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <span className="font-medium">{selectedStatus}</span>
                        <ChevronDown size={16} className={`text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                            {statusOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => { setSelectedStatus(option); setIsFilterOpen(false); }}
                                    className="group w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-slate-700 hover:bg-blue-600 hover:text-white transition-colors"
                                >
                                    {option}
                                    {selectedStatus === option && <Check size={14} className="text-blue-600 group-hover:text-white" />}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="col-span-5 flex justify-end">
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedStatus('All Status');
                        }}
                        className="flex items-center gap-2 px-6 py-2.5 border-2 border-blue-900 rounded-xl text-blue-900 text-xs font-bold hover:bg-blue-900 hover:text-white transition-all"
                    >
                        <RotateCcw size={14} /> Clear Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
                    <FileText size={18} className="text-blue-900" />
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Outstanding Debts ({filteredDebts.length})</h4>
                </div>
                <div className="overflow-x-auto">
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
                            {filteredDebts.map(row => (
                                <ProcessingRow
                                    key={row.id}
                                    {...row}
                                    onHistory={openHistory}
                                    onLog={openLogPayment}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <FinancialComponents
                isOpen={isHistoryOpen}
                data={selectedReport}
                onClose={() => setIsHistoryOpen(false)}
            />

            <PaymentModals
                isOpen={isLogOpen}
                data={selectedReport}
                onClose={() => setIsLogOpen(false)}
                onUpdate={fetchPayments}
            />

        </div>
    );
};

const ProcessingRow = ({ id, vendor, order, original, paid, status, date, dueDate, paymentDate, referenceNumber, totalPaidAmount, onHistory, onLog }) => {
    const remaining = (parseFloat(original.replace(',', '')) - parseFloat(paid.replace(',', ''))).toLocaleString('en-US', { minimumFractionDigits: 2 });
    const rowData = { id, vendor, order, original, paid, status, date, dueDate, paymentDate, referenceNumber, totalPaidAmount, remaining };

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4 font-bold text-blue-600 hover:underline cursor-pointer">{id}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
                        <ShieldCheck size={14} />
                    </div>
                    <span className="font-bold text-slate-700">{vendor}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-slate-500 font-medium">{order}</td>
            <td className="px-6 py-4 font-bold text-black-500">${original}</td>
            <td className="px-6 py-4 font-bold text-green-600">${paid}</td>
            <td className="px-6 py-4 font-bold text-red-600">${remaining}</td>
            <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={14} /> <span className="text-xs font-bold">{date}</span>
                </div>
            </td>
            <td className="px-6 py-4 ">
                <StatusBadge status={status} />
            </td>
            <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2  transition-opacity">
                    <button
                        onClick={() => onHistory(rowData)}
                        className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-white hover:text-blue-900 transition-all shadow-sm"
                    >
                        <History size={12} /> History
                    </button>
                    <button
                        onClick={() => onLog(rowData)}
                        disabled={status === 'Paid'}
                        className={`flex items-center gap-1.5 px-3 py-1.5 border border-blue-900 rounded-lg text-[10px] font-bold transition-all shadow-md
                            ${status === 'Paid'
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                : 'bg-blue-900 text-white hover:bg-blue-800'}`}
                    >
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
        <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase flex items-center gap-1.5 w-fit ${styles[status.trim()] || 'bg-slate-500 text-white'}`}>
            <div className="w-1 h-1 rounded-full bg-white/50" />
            {status}
        </span>
    );
};

const DebtMetric = ({ label, amount, subtext, icon, bg, isPositive, isAlert }) => (
    <div className="p-6 rounded-2xl border border-slate-200 bg-white relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
            <div className={`p-2 rounded-xl ${bg} text-white shadow-lg`}>
                {icon}
            </div>
        </div>
        <h3 className={`text-2xl font-black ${isAlert ? 'text-red-600' : 'text-slate-800'}`}>{amount}</h3>
        <p className={`text-[11px] font-bold mt-1 ${isPositive ? 'text-green-500' : isAlert ? 'text-red-500' : 'text-slate-400'}`}>
            {subtext}
        </p>
    </div>
);

export default PaymentProcessing;