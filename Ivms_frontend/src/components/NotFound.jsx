import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Visual Element */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="relative bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
          <FileQuestion className="w-20 h-20 text-blue-600" />
        </div>
      </div>

      {/* Text Content */}
      <h1 className="text-6xl font-bold text-slate-900 mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-4">
        Page Not Found
      </h2>
      <p className="text-slate-500 max-w-md mb-8 leading-relaxed">
        The page you're looking for doesn't exist or has been moved. 
        Please check the URL or return to the dashboard.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200"
        >
          <Home className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;