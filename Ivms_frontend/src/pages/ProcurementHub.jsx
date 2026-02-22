import React from 'react';
import { 
  FileText, Clock, Truck, AlertCircle, PlusCircle, 
  ListChecks, ArrowDownCircle, CheckCircle2, Package
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { QuickActionCard } from '../components/ui/QuickActionCard';
import { WorkflowStep } from '../components/ui/WorkflowStep';

const ProcurementHub = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 1. Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active POs" value="12" icon={FileText} bgColor="bg-blue-600" colorClass="text-slate-800" />
        <StatCard title="Pending Receipts" value="5" icon={Clock} bgColor="bg-orange-500" colorClass="text-orange-600" />
        <StatCard title="In Transit" value="8" icon={Truck} bgColor="bg-blue-400" colorClass="text-blue-500" />
        <StatCard title="Delayed" value="2" icon={AlertCircle} bgColor="bg-red-500" colorClass="text-red-600" />
      </div>

      {/* 2. Quick Actions Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1 h-4 bg-purple-500 rounded-full"></div> Quick Actions
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <QuickActionCard
            title="Create Purchase Order" 
            subtitle="Start a new PO with AI-assisted vendor and item selection"
            icon={PlusCircle}
            colorClass="bg-purple-600"
            path="/procurement/create-purchase-order" // Updated Path
          />
          <QuickActionCard 
            title="Receive Goods" 
            subtitle="Process incoming deliveries and update inventory"
            icon={ArrowDownCircle}
            colorClass="bg-emerald-600"
            path="/procurement/receive-goods" // Updated Path
          />
          <QuickActionCard 
            title="Track Shipments" 
            subtitle="Monitor incoming shipments and delivery status"
            icon={Truck}
            colorClass="bg-blue-500"
            path="/procurement/track-shipments" // Updated Path
          />
          <QuickActionCard 
            title="Manage Purchase Orders" 
            subtitle="View, edit, and void existing purchase orders"
            icon={ListChecks}
            colorClass="bg-red-500"
            path="/procurement/manage-purchase-orders" // Updated Path
          />
        </div>
      </section>

      {/* 3. Procurement Workflow Section */}
      <section className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
          <Package className="w-4 h-4 text-purple-500" /> Procurement Workflow
        </h3>
        <div className="flex items-center justify-between">
          <WorkflowStep stepNumber="1" title="Create PO" description="Define items & vendor" icon={PlusCircle} colorClass="bg-purple-600" />
          <WorkflowStep stepNumber="2" title="Review & Send" description="Approve & dispatch" icon={FileText} colorClass="bg-red-600" />
          <WorkflowStep stepNumber="3" title="Track" description="Monitor shipment" icon={Truck} colorClass="bg-blue-600" />
          <WorkflowStep stepNumber="4" title="Receive" description="Update inventory" icon={CheckCircle2} colorClass="bg-emerald-600" isLast />
        </div>
      </section>
    </div>
  );
};

export default ProcurementHub;