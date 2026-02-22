export const StatusBadge = ({ status }) => {
  const styles = {
    'In Transit': 'bg-blue-50 text-blue-600 border-blue-100',
    'Delayed': 'bg-red-50 text-red-600 border-red-100',
    'Customs': 'bg-orange-50 text-orange-600 border-orange-100',
    'Partially Received': 'bg-purple-50 text-purple-600 border-purple-100',
    'Overdue': 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${styles[status] || 'bg-slate-50 text-slate-600'}`}>
      {status}
    </span>
  );
};