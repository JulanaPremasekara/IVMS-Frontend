import React from 'react';
import { Box, Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm">
      {/* Left Section: Logo and Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg shadow-md">
          <Box className="text-white w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-slate-800 leading-tight">
            Cognitive IVMS
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Intelligent Vendor Management
          </p>
        </div>
      </div>

      {/* Right Section: Actions and Profile */}
      <div className="flex items-center gap-6">
        {/* Notification Bell with Indicator */}
        <div className="relative cursor-pointer text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-white rounded-full"></span>
        </div>

        {/* Role Badge */}
        <div className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm">
          Procurement Manager
        </div>

        {/* User Profile Dropdown */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="flex items-center justify-center w-9 h-9 bg-blue-500 text-white rounded-full font-semibold text-sm border-2 border-blue-100 group-hover:border-blue-200 transition-all">
            PM
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
};

export default Header;