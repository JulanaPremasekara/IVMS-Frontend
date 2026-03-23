import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './header';
import Sidebar from './SideBAr';


let hasRotated = false;

const MainLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent React 18 Strict Mode from double-firing the one-time refresh token
    if (hasRotated) return;
    
    // If we just logged in, skip the refresh on mount to avoid race conditions
    if (sessionStorage.getItem('justLoggedIn') === 'true') {
      sessionStorage.removeItem('justLoggedIn');
      hasRotated = true; // Mark as done for this session life
      return;
    }

    hasRotated = true;

    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return;

    const rotateToken = async () => {
      try {
        const response = await fetch('http://localhost:9090/api/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          console.log("Token rotation successful for current session.");
        } else {
          const errorText = await response.text();
          console.warn("Security Rotation Note:", errorText || "Token is currently active.");
          // We REMOVED the navigate('/login') here. 
          // This ensures you stay on the page even if a refresh attempt fails.
        }
      } catch (err) {
        console.error('Failed to refresh token:', err);
      }
    };
    
    rotateToken();
  }, [navigate]);

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