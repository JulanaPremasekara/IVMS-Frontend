import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  ShoppingCart,
  Plus,
  Info,
  Trash2,
  DollarSign,
  Save,
  CheckCircle,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";

// ---- Reusable Section Card ----
const FormSection = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
    <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-900 rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      </div>
      {action}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const emptyItem = (id = 1) => ({
  id,
  inventoryItemId: "",
  name: "",
  sku: "",
  stock: 0,
  safety: 0,
  ai: 0,
  qty: 1,
  price: 0,
});

const ProcurementCreatePurchaseOrder_Simple = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editMode = location.state?.mode === "edit";
  const passedPO = location.state?.po || null;

  const [loading, setLoading] = useState(false);
  const [poDetailsLoading, setPoDetailsLoading] = useState(false);

  const [vendors, setVendors] = useState([]);
  const [vendorsLoading, setVendorsLoading] = useState(false);

  const [selectedVendorId, setSelectedVendorId] = useState("");
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(false);

  const [items, setItems] = useState([emptyItem(1)]);
  const [errors, setErrors] = useState([]);

  const [editPO, setEditPO] = useState(passedPO);

  useEffect(() => {
    const loadVendors = async () => {
      setVendorsLoading(true);
      try {
        const res = await axios.get("http://localhost:8081/api/vendors");
        setVendors(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load vendors", e);
        setVendors([]);
      } finally {
        setVendorsLoading(false);
      }
    };

    loadVendors();
  }, []);

  useEffect(() => {
    const loadInventory = async () => {
      setInventoryLoading(true);
      try {
        const res = await axios.get("http://localhost:8081/api/inventory/items");
        setInventoryItems(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error("Failed to load inventory items", e);
        setInventoryItems([]);
      } finally {
        setInventoryLoading(false);
      }
    };

    loadInventory();
  }, []);

  useEffect(() => {
    const loadPurchaseOrderDetails = async () => {
      if (!editMode || !passedPO?.id) return;

      const hasFullItems =
        passedPO &&
        Array.isArray(passedPO.items) &&
        passedPO.items.length >= 0 &&
        (passedPO.vendorId ||
          passedPO.expectedDeliveryDate ||
          passedPO.shippingMethod);

      if (hasFullItems) {
        setEditPO(passedPO);
        return;
      }

      setPoDetailsLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8081/api/v1/purchaseOrders/${passedPO.id}`
        );
        setEditPO(res.data || null);
      } catch (e) {
        console.error("Failed to load purchase order details", e);
        alert("Failed to load purchase order details.");
      } finally {
        setPoDetailsLoading(false);
      }
    };

    loadPurchaseOrderDetails();
  }, [editMode, passedPO]);

  useEffect(() => {
    if (!editMode || !editPO || vendors.length === 0) return;

    const vendorId = String(editPO.vendorId ?? editPO.vendor?.id ?? "");
    const foundVendor = vendors.find((v) => String(v.id) === vendorId);

    setSelectedVendorId(vendorId);
    setSelectedVendor(foundVendor || null);
    setDeliveryDate(
      editPO.expectedDeliveryDate || editPO.deliveryDate || editPO.delivery || ""
    );
    setShippingMethod(editPO.shippingMethod || "");
    setInternalNotes(editPO.internalNotes || "");
  }, [editMode, editPO, vendors]);

  useEffect(() => {
    if (!editMode || !editPO || inventoryItems.length === 0) return;

    const mappedItems =
      editPO.items?.map((poItem, index) => {
        const matchedInventory = inventoryItems.find(
          (inv) =>
            String(inv.id) === String(poItem.inventoryItemId) ||
            String(inv.id) === String(poItem.itemId)
        );

        return {
          id: index + 1,
          inventoryItemId:
            matchedInventory?.id ??
            poItem.inventoryItemId ??
            poItem.itemId ??
            "",
          name: matchedInventory?.name || poItem.name || "",
          sku: poItem.sku || matchedInventory?.sku || "",
          stock: Number(matchedInventory?.stock ?? 0),
          safety: Number(matchedInventory?.safety ?? 0),
          ai: Number(matchedInventory?.ai ?? 0),
          qty: Number(poItem.quantity ?? poItem.qty ?? 1),
          price: Number(poItem.price ?? 0),
        };
      }) || [];

    setItems(mappedItems.length > 0 ? mappedItems : [emptyItem(1)]);
  }, [editMode, editPO, inventoryItems]);

  const handleSelectVendor = (e) => {
    const id = e.target.value;
    setSelectedVendorId(id);

    const v = vendors.find((x) => String(x.id) === String(id));
    setSelectedVendor(v || null);

    setShippingMethod("");
    setErrors([]);
  };

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Number(item.qty || 0) * Number(item.price || 0),
        0
      ),
    [items]
  );

  const tax = subtotal * 0.08;
  const shipping = 150.0;
  const total = subtotal + tax + shipping;

  const budgetRemaining = 50000;

  const afterThisPO = useMemo(
    () => budgetRemaining - total,
    [budgetRemaining, total]
  );

  const isBudgetExceeded = afterThisPO < 0;

  const getBudgetStatus = (afterThisPOValue, budgetRemainingValue) => {
    if (afterThisPOValue < 0) {
      return {
        label: "Critical",
        message: "This PO exceeds the remaining budget",
        containerClass: "bg-red-50 border border-red-100",
        iconClass: "text-red-500",
        titleClass: "text-red-800",
        textClass: "text-red-600",
      };
    }

    const lowThreshold = budgetRemainingValue * 0.1;
    if (afterThisPOValue <= lowThreshold) {
      return {
        label: "Warning",
        message: "Budget will be low after this PO",
        containerClass: "bg-amber-50 border border-amber-100",
        iconClass: "text-amber-500",
        titleClass: "text-amber-800",
        textClass: "text-amber-600",
      };
    }

    return {
      label: "Healthy",
      message: "Sufficient budget available",
      containerClass: "bg-emerald-50 border border-emerald-100",
      iconClass: "text-emerald-500",
      titleClass: "text-emerald-800",
      textClass: "text-emerald-600",
    };
  };

  const budgetStatus = useMemo(
    () => getBudgetStatus(afterThisPO, budgetRemaining),
    [afterThisPO, budgetRemaining]
  );

  const updateItemField = (id, field, val) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "name" ||
                field === "sku" ||
                field === "inventoryItemId"
                  ? val
                  : Number(val || 0),
            }
          : item
      )
    );
    setErrors([]);
  };

  const handleSelectInventoryItem = (rowId, selectedInventoryId) => {
    const selected = inventoryItems.find(
      (x) => String(x.id) === String(selectedInventoryId)
    );

    if (!selected) {
      setItems((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                inventoryItemId: "",
                name: "",
                sku: "",
                stock: 0,
                safety: 0,
                ai: 0,
                price: 0,
                qty: 1,
              }
            : r
        )
      );
      setErrors([]);
      return;
    }

    setItems((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              inventoryItemId: selected.id,
              name: selected.name ?? "",
              sku: selected.sku ?? "",
              stock: Number(selected.stock ?? 0),
              safety: Number(selected.safety ?? 0),
              ai: Number(selected.ai ?? 0),
              price: Number(selected.price ?? 0),
              qty: Number(selected.ai ?? 1),
            }
          : r
      )
    );
    setErrors([]);
  };

  const removeItem = (id) => {
    setItems((prev) => {
      if (prev.length === 1) return prev;
      return prev.filter((i) => i.id !== id);
    });
    setErrors([]);
  };

  const addItem = () => {
    const nextId = Math.max(0, ...items.map((i) => i.id)) + 1;
    setItems((prev) => [...prev, emptyItem(nextId)]);
    setErrors([]);
  };

  const acceptAllAISuggestions = () => {
    setItems((prev) =>
      prev.map((i) => ({
        ...i,
        qty: i.ai || i.qty,
      }))
    );
    setErrors([]);
  };

  const validateForm = (status) => {
    const validationErrors = [];

    if (!selectedVendorId) {
      validationErrors.push("Vendor is required.");
    }

    if (!deliveryDate) {
      validationErrors.push("Expected delivery date is required.");
    }

    if (!shippingMethod) {
      validationErrors.push("Shipping method is required.");
    }

    if (!items.length) {
      validationErrors.push("At least one item is required.");
    }

    items.forEach((item, index) => {
      const row = index + 1;

      if (!item.inventoryItemId) {
        validationErrors.push(`Row ${row}: Please select an item.`);
      }

      if (Number(item.qty) <= 0) {
        validationErrors.push(`Row ${row}: Quantity must be greater than 0.`);
      }

      if (Number(item.price) < 0) {
        validationErrors.push(`Row ${row}: Price cannot be negative.`);
      }
    });

    if (status === "SENT" && afterThisPO < 0) {
      validationErrors.push(
        "Cannot send purchase order because budget is exceeded."
      );
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const submitPurchaseOrder = async (status) => {
    setLoading(true);

    const isValid = validateForm(status);
    if (!isValid) {
      setLoading(false);
      return;
    }

    const payload = {
      vendorId: Number(selectedVendorId),
      expectedDeliveryDate: deliveryDate,
      shippingMethod,
      internalNotes,
      status,
      items: items.map((item) => ({
        inventoryItemId: Number(item.inventoryItemId),
        sku: item.sku,
        quantity: Number(item.qty),
        price: Number(item.price),
      })),
      totalAmount: total,
    };

    try {
      let response;

      if (editMode && editPO?.id) {
        response = await axios.put(
          `http://localhost:8081/api/v1/purchaseOrders/${editPO.id}`,
          payload
        );
        alert(`PO Updated Successfully: ${response.data?.id || editPO.id}`);
      } else {
        response = await axios.post(
          "http://localhost:8081/api/v1/purchaseOrders",
          payload
        );
        alert(`PO ${status} Successfully: ${response.data?.id || ""}`);
      }

      setErrors([]);
      navigate("/procurement/manage-purchase-orders");
    } catch (error) {
      console.error(error);
      setErrors([
        editMode
          ? "Update failed. Please try again."
          : "Submission failed. Please try again.",
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/procurement/manage-purchase-orders");
  };

  const pageBusy = vendorsLoading || inventoryLoading || poDetailsLoading;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 pb-32 font-sans text-slate-900">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {editMode ? "Edit Purchase Order" : "Create Purchase Order"}
          </h1>
          <p className="text-slate-500 text-sm">
            {editMode
              ? `Editing PO ${editPO?.id || ""}`
              : "AI-generated purchase order based on inventory forecast"}
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white shadow-sm">
            Manual Creation
          </button>
          <button className="px-4 py-1.5 text-xs font-bold text-slate-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-600" /> AI Suggested PO
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 rounded-xl p-4 mb-8 flex items-center justify-between">
        <div className="flex gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg self-start">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">
              AI Procurement Oracle Generated This PO
            </h4>
            <p className="text-xs text-slate-500">
              Suggested quantities based on forecast demand and safety stock
              thresholds.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={acceptAllAISuggestions}
            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold"
          >
            Accept AI Qty
          </button>
          <button className="border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-lg text-xs font-bold bg-white">
            Review
          </button>
        </div>
      </div>

      {pageBusy ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-10 flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-blue-700" />
          <span className="text-sm font-medium text-slate-600">
            Loading purchase order form...
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            <FormSection title="Vendor Information" icon={User}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">
                    Select Vendor *
                  </label>
                  <select
                    value={selectedVendorId}
                    onChange={handleSelectVendor}
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 ring-blue-50 outline-none"
                  >
                    <option value="">
                      {vendorsLoading
                        ? "Loading vendors..."
                        : "-- Select Vendor --"}
                    </option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} {v.status ? `- ${v.status}` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-10 p-4 bg-slate-50/50 border border-dashed rounded-xl border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Vendor Rating
                    </p>

                    <div className="flex items-center gap-1 text-xs font-bold">
                      {selectedVendor ? (
                        <>
                          <div className="flex text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star}>
                                {selectedVendor.rating >= star ? "★" : "☆"}
                              </span>
                            ))}
                          </div>
                          <span className="text-slate-700 ml-1">
                            {selectedVendor.rating}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Payment Terms
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {selectedVendor ? selectedVendor.paymentTerms : "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Contract Expiry
                    </p>
                    <p className="text-xs font-bold text-slate-700 text-red-500">
                      {selectedVendor ? selectedVendor.contractExpiry : "-"}
                    </p>
                  </div>

                  <button className="ml-auto text-blue-600 text-[10px] font-bold flex items-center gap-1 hover:underline">
                    <Info className="w-3 h-3" /> View Contract Details
                  </button>
                </div>
              </div>
            </FormSection>

            <FormSection
              title="Order Items"
              icon={ShoppingCart}
              action={
                <button
                  onClick={addItem}
                  className="bg-blue-900 text-white px-3 py-1.5 rounded text-[10px] font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Item
                </button>
              }
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-[11px] text-slate-500">
                  {inventoryLoading
                    ? "Loading inventory items..."
                    : `Inventory items loaded: ${inventoryItems.length}`}
                </div>
              </div>

              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-50">
                    <th className="pb-3 px-2">Item Name</th>
                    <th className="pb-3 px-2">SKU</th>
                    <th className="pb-3 px-2 text-center">Stock</th>
                    <th className="pb-3 px-2 text-center text-indigo-600">
                      AI Suggested
                    </th>
                    <th className="pb-3 px-2 text-center">Order Qty</th>
                    <th className="pb-3 px-2">Unit Price</th>
                    <th className="pb-3 px-2 text-right">Subtotal</th>
                    <th className="pb-3 px-2" />
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-50">
                  {items.map((item) => (
                    <tr key={item.id} className="group">
                      <td className="py-4 px-2">
                        <select
                          value={item.inventoryItemId || ""}
                          onChange={(e) =>
                            handleSelectInventoryItem(item.id, e.target.value)
                          }
                          className="w-full border border-slate-200 rounded-lg p-2 text-xs font-bold bg-white"
                        >
                          <option value="">-- Select Item --</option>
                          {inventoryItems.map((inv) => (
                            <option key={inv.id} value={inv.id}>
                              {inv.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="py-4 px-2 text-slate-400 font-mono">
                        {item.sku || "-"}
                      </td>

                      <td className="py-4 px-2 text-center font-bold text-red-500">
                        {item.stock}
                      </td>

                      <td className="py-4 px-2 text-center">
                        <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md font-bold border border-indigo-100">
                          {item.ai}
                        </span>
                      </td>

                      <td className="py-4 px-2 text-center">
                        <input
                          type="number"
                          min={0}
                          value={item.qty}
                          onChange={(e) =>
                            updateItemField(item.id, "qty", e.target.value)
                          }
                          disabled={!item.inventoryItemId}
                          className="w-16 border rounded p-1 text-center font-bold bg-white disabled:opacity-50"
                        />
                      </td>

                      <td className="py-4 px-2">
                        <input
                          type="number"
                          min={0}
                          step="0.01"
                          value={item.price}
                          onChange={(e) =>
                            updateItemField(item.id, "price", e.target.value)
                          }
                          disabled={!item.inventoryItemId}
                          className="w-24 border rounded p-1 text-right font-bold bg-white disabled:opacity-50"
                        />
                      </td>

                      <td className="py-4 px-2 text-right font-bold text-slate-700">
                        $
                        {(
                          Number(item.qty || 0) * Number(item.price || 0)
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>

                      <td className="py-4 px-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-slate-300 hover:text-red-500"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                <p className="font-bold text-slate-700">Items Subtotal:</p>
                <p className="text-xl font-black text-slate-900">
                  $
                  {subtotal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </FormSection>

            <FormSection title="Delivery & Notes" icon={Calendar}>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-[10px] font-bold text-red-500 uppercase">
                    Expected Delivery Date *
                  </label>
                  <div className="relative mt-1">
                    <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      className="w-full border border-slate-200 rounded-lg py-2 pl-10 pr-3 text-sm outline-none focus:ring-2 ring-blue-50"
                      value={deliveryDate}
                      onChange={(e) => {
                        setDeliveryDate(e.target.value);
                        setErrors([]);
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-red-500 uppercase">
                    Shipping Method *
                  </label>
                  <select
                    className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm outline-none"
                    value={shippingMethod}
                    onChange={(e) => {
                      setShippingMethod(e.target.value);
                      setErrors([]);
                    }}
                    disabled={!selectedVendor}
                  >
                    <option value="">
                      {selectedVendor
                        ? "-- Select Shipping Method --"
                        : "Select Vendor First"}
                    </option>

                    {selectedVendor?.shippingMethods?.map((method, index) => (
                      <option key={index} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase">
                  Internal Notes (Optional)
                </label>
                <textarea
                  className="w-full mt-1 border border-slate-200 rounded-lg p-3 text-sm min-h-[100px] outline-none placeholder:text-slate-300"
                  placeholder="Add any internal notes or special instructions..."
                  value={internalNotes}
                  onChange={(e) => {
                    setInternalNotes(e.target.value);
                    setErrors([]);
                  }}
                />
              </div>
            </FormSection>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-2 border-b border-slate-50">
                <div className="p-1.5 bg-emerald-100 rounded-md">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">
                  Financial Summary
                </h3>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-700">
                      $
                      {subtotal.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-slate-700">
                      $
                      {tax.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold text-slate-700">
                      $
                      {shipping.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total PO Amount</span>
                  <span className="text-xl font-black text-slate-900">
                    $
                    {total.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase">
                      Budget Remaining
                    </span>
                    <span className="text-slate-700">
                      ${budgetRemaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-400 uppercase">After This PO</span>
                    <span
                      className={
                        afterThisPO < 0 ? "text-red-600" : "text-emerald-600"
                      }
                    >
                      ${afterThisPO.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div
                  className={`${budgetStatus.containerClass} p-3 rounded-lg flex items-center gap-2`}
                >
                  <CheckCircle className={`w-4 h-4 ${budgetStatus.iconClass}`} />
                  <div className="leading-tight">
                    <p className={`text-[11px] font-bold ${budgetStatus.titleClass}`}>
                      Budget Status: {budgetStatus.label}
                    </p>
                    <p className={`text-[10px] ${budgetStatus.textClass}`}>
                      {budgetStatus.message}
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-lg flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <div className="leading-tight">
                    <p className="text-[11px] font-bold text-blue-800">
                      Pending Ledger Entry
                    </p>
                    <p className="text-[10px] text-blue-600">
                      This amount will be committed upon approval
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 px-8 shadow-lg z-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              Total:
            </span>
            <span className="text-lg font-black text-slate-900">
              $
              {total.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] text-slate-400 ml-2 font-bold">
              {items.length} items
            </span>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2 text-xs font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              onClick={() => submitPurchaseOrder("DRAFT")}
              disabled={loading}
              className="px-5 py-2 text-xs font-bold text-blue-900 border border-slate-200 rounded-lg flex items-center gap-2 hover:bg-slate-50 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              {editMode ? "Update Draft" : "Save as Draft"}
            </button>

            <button
              onClick={() => submitPurchaseOrder("SENT")}
              disabled={loading || isBudgetExceeded}
              className={`px-6 py-2 text-xs font-bold text-white rounded-lg flex items-center gap-2 shadow-sm ${
                loading || isBudgetExceeded
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}

              {loading
                ? editMode
                  ? "Updating..."
                  : "Approving..."
                : isBudgetExceeded
                ? "Budget Exceeded"
                : editMode
                ? "Update & Send"
                : "Approve & Send"}
            </button>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-xs font-bold text-red-700 mb-2">
              Please fix the following:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-xs text-red-600">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcurementCreatePurchaseOrder_Simple;