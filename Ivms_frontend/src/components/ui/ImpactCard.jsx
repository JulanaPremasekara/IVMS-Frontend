export const ImpactCard = ({ title, icon: Icon, children, statusBadge }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-slate-50 rounded-lg">
          <Icon className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      {statusBadge}
    </div>
    {children}
  </div>
);