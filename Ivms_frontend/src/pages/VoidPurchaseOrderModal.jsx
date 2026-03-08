import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle, Mail, X } from "lucide-react";

export default function VoidPurchaseOrderModal({
  po,
  voidConfirmText,
  setVoidConfirmText,
  onClose,
  onConfirmVoid,
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [notifyVendor, setNotifyVendor] = useState(false);

  if (!po) return null;

  const trimmedNote = note.trim();

  const noteError = useMemo(() => {
    if (!trimmedNote) return "";

    if (trimmedNote.length < 3) {
      return "Please enter a valid short sentence.";
    }

    if (trimmedNote.length > 120) {
      return "Note must be short, about one sentence only.";
    }

    const sentenceCount = trimmedNote
      .split(/[.!?]+/)
      .map((x) => x.trim())
      .filter(Boolean).length;

    if (sentenceCount > 1) {
      return "Please enter only one short sentence.";
    }

    return "";
  }, [trimmedNote]);

  const finalNote = trimmedNote || reason;
  const hasReasonOrNote = finalNote.trim() !== "";
  const isEnabled =
    voidConfirmText === "VOID" && hasReasonOrNote && !noteError;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden border border-red-100">
        <div className="p-5 border-b border-red-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-sm font-black text-red-600 uppercase tracking-tight">
                Void / Cancel Purchase Order
              </h2>
              <p className="text-[10px] text-slate-400 font-bold">
                {po.id} - {po.vendor}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-red-700">
                Critical Action: This cannot be undone
              </p>
              <p className="text-[11px] text-red-600/70 mt-1 leading-relaxed">
                Voiding a PO will clear financial commitments and remove expected
                stock from the Sales Engine.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                1
              </span>
              System Eligibility Check
            </p>
            <div className="space-y-2 ml-7">
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> PO Status: {po.status} (Eligible)
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2 text-[11px] text-emerald-700 font-medium">
                <CheckCircle className="w-3.5 h-3.5" /> Vendor Shipment: Not Shipped (Required)
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                2
              </span>
              Cancellation Reason
              <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[9px] ml-1">
                Required
              </span>
            </p>

            <div className="ml-7 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">
                  Select Reason
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:ring-2 ring-blue-50"
                >
                  <option value="">Choose a reason...</option>
                  <option value="Duplicate entry">Duplicate entry</option>
                  <option value="Ordered in error">Ordered in error</option>
                  <option value="Vendor unavailable">Vendor unavailable</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">
                  Type Custom Reason
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter one short sentence..."
                  className={`w-full border rounded-lg p-3 text-xs min-h-[80px] outline-none focus:ring-2 ring-blue-50 ${
                    noteError ? "border-red-400" : "border-slate-200"
                  }`}
                />
                {noteError && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">
                    {noteError}
                  </p>
                )}
                {!reason && !trimmedNote && (
                  <p className="mt-1 text-[11px] text-red-500 font-medium">
                    Please select a reason or type one short sentence.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px]">
                3
              </span>
              Vendor Notification
            </p>
            <div className="ml-7 flex items-center justify-between p-3 border border-slate-100 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                <Mail className="w-4 h-4 text-blue-500" /> Notify Vendor by Email
              </div>

              <button
                type="button"
                onClick={() => setNotifyVendor((prev) => !prev)}
                className={`w-10 h-5 rounded-full relative transition ${
                  notifyVendor ? "bg-blue-500" : "bg-slate-200"
                }`}
              >
                <div
                  className={`absolute top-1 bg-white w-3 h-3 rounded-full shadow-sm transition-all ${
                    notifyVendor ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-xl space-y-3 mt-4">
            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider text-center">
              Type VOID to confirm
            </p>
            <input
              type="text"
              placeholder="Type VOID here..."
              className="w-full border border-orange-200 rounded-lg p-3 text-center text-sm font-bold uppercase tracking-widest outline-none focus:bg-white transition-all placeholder:text-slate-300"
              value={voidConfirmText}
              onChange={(e) => setVoidConfirmText(e.target.value)}
            />
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-2.5 border border-slate-300 rounded-lg font-bold text-slate-700 bg-white hover:bg-slate-50 transition-all text-sm"
          >
            Cancel
          </button>

          <button
            disabled={!isEnabled}
            onClick={() =>
              onConfirmVoid({
                poId: po.id,
                note: finalNote,
                notifyVendor,
              })
            }
            className={`px-8 py-2.5 rounded-lg font-bold flex items-center gap-2 text-sm transition-all ${
              isEnabled
                ? "bg-slate-700 text-white hover:bg-red-600"
                : "bg-slate-300 text-slate-100 cursor-not-allowed"
            }`}
          >
            <X className="w-4 h-4" /> Confirm Void
          </button>
        </div>
      </div>
    </div>
  );
}