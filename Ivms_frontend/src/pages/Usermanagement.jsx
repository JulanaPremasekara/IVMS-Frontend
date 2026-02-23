import React from 'react';
import { 
  Users, UserCheck, UserX, Shield, Search, 
  ArrowLeft, Plus, Eye, Edit2, Power, Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '../components/ui/StatCard';

const UserManagement = () => {
  const navigate = useNavigate();

  const userStats = [
    { title: "Total Users", value: "5", icon: Users, colorClass: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Users", value: "4", icon: UserCheck, colorClass: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Inactive Users", value: "1", icon: UserX, colorClass: "text-slate-600", bgColor: "bg-slate-50" },
    { title: "Admin Roles", value: "2", icon: Shield, colorClass: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  const users = [
    { id: 'USR-001', name: 'John Anderson', email: 'john.anderson@company.com', designation: 'Warehouse Manager', role: 'Warehouse Manager', status: 'Active', lastLogin: '2026-02-21 08:30 AM' },
    { id: 'USR-002', name: 'Sarah Chen', email: 'sarah.chen@company.com', designation: 'Procurement Manager', role: 'Procurement Manager', status: 'Active', lastLogin: '2026-02-21 09:15 AM' },
    { id: 'USR-003', name: 'Michael Rodriguez', email: 'michael.r@company.com', designation: 'Sales Staff', role: 'Sales Staff', status: 'Active', lastLogin: '2026-02-20 04:45 PM' },
    { id: 'USR-004', name: 'Emma Wilson', email: 'emma.wilson@company.com', designation: 'Finance Officer', role: 'Admin', status: 'Inactive', lastLogin: '2026-02-15 11:20 AM' },
    { id: 'USR-005', name: 'Admin User', email: 'admin@company.com', designation: 'System Administrator', role: 'Admin', status: 'Active', lastLogin: '2026-02-21 10:00 AM' },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 mb-2 border border-blue-200 px-3 py-1 rounded-md bg-blue-50/50"
          >
            <ArrowLeft size={14} /> Back to Admin Control
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Admin Control</span>
          </div>
          <p className="text-slate-500 text-sm mt-1">Manage system users, assign roles, and control access permissions</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-100 transition-all">
          <Plus size={16} /> Add New User
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search by name, email, or user ID..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-4 py-2 rounded-lg outline-none">
            <option>All Roles</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 px-4 py-2 rounded-lg outline-none">
            <option>All Status</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
          <Users size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">System Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase text-[10px] font-bold">
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Designation</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Login</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-blue-600">{user.id}</td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-700">{user.name}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{user.email}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{user.designation}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${user.role === 'Admin' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[10px] text-slate-400 font-medium">{user.lastLogin}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 border border-slate-100 rounded hover:bg-white transition-all"><Eye size={14} /></button>
                      <button className="p-1.5 text-slate-400 hover:text-amber-600 border border-slate-100 rounded hover:bg-white transition-all"><Edit2 size={14} /></button>
                      <button className={`p-1.5 border border-slate-100 rounded hover:bg-white transition-all ${user.status === 'Active' ? 'text-rose-400 hover:text-rose-600' : 'text-emerald-400 hover:text-emerald-600'}`}>
                        <Power size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Global Security Policy Section */}
      <div className="bg-white rounded-xl border border-purple-100 shadow-sm overflow-hidden">
        <div className="px-6 py-3 bg-purple-50/30 border-b border-purple-50 flex items-center gap-2 text-purple-600">
          <Shield size={16} />
          <h3 className="text-sm font-bold">Global Security Policy</h3>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-xl border border-purple-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-800">Enforce Mandatory Password Change on First Login</h4>
                <span className="bg-emerald-500 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase">Enabled</span>
              </div>
              <p className="text-xs text-slate-500">When enabled, all newly created users must update their password at first login. This global policy applies to all new user accounts.</p>
            </div>
            <div className="w-10 h-5 bg-blue-900 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="mt-4 flex gap-3 p-4 bg-blue-50/30 border border-blue-100 rounded-xl">
            <div className="p-2 bg-blue-100 rounded-lg h-fit text-blue-600">
              <Info size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-blue-700">Security Best Practice</h5>
              <p className="text-[11px] text-blue-600/80 leading-relaxed">Enabling this policy ensures that temporary passwords cannot be used indefinitely, reducing security risks and ensuring users set their own secure credentials.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;