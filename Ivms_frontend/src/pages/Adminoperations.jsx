// src/pages/AdminOperations.jsx
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Package, MapPin, RefreshCw, ClipboardList, ShieldCheck, Search, AlertCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminOperations = () => {
  const navigate = useNavigate();

  // Form state
  const [warehouses, setWarehouses] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sourceWarehouse, setSourceWarehouse] = useState('');
  const [destinationWarehouse, setDestinationWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [requireApproval, setRequireApproval] = useState(false);
  const [availableStock, setAvailableStock] = useState(null);
  const [formError, setFormError] = useState('');
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Load warehouses
  const loadWarehouses = async () => {
    setLoadingWarehouses(true);
    setFormError('');
    try {
      const res = await fetch('http://localhost:8080/api/admin/warehouses');
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to load warehouses: ${res.status} - ${errorText}`);
      }
      const data = await res.json();
      setWarehouses(data);
    } catch (err) {
      console.error(err);
      alert('Error loading warehouses: ' + (err.message || 'Server not reachable'));
    } finally {
      setLoadingWarehouses(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  // Product search (debounced)
  useEffect(() => {
    if (productSearch.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/admin/products/search?q=${encodeURIComponent(productSearch)}`);
        if (!res.ok) throw new Error('Failed to search products');
        const data = await res.json();
        setSearchResults(data);
      } catch (err) {
        console.error(err);
        alert('Error searching products: ' + err.message);
      }
    }, 400); // debounce 400ms

    return () => clearTimeout(timeout);
  }, [productSearch]);

  // Get available stock
  useEffect(() => {
    if (!selectedProduct?.id || !sourceWarehouse) {
      setAvailableStock(null);
      return;
    }

    const fetchStock = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/admin/stock?product=${selectedProduct.id}&warehouse=${sourceWarehouse}`);
        if (!res.ok) throw new Error('Failed to fetch stock');
        const data = await res.json();
        setAvailableStock(data.quantity);
      } catch (err) {
        console.error(err);
        setAvailableStock(null);
        alert('Error fetching available stock: ' + err.message);
      }
    };

    fetchStock();
  }, [selectedProduct?.id, sourceWarehouse]);

  // Submit transfer
  const handleSubmit = async () => {
    setFormError('');
    setLoadingSubmit(true);

    // Basic validation
    if (!selectedProduct) return setFormError('Please select a product');
    if (!sourceWarehouse) return setFormError('Please select source warehouse');
    if (!destinationWarehouse) return setFormError('Please select destination warehouse');
    if (sourceWarehouse === destinationWarehouse) return setFormError('Source and destination cannot be the same');
    if (!quantity || quantity <= 0) return setFormError('Please enter valid quantity');
    if (availableStock !== null && parseInt(quantity) > availableStock) return setFormError('Quantity exceeds available stock');
    if (!reason) return setFormError('Please select transfer reason');

    const payload = {
      productId: selectedProduct.id,
      sourceWarehouseId: sourceWarehouse,
      destinationWarehouseId: destinationWarehouse,
      quantity: parseInt(quantity),
      reason,
      notes,
      requireApproval,
    };

    try {
      const res = await fetch('http://localhost:8080/api/admin/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to create transfer: ${res.status} - ${errorText}`);
      }

      alert('Transfer request created successfully!');
      
      // Reset form
      setProductSearch('');
      setSelectedProduct(null);
      setSourceWarehouse('');
      setDestinationWarehouse('');
      setQuantity('');
      setReason('');
      setNotes('');
      setRequireApproval(false);
      setAvailableStock(null);
      setSearchResults([]);
    } catch (err) {
      console.error(err);
      setFormError(err.message || 'Failed to submit transfer');
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button 
            onClick={() => navigate('/admin')} 
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-3 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Admin Dashboard
          </button>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Warehouse Stock Transfer</h1>
            <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded font-bold uppercase flex items-center gap-1.5">
              <ShieldCheck size={14} /> Admin Operation
            </span>
          </div>
          <p className="text-slate-600 mt-1">
            Transfer stock between warehouses with full audit trail
          </p>
        </div>

        <button 
          onClick={loadWarehouses}
          disabled={loadingWarehouses}
          className={`flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition ${
            loadingWarehouses ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          <RefreshCw size={16} className={loadingWarehouses ? 'animate-spin' : ''} />
          {loadingWarehouses ? 'Refreshing...' : 'Refresh Warehouses'}
        </button>
      </div>

      {/* Main Transfer Form */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50 flex items-center gap-3 text-blue-900">
          <RefreshCw size={18} className="text-blue-600" />
          <h2 className="text-base font-bold uppercase tracking-tight">
            Inter-Warehouse Stock Transfer
          </h2>
        </div>

        <div className="p-6 md:p-8 space-y-10">

          {/* Stock Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Package size={16} className="text-slate-500" />
              Select Product to Transfer
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  SKU / Product Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search product by SKU or name..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                  />
                  <Search 
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
                    size={16} 
                  />
                </div>

                {/* Search results dropdown */}
                {searchResults.length > 0 && (
                  <ul className="mt-2 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-sm z-10 absolute w-full">
                    {searchResults.map((product) => (
                      <li 
                        key={product.id}
                        onClick={() => {
                          setSelectedProduct(product);
                          setProductSearch(`${product.sku} - ${product.name}`);
                          setSearchResults([]);
                          setAvailableStock(null);
                        }}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer text-sm border-b last:border-b-0"
                      >
                        {product.sku} - {product.name} (Total Stock: {product.totalStock})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Current Stock (All Warehouses)
                </label>
                <div className="py-2.5 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                  {selectedProduct ? selectedProduct.totalStock : '— will show after selection —'}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Available in Source
                </label>
                <div className="py-2.5 px-4 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-700 font-medium">
                  {availableStock !== null ? `${availableStock} units` : '— select source first —'}
                </div>
              </div>
            </div>
          </div>

          {/* Transfer Details */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <MapPin size={16} className="text-slate-500" />
              Transfer Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Source Warehouse *
                </label>
                <select 
                  value={sourceWarehouse}
                  onChange={(e) => setSourceWarehouse(e.target.value)}
                  disabled={loadingWarehouses}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                >
                  <option value="">Select source warehouse...</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Destination Warehouse *
                </label>
                <select 
                  value={destinationWarehouse}
                  onChange={(e) => setDestinationWarehouse(e.target.value)}
                  disabled={loadingWarehouses}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                >
                  <option value="">Select destination warehouse...</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Quantity to Transfer *
                </label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Enter quantity..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Transfer Reason *
                </label>
                <select 
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none appearance-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
                >
                  <option value="">Select reason...</option>
                  <option>Stock Replenishment</option>
                  <option>Order Fulfillment</option>
                  <option>Damaged Goods Return</option>
                  <option>Seasonal Re-distribution</option>
                  <option>Emergency Transfer</option>
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Notes / Reference (Optional)
                </label>
                <textarea 
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal reference number, transport details, or any special instructions..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="require-approval" 
                checked={requireApproval}
                onChange={(e) => setRequireApproval(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor="require-approval" 
                className="text-sm font-medium text-slate-700 cursor-pointer"
              >
                Require approval from receiving warehouse
              </label>
            </div>

            <div className="flex gap-3">
              <button 
                disabled={loadingSubmit}
                onClick={() => {
                  setFormError('');
                  setProductSearch('');
                  setSelectedProduct(null);
                  setSourceWarehouse('');
                  setDestinationWarehouse('');
                  setQuantity('');
                  setReason('');
                  setNotes('');
                  setRequireApproval(false);
                  setAvailableStock(null);
                  setSearchResults([]);
                }}
                className="px-7 py-2.5 bg-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={loadingSubmit || loadingWarehouses}
                onClick={handleSubmit}
                className={`px-8 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 shadow-md transition flex items-center gap-2 ${
                  loadingSubmit ? 'opacity-70 cursor-wait' : ''
                }`}
              >
                <ClipboardList size={16} />
                {loadingSubmit ? 'Submitting...' : 'Review & Confirm Transfer'}
              </button>
            </div>
          </div>

          {formError && (
            <p className="text-red-600 text-sm mt-2 text-center font-medium">
              {formError}
            </p>
          )}
        </div>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 text-sm text-blue-800">
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Important:</p>
            <p className="mt-1">
              All stock transfers are logged in the audit system. Make sure source warehouse has sufficient stock before proceeding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOperations;