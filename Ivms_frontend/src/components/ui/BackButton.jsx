import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center text-sm mb-6">
      {/* The Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center hover:text-blue-600 transition-colors group text-slate-600"
      >
        <ArrowLeft size={18} className="mr-1.5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold text-[15px]">Back</span>
      </button>

      {/* The Vertical Divider Line */}
      <div className="h-4 w-[1px] bg-gray-300 mx-4"></div> 
      
      {/* Optional Breadcrumb text (like "Inventory Hub" in your screenshot) */}
      <span className="text-gray-400 cursor-default">Dashboard</span>
    </div>
  );
};

export default BackButton;