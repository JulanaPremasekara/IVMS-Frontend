import React, { useState } from "react";
import { Ban, AlertTriangle, X, History, Package, AlertCircle } from "lucide-react";

const VoidModal = ({ isOpen, onClose, data, isSuperAdminEnabled }) => {
  if (!isOpen || !data) return null;

  const isBlockedByStock = data.stock === "In Inventory";
  const showApprovalWarning = !isBlockedByStock && isSuperAdminEnabled;
  const [reason, setReason] = useState("");

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
            <p className="text-sm text-slate-600 mb-6">This entry cannot be voided at this time</p>
            <div className="bg-red-50 border border-red-100 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 font-bold mb-2">
                <Package size={18} /> Linked to Active Stock
              </div>
              <p className="text-sm text-red-600 mb-4">
                Cannot delete invoice while associated stock is still in inventory.
              </p>
              <div className="bg-white p-3 rounded border border-red-200">
                <p className="text-xs font-bold text-slate-700 uppercase mb-1">Required Action:</p>
                <p className="text-sm text-red-700">
                  Please adjust stock levels in Inventory Hub before voiding this financial entry.
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
            <span className="text-lg">Void Financial Entry</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-slate-500 mb-5">
            This action will be permanently logged in the audit trail
          </p>

          {/* Info Cards - Corrected Typography */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Transaction ID</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{data.id}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Amount</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{data.amt}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Linked Stock</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{data.stock}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="text-[10px] text-slate-500 uppercase font-bold">Fiscal Period</div>
              <div className="text-sm font-semibold text-slate-900 mt-1">{data.fiscal}</div>
            </div>
          </div>

          {/* Audit Trail Box */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex gap-3 mb-6">
            <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h4 className="text-sm font-bold text-red-700">Important: Audit Trail</h4>
              <p className="text-xs text-red-600 mt-1 leading-relaxed">
                This action will be logged in the Audit Trail with your user ID, timestamp, IP address, and the reason you provide. This record cannot be permanently deleted.
              </p>
            </div>
          </div>


          {/* Reason Input */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Reason for Deletion <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full h-24 p-3 text-sm border border-red-300 rounded-lg focus:ring-2 focus:ring-red-100 focus:border-red-400 outline-none transition"
              placeholder="Explain why this entry needs to be voided (minimum 10 characters)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          
            {/* Conditional Message (Only displays when toggle is enabled) */}
            {isSuperAdminEnabled && (
              <div className="p-3 bg-white border border-orange-100 rounded-lg flex gap-3 items-center">
                <History size={16} className="text-orange-500 flex-shrink-0" />
                <p className="text-xs text-orange-800 font-medium">
                  This entry will be marked as <b>Pending Approval</b> until reviewed by Super Admin.
                </p>
              </div>
            )}
        

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              disabled={reason.length < 10}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
            >
              <Ban size={16} />
              Confirm Void
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoidModal;