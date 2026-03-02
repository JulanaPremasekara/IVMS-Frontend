import React, { useState } from 'react';
import { 
  Package, Truck, AlertCircle, HardHat, 
  Layers, TrendingUp, Filter, Search, 
  ExternalLink, X, Clock, CheckCircle2, 
  MapPin, Anchor, ChevronRight 
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { StatusBadge } from '../components/ui/StatusBadge';

const ProcurementShipment = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);

  const shipments = [
    { 
      id: 'PO-2026-1001', vendor: 'TechSupply Inc.', items: 5, qty: 250, 
      origin: 'China', dest: 'Warehouse A - New York', status: 'In Transit', 
      trackId: 'TRK-894562138', carrier: 'Maersk Line', arrival: 'Feb 25, 2026',
      type: 'Sea', lastUpdated: '2026-02-21 08:30 AM'
    },
    { 
      id: 'PO-2026-1045', vendor: 'GlobalParts Corp', items: 3, qty: 150, 
      origin: 'Germany', dest: 'Warehouse B - Los Angeles', status: 'Delayed', 
      trackId: 'TRK-741258963', carrier: 'DHL Express', arrival: 'Feb 23, 2026', alert: '+2d' 
    },
  ];

  return (
    <div className="relative space-y-6 overflow-hidden">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Procurement</span>
        <span>/</span>
        <span className="text-slate-600">Track Shipments</span>
        <span className="ml-2 bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">LIVE</span>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Active" value="5" icon={Package} bgColor="bg-blue-500" />
        <StatCard title="In Transit" value="1" icon={Truck} bgColor="bg-blue-400" />
        <StatCard title="Delayed" value="2" icon={AlertCircle} bgColor="bg-red-500" />
        <StatCard title="In Customs" value="1" icon={HardHat} bgColor="bg-orange-500" />
        <StatCard title="Partial" value="1" icon={Layers} bgColor="bg-purple-500" />
        <StatCard title="This Week" value="5" icon={TrendingUp} bgColor="bg-emerald-500" />
      </div>

      {/* 3. Filters Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-50 pb-3">
          <Filter className="w-4 h-4 text-blue-500" /> Advanced Filters
        </div>
        <div className="grid grid-cols-5 gap-4">
          {['Vendor', 'Status', 'Region', 'Expected From', 'Expected To'].map((label) => (
            <div key={label} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
              <select className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none">
                <option>All {label}s</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Shipment Table */}
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
          <table className="w-full text-left">
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
                    <div className="flex items-center gap-2 font-medium">
                      {row.arrival}
                      {row.alert && <span className="text-[10px] bg-red-50 text-red-500 px-1 rounded border border-red-100 font-bold">{row.alert}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button 
                      onClick={() => setSelectedShipment(row)}
                      className="text-slate-400 hover:text-blue-600 font-bold transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SHIPMENT DETAILS SIDE PANEL (from Image 2) */}
      {selectedShipment && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[100]"
            onClick={() => setSelectedShipment(null)}
          />
          
          {/* Side Panel */}
          <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[110] border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" /> Shipment Details
                </h2>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                  {selectedShipment.id} - {selectedShipment.vendor}
                </p>
              </div>
              <button 
                onClick={() => setSelectedShipment(null)}
                className="p-1.5 hover:bg-white rounded-md border border-transparent hover:border-slate-200 text-slate-400 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-8">
              {/* Shipment Overview Section */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipment Overview</h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">PO Number</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">{selectedShipment.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Vendor</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedShipment.vendor}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Carrier</p>
                    <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-slate-400" /> {selectedShipment.carrier}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tracking Number</p>
                    <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                      {selectedShipment.trackId} <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Shipment Type</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedShipment.type}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                    <div className="mt-1"><StatusBadge status={selectedShipment.status} /></div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Last Updated</p>
                    <p className="text-[11px] font-bold text-blue-700">{selectedShipment.lastUpdated}</p>
                  </div>
                </div>
              </section>

              {/* Live Status Timeline Section */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Status Timeline</h3>
                <div className="space-y-6 relative ml-2">
                  {/* Timeline Line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

                  {/* Timeline Item 1 */}
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">PO Approved</p>
                      <p className="text-[10px] text-slate-400 font-medium">2026-02-01 10:00 AM</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> New York, USA
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 2 */}
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Dispatched</p>
                      <p className="text-[10px] text-slate-400 font-medium">2026-02-05 02:30 PM</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Shanghai, China
                      </p>
                    </div>
                  </div>

                  {/* Timeline Item 3 (Current) */}
                  <div className="flex gap-4 relative">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">In Transit</p>
                      <p className="text-[10px] text-slate-400 font-medium">2026-02-10 08:00 AM</p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Pacific Ocean
                      </p>
                      <p className="text-[10px] text-orange-500 font-bold italic mt-1">
                        Container loaded on vessel
                      </p>
                    </div>
                  </div>

                  {/* Pending Items */}
                  {[
                    { title: 'Customs Clearance', location: 'Los Angeles Port, USA' },
                    { title: 'Arrived at Port', location: 'New York Port, USA' },
                    { title: 'Out for Delivery', location: 'New York, USA' },
                    { title: 'Delivered', location: 'Warehouse A' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4 relative opacity-50">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center z-10">
                        <div className="w-2 h-2 rounded-full bg-slate-200" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400">{item.title}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {item.location}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Items Breakdown Footer (Sticky-like) */}
              <section className="pt-6 border-t border-slate-100">
                <button className="w-full flex items-center justify-between group">
                  <span className="text-sm font-bold text-slate-800">Items Breakdown</span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </button>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProcurementShipment;