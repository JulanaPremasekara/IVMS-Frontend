import React from 'react'
import { useState } from 'react'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, ArrowRight, Info} from 'lucide-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <>
    <div className="w-full max-w-[440px] bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
        <div className="p-10">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-50 p-4 rounded-full">
              <ShieldCheck className="w-10 h-10 text-blue-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
            <p className="text-slate-400 text-sm tracking-wide uppercase font-medium">
              Professional Management Portal Access
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6">
            {/* Username/Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-slate-500">Remember Me</span>
                <Info size={14} className="text-slate-300" />
              </label>
              <a href="#" className="font-bold text-blue-600 hover:text-blue-700">Forgot Password?</a>
            </div>

            {/* Submit Button */}
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2 group">
              <span>Login to Dashboard</span>
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="bg-slate-50/50 py-6 text-center border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Don't have an account? <a href="#" className="font-bold text-blue-600 hover:underline">Contact Administrator</a>
          </p>
        </div>
      </div></>
  )
}
