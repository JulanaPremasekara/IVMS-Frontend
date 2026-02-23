import React from 'react';
import {
  Search, BookOpen, Settings,
  Download, ChevronDown, Eye, ArrowUpRight, ArrowDownRight
} from 'lucide-react';

const FinancialLedger = () => {
  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Financial Ledger Automation</h2>
            <p className="text-sm text-slate-500">Auto-Generated Invoices & Expense Records</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-100">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Ledger Module Active
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50">
              <Settings size={14} /> Settings
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 shadow-sm shadow-blue-200">
              <Download size={14} /> Export Ledger
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <StatCard
            type="Sales Invoices"
            sub="Accounts Receivable"
            outstanding="$74,880.00"
            paid="$94,740.00"
            total="$169,620.00"
            color="blue"
            count={3}
            trend="up"
          />
          <StatCard
            type="Purchase Expenses"
            sub="Accounts Payable"
            outstanding="$83,640.00"
            paid="$22,500.00"
            total="$106,140.00"
            color="purple"
            count={3}
            trend="down"
          />
        </div>

        {/* AI Banner */}
        <div className="bg-blue-600 text-white p-4 rounded-xl flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-2 rounded-lg">
              <Settings className="animate-spin-slow" size={20} />
            </div>
            <div>
              <h4 className="font-bold text-sm">Automated Ledger Management</h4>
              <p className="text-xs text-blue-100">Records are automatically generated when Sales Orders are marked "Shipped" or Purchase Orders are marked "Received"</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-green-400 text-green-900 rounded-md text-[10px] font-bold uppercase tracking-wider">
            Active
          </div>
        </div>

        {/* Table Controls */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center gap-4">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Transaction ID, Order ID, or Customer/Vendor..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
              All Types <ChevronDown size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50">
              All Status <ChevronDown size={14} />
            </button>
          </div>

          {/* Table */}
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Transaction ID</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Tax</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow id="INV-2026-001" order="SO-1045" type="Sale" party="Acme Corporation" amount="45,750.00" tax="9,150.00" total="54,900.00" status="Paid" time="2026-02-18 14:32:00" />
              <TableRow id="EXP-2026-045" order="PO-2089" type="Purchase" party="TechSupply Co." amount="28,500.00" tax="5,700.00" total="34,200.00" status="Pending" time="2026-02-19 09:15:00" />
              <TableRow id="INV-2026-002" order="SO-1046" type="Sale" party="Global Enterprises Ltd." amount="62,400.00" tax="12,480.00" total="74,880.00" status="Pending" time="2026-02-20 11:20:00" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Components

const StatCard = ({ type, sub, outstanding, paid, total, color, count, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div className="flex gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} text-white`}>
          {color === 'blue' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{type}</h3>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">{sub}</p>
        </div>
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-white text-xs font-bold ${color === 'blue' ? 'bg-blue-900' : 'bg-purple-600'}`}>
        {count} {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4 mb-6">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Outstanding</p>
        <p className="text-xl font-bold text-orange-600">{outstanding}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Paid</p>
        <p className="text-xl font-bold text-green-600">{paid}</p>
      </div>
    </div>

    <div className="pt-4 border-t border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total {type.split(' ')[1]}</p>
      <p className="text-lg font-bold text-slate-800">{total}</p>
    </div>
  </div>
);

const TableRow = ({ id, order, type, party, amount, tax, total, status, time }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    <td className="px-6 py-4 font-medium text-blue-600 cursor-pointer">{id}</td>
    <td className="px-6 py-4 text-slate-500 font-medium">{order} <ArrowUpRight size={12} className="inline opacity-40" /></td>
    <td className="px-6 py-4">
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${type === 'Sale' ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'}`}>
        {type}
      </span>
    </td>
    <td className="px-6 py-4 font-semibold text-slate-700">{party}</td>
    <td className="px-6 py-4 font-bold text-slate-700">${amount}</td>
    <td className="px-6 py-4 text-slate-400 text-xs">${tax} <span className="opacity-60">(20%)</span></td>
    <td className="px-6 py-4 font-bold text-slate-800">${total}</td>
    <td className="px-6 py-4">
      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
        {status}
      </span>
    </td>
    <td className="px-6 py-4 text-slate-500 text-xs tabular-nums">{time}</td>
    <td className="px-6 py-4 text-right">
      <button className="p-1.5 text-slate-400 border border-slate-200 rounded hover:bg-white hover:text-blue-600 shadow-sm">
        <Eye size={16} />
      </button>
    </td>
  </tr>
);

export default FinancialLedger;