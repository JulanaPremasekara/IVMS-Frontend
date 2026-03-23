import React, { useState, useEffect } from 'react';
import {
  History, Search, RefreshCw, Download, Filter, Calendar, User,
  Database, AlertCircle, Eye, X, ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {jsPDF} from 'jspdf';
import {autoTable} from 'jspdf-autotable';

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
        const response = await fetch('http://localhost:8080/api/admin/audit/logs', {
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
      ? 'text-rose-700 font-bold'
      : 'text-emerald-700 font-medium';
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
    <div className="space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 px-5 py-2.5 bg-white border ...">
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
            <p className="text-slate-500 text-sm mt-1">Track system activities</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-4 py-2 ...">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={exportToPDF} disabled={filteredLogs.length === 0} className={`... ${filteredLogs.length === 0 ? 'bg-gray-300' : 'bg-blue-700 text-white'}`}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border shadow-sm">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-2 text-blue-700">
          <Filter size={18} />
          <h3 className="text-base font-bold">Filter Audit Logs</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Calendar size={14} /> Date From
            </label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-full p-2.5 border rounded-lg" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <Calendar size={14} /> Date To
            </label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-full p-2.5 border rounded-lg" />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <User size={14} /> User
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Name or ID..." value={userSearch} onChange={e => setUserSearch(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 border rounded-lg" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Action Type</label>
            <select value={actionType} onChange={e => setActionType(e.target.value)} className="w-full p-2.5 border rounded-lg">
              <option>All actions</option>
              <option>CREATE</option>
              <option>UPDATE</option>
              <option>DELETE</option>
              <option>DEACTIVATE</option>
              <option>ACTIVATE</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase">Module</label>
            <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)} className="w-full p-2.5 border rounded-lg">
              <option>All modules</option>
              <option>Inventory</option>
              <option>Procurement</option>
              <option>Finance</option>
              <option>Auth</option>
              <option>User</option>
            </select>
          </div>

        </div>
        <div className="px-6 py-4 border-t bg-slate-50 flex justify-end gap-3">
          <button onClick={resetFilters} className="px-6 py-2 border rounded-lg">Reset</button>
          <button onClick={applyFilters} className="px-6 py-2 bg-blue-700 text-white rounded-lg">Apply Filters</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Database size={18} className="text-slate-500" />
            <h3 className="text-base font-bold text-slate-800">Audit Log Results</h3>
          </div>
          <span className="bg-slate-800 text-white text-xs px-3 py-1 rounded font-bold">
            {filteredLogs.length} Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-xs font-bold border-b">
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Module</th>
                <th className="px-5 py-3.5">Action</th>
                <th className="px-5 py-3.5">Entity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, idx) => (
                <tr key={log.id || idx} className="text-sm hover:bg-slate-50">
                  <td className="px-5 py-4 text-slate-600 font-medium">{formatTimestamp(log.timestamp)}</td>
                  <td className="px-5 py-4">
                    <div className="font-semibold text-slate-800">{log.user || '—'}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{log.userId || '—'}</div>
                  </td>
                  <td className="px-5 py-4">{log.module || '—'}</td>
                  <td className="px-5 py-4 text-slate-700">{log.action || '—'}</td>
                  <td className="px-5 py-4 font-mono text-blue-600">{log.entity || '—'}</td>
                  <td className={`px-5 py-4 ${getStatusStyle(log.status)} uppercase font-semibold text-xs`}>
                    {log.status || 'Normal'}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <button onClick={() => setSelectedLog(log)} className="text-blue-600 hover:text-blue-800">
                      <Eye size={14} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-16 text-center text-slate-500">No matching audit logs found.</div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLog(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <Eye size={20} className="text-blue-600" />
                Audit Log — {selectedLog.entity || '—'}
              </h2>
              <button onClick={() => setSelectedLog(null)}><X size={20} /></button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Timestamp</label>
                  <p className="mt-1 font-medium">{formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">User</label>
                  <p className="mt-1">
                    <span className="font-semibold">{selectedLog.user || '—'}</span>
                    <span className="text-slate-500 text-sm ml-2">({selectedLog.userId || '—'})</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Module</label>
                  <p className="mt-1 font-medium">{selectedLog.module || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Action</label>
                  <p className="mt-1 font-medium">{selectedLog.action || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Entity</label>
                  <p className="mt-1 font-mono text-blue-600">{selectedLog.entity || '—'}</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <p className={`mt-1 font-semibold uppercase ${getStatusStyle(selectedLog.status)}`}>
                    {selectedLog.status || 'Normal'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-slate-50 flex justify-end">
              <button onClick={() => setSelectedLog(null)} className="px-6 py-2.5 bg-slate-700 text-white rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;