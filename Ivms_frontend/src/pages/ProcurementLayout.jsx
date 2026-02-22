// components/ProcurementLayout.jsx
import { Outlet } from "react-router-dom";

import { Package } from "lucide-react";
import SubNavTabs from "../components/ui/SubNavTabs";

const ProcurementLayout = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-purple-600 p-2 rounded-lg">
            <Package className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Procurement Hub</h1>
            <p className="text-sm text-slate-500">Complete procurement lifecycle management</p>
          </div>
        </div>
        <div className="bg-purple-600 text-white px-4 py-1.5 rounded text-xs font-semibold">
          Procurement Manager
        </div>
      </div>

      {/* 2. The Tabs (Added here) */}
      <SubNavTabs/>
      {/* This renders either ProcurementHub OR ProcurementShipment */}
      <Outlet /> 
    </div>
  );
};

export default ProcurementLayout;