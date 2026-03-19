import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, UserX, Shield, Search,
  ArrowLeft, Plus, Eye, Edit2, Trash2, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StatCard } from '../components/ui/StatCard';

const UserManagement = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get('http://localhost:8080/api/admin/users');
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("Could not load users. Is the backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    navigate('/admin/users/add', { state: { editUser: user } });
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser?.id) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/users/${selectedUser.id}`);
      setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Dynamic stats
  const userStats = [
    { title: "Total Users", value: users.length.toString(), icon: Users, colorClass: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Users", value: users.filter(u => u.status === "Active").length.toString(), icon: UserCheck, colorClass: "text-emerald-600", bgColor: "bg-emerald-50" },
    { title: "Inactive Users", value: users.filter(u => u.status !== "Active").length.toString(), icon: UserX, colorClass: "text-slate-600", bgColor: "bg-slate-50" },
    { title: "Admin Roles", value: users.filter(u => u.role?.toLowerCase() === "admin").length.toString(), icon: Shield, colorClass: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  if (loading) return <div className="p-10 text-center text-slate-500">Loading users...</div>;

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl mx-auto max-w-4xl">
      <p className="font-medium">{error}</p>
      <p className="text-sm mt-2">Make sure backend is running on http://localhost:8080</p>
    </div>
  );

  return (
    <div className="space-y-6 relative">

      {/* VIEW MODAL */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowViewModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#1e3a8a] p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg"><Users size={20} /></div>
                <h3 className="font-bold text-lg tracking-tight">User Information</h3>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <div className="p-8 grid grid-cols-2 gap-y-6 gap-x-8">
              <DetailItem label="User ID" value={selectedUser.userId || selectedUser.id} highlight />
              <DetailItem label="Account Status" value={selectedUser.status} status />
              <DetailItem label="Full Name" value={selectedUser.name} fullWidth />
              <DetailItem label="Email Address" value={selectedUser.email} fullWidth />
              <DetailItem label="Designation" value={selectedUser.designation} />
              <DetailItem label="System Role" value={selectedUser.role} />
              <DetailItem label="Last Activity" value={selectedUser.lastLogin || 'Never'} fullWidth />
            </div>
            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowViewModal(false)} className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">Close Details</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
          <div className="relative bg-white rounded-[32px] shadow-2xl max-w-sm w-full p-10 text-center animate-in fade-in zoom-in duration-200">
            <div className="mx-auto w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-6">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Delete User?</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-10">
              Are you sure you want to delete <span className="font-bold text-slate-700">{selectedUser.name}</span>? This action will permanently remove the user from the system.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl text-sm font-bold hover:bg-rose-700 shadow-lg shadow-rose-100 transition-all"
              >
                Yes, Delete User
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full py-4 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-100 transition-all border border-slate-100"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
        <button
          onClick={() => navigate('/admin/users/add')}
          className="flex items-center gap-2 px-4 py-2 bg-[#1e3a8a] text-white rounded-lg text-xs font-bold hover:bg-blue-900 shadow-lg shadow-blue-100 transition-all"
        >
          <Plus size={14} /> Add New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {userStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Search & Filter (placeholder) */}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
          <Users size={16} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-800">System Users ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            No users found.
          </div>
        ) : (
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
                    <td className="px-6 py-4 text-xs font-bold text-blue-600">{user.userId || user.id}</td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{user.name}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{user.email}</td>
                    <td className="px-6 py-4 text-xs text-slate-500">{user.designation || '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${user.role?.toLowerCase() === 'admin' ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white'}`}>
                        {user.role || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {user.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[10px] text-slate-400 font-medium">{user.lastLogin || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleView(user)} className="p-1.5 text-slate-400 hover:text-blue-600 border border-slate-100 rounded hover:bg-white transition-all shadow-sm">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleEdit(user)} className="p-1.5 text-slate-400 hover:text-amber-600 border border-slate-100 rounded hover:bg-white transition-all shadow-sm">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDeleteClick(user)} className="p-1.5 text-slate-400 hover:text-rose-600 border border-slate-100 rounded hover:bg-white transition-all shadow-sm">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ label, value, highlight, status, fullWidth }) => (
  <div className={fullWidth ? "col-span-2" : "col-span-1"}>
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{label}</label>
    <p className={`text-sm font-semibold ${
      highlight ? "text-blue-600 font-bold" :
      status ? (value === 'Active' ? "text-emerald-600" : "text-slate-500") :
      "text-slate-700"
    }`}>
      {value || '—'}
    </p>
  </div>
);

export default UserManagement;