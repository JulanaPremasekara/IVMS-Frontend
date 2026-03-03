import { Copy, Download, Eye, FileText, Filter, MoreVertical, Trash2 } from "lucide-react";
import PurchaseOrderDetailsModal from "./PurchaseOrderDetailsModal";
import VoidPurchaseOrderModal from "./VoidPurchaseOrderModal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SearchFilter } from '../components/ui/SearchFilter';
import { useState } from "react";

const ProcurementManagePurchaseOrders = () => {
  const [poData, setPoData] = useState([
    {
      id: "PO-2026-1001",
      vendor: "TechSupply Inc.",
      status: "Sent",
      date: "Feb 01, 2026",
      delivery: "Feb 25, 2026",
      total: 38250,
      creator: "John Smith",
      items: [
        "Premium Wireless Headphones",
        "Smart Watch Series 5",
        "Bluetooth Speaker",
      ],
    },
    {
      id: "PO-2026-1002",
      vendor: "GlobalParts Corp",
      status: "Draft",
      date: "Feb 20, 2026",
      delivery: "Mar 05, 2026",
      total: 12450,
      creator: "Sarah Johnson",
      items: ["Bulk Sensors"],
    },
    {
      id: "PO-2026-1003",
      vendor: "TechSupply Inc.",
      status: "Draft",
      date: "Feb 21, 2026",
      delivery: "Mar 10, 2026",
      total: 38250,
      creator: "John Smith",
      flag: "Duplicate",
      items: [],
    },
    {
      id: "PO-2026-1004",
      vendor: "ElectroWholesale Ltd",
      status: "Received",
      date: "Jan 15, 2026",
      delivery: "Feb 10, 2026",
      total: 54800,
      creator: "Mike Davis",
      items: [],
    },
  ]);

  // UI state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  // conditional-render “mode”
  // "none" | "details" | "void"
  const [modal, setModal] = useState("none");

  const [voidConfirmText, setVoidConfirmText] = useState("");

  const isDetailsOpen = modal === "details";
  const isVoidOpen = modal === "void";

  const handleActionClick = (id) => {
    setActiveMenuId((prev) => (prev === id ? null : id));
  };

  const openDetails = (po) => {
    setSelectedPO(po);
    setModal("details");
    setActiveMenuId(null);
  };

  const openVoid = (po) => {
    setSelectedPO(po);
    setVoidConfirmText("");
    setModal("void");
    setActiveMenuId(null);
  };

  const closeModal = () => {
    setModal("none");
    setSelectedPO(null);
    setVoidConfirmText("");
  };

  const confirmVoid = (po) => {
    // Example: update status locally (you can replace with API call)
    setPoData((prev) =>
      prev.map((x) =>
        x.id === po.id ? { ...x, status: "Voided", voidedAt: new Date() } : x
      )
    );
    closeModal();
  };

  return (
    <div className="space-y-6 relative">
      {/* Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
          <Filter className="w-3.5 h-3.5 text-blue-500" /> Filters & Search
        </div>

        <div className="flex items-end gap-6">
          <SearchFilter placeholder="Search by PO# or Vendor..." />

          <div className="flex flex-col gap-1 w-48">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Status
            </label>
            <select className="border border-slate-200 rounded-lg p-2 text-xs text-slate-600 bg-white outline-none">
              <option>All Status</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Received</option>
              <option>Voided</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="voided"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
            />
            <label htmlFor="voided" className="text-xs font-medium text-slate-600">
              Include Voided
            </label>
          </div>
        </div>
      </div>

      {/* Management Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-visible">
        <div className="p-4 bg-slate-50/30 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
            Purchase Orders ({poData.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold">
              <tr>
                <th className="px-6 py-3">PO Number</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Created Date</th>
                <th className="px-6 py-3">Expected Delivery</th>
                <th className="px-6 py-3">Total Amount</th>
                <th className="px-6 py-3">Created By</th>
                <th className="px-6 py-3">Flags</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-xs divide-y divide-slate-50">
              {poData.map((po) => (
                <tr
                  key={po.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td
                    className="px-6 py-4 font-bold text-blue-600 hover:underline cursor-pointer"
                    onClick={() => openDetails(po)}
                  >
                    {po.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {po.vendor}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={po.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-500">{po.date}</td>
                  <td className="px-6 py-4 text-slate-500">{po.delivery}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    ${po.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{po.creator}</td>
                  <td className="px-6 py-4">
                    {po.flag && (
                      <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded text-[9px] font-bold border border-orange-100 flex items-center gap-1 w-fit">
                        <Copy className="w-2.5 h-2.5" /> {po.flag}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right relative">
                    <button
                      onClick={() => handleActionClick(po.id)}
                      className={`p-1 rounded transition-all ${
                        activeMenuId === po.id
                          ? "bg-slate-100 text-slate-900"
                          : "text-slate-400 group-hover:text-slate-600"
                      }`}
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === po.id && (
                      <div className="absolute right-6 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-lg z-50 py-1 text-left">
                        <button
                          onClick={() => openDetails(po)}
                          className="w-full px-4 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                        >
                          <Eye className="w-4 h-4 text-slate-400" /> View Details
                        </button>

                        <button className="w-full px-4 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors">
                          <Download className="w-4 h-4 text-slate-400" /> Download
                          PDF
                        </button>

                        <hr className="my-1 border-slate-50" />

                        <button
                          onClick={() => openVoid(po)}
                          className="w-full px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" /> Void / Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Conditional Rendering as Components */}
      {isDetailsOpen && (
        <PurchaseOrderDetailsModal
          po={selectedPO}
          onClose={closeModal}
          onVoid={openVoid}
        />
      )}

      {isVoidOpen && (
        <VoidPurchaseOrderModal
          po={selectedPO}
          voidConfirmText={voidConfirmText}
          setVoidConfirmText={setVoidConfirmText}
          onClose={closeModal}
          onConfirmVoid={confirmVoid}
        />
      )}
    </div>
  );
};

export default ProcurementManagePurchaseOrders;