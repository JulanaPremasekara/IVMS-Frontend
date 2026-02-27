import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export const CreationModeToggle = () => {
  const [mode, setMode] = useState('manual');

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Creation Mode:</span>
      <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
        <button 
          onClick={() => setMode('manual')}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
        >
          Manual Creation
        </button>
        <button 
          onClick={() => setMode('ai')}
          className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${mode === 'ai' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500'}`}
        >
          <Sparkles className={`w-3 h-3 ${mode === 'ai' ? 'text-purple-500' : 'text-slate-400'}`} />
          AI Suggested
        </button>
      </div>
    </div>
  );
};