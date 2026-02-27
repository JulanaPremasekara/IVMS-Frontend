import React from 'react';
import { 
  X, FileText, Zap, ExternalLink, Package, 
  DollarSign, Calendar, Download, CheckCircle2 
} from 'lucide-react';

const TransactionDetailsModal = ({ isOpen, onClose, data }) => {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[95vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-start border-b border-slate-50">
          <div className="flex gap-3">
            <div className="p-2 bg-slate-50 text-blue-900 rounded-lg">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Transaction Details</h3>
              <p className="text-xs text-slate-500">Complete information for {data.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Auto-Generated Banner */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl flex gap-4">
            <div className="text-blue-500 mt-1">
              <Zap size={18} fill="currentColor" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-900">Auto-Generated Record</h4>
              <p className="text-xs text-blue-700/80 mt-0.5">
                This record was automatically generated after Order Status: Shipped
              </p>
              <p className="text-[10px] text-blue-400 mt-1 uppercase font-semibold">
                Generated at: {data.timestamp}
              </p>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
            <InfoItem label="Transaction ID" value={data.id} />
            <InfoItem 
              label="Linked Order" 
              value={data.orderId} 
              isLink 
              linkValue={data.orderId} 
            />
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
              <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white ${data.type === 'Sale' ? 'bg-blue-800' : 'bg-purple-700'}`}>
                {data.type === 'Sale' ? '↗ Sale' : '↘ Purchase'}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
              <span className={`w-fit flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${data.status === 'Paid' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${data.status === 'Paid' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                {data.status}
              </span>
            </div>
            <InfoItem label="Customer:" value={data.party} isBold />
            <InfoItem label="Due Date:" value="2026-03-20" />
          </div>

          {/* Line Items Table */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Package size={16} className="text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Line Items</h4>
            </div>
            <table className="w-full text-sm">
              <thead className="text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="text-left py-2">SKU</th>
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Unit Price</th>
                  <th className="text-right py-2">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Sample items - usually these would come from your data prop */}
                <TableRow sku="LAP-DEL-XPS15" item="Dell XPS 15 Laptop" qty={15} price="1,850.00" subtotal="27,750.00" />
                <TableRow sku="MON-LG-27UK" item='LG 27" 4K Monitor' qty={30} price="450.00" subtotal="13,500.00" />
              </tbody>
            </table>
          </section>

          {/* Financial Breakdown */}
          <section className="space-y-2 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} className="text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Financial Breakdown</h4>
            </div>
            <div className="space-y-2 max-w-xs ml-auto">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal:</span>
                <span className="font-bold text-slate-700">${data.amount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax (VAT 20%):</span>
                <span className="font-bold text-slate-700">${data.tax}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total Amount:</span>
                <span className="text-lg font-bold text-blue-900">${data.total}</span>
              </div>
            </div>
          </section>

          {/* Payment Timeline */}
          <section className="bg-slate-50/30 border border-slate-100 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-slate-400" />
              <h4 className="text-sm font-bold text-slate-700 uppercase tracking-tight">Payment Timeline</h4>
            </div>
            <div className="space-y-6 relative ml-2">
              <TimelineItem label="Transaction Created" time={data.timestamp} active />
              <TimelineItem label="Payment Received" time="2026-02-20" active last />
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
          <button onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-blue-900 border border-blue-900 rounded-lg hover:bg-white transition-colors">
            Close
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-blue-900 rounded-lg hover:bg-blue-800 transition-shadow shadow-md shadow-blue-900/20">
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const InfoItem = ({ label, value, isLink, linkValue, isBold }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-sm ${isBold ? 'font-bold text-slate-800' : 'text-slate-600'} flex items-center gap-1`}>
      {value}
      {isLink && <span className="text-blue-500 font-medium border-b border-blue-200 cursor-pointer">{linkValue}</span>}
    </span>
  </div>
);

const TableRow = ({ sku, item, qty, price, subtotal }) => (
  <tr className="text-xs group hover:bg-slate-50/50">
    <td className="py-3 text-blue-500 font-medium cursor-pointer">{sku}</td>
    <td className="py-3 text-slate-700 font-semibold">{item}</td>
    <td className="py-3 text-center text-slate-500 font-medium">{qty}</td>
    <td className="py-3 text-right text-slate-700 font-bold">${price}</td>
    <td className="py-3 text-right text-slate-900 font-bold">${subtotal}</td>
  </tr>
);

const TimelineItem = ({ label, time, active, last }) => (
  <div className="flex gap-4 relative">
    {!last && <div className="absolute left-1.5 top-3 w-0.5 h-10 bg-slate-100"></div>}
    <div className={`w-3 h-3 rounded-full z-10 mt-1 ${active ? 'bg-green-500 shadow-sm shadow-green-200' : 'bg-slate-200'}`}></div>
    <div className="flex flex-col">
      <span className={`text-xs font-bold ${active ? 'text-green-700' : 'text-slate-400'}`}>{label}</span>
      <span className="text-[10px] text-slate-400">{time}</span>
    </div>
  </div>
);

export default TransactionDetailsModal;