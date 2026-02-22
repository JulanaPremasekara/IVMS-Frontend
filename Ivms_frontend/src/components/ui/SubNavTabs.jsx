import React from 'react';
import { NavLink } from 'react-router-dom';
import { Layout, PlusCircle, ListChecks, Truck, ArrowDownCircle } from 'lucide-react';

const SubNavTabs = () => {
  const tabs = [
  { label: 'Overview', path: '/procurement', icon: Layout },
  { label: 'Create PO', path: '/procurement/create-purchase-order', icon: PlusCircle },
  { label: 'Manage POs', path: '/procurement/manage-purchase-orders', icon: ListChecks },
  { label: 'Track Shipments', path: '/procurement/track-shipments', icon: Truck },
  { label: 'Receive Goods', path: '/procurement/receive-goods', icon: ArrowDownCircle },
];

  return (
    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-100 shadow-sm w-full overflow-x-auto">
      {tabs.map((tab) => (
       <NavLink
  key={tab.path}
  to={tab.path}
  // Add 'end' only for the base path to ensure exact matching
  end={tab.path === '/procurement'} 
  className={({ isActive }) => `
    flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 whitespace-nowrap flex-1
    ${isActive 
      ? 'bg-purple-600 text-white shadow-md shadow-purple-200' 
      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
  `}
>
  <tab.icon className="w-4 h-4" />
  {tab.label}
</NavLink>
      ))}
    </div>
  );
};

export default SubNavTabs;