import React from 'react';
import { 
  Package, Truck, AlertCircle, HardHat, 
  Layers, TrendingUp, Filter, RefreshCw, Download, Search, ExternalLink 
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import SubNavTabs from '../components/ui/SubNavTabs';

const ProcurementShipment = () => {
  const shipments = [
    { id: 'PO-2026-1001', vendor: 'TechSupply Inc.', items: 5, qty: 250, origin: 'China', dest: 'Warehouse A - New York', status: 'In Transit', trackId: 'TRK-894562138', carrier: 'Maersk Line', arrival: 'Feb 25, 2026' },
    { id: 'PO-2026-1045', vendor: 'GlobalParts Corp', items: 3, qty: 150, origin: 'Germany', dest: 'Warehouse B - Los Angeles', status: 'Delayed', trackId: 'TRK-741258963', carrier: 'DHL Express', arrival: 'Feb 23, 2026', alert: '+2d' },
    // Add other rows from your data here...
  ];

  return (
    <div className="space-y-6">
      

      {/* 3. Breadcrumbs (Small detail from image) */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Procurement</span>
        <span>/</span>
        <span className="text-slate-600">Track Shipments</span>
        <span className="ml-2 bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">LIVE</span>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Active" value="5" icon={Package} bgColor="bg-blue-500" colorClass="text-slate-800" />
        <StatCard title="In Transit" value="1" icon={Truck} bgColor="bg-blue-400" colorClass="text-blue-600" />
        <StatCard title="Delayed" value="2" icon={AlertCircle} bgColor="bg-red-500" colorClass="text-red-600" />
        <StatCard title="In Customs" value="1" icon={HardHat} bgColor="bg-orange-500" colorClass="text-orange-600" />
        <StatCard title="Partial" value="1" icon={Layers} bgColor="bg-purple-500" colorClass="text-purple-600" />
        <StatCard title="This Week" value="5" icon={TrendingUp} bgColor="bg-emerald-500" colorClass="text-emerald-600" />
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-50 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Filter className="w-4 h-4 text-blue-500" /> Advanced Filters
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4">
          {['Vendor', 'Status', 'Region', 'Expected From', 'Expected To'].map((label) => (
            <div key={label} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
              <select className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50">
                <option>All {label}s</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Shipment Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" /> Active Shipments (5)
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search PO# or Tracking ID..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs w-64 focus:ring-2 focus:ring-blue-100 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-4 py-3">PO #</th>
                <th className="px-4 py-3">Vendor</th>
                <th className="px-4 py-3 text-center">Items</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3">Origin</th>
                <th className="px-4 py-3">Destination</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tracking ID</th>
                <th className="px-4 py-3">Arrival</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-600 divide-y divide-slate-50">
              {shipments.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-blue-600 underline cursor-pointer">{row.id}</td>
                  <td className="px-4 py-4 font-medium text-slate-800">{row.vendor}</td>
                  <td className="px-4 py-4 text-center">{row.items}</td>
                  <td className="px-4 py-4 text-center">{row.qty}</td>
                  <td className="px-4 py-4">{row.origin}</td>
                  <td className="px-4 py-4">{row.dest}</td>
                  <td className="px-4 py-4"><StatusBadge status={row.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {row.trackId} <ExternalLink className="w-3 h-3 text-slate-300" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {row.arrival}
                      {row.alert && <span className="text-[10px] bg-red-50 text-red-500 px-1 rounded border border-red-100 font-bold">{row.alert}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button className="text-slate-400 hover:text-blue-600 font-bold transition-colors">Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default ProcurementShipment