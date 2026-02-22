import React from 'react';

export const StatCard = ({ title, value, icon: Icon, colorClass, bgColor }) => (
  <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-start min-w-[180px] flex-1">
    <div>
      <p className="text-xs font-medium text-slate-500 mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${colorClass}`}>{value}</h3>
    </div>
    <div className={`p-2 rounded-lg ${bgColor}`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
  </div>
);