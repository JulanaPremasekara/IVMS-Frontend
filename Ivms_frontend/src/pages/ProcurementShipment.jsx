import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Package,
  Truck,
  AlertCircle,
  HardHat,
  Layers,
  TrendingUp,
  Filter,
  Search,
  ExternalLink,
  X,
  Clock,
  CheckCircle2,
  MapPin,
  Anchor,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "../components/ui/StatCard";
import { StatusBadge } from "../components/ui/StatusBadge";

const API_BASE = "http://localhost:8081";

// Frontend timeline steps (rendered as completed/pending based on backend events)
const TIMELINE_STEPS = [
  { key: "APPROVED", label: "PO Approved" },
  { key: "DISPATCHED", label: "Dispatched" },
  { key: "IN_TRANSIT", label: "In Transit" },
  { key: "CUSTOMS_CLEARANCE", label: "Customs Clearance" },
  { key: "ARRIVED_AT_PORT", label: "Arrived at Port" },
  { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

const ProcurementShipment = () => {
  const [selectedShipment, setSelectedShipment] = useState(null);

  // ✅ data comes from backend (ShipmentListRowDto)
  const [shipments, setShipments] = useState([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);

  // ✅ timeline events from backend (TimelineEventDto)
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);

  const [search, setSearch] = useState("");

  const fetchShipments = async () => {
    setShipmentsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/shipments`);
      // Expected: ShipmentListRowDto[]
      setShipments(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load shipments", e);
      setShipments([]);
    } finally {
      setShipmentsLoading(false);
    }
  };

  const fetchTimeline = async (trackingId) => {
    if (!trackingId) return;
    setTimelineLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE}/api/v1/shipments/${encodeURIComponent(trackingId)}/timeline`
      );
      // Expected: TimelineEventDto[]
      setTimelineEvents(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load timeline", e);
      setTimelineEvents([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchShipments();
  }, []);

  // When open details panel, load timeline
  useEffect(() => {
    if (selectedShipment?.trackingId) {
      fetchTimeline(selectedShipment.trackingId);
    } else {
      setTimelineEvents([]);
    }
  }, [selectedShipment?.trackingId]);

  // ✅ SSE realtime updates (refresh list and timeline when relevant)
  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/v1/realtime/stream`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // You can refine these types to match what your backend emits
        if (data.type === "SHIPMENT_CREATED" || data.type === "SHIPMENT_STATUS_UPDATED") {
          fetchShipments();
          if (
            selectedShipment?.trackingId &&
            (data.trackingId === selectedShipment.trackingId || data.key === selectedShipment.trackingId)
          ) {
            fetchTimeline(selectedShipment.trackingId);
          }
        }

        if (data.type === "SHIPMENT_TIMELINE_EVENT") {
          // { type, trackingId } (recommended)
          if (selectedShipment?.trackingId && data.trackingId === selectedShipment.trackingId) {
            fetchTimeline(selectedShipment.trackingId);
            fetchShipments();
          }
        }

        if (data.type === "PO_APPROVED") {
          // PO status changed could affect shipment availability in list
          fetchShipments();
        }
      } catch (e) {
        // ignore non-json
      }
    };

    es.onerror = () => {
      // Browser will auto-reconnect; no action needed
    };

    return () => es.close();
  }, [selectedShipment?.trackingId]);

  // Search filter (PO# or Tracking ID)
  const filteredShipments = useMemo(() => {
    const q = (search || "").trim().toLowerCase();
    if (!q) return shipments;

    return shipments.filter((s) => {
      const po = (s.poNumber || "").toLowerCase();
      const tr = (s.trackingId || "").toLowerCase();
      return po.includes(q) || tr.includes(q);
    });
  }, [shipments, search]);

  // Stats from live data
  const stats = useMemo(() => {
    const total = shipments.length;
    const statusCounts = shipments.reduce((acc, s) => {
      const k = (s.status || "").toUpperCase();
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      inTransit: statusCounts["IN_TRANSIT"] || 0,
      delayed: statusCounts["DELAYED"] || 0,
      inCustoms: statusCounts["CUSTOMS_CLEARANCE"] || statusCounts["IN_CUSTOMS"] || 0,
      partial: statusCounts["PARTIAL"] || 0,
      thisWeek: total, // keep as-is unless you add arrival-date logic
    };
  }, [shipments]);

  // Merge backend events into step list (done/pending + show time/location/note for done steps)
  const mergedTimeline = useMemo(() => {
    const eventByStatus = new Map(
      (timelineEvents || []).map((e) => [String(e.status || "").toUpperCase(), e])
    );

    return TIMELINE_STEPS.map((step) => {
      const evt = eventByStatus.get(step.key);
      return {
        ...step,
        done: !!evt,
        time: evt?.time ?? null,
        location: evt?.location ?? null,
        note: evt?.note ?? null,
      };
    });
  }, [timelineEvents]);

  const openDetails = (row) => {
    setSelectedShipment(row);
  };

  return (
    <div className="relative space-y-6 overflow-hidden">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Procurement</span>
        <span>/</span>
        <span className="text-slate-600">Track Shipments</span>
        <span className="ml-2 bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">
          LIVE
        </span>
      </div>

      {/* 2. Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Active" value={String(stats.total)} icon={Package} bgColor="bg-blue-500" />
        <StatCard title="In Transit" value={String(stats.inTransit)} icon={Truck} bgColor="bg-blue-400" />
        <StatCard title="Delayed" value={String(stats.delayed)} icon={AlertCircle} bgColor="bg-red-500" />
        <StatCard title="In Customs" value={String(stats.inCustoms)} icon={HardHat} bgColor="bg-orange-500" />
        <StatCard title="Partial" value={String(stats.partial)} icon={Layers} bgColor="bg-purple-500" />
        <StatCard title="This Week" value={String(stats.thisWeek)} icon={TrendingUp} bgColor="bg-emerald-500" />
      </div>

      {/* 3. Filters Section */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-50 pb-3">
          <Filter className="w-4 h-4 text-blue-500" /> Advanced Filters
        </div>
        <div className="grid grid-cols-5 gap-4">
          {["Vendor", "Status", "Region", "Expected From", "Expected To"].map((label) => (
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
            <Package className="w-4 h-4 text-blue-500" /> Active Shipments ({shipmentsLoading ? "..." : filteredShipments.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PO# or Tracking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              {filteredShipments.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-4 font-bold text-blue-600 underline cursor-pointer">
                    {row.poNumber}
                  </td>
                  <td className="px-4 py-4 font-medium text-slate-800">{row.vendor}</td>
                  <td className="px-4 py-4 text-center">{row.items.length}</td>
                  <td className="px-4 py-4 text-center">{row.qty}</td>
                  <td className="px-4 py-4">{row.origin}</td>
                  <td className="px-4 py-4">{row.destination}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      {row.trackingId} <ExternalLink className="w-3 h-3 text-slate-300" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 font-medium">
                      {row.arrival || "-"}
                      {row.delayDays != null && row.delayDays > 0 && (
                        <span className="text-[10px] bg-red-50 text-red-500 px-1 rounded border border-red-100 font-bold">
                          +{row.delayDays}d
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => openDetails(row)}
                      className="text-slate-400 hover:text-blue-600 font-bold transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}

              {!shipmentsLoading && filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-slate-400 text-xs">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SHIPMENT DETAILS SIDE PANEL */}
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
                  {selectedShipment.poNumber} - {selectedShipment.vendor}
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
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Shipment Overview
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">PO Number</p>
                    <p className="text-xs font-bold text-blue-600 mt-1">{selectedShipment.poNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Vendor</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{selectedShipment.vendor}</p>
                  </div>

                  {/* Carrier not provided by backend DTO; keep placeholder */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Carrier</p>
                    <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-slate-400" /> {"-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tracking Number</p>
                    <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                      {selectedShipment.trackingId} <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>

                  {/* Type not provided by backend DTO; keep placeholder */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Shipment Type</p>
                    <p className="text-xs font-bold text-slate-800 mt-1">{"-"}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={selectedShipment.status} />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
                      Timeline
                    </p>
                    <p className="text-[11px] font-bold text-blue-700">
                      {timelineLoading ? "Loading..." : `${timelineEvents.length} events`}
                    </p>
                  </div>
                </div>
              </section>

              {/* Live Status Timeline Section */}
              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Status Timeline
                </h3>

                <div className="space-y-6 relative ml-2">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

                  {mergedTimeline.map((item) => (
                    <div
                      key={item.key}
                      className={`flex gap-4 relative ${item.done ? "" : "opacity-50"}`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border
                          ${item.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-200"}
                        `}
                      >
                        {item.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <p className={`text-xs font-bold ${item.done ? "text-slate-800" : "text-slate-400"}`}>
                          {item.label}
                        </p>

                        {item.time && (
                          <p className="text-[10px] text-slate-400 font-medium">{item.time}</p>
                        )}

                        {item.location && (
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {item.location}
                          </p>
                        )}

                        {item.note && (
                          <p className="text-[10px] text-orange-500 font-bold italic mt-1">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {!timelineLoading && mergedTimeline.every((x) => !x.done) && (
                    <div className="text-[10px] text-slate-400 pl-8">
                      No timeline events yet.
                    </div>
                  )}
                </div>
              </section>

              {/* Items Breakdown Footer (Sticky-like) */}
              <section className="pt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Items Breakdown</span>
                </div>

                {timelineEvents.length > 0 && (
                  <div className="space-y-2">
                    {timelineEvents[0].items?.map((item, index) => (
                      <div
                        key={index}
                        className="text-xs bg-slate-50 border border-slate-100 rounded-md px-3 py-2"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProcurementShipment;