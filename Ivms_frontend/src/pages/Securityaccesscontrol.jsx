// src/pages/SecurityAccessControl.jsx
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert, Lock, UserX, Archive, Save,
  AlertTriangle, Key, ArrowLeft,
  Users, Loader2, UserCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SecurityAccessControl = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [localPermissions, setLocalPermissions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [savingPermissions, setSavingPermissions] = useState(false);

  // Fetch all users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8082/api/admin/users');
        if (!res.ok) {
          throw new Error(`Failed to load users: ${res.status}`);
        }
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Sync local permissions when a user is selected
  useEffect(() => {
    if (selectedUser?.permissions) {
      setLocalPermissions(new Set(selectedUser.permissions));
    } else {
      setLocalPermissions(new Set());
    }
  }, [selectedUser]);

  // Handle Deactivate / Activate / Archive
  const handleLifecycleAction = async (action, userId) => {
    let confirmMessage = '';

    if (action === 'deactivate') {
      confirmMessage = 'This will immediately revoke access. Continue?';
    } else if (action === 'activate') {
      confirmMessage = 'This will reactivate the user account. Continue?';
    } else if (action === 'archive') {
      confirmMessage = 'This will permanently archive the profile and revoke all access. Continue?';
    }

    if (!window.confirm(confirmMessage)) return;

    setActionLoading((prev) => ({ ...prev, [userId]: action }));

    try {
      let endpoint = '';

      if (action === 'deactivate') endpoint = `/api/admin/users/${userId}/deactivate`;
      else if (action === 'activate') endpoint = `/api/admin/users/${userId}/activate`;
      else if (action === 'archive') endpoint = `/api/admin/users/${userId}/archive`;

      const res = await fetch(`http://localhost:8082${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        let errorMessage = await res.text();

        if (res.status === 400) {
          errorMessage = errorMessage || 'Invalid operation (e.g. user already in this state)';
        } else if (res.status === 404) {
          errorMessage = 'User not found';
        } else {
          errorMessage = errorMessage || `Server error (${res.status})`;
        }

        throw new Error(errorMessage);
      }

      alert(`User successfully ${action}d!`);

      // Refresh users
      const updatedRes = await fetch('http://localhost:8082/api/admin/users');
      if (!updatedRes.ok) {
        throw new Error(`Failed to refresh users: ${updatedRes.status}`);
      }

      const updatedUsers = await updatedRes.json();
      setUsers(updatedUsers);

      // Update selected user
      const updatedUser = updatedUsers.find((u) => u.id === userId);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
    } catch (err) {
      alert(`Error during ${action}: ${err.message}`);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: null }));
    }
  };

  // Toggle individual permission
  const togglePermission = (perm) => {
    setLocalPermissions((prev) => {
      const newSet = new Set(prev);

      if (newSet.has(perm)) {
        newSet.delete(perm);
      } else {
        newSet.add(perm);
      }

      return newSet;
    });
  };

  // Save updated permissions
  const handleUpdatePermissions = async () => {
    if (!selectedUser) return;

    setSavingPermissions(true);

    try {
      const res = await fetch(`http://localhost:8082/api/admin/users/${selectedUser.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.from(localPermissions)),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Failed to update permissions');
      }

      alert('Permissions updated successfully!');

      // Refresh selected user data
      const updatedRes = await fetch(`http://localhost:8082/api/admin/users/${selectedUser.id}`);
      if (!updatedRes.ok) {
        throw new Error(`Failed to refresh user: ${updatedRes.status}`);
      }

      const updatedUser = await updatedRes.json();
      setSelectedUser(updatedUser);
      setLocalPermissions(new Set(updatedUser.permissions || []));

      // Keep left-side user list in sync too
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    } catch (err) {
      alert(`Error updating permissions: ${err.message}`);
    } finally {
      setSavingPermissions(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <AlertTriangle className="mx-auto mb-4" size={48} />
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 mb-3 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Admin Control
        </button>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-slate-800">Security &amp; Access Control</h1>
          <span className="bg-rose-100 text-rose-700 text-xs px-2.5 py-1 rounded font-bold uppercase flex items-center gap-1.5">
            <Lock size={14} /> Critical Security Area
          </span>
        </div>

        <p className="text-slate-500 text-sm mt-1">
          Manage user lifecycle, permissions, and system-wide security policies
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: User Selection */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-700 uppercase">Select User</h3>
              <Users size={16} className="text-slate-500" />
            </div>

            <div className="divide-y divide-slate-100 max-h-[70vh] overflow-y-auto">
              {users.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No users found in the system
                </div>
              ) : (
                users.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 ${
                      selectedUser?.id === user.id
                        ? 'bg-blue-50 border-l-4 border-blue-600'
                        : ''
                    }`}
                  >
                    <div className="font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{user.userId}</div>

                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {user.role}
                      </span>

                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          user.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-700'
                            : user.status === 'Inactive'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Permissions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedUser ? (
            <>
              {/* Account Lifecycle Management */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center gap-3 text-rose-700">
                  <ShieldAlert size={18} />
                  <h3 className="text-base font-bold uppercase tracking-tight">
                    Account Lifecycle Management
                  </h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Deactivate / Activate */}
                  <div className="p-5 border border-amber-200 bg-amber-50/30 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 text-amber-700">
                      {selectedUser.status === 'Active' ? (
                        <UserX size={20} />
                      ) : (
                        <UserCheck size={20} />
                      )}
                      <h4 className="text-sm font-bold">
                        {selectedUser.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                      </h4>
                    </div>

                    <p className="text-sm text-slate-600">
                      {selectedUser.status === 'Active'
                        ? 'Temporarily disable access. User cannot log in, but all data remains intact.'
                        : 'Reactivate the account. User will regain access.'}
                    </p>

                    <button
                      onClick={() =>
                        handleLifecycleAction(
                          selectedUser.status === 'Active' ? 'deactivate' : 'activate',
                          selectedUser.id
                        )
                      }
                      disabled={actionLoading[selectedUser.id] || selectedUser.status === 'Archived'}
                      className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                        selectedUser.status === 'Active'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {actionLoading[selectedUser.id] ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </span>
                      ) : selectedUser.status === 'Active' ? (
                        `Deactivate ${selectedUser.name.split(' ')[0]}`
                      ) : (
                        `Activate ${selectedUser.name.split(' ')[0]}`
                      )}
                    </button>
                  </div>

                  {/* Archive */}
                  <div className="p-5 border border-rose-200 bg-rose-50/30 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 text-rose-700">
                      <Archive size={20} />
                      <h4 className="text-sm font-bold">Archive Profile</h4>
                    </div>

                    <p className="text-sm text-slate-600">
                      Permanently remove access. Recommended for former employees.
                    </p>

                    <button
                      onClick={() => handleLifecycleAction('archive', selectedUser.id)}
                      disabled={actionLoading[selectedUser.id] || selectedUser.status === 'Archived'}
                      className={`w-full py-2.5 px-4 rounded-lg text-white font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                        selectedUser.status === 'Archived'
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                    >
                      {actionLoading[selectedUser.id] ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Processing...
                        </span>
                      ) : (
                        'Archive Permanently'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Permission Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-blue-700">
                    <Lock size={18} />
                    <h3 className="text-base font-bold uppercase tracking-tight">
                      Permission Matrix
                    </h3>
                  </div>

                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                    MANUAL OVERRIDE
                  </span>
                </div>

                <div className="p-6 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        module: 'Procurement',
                        perms: ['Create PO', 'Approve PO', 'Delete PO']
                      },
                      {
                        module: 'Inventory',
                        perms: ['Stock Adjustment', 'Warehouse Transfer', 'View Valuations']
                      },
                      {
                        module: 'Finance',
                        perms: ['View Ledger', 'Generate Reports', 'Edit Tax Settings']
                      }
                    ].map((group) => (
                      <div key={group.module} className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                          {group.module}
                        </h4>

                        <div className="space-y-3">
                          {group.perms.map((perm) => (
                            <label
                              key={perm}
                              className="flex items-center gap-3 cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={localPermissions.has(perm)}
                                onChange={() => togglePermission(perm)}
                                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors">
                                {perm}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      onClick={handleUpdatePermissions}
                      disabled={savingPermissions}
                      className={`flex items-center gap-2 px-6 py-2.5 bg-blue-700 text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-all shadow-md ${
                        savingPermissions ? 'opacity-70 cursor-wait' : ''
                      }`}
                    >
                      {savingPermissions ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Update Security Profile
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl py-24 bg-slate-50">
              <div className="p-6 bg-slate-100 rounded-full text-slate-400 mb-6">
                <Key size={48} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">No User Selected</h3>
              <p className="text-slate-500 text-center max-w-md">
                Select a user from the list on the left to manage their account lifecycle and permissions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAccessControl;