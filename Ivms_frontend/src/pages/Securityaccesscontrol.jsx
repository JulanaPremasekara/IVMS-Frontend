import React, { useState } from 'react';
import { 
  ShieldAlert, Lock, UserX, Archive, Save, 
  ChevronRight, AlertTriangle, Key, ArrowLeft,
  Users, CheckCircle, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityAccessControl = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for user management actions
  const users = [
    { id: 'USR-1021', name: 'John Doe', email: 'john@company.com', role: 'Inventory Manager', status: 'Active' },
    { id: 'USR-1035', name: 'Sarah Chen', email: 'sarah.c@company.com', role: 'Procurement', status: 'Active' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button 
          onClick={() => navigate('/admin')} 
          className="flex items-center gap-2 text-[10px] font-bold text-blue-600 mb-2 border border-blue-100 px-2 py-1 rounded bg-blue-50/50 hover:bg-blue-100 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft size={12} /> Back to Admin Control
        </button>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Security & Access Control</h1>
          <span className="bg-rose-100 text-rose-700 text-[10px] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-1">
            <Lock size={10} /> Critical Security Area
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">Manage user lifecycle, permissions, and system-wide security policies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Selection for Security Actions */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase">Select User</h3>
              <Users size={14} className="text-slate-400" />
            </div>
            <div className="divide-y divide-slate-50">
              {users.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${selectedUser?.id === user.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''}`}
                >
                  <div className="font-bold text-slate-800 text-xs">{user.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium uppercase">{user.role}</span>
                    <span className="text-[9px] text-emerald-600 font-bold">{user.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Operations Panels */}
        <div className="lg:col-span-2 space-y-6">
          {selectedUser ? (
            <>
              {/* User Lifecycle Management: Deactivate & Archive */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2 text-rose-600">
                  <ShieldAlert size={16} />
                  <h3 className="text-sm font-bold uppercase">Account Lifecycle Management</h3>
                </div>
                
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deactivate User */}
                  <div className="p-4 border border-amber-100 bg-amber-50/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-amber-700">
                      <UserX size={18} />
                      <h4 className="text-xs font-bold">Deactivate Account</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Temporarily disable access. The user will be unable to log in, but all historical data remains intact.
                    </p>
                    <button className="w-full py-2 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all">
                      Deactivate {selectedUser.name.split(' ')[0]}
                    </button>
                  </div>

                  {/* Archive User */}
                  <div className="p-4 border border-rose-100 bg-rose-50/30 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-700">
                      <Archive size={18} />
                      <h4 className="text-xs font-bold">Archive Profile</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Permanently remove access and move records to cold storage. Recommended for employees leaving the company.
                    </p>
                    <button className="w-full py-2 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all">
                      Archive Permanently
                    </button>
                  </div>
                </div>
              </div>

              {/* Granular Permissions Section */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-600">
                    <Lock size={16} />
                    <h3 className="text-sm font-bold uppercase">Permission Matrix</h3>
                  </div>
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold uppercase">Manual Override</span>
                </div>
                
                <div className="p-6 space-y-4">
                  {[
                    { module: 'Procurement', permissions: ['Create PO', 'Approve PO', 'Delete PO'] },
                    { module: 'Inventory', permissions: ['Stock Adjustment', 'Warehouse Transfer', 'View Valuations'] },
                    { module: 'Finance', permissions: ['View Ledger', 'Generate Reports', 'Edit Tax Settings'] }
                  ].map((group, idx) => (
                    <div key={idx} className="space-y-3 border-b border-slate-50 pb-4 last:border-0">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{group.module} Access</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {group.permissions.map(perm => (
                          <label key={perm} className="flex items-center gap-2 cursor-pointer group">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600" />
                            <span className="text-[11px] text-slate-600 group-hover:text-blue-600 transition-colors">{perm}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                   <button className="flex items-center gap-2 px-6 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 shadow-lg shadow-blue-100">
                      <Save size={14} /> Update Security Profile
                   </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-xl py-20 bg-white">
              <div className="p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
                <Key size={40} />
              </div>
              <h3 className="text-slate-800 font-bold text-sm">No User Selected</h3>
              <p className="text-slate-400 text-xs mt-1">Select a user from the sidebar to manage security settings</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessControl;