import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Calendar, PlusCircle, Ban, FileSpreadsheet, FileDown,
  ArrowUpRight, ArrowDownRight, ShieldCheck, PieChart as PieIcon,
  TrendingUp, Wallet, DollarSign, FileText
} from 'lucide-react';

import AccountsPayableContent from './AccountsPayableReport';
import AccountsReceivableContent from './AccountsReceivableReport';
import SalesRevenueContent from './SalesRevenueReport';
import PaymentProcessing from './PaymentProcessing';
import ManageFinancialEntries from './ManageFinancialEntries';
import TransactionModal from './TransactionModal';

// Sample Data (Moved outside to keep component clean)
const barData = [
  { name: 'Jan', Revenue: 130000, Expenses: 85000 },
  { name: 'Feb', Revenue: 150000, Expenses: 95000 },
  { name: 'Mar', Revenue: 145000, Expenses: 90000 },
  { name: 'Apr', Revenue: 160000, Expenses: 100000 },
  { name: 'May', Revenue: 175000, Expenses: 105000 },
  { name: 'Jun', Revenue: 185000, Expenses: 110000 },
];

const pieData = [
  { name: 'Procurement', value: 44, color: '#1e3a8a' },
  { name: 'Salaries', value: 27, color: '#3b82f6' },
  { name: 'Operations', value: 15, color: '#60a5fa' },
  { name: 'Marketing', value: 8, color: '#93c5fd' },
  { name: 'Other', value: 6, color: '#d1d5db' },
];

const lineData = [
  { date: 'Feb 15', Revenue: 45000 },
  { date: 'Feb 16', Revenue: 52000 },
  { date: 'Feb 17', Revenue: 48000 },
  { date: 'Feb 18', Revenue: 55000 },
  { date: 'Feb 19', Revenue: 60000 },
  { date: 'Feb 20', Revenue: 64000 },
  { date: 'Feb 21', Revenue: 70000 },
];

const transactions = [
  {
    id: "INV-2026-001",
    type: "Revenue",
    category: "Product Sales",
    amount: 54900,
    status: "Paid",
    date: "2026-02-18",
  },
  {
    id: "EXP-2026-045",
    type: "Expense",
    category: "Procurement",
    amount: 34200,
    status: "Pending",
    date: "2026-02-19",
  },
  {
    id: "EXP-2026-048",
    type: "Expense",
    category: "Salaries",
    amount: 28000,
    status: "Paid",
    date: "2026-02-15",
  },
];

const FinancialReports = () => {
  const [activeTab, setActiveTab] = useState('Profit & Loss');
  const [activeSubView, setActiveSubView] = useState(null); 
  const [selectedReport, setSelectedReport] = useState(null); // Modal State
  
  const totalIncome = transactions
  .filter(t => t.type === "Revenue")
  .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
  .filter(t => t.type === "Expense")
  .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  if (activeSubView === 'payment') {
    return <PaymentProcessing onBack={() => setActiveSubView(null)} />;
  }

  if (activeSubView === 'void') {
    return <ManageFinancialEntries onBack={() => setActiveSubView(null)} />;
  }

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-8">
      {/* Top Header Actions */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Financial Reports & Analytics</h2>
          <p className="text-sm text-slate-500">Monitor financial health and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex items-center gap-2 bg-white border border-slate-200 px-2 py-2 rounded-lg text-xs font-semibold text-slate-600 shadow-sm hover:border-slate-300 transition-colors ">
              {/* Icon stays on the left */}
              <Calendar size={14} className="text-slate-400" />

                <select className="bg-transparent outline-none appearance-none cursor-pointer pr-5 w-full">
                  <option>&nbsp;&nbsp;Last 7 Days</option>
                  <option>&nbsp;&nbsp;Last 30 Days</option>
                  <option>&nbsp;&nbsp;This Month</option>
                  <option>&nbsp;&nbsp;Last Month</option>
                  <option>&nbsp;&nbsp;This Quarter</option>
                  <option>&nbsp;&nbsp;Custom Range</option>
                </select>

              {/* Custom Arrow - positioned absolutely so it doesn't move */}
              <div className="absolute right-3 pointer-events-none text-slate-400">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 1L5 5L9 1" />
                </svg>
              </div>
            </div>
          <button
            onClick={() => setActiveSubView('payment')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
          >
            <PlusCircle size={14} /> Log Payment
          </button>
          <button
            onClick={() => setActiveSubView('void')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
          >
            <Ban size={14} /> Void Entry
          </button>
          <div className="h-8 w-px bg-slate-200 mx-1" />
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900">
            <FileDown size={14} /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-blue-900">
            <FileSpreadsheet size={14} /> Export Excel
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-blue-900 text-white rounded-full">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Role-Based View: Finance Manager</h4>
            <p className="text-xs text-slate-500">Full Access to All Financial Reports</p>
          </div>
        </div>
        <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-bold rounded uppercase">Full Access</span>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-8 border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar">
        <ReportTab icon={<TrendingUp size={16} />} label="Profit & Loss" active={activeTab === 'Profit & Loss'} onClick={() => setActiveTab('Profit & Loss')} />
        <ReportTab icon={<Wallet size={16} />} label="Accounts Payable" active={activeTab === 'Accounts Payable'} onClick={() => setActiveTab('Accounts Payable')} />
        <ReportTab icon={<TrendingUp size={16} />} label="Accounts Receivable" active={activeTab === 'Accounts Receivable'} onClick={() => setActiveTab('Accounts Receivable')} />
        <ReportTab icon={<FileText size={16} />} label="Sales Revenue" active={activeTab === 'Sales Revenue'} onClick={() => setActiveTab('Sales Revenue')} />
      </div>

      {/* Conditional Content Rendering */}
      {activeTab === 'Profit & Loss' && (
        <>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <SummaryCard
              label="Total Income"
              amount={`$${totalIncome.toLocaleString()}.00`}
              trend="+12.5%"
              color="green"
            />

            <SummaryCard
              label="Total Expenses"
              amount={`$${totalExpenses.toLocaleString()}.00`}
              trend="+8.2%"
              color="orange"
            />

            <SummaryCard
              label="Net Profit"
              amount={`$${netProfit.toLocaleString()}.00`}
              subtext={`Profit Margin: ${((netProfit / totalIncome) * 100).toFixed(1)}%`}
              color="green"
              isPrimary
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-12 gap-6 mb-8">
            <div className="col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp size={18} className="text-slate-400" />
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Revenue vs Expenses</h4>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="rect" align="center" verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                    <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} barSize={35} />
                    <Bar dataKey="Expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={35} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <PieIcon size={18} className="text-slate-400" />
                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Expense Breakdown</h4>
              </div>
              <div className="h-64 flex">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col justify-center gap-3 pr-4">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[11px] font-medium text-slate-600">{item.name}: {item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <FileSpreadsheet size={18} className="text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight"><h4>Detailed Transactions ({transactions.length})</h4></h4>
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
                {/* Notice 'onView' is passed here */}
                <ReportRow onView={(data) => setSelectedReport(data)} id="INV-2026-001" order="SO-1045" party="Acme Corporation" type="Revenue" category="Product Sales" amount="54,900.00" status="Paid" date="2026-02-18" />
                <ReportRow onView={(data) => setSelectedReport(data)} id="EXP-2026-045" order="PO-2089" party="TechSupply Co." type="Expense" category="Procurement" amount="34,200.00" status="Pending" date="2026-02-19" />
                <ReportRow onView={(data) => setSelectedReport(data)} id="EXP-2026-048" order="SAL-001" party="Payroll Department" type="Expense" category="Salaries" amount="28,000.00" status="Paid" date="2026-02-15" />
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Modal Logic (One place) */}
      {selectedReport && (
        <TransactionModal 
          isOpen={true} 
          data={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

      {activeTab === 'Accounts Payable' && <AccountsPayableContent />}
      {activeTab === 'Accounts Receivable' && <AccountsReceivableContent />}
      {activeTab === 'Sales Revenue' && <SalesRevenueContent />}
    </div>
  );
};

// Fixed ReportRow component
const ReportRow = ({ id, order, party, type, category, amount, status, date, onView }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-6 py-4 font-medium text-blue-600">{id}</td>
    <td className="px-6 py-4 text-slate-500 font-medium">{order}</td>
    <td className="px-6 py-4 font-semibold text-slate-700">{party}</td>
    <td className="px-6 py-4">
      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${type === 'Revenue' ? 'bg-blue-900 text-white' : 'bg-purple-600 text-white'}`}>
        {type === 'Revenue' ? '↗ Revenue' : '↘ Expense'}
      </span>
    </td>
    <td className="px-6 py-4 text-slate-500">{category}</td>
    <td className="px-6 py-4 font-bold text-slate-800">${amount}</td>
    <td className="px-6 py-4">
      <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${status === 'Paid' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
        {status}
      </span>  
    </td>
    <td className="px-6 py-4 text-slate-500 text-xs">{date}</td>
    <td className="px-6 py-4 text-right">
      <button 
        onClick={() => onView({ id, order, party, type, category, amount, status, date })} 
        className="flex items-center gap-1 ml-auto px-2 py-1 border border-slate-200 rounded text-[10px] font-bold text-slate-400 hover:text-blue-900 hover:border-blue-900 transition-all shadow-sm"
      >
        <TrendingUp size={12} /> View
      </button>
    </td>
  </tr>
);

// Helper Sub-components
const ReportTab = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-2 pb-3 px-2 cursor-pointer transition-all border-b-2 ${active ? 'border-blue-900 text-blue-900 font-bold' : 'border-transparent text-slate-400 font-medium hover:text-slate-600'}`}
  >
    {icon}
    <span className="text-sm">{label}</span>
  </div>
);

const SummaryCard = ({ label, amount, trend, subtext, color, isPrimary }) => (
  <div className={`p-6 rounded-2xl border ${isPrimary ? 'bg-white border-slate-200 ring-1 ring-green-100' : 'bg-white border-slate-200'}`}>
    <div className="flex items-center gap-2 mb-4">
      <div className={`w-2 h-2 rounded-full ${color === 'green' ? 'bg-green-500' : 'bg-orange-500'}`} />
      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex items-baseline gap-3">
      <h3 className={`text-2xl font-bold ${isPrimary ? 'text-green-600' : 'text-slate-800'}`}>{amount}</h3>
      {trend && <span className={`text-xs font-bold ${color === 'green' ? 'text-green-500' : 'text-orange-500'}`}>{trend} <span className="text-slate-400 font-normal">from last period</span></span>}
    </div>
    {subtext && <p className="mt-1 text-xs font-bold text-green-700/60 uppercase">{subtext}</p>}
  </div>
);

export default FinancialReports;