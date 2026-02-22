import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAV_ITEMS } from '../config/navConfig';

// Reusable NavItem component for better performance and readability
const SidebarItem = ({ item }) => {
  const location = useLocation();
  
  // Logic to determine if a parent should be active based on child routes
  const isActive = item.path === '/' 
    ? location.pathname === '/' 
    : location.pathname.startsWith(item.path);

  return (
    <NavLink
      to={item.path}
      className={({ isActive: linkActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 group
        ${isActive || linkActive 
          ? 'bg-purple-50 text-purple-600' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}
      `}
    >
      <item.icon className={`w-5 h-5 ${(isActive) ? 'text-purple-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
      <span className="font-medium">{item.label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-100 flex flex-col p-4 sticky top-0">
      <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <SidebarItem key={item.id} item={item} />
        ))}
      </nav>

      {/* AI Status Card (Footer) */}
      <footer className="mt-6">
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-slate-800">AI Engine Active</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">Real-time optimization</p>
        </div>
      </footer>
    </aside>
  );
};

export default Sidebar;