import React, { useState } from "react";
import { Ban, AlertTriangle, X, History, Package, AlertCircle, Trash2 } from "lucide-react";

const VoidModal = ({ isOpen, onClose, data, isSuperAdminEnabled, onDelete }) => {
  if (!isOpen || !data) return null;

  const isBlockedByStock = data.stock !== "STOCK_OUT";
  const showApprovalWarning = !isBlockedByStock && isSuperAdminEnabled;
  const [reason, setReason] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    const isConfirmed = window.confirm("Are you absolutely sure you want to delete this financial entry? This action cannot be undone.");
    if (!isConfirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`http://localhost:8080/api/ledger/transactions/${data.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        onDelete(data.id);
        onClose();
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // UI for when action is blocked by inventory status
  if (isBlockedByStock) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2 text-red-600 font-bold">
              <X size={20} className="bg-red-100 rounded-full p-0.5" />
              <span className="text-lg">Action Blocked</span>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-6">This entry cannot be deleted at this time</p>
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <Package size={18} /> Linked to Active Stock
              </div>
              <p className="text-sm text-red-600 mb-4">
                Only STOCK_OUT items can be deleted. Please adjust stock levels in Inventory Hub before deleting this financial entry.
              </p>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-xs font-bold text-slate-700 uppercase mb-1">Required Action:</p>
                <p className="text-sm text-red-700">
                  Current Status: {data.stock}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={onClose} className="px-6 py-2 border rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2 text-red-600 font-bold">
            <AlertTriangle size={20} />
            <span className="text-lg">Delete Financial Entry</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500 mb-5">
            Are you sure you want to delete this record? This action will be permanently logged in the audit trail.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Transaction ID</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{data.id}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Amount</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">${data.amt}</div>
            </div>
          </div>

          {/* Audit Trail Box */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3 mb-6">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-sm font-bold text-red-700">Important: Deletion Logging</h4>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                Deleting a financial entry requires an audit reason. This will be recorded for compliance purposes.
              </p>
            </div>
          </div>

          {/* Reason Input */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-slate-700">
                Reason for Deletion <span className="text-red-500">*</span>
              </label>
              <span className={`text-[10px] font-bold ${reason.length >= 10 ? 'text-green-600' : 'text-slate-400'}`}>
                {reason.length}/10 chars min
              </span>
            </div>
            <textarea
              className="w-full h-24 p-3 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
              placeholder="Explain why this entry needs to be deleted (minimum 10 characters)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={reason.length < 10 || isDeleting}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              {isDeleting ? <span className="animate-spin text-sm">...</span> : <Trash2 size={16} />}
              Confirm Deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoidModal;