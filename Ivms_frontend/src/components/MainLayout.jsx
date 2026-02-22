import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Sidebar from './SideBAr';


const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Fixed Header at the top */}
      <Header />
      
      <div className="flex flex-1">
        {/* Sidebar sticks to the left */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet /> 
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;