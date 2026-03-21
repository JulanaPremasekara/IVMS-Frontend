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
  const [shipments, setShipments] = useState([]);
  const [shipmentsLoading, setShipmentsLoading] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [expectedFrom, setExpectedFrom] = useState("");
  const [expectedTo, setExpectedTo] = useState("");

  const fetchShipments = async () => {
    setShipmentsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/v1/shipments`);
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
      setTimelineEvents(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load timeline", e);
      setTimelineEvents([]);
    } finally {
      setTimelineLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  useEffect(() => {
    if (selectedShipment?.trackingId) {
      fetchTimeline(selectedShipment.trackingId);
    } else {
      setTimelineEvents([]);
    }
  }, [selectedShipment?.trackingId]);

  useEffect(() => {
    const es = new EventSource(`${API_BASE}/api/v1/realtime/stream`);

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "SHIPMENT_CREATED" || data.type === "SHIPMENT_STATUS_UPDATED") {
          fetchShipments();
          if (
            selectedShipment?.trackingId &&
            (data.trackingId === selectedShipment.trackingId ||
              data.key === selectedShipment.trackingId)
          ) {
            fetchTimeline(selectedShipment.trackingId);
          }
        }

        if (data.type === "SHIPMENT_TIMELINE_EVENT") {
          if (selectedShipment?.trackingId && data.trackingId === selectedShipment.trackingId) {
            fetchTimeline(selectedShipment.trackingId);
            fetchShipments();
          }
        }

        if (data.type === "PO_APPROVED") {
          fetchShipments();
        }
      } catch (e) {}
    };

    es.onerror = () => {};

    return () => es.close();
  }, [selectedShipment?.trackingId]);

  const filteredShipments = useMemo(() => {
    const q = (search || "").trim().toLowerCase();

    return shipments.filter((s) => {
      const po = (s.poNumber || "").toLowerCase();
      const tr = (s.trackingId || "").toLowerCase();
      const matchesSearch = !q || po.includes(q) || tr.includes(q);

      const arrivalDate = s.arrival ? new Date(s.arrival) : null;
      const fromDate = expectedFrom ? new Date(expectedFrom) : null;
      const toDate = expectedTo ? new Date(expectedTo) : null;
      const matchesFrom = !fromDate || (arrivalDate && arrivalDate >= fromDate);
      const matchesTo = !toDate || (arrivalDate && arrivalDate <= toDate);

      return matchesSearch && matchesFrom && matchesTo ;
    });
  }, [shipments, search, expectedFrom, expectedTo]);

  const stats = useMemo(() => {
  const total = shipments.length;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = today.getDay(); // Sunday = 0, Monday = 1
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() + diffToMonday);
  weekStart.setHours(0, 0, 0, 0);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const stats = shipments.reduce((acc, s) => {
    const k = (s.status || "").toUpperCase();
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const delayed = shipments.filter((s) => {
    const status = (s.status || "").toUpperCase();

    if (status === "DELIVERED") return false;
    if (!s.arrival) return false;

    const expectedDate = new Date(s.arrival);
    if (isNaN(expectedDate.getTime())) return false;

    expectedDate.setHours(0, 0, 0, 0);

    return expectedDate < today;
  }).length;

  const thisWeek = shipments.filter((s) => {
    if (!s.arrival) return false;

    const arrivalDate = new Date(s.arrival);
    if (isNaN(arrivalDate.getTime())) return false;

    return arrivalDate >= weekStart && arrivalDate <= weekEnd;
  }).length;

  return {
    total,
    inTransit: stats["IN_TRANSIT"] || 0,
    delayed,
    inCustoms: stats["CUSTOMS_CLEARANCE"] || stats["IN_CUSTOMS"] || 0,
    thisWeek,
  };
}, [shipments]);

    

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
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <span>Procurement</span>
        <span>/</span>
        <span className="text-slate-600">Track Shipments</span>
        <span className="ml-2 bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md text-[8px] animate-pulse">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard title="Total Active" value={String(stats.total)} icon={Package} bgColor="bg-blue-500" />
        <StatCard title="In Transit" value={String(stats.inTransit)} icon={Truck} bgColor="bg-blue-400" />
        <StatCard title="Delayed" value={String(stats.delayed)} icon={AlertCircle} bgColor="bg-red-500" />
        <StatCard title="In Customs" value={String(stats.inCustoms)} icon={HardHat} bgColor="bg-orange-500" />
        <StatCard title="This Week" value={String(stats.thisWeek)} icon={TrendingUp} bgColor="bg-emerald-500" />
      </div>

      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm border-b border-slate-50 pb-3">
          <Filter className="w-4 h-4 text-blue-500" /> Advanced Filters
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Vendor</label>
            <select className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none">
              <option>All Vendors</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
            <select className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none">
              <option>All Statuses</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Region</label>
            <select className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none">
              <option>All Regions</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Expected From</label>
            <input
              type="date"
              value={expectedFrom}
              onChange={(e) => setExpectedFrom(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Expected To</label>
            <input
              type="date"
              value={expectedTo}
              onChange={(e) => setExpectedTo(e.target.value)}
              className="w-full border border-slate-200 rounded-md p-2 text-xs text-slate-600 bg-slate-50/50 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-50">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-500" /> Active Shipments (
            {shipmentsLoading ? "..." : filteredShipments.length})
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

      {selectedShipment && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[100]"
            onClick={() => setSelectedShipment(null)}
          />

          <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl z-[110] border-l border-slate-100 flex flex-col animate-in slide-in-from-right duration-300">
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

                  

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Tracking Number</p>
                    <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                      {selectedShipment.trackingId} <ExternalLink className="w-3 h-3" />
                    </p>
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

              <section className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Live Status Timeline
                </h3>

                <div className="space-y-6 relative ml-2">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100" />

                  {mergedTimeline.map((item) => (
                    <div key={item.key} className={`flex gap-4 relative ${item.done ? "" : "opacity-50"}`}>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center z-10 border ${
                          item.done ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-200"
                        }`}
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
                    <div className="text-[10px] text-slate-400 pl-8">No timeline events yet.</div>
                  )}
                </div>
              </section>

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