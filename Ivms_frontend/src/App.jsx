import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import { ShieldCheck, RefreshCw } from 'lucide-react';

function App() {
 

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-600">
      <Login/>
      <div className="mt-8 flex flex-col items-center space-y-4">
        <div className="flex items-center space-x-6 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center space-x-1">
            <ShieldCheck size={14} />
            <span>256-bit Encryption</span>
          </div>
          <div className="flex items-center space-x-1">
            <RefreshCw size={14} />
            <span>Uptime 99.9%</span>
          </div>
        </div>
        <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
          © 2024 COGNITIVE IVMS • ENTERPRISE GRADE SECURITY
        </p>
      </div>
    </div>
  )
}

export default App
