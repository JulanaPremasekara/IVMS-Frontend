import React from 'react';
import { LayoutDashboard, Search, Box, LineChart, Truck, ClipboardList, User } from 'lucide-react';
import DashboardContent from './DashboardContent';
import { Outlet } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-slate-800'}`}>
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const InventoryDashboard = () => {
  return (
    <div className="flex min-h-screen bg-white">

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b flex items-center justify-between px-8 bg-white">
          <div className="flex items-center space-x-4">
            <span className="text-blue-600 font-bold text-xl uppercase tracking-tight">Cognitive IVMS</span>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
              Warehouse Manager
            </span>
          </div>
          <div className="p-2 border rounded-full hover:bg-gray-50 cursor-pointer">
            <User size={20} className="text-gray-600" />
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet/>
        </main>
      </div>
    </div>
  );
};

export default InventoryDashboard;