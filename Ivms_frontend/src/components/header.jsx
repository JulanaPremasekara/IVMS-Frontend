import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Bell, ChevronDown, LogOut, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Determine role and avatar based on path
  const isFinancialPage = location.pathname.includes('financial');
  const role = isFinancialPage ? 'Finance Manager' : 'Procurement Manager';
  const avatarInitials = isFinancialPage ? 'FM' : 'PM';

  const handleLogout = () => {
    // Implement logout logic here (e.g., clear tokens)
    console.log('Logging out...');
    // Redirect to login or home
    // navigate('/login'); 
    alert('Logged out successfully');
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shadow-sm relative z-50">
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
        <div className="bg-[#1e3a8a] text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm transition-all duration-300">
          {role}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <div
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="flex items-center justify-center w-9 h-9 bg-blue-500 text-white rounded-full font-semibold text-sm border-2 border-blue-100 group-hover:border-blue-200 transition-all">
              {avatarInitials}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              ></div>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-3 border-b border-slate-50">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Signed in as</p>
                  <p className="text-sm font-bold text-slate-800">{role}</p>
                </div>
                <div className="p-1">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <User size={16} /> View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;