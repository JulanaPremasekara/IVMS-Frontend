import React, { useEffect, useMemo, useState } from 'react';
import {
  FileText, Package, Database, DollarSign,
  CheckCircle, X, Save, Info
} from 'lucide-react';
import { VerificationInput } from '../components/ui/VerificationInput';
import { ImpactCard } from '../components/ui/ImpactCard';
import axios from 'axios';


export const savePartialReceipt = async(payload) => {
    try{
      const response = await axios.post("http://localhost:8081/api/v1/purchaseOrders/partialReceipt", payload);
      return response.data;
    } catch (error) {
      console.error("Error saving partial receipt:", error);
      throw error;
    }
  };
const ReceiveGoodsVerification = ({ po, items }) => {
  const [rows, setRows] = useState([]);

 const handleSavePartial = async () => {
  try {
    const payload = {
      orderId: po.poNumber,
      shipmentId: po.trackingNumber,
      vendor: po.vendor,
      orderStatus: "Received",
      shipmentStatus: "Delivered",
      totalReceived,
      totalDamaged,
      items: rows.map((item) => {
        const orderedQty = Number(item.ordered || 0);
        const receivedQty = Number(item.receivedQty || 0);
        const damagedQty = Number(item.damaged || 0);
        const remainingQty = Math.max(
          0,
          orderedQty - receivedQty - damagedQty
        );

        return {
          itemId: item.id,
          itemName: item.name,
          orderedQty,
          receivedQty,
          damagedQty,
          remainingQty,
          newOrderQty: remainingQty + damagedQty,
        };
      }),
    };

    const result = await savePartialReceipt(payload);
    console.log("Partial receipt saved:", result);
  } catch (error) {
    console.error("Error saving partial receipt:", error);
  }
};

  useEffect(() => {
    const formattedItems = (items || []).map((item) => ({
      ...item,
      receivedQty: item.receivedQty ?? "",
      damaged: item.damaged ?? "",
    }));
    setRows(formattedItems);
  }, [items]);

  const handleFieldChange = (index, field, value) => {
  setRows((prev) =>
    prev.map((item, i) => {
      if (i !== index) return item;

      // allow empty input when user presses backspace
      if (value === "") {
        return { ...item, [field]: "" };
      }

      const numberValue = Number(value);

      const maxAllowed = item.ordered || 0;

      const validatedValue = Math.min(
        Math.max(0, numberValue), // prevent negative
        maxAllowed                // prevent exceeding ordered
      );

      return { ...item, [field]: validatedValue };
    })
  );
};

  const totalQuantity = useMemo(
    () => rows.reduce((total, item) => total + (item.ordered || 0), 0),
    [rows]
  );

  const totalReceived = useMemo(
    () => rows.reduce((total, item) => total + (item.receivedQty || 0), 0),
    [rows]
  );

  const totalDamaged = useMemo(
    () => rows.reduce((total, item) => total + Number(item.damaged || 0), 0),
    [rows]
  );

  const itemsUpdated = useMemo(
    () => rows.filter((item) => (item.receivedQty || 0) > 0 || (item.damaged || 0) > 0).length,
    [rows]
  );

  const hasdamaged = totalDamaged > 0;

  return (
    <div className="space-y-6 pb-24 mx-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Receive Goods (GRN)</h1>
          <p className="text-sm text-slate-500 font-medium">Verify physical delivery and update inventory</p>
        </div>
        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded text-[10px] font-bold border border-blue-100 uppercase">
          Sent
        </span>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Purchase Order Summary
                </h2>
              </div>
              <button className="text-[10px] font-bold text-blue-600 border border-blue-200 px-3 py-1 rounded-md hover:bg-blue-50">
                ✕ Change PO
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">PO Number</p>
                <p className="text-sm font-black text-blue-600">{po.poNumber}</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Vendor</p>
                <p className="text-sm font-bold text-slate-700">{po.vendor}</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Shipment Reference</p>
                <p className="text-sm font-bold text-slate-700">{po.trackingNumber}</p>
              </div>
              <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Expected Delivery</p>
                <p className="text-sm font-bold text-slate-700">{po.dueDate}</p>
              </div>
              <div className="col-span-2 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Warehouse Location</p>
                <p className="text-sm font-bold text-slate-800">Warehouse A - New York</p>
              </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
              <div className="p-4 bg-blue-50/30">
                <p className="text-[10px] font-bold text-blue-400 uppercase">Total Items</p>
                <p className="text-xl font-black text-blue-600">{rows.length}</p>
              </div>
              <div className="p-4 bg-emerald-50/30">
                <p className="text-[10px] font-bold text-emerald-400 uppercase">Total Quantity</p>
                <p className="text-xl font-black text-emerald-600">{totalQuantity}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#1e3a8a]" />
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-widest">
                  Items Verification
                </h2>
              </div>
              {/* <button className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> Receive All Remaining
              </button> */}
            </div>

            <div className="overflow-x-auto border border-slate-100 rounded-xl bg-white">
              <table className="w-full min-w-[1100px] text-sm text-left table-fixed">
                <thead className="text-slate-400 text-[11px] uppercase font-bold border-b border-slate-50 bg-slate-50/30">
                  <tr>
                    <th className="w-[28%] px-4 py-4">Item Name</th>
                    <th className="w-[10%] px-2 py-4">SKU</th>
                    <th className="w-[8%] px-2 py-4 text-center">Ordered</th>
                    <th className="w-[10%] px-2 py-4 text-center">Prev. Rec.</th>
                    <th className="w-[10%] px-2 py-4 text-center">Remaining</th>
                    <th className="w-[12%] px-2 py-4 text-center">Received Qty</th>
                    <th className="w-[12%] px-2 py-4 text-center">Damaged</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {rows.map((item, i) => (
                    <tr key={item.id ?? i} className="group hover:bg-slate-50/40 transition-colors">
                      <td className="px-4 py-4 font-bold text-slate-800 truncate">{item.name}</td>
                      <td className="px-2 py-4 text-slate-400 font-mono text-xs">{item.sku}</td>
                      <td className="px-2 py-4 text-center font-medium">{item.ordered}</td>
                      <td className="px-2 py-4 text-center font-medium text-slate-400">0</td>
                      <td className="px-2 py-4 text-center font-bold text-blue-600">{Math.max(0, item.ordered - item.receivedQty - item.damaged)}</td>

                      <td className="px-2 py-4">
                        <div className="flex justify-center">
                          <VerificationInput
                            label=""
                            value={item.receivedQty}
                            onChange={(e) => handleFieldChange(i, 'receivedQty', e.target.value)}
                            placeholder="0"
                            className="w-20"
                          />
                        </div>
                      </td>

                      <td className="px-2 py-4">
                        <div className="flex justify-center">
                          <VerificationInput
                            label=""
                            color="red"
                            value={item.damaged}
                            onChange={(e) => handleFieldChange(i, 'damaged', e.target.value)}
                            placeholder="0"
                            className="w-20"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <ImpactCard title="Inventory Impact Preview" icon={Database}>
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <Package className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-xs font-medium italic">Enter received quantities to see impact</p>
            </div>
          </ImpactCard>

          <ImpactCard
            title="Financial Impact"
            icon={DollarSign}
            statusBadge={
              <span className="bg-orange-50 text-orange-600 text-[9px] font-black px-2 py-0.5 rounded border border-orange-100 uppercase">
                Pending Creation
              </span>
            }
          >
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center text-slate-500">
                <span>Bill to Pay Amount:</span>
                <span className="font-black text-slate-800 text-base">$0.00</span>
              </div>
              <div className="flex justify-between items-center text-slate-500">
                <span>Invoice Expected:</span>
                <span className="bg-blue-50 text-blue-600 text-[9px] px-2 py-0.5 rounded font-bold uppercase">Pending</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 pb-4 border-b border-slate-50">
                <span>Payment Terms:</span>
                <span className="font-bold text-slate-700">Net 30</span>
              </div>
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                <p className="text-[10px] font-bold text-blue-700 leading-tight">
                  Bill to Pay will be auto-created upon confirmation
                </p>
              </div>
            </div>
          </ImpactCard>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Receipt Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-slate-500">Total Received:</span>
                <span className="font-black text-emerald-600 text-lg">{totalReceived} units</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-xs font-medium text-slate-500">Total Damaged:</span>
                <span className="font-black text-red-600 text-lg">{totalDamaged} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-slate-500">Items Updated:</span>
                <span className="font-black text-slate-800">{itemsUpdated} / {rows.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-100 p-4 flex items-center justify-between z-50 px-8 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex gap-8 text-[11px] font-black uppercase tracking-tight">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Received:</span>
            <span className="text-emerald-600 text-sm">{totalReceived}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Damaged:</span>
            <span className="text-red-600 text-sm">{totalDamaged}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-2 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg hover:bg-slate-50 transition-all">
            <X className="w-4 h-4 text-slate-400" /> Cancel
          </button>
          <button onClick={handleSavePartial} className="flex items-center gap-2 px-6 py-2 border border-[#1e3a8a] text-[#1e3a8a] font-bold text-xs rounded-lg hover:bg-blue-50 transition-all">
            <Save className="w-4 h-4" /> Save as Partial
          </button>
          <button
              disabled={hasdamaged}
              className="flex items-center gap-2 px-8 py-2
              bg-emerald-600 text-white font-bold text-xs rounded-lg
              shadow-lg shadow-emerald-100 transition-all
              hover:bg-emerald-700
              disabled:bg-gray-400
              disabled:text-gray-200
              disabled:cursor-not-allowed
              disabled:shadow-none
              disabled:hover:bg-gray-400"
            >
              <CheckCircle className="w-4 h-4" /> Mark as Received
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiveGoodsVerification;