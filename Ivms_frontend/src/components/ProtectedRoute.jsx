import React from 'react';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();

  // System Admin is a superuser and can access EVERYTHING
  const hasAccess = userRole === 'System Admin' || (allowedRoles && allowedRoles.includes(userRole));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center bg-white rounded-3xl shadow-sm border border-slate-100 animate-in fade-in zoom-in duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
          ACCESS RESTRICTED
        </h2>
        
        <p className="text-slate-500 max-w-md mb-8 leading-relaxed font-medium">
          Your current clearance level <span className="text-red-600 font-bold">[{userRole || 'Guest'}]</span> does not have authorization to view this secure module.
        </p>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
          >
            <ArrowLeft size={18} /> Go Back
          </button>
          
          <button 
            onClick={() => navigate('/inventory')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
          >
            <Home size={18} /> Dashboard
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
