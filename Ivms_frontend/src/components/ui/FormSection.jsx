export const FormSection = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden mb-6">
    <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-blue-600 rounded-md">
          <Icon className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
      </div>
      {action && <div>{action}</div>}
    </div>
    <div className="p-5">{children}</div>
  </div>
);
