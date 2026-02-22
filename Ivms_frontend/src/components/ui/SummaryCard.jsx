export const SummaryCard = ({ title, icon: Icon, children, footer }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm mb-4">
    <div className="p-4 border-b border-slate-50 flex items-center gap-2">
      <Icon className="w-4 h-4 text-emerald-600" />
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
    <div className="p-4 space-y-3">{children}</div>
    {footer && <div className="p-3 bg-slate-50/50 border-t border-slate-50">{footer}</div>}
  </div>
);