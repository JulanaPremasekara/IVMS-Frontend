import React from 'react';

export const ActionButton = ({ label, icon: Icon, onClick, variant = 'primary' }) => {
  const styles = variant === 'primary' 
    ? 'bg-[#1e3a8a] text-white hover:bg-blue-900 shadow-md shadow-blue-100' 
    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50';

  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${styles}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
};
