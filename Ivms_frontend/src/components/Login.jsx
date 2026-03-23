import React, { useState } from 'react'
import { 
  ShieldCheck, Mail, Lock, Eye, EyeOff, 
  ArrowRight, Info, Loader2, AlertCircle, 
  Globe 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLoginSuccess }) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  if (isLocked) return;
  
  setIsLoading(true);
  setError('');
  try {
    const response = await fetch('http://localhost:9090/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    // Check if it's actually a successful response before parsing JSON
    if (!response.ok) {
      const errorText = await response.text(); // Get raw text to avoid JSON crash
      throw new Error(`Server responded with ${response.status}: ${errorText || 'Forbidden'}`);
    }

    const data = await response.json(); // Now this is safe to call

    // 2. Now check for errors
    if (!response.ok) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 3) {
        setIsLocked(true);
        throw new Error("Security protocol engaged: Account restricted.");
      }
      // Use message from backend if available, otherwise generic error
      throw new Error(data.message || `Error ${response.status}: Access Denied`);
    }

    // 3. Success logic...
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', data.role);
    localStorage.setItem('userName', data.name);
    sessionStorage.setItem('justLoggedIn', 'true');
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess(data.role);
    } else {
      // Default fallback navigation if no onLoginSuccess is provided
      navigate('/inventory');
    }
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f8fafc] relative overflow-hidden">
      
      {/* --- Subtle Background Elements (Matching Image Style) --- */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px]" />

      <div className="w-full max-w-[460px] px-6 z-10">
        
        {/* --- Logo Style --- */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-default">
            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10"></div>
            <div className="relative flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl shadow-xl">
              <ShieldCheck className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-2xl font-light text-slate-900 mt-5 tracking-[-0.05em]">
            COGNITIVE <span className="font-black text-blue-600 italic tracking-tighter">IVMS</span>
          </h1>
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.4em] mt-2">
            Intelligent Vendor Management
          </p>
        </div>

        {/* --- Login Card (Solid High-Contrast Style) --- */}
        <div className="bg-white rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="p-10">
            
            <div className="mb-10 flex flex-col items-center text-center">
              <div className="bg-slate-50 p-3 rounded-full mb-4">
                <Globe size={20} className="text-blue-600" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-sm">
                  Verify your identity to proceed
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs font-bold text-red-700">{error}</p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
                  Access Identifier
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    disabled={isLocked || isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300"
                    placeholder="name@cognitive.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">
                    Passkey
                  </label>
                  <button type="button" className="text-[10px] font-bold text-blue-600 hover:text-blue-800">Forgot Password?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLocked || isLoading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-600/10 focus:border-blue-600 outline-none transition-all text-slate-900 font-medium placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember Me</span>
                </label>
                <Info size={14} className="text-slate-300 cursor-help" />
              </div>

              <button 
                type="submit"
                disabled={isLocked || isLoading}
                className={`w-full py-4 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center space-x-3 shadow-lg ${
                  isLocked 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                  : 'bg-blue-900 text-white hover:bg-slate-900 shadow-blue-200 active:scale-[0.98]'
                }`}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <span>{isLocked ? "LOCKOUT ACTIVE" : "INITIATE ACCESS"}</span>
                    {!isLocked && <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-slate-50 py-6 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Don't have an account? <a href="#" className="font-bold text-blue-600 hover:underline">Contact Administrator</a>
            </p>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-slate-200"></span>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em]">
              Secured by Cognitive Defense
            </p>
            <span className="h-[1px] w-8 bg-slate-200"></span>
        </div>
      </div>
    </div>
  )
}