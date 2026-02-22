import React from 'react';
import { ChevronRight, HelpCircle } from 'lucide-react'; // Fallback icon
import { useNavigate } from 'react-router-dom';

export const QuickActionCard = ({ title, subtitle, icon: Icon, colorClass, path }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(path)}
      className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer group flex-1 min-w-[300px]"
    >
      <div className="flex items-center gap-4">
        {/* The Icon Container */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${colorClass}`}>
          {/* If Icon exists, render it. If not, render a fallback HelpCircle */}
          {Icon ? (
            <Icon className="w-7 h-7 text-white" />
          ) : (
            <HelpCircle className="w-7 h-7 text-white opacity-50" />
          )}
        </div>
        
        <div>
          <h4 className="text-base font-bold text-slate-800 leading-tight">{title}</h4>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
      </div>

      <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-slate-100 transition-colors">
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500" />
      </div>
    </div>
  );
};