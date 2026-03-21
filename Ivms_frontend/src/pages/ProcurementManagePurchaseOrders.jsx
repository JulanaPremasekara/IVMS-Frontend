import {
  Download,
  Eye,
  FileText,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import PurchaseOrderDetailsModal from "./PurchaseOrderDetailsModal";
import VoidPurchaseOrderModal from "./VoidPurchaseOrderModal";
import { StatusBadge } from "../components/ui/StatusBadge";
import { SearchFilter } from "../components/ui/SearchFilter";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProcurementManagePurchaseOrders = () => {
  const navigate = useNavigate();

  const [poData, setPoData] = useState([]);
  const [poDataLoading, setPoDataLoading] = useState(false);

  // UI state
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [selectedPO, setSelectedPO] = useState(null);

  // "none" | "details" | "void"
  const [modal, setModal] = useState("none");
  const [voidConfirmText, setVoidConfirmText] = useState("");

  //filter logic
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");

  const menuRef = useRef(null);

  const isDetailsOpen = modal === "details";
  const isVoidOpen = modal === "void";

  useEffect(() => {
    loadPoData();
  }, []);

  const loadPoData = async () => {
    setPoDataLoading(true);
    try {
      const res = await axios.get("http://localhost:8081/api/v1/purchaseOrders");
      setPoData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error("Failed to load purchase orders", e);
      setPoData([]);
    } finally {
      setPoDataLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const handleActionClick = (e, id) => {
    e.stopPropagation();
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

  const filteredPoData = poData.filter(po => {
    const matchesStatus = statusFilter === "All Status" || String(po.status || "").toUpperCase() === statusFilter.toUpperCase();
    const matchesSearch = searchTerm === "" || 
      String(po.id).includes(searchTerm) || 
      String(po.vendor).includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  const confirmVoid = async ({ poId, note }) => {
  try {
    await axios.put(
      `http://localhost:8081/api/v1/purchaseOrders/${poId}/void`,
      { note }
    );

    setPoData((prev) =>
      prev.map((x) =>
        x.id === poId
          ? { ...x, status: "VOIDED", voidedAt: new Date(), voidNote: note }
          : x
      )
    );

    closeModal();
  } catch (error) {
    console.error("Failed to void purchase order", error);
    alert("Failed to void purchase order.");
  }
};

  const openEdit = async (po) => {
    setActiveMenuId(null);

    try {
      // fetch full PO details before going to edit page
      const res = await axios.get(
        `http://localhost:8081/api/v1/purchaseOrders/${po.id}`
      );

      navigate("/procurement/create-purchase-order", {
        state: {
          mode: "edit",
          po: res.data,
        },
      });
    } catch (error) {
      console.error("Failed to load PO details for editing", error);

      // fallback: navigate with current row data if detail API fails
      navigate("/procurement/create-purchase-order", {
        state: {
          mode: "edit",
          po,
        },
      });
    }
  };

  const downloadPurchaseOrderPdf = async (po) => {
    try {
      // Adjust endpoint if your backend PDF route is different
      const response = await axios.get(
        `http://localhost:8081/api/v1/purchaseOrders/${po.id}/pdf`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `purchase-order-${po.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
      setActiveMenuId(null);
    } catch (error) {
      console.error("Failed to download PDF", error);
      alert("Failed to download PDF.");
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Filters Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-3">
          <Filter className="w-3.5 h-3.5 text-blue-500" /> Filters & Search
        </div>

        <div className="flex items-end gap-6">
          <SearchFilter  placeholder="Search by PO# or Vendor..." onSearchChange={(value) => setSearchTerm(value)} />

          <div className="flex flex-col gap-1 w-48">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-slate-200 rounded-lg p-2 text-xs text-slate-600 bg-white outline-none"
            >
              <option>All Status</option>
              <option>Draft</option>
              <option>Sent</option>
              <option>Received</option>
              <option>Voided</option>
            </select>
          </div>

          {/* <div className="flex items-center gap-2 pb-2">
            <input
              type="checkbox"
              id="voided"
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-100"
            />
            <label htmlFor="voided" className="text-xs font-medium text-slate-600">
              Include Voided
            </label>
          </div> */}
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
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-xs divide-y divide-slate-50">
              {poDataLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    Loading purchase orders...
                  </td>
                </tr>
              ) : filteredPoData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-slate-500">
                    No purchase orders found.
                  </td>
                </tr>
              ) : (
                filteredPoData.map((po) => {
                  const normalizedStatus = String(po.status || "").toUpperCase();
                  const isDraft = normalizedStatus === "DRAFT";
                  const isSent = normalizedStatus === "SENT";
                  const canVoid = isDraft || isSent;
                  const isMenuOpen = activeMenuId === po.id;

                  return (
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
                        ${Number(po.total || 0).toLocaleString()}
                      </td>

                      <td className="px-6 py-4 text-slate-500">{po.creator}</td>

                      <td className="px-6 py-4 text-right relative">
                        <div
                          className="inline-block relative"
                          ref={isMenuOpen ? menuRef : null}
                        >
                          <button
                            onClick={(e) => handleActionClick(e, po.id)}
                            className={`p-2 rounded-md transition-all ${
                              isMenuOpen
                                ? "bg-slate-100 text-slate-900"
                                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            }`}
                            aria-label="Actions"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="menu"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-lg z-50 py-1 text-left"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => openDetails(po)}
                                className="w-full px-4 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                              >
                                <Eye className="w-4 h-4 text-slate-400" />
                                View Details
                              </button>

                              <button
                                onClick={() => downloadPurchaseOrderPdf(po)}
                                className="w-full px-4 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                              >
                                <Download className="w-4 h-4 text-slate-400" />
                                Download PDF
                              </button>

                              {isDraft && (
                                <button
                                  onClick={() => openEdit(po)}
                                  className="w-full px-4 py-2 text-slate-600 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                >
                                  <Pencil className="w-4 h-4 text-slate-400" />
                                  Edit
                                </button>
                              )}

                              <hr className="my-1 border-slate-50" />

                              {canVoid && (
                                  <>
                                    <hr className="my-1 border-slate-50" />
                                    <button
                                      onClick={() => openVoid(po)}
                                      className="w-full px-4 py-2 text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Void / Cancel
                                    </button>
                                  </>
                                )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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