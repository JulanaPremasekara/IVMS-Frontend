import React, { useState, useEffect } from 'react';
import {
  History, Search, RefreshCw, Download, Filter, Calendar, User,
  AlertCircle, Eye, X, ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AuditLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [actionType, setActionType] = useState('All actions');
  const [moduleFilter, setModuleFilter] = useState('All modules');

  useEffect(() => {
    const fetchAuditLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8082/api/admin/audit/logs', {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (!response.ok) throw new Error(`Server responded with status ${response.status}`);
        const data = await response.json();
        setLogs(data);
        setFilteredLogs(data);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
        setError(err.message || 'Failed to load audit logs.');
      } finally {
        setLoading(false);
      }
    };
    fetchAuditLogs();
  }, []);

  const applyFilters = () => {
    let result = [...logs];

    if (dateFrom) {
      const from = `${dateFrom}T00:00:00`;
      result = result.filter(log => log.timestamp >= from);
    }
    if (dateTo) {
      const to = `${dateTo}T23:59:59`;
      result = result.filter(log => log.timestamp <= to);
    }

    if (userSearch.trim()) {
      const term = userSearch.toLowerCase().trim();
      result = result.filter(log =>
        (log.user?.toLowerCase() || '').includes(term) ||
        (log.userId?.toLowerCase() || '').includes(term)
      );
    }

    if (actionType !== 'All actions') {
      result = result.filter(log => log.action === actionType);
    }
    if (moduleFilter !== 'All modules') {
      result = result.filter(log => log.module === moduleFilter);
    }

    setFilteredLogs(result);
  };

  const resetFilters = () => {
    setDateFrom('');
    setDateTo('');
    setUserSearch('');
    setActionType('All actions');
    setModuleFilter('All modules');
    setFilteredLogs([...logs]);
  };

  const getStatusStyle = (status) => {
    return status === 'Flagged'
      ? 'bg-rose-50 text-rose-600 border-rose-100'
      : 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    try {
      const date = new Date(ts);
      return date.toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
      });
    } catch {
      return ts;
    }
  };

  const exportToPDF = () => {
    if (filteredLogs.length === 0) {
      alert('No audit logs to export.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    doc.setFontSize(16);
    doc.text('System Audit Logs', 14, 15);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    doc.text(`Total records: ${filteredLogs.length}`, 14, 27);

    const tableColumn = [
      'Timestamp', 'User', 'User ID', 'Module', 'Action', 'Entity', 'Status'
    ];

    const tableRows = filteredLogs.map(log => [
      formatTimestamp(log.timestamp) || '—',
      log.user || '—',
      log.userId || '—',
      log.module || '—',
      log.action || '—',
      log.entity || '—',
      log.status || 'Normal',
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      styles: { fontSize: 9, cellPadding: 3, overflow: 'linebreak', halign: 'left' },
      headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 244, 248] },
      columnStyles: {
        0: { cellWidth: 38 },  // Timestamp
        1: { cellWidth: 32 },  // User
        2: { cellWidth: 24 },  // User ID
        3: { cellWidth: 24 },  // Module
        4: { cellWidth: 28 },  // Action
        5: { cellWidth: 35 },  // Entity
        6: { cellWidth: 25 },  // Status
      },
      margin: { top: 35, left: 14, right: 14 },
    });

    const today = new Date().toISOString().split('T')[0];
    doc.save(`audit-logs-${today}.pdf`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl w-full text-center">
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" onClick={() => setSelectedLog(null)}>
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="bg-[#1e3a8a] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><History size={20} /></div>
                <h3 className="font-bold text-lg tracking-tight">Audit Log Details</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <AuditDetailItem label="Timestamp" value={formatTimestamp(selectedLog.timestamp)} fullWidth />
              <AuditDetailItem label="User" value={selectedLog.user || '—'} />
              <AuditDetailItem label="User ID" value={selectedLog.userId || '—'} highlight />
              <AuditDetailItem label="Module" value={selectedLog.module || '—'} />
              <AuditDetailItem label="Action" value={selectedLog.action || '—'} />
              <AuditDetailItem label="Entity" value={selectedLog.entity || '—'} fullWidth mono highlight />
              <div className="col-span-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Status</label>
                <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${getStatusStyle(selectedLog.status)}`}>
                  {selectedLog.status || 'Normal'}
                </span>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setSelectedLog(null)} className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 mb-2 border border-blue-200 px-3 py-1 rounded-md bg-blue-50/50"
          >
            <ArrowLeft size={14} /> Back to Admin Control
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Compliance</span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Track system activities, user actions, and module-level changes.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            onClick={exportToPDF}
            disabled={filteredLogs.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              filteredLogs.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-lg shadow-blue-100'
            }`}
          >
            <Download size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">Filter Audit Logs</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Calendar size={12} /> Date From
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <Calendar size={12} /> Date To
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
              <User size={12} /> User
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Name or user ID..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Action Type</label>
            <select
              value={actionType}
              onChange={e => setActionType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option>All actions</option>
              <option>CREATE</option>
              <option>UPDATE</option>
              <option>DELETE</option>
              <option>DEACTIVATE</option>
              <option>ACTIVATE</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Module</label>
            <select
              value={moduleFilter}
              onChange={e => setModuleFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option>All modules</option>
              <option>Inventory</option>
              <option>Procurement</option>
              <option>Finance</option>
              <option>Auth</option>
              <option>User</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all"
          >
            Reset Filters
          </button>
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 transition-all shadow-lg shadow-blue-100"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-blue-600" />
            <h3 className="text-sm font-bold text-slate-800">Audit Log Results</h3>
          </div>
          <span className="bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">
            {filteredLogs.length} Records
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="py-16 text-center text-slate-500">No matching audit logs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[980px]">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold">
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Entity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log, idx) => (
                  <tr key={log.id || idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">{formatTimestamp(log.timestamp)}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-slate-700">{log.user || '—'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.userId || '—'}</div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{log.module || '—'}</td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-semibold">{log.action || '—'}</td>
                    <td className="px-6 py-4 text-xs font-mono text-blue-600">{log.entity || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusStyle(log.status)}`}>
                        {log.status || 'Normal'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 border border-slate-100 rounded hover:bg-white transition-all shadow-sm"
                          aria-label="View audit details"
                          title="View details"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const AuditDetailItem = ({ label, value, fullWidth, highlight, mono }) => (
  <div className={fullWidth ? 'col-span-1 sm:col-span-2' : 'col-span-1'}>
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</label>
    <p className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${highlight ? 'text-blue-600' : 'text-slate-700'}`}>
      {value || '—'}
    </p>
  </div>
);

export default AuditLogs;