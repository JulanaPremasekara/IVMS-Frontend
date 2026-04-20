import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  Mail,
  User,
  CheckCircle,
  Save,
  Key
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ROLE_OPTIONS = [
  { value: 'system admin', label: 'System Admin' },
  { value: 'procurement officer', label: 'Procurement Officer' },
  { value: 'inventory manager', label: 'Inventory Manager' },
  { value: 'finance manager', label: 'Finance Manager' },
  { value: 'sales representative', label: 'Sales Representative' }
];

const LEGACY_ROLE_MAP = {
  admin: 'system admin',
  'super admin': 'system admin',
  procurement: 'procurement officer',
  'procurement manager': 'procurement officer',
  warehouse: 'inventory manager',
  'warehouse manager': 'inventory manager',
  inventory: 'inventory manager',
  finance: 'finance manager',
  'finance officer': 'finance manager',
  sales: 'sales representative',
  'sales staff': 'sales representative'
};

const normalizeRole = (role) => {
  const normalized = String(role || '').trim().toLowerCase();
  return LEGACY_ROLE_MAP[normalized] || normalized;
};

const AddUser = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const editUser = location.state?.editUser || null;

  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditMode, setIsEditMode] = useState(Boolean(editUser));
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    password: '',
    forcePasswordChange: true,
    sendWelcomeEmail: true
  });

  useEffect(() => {
    if (editUser) {
      setIsEditMode(true);
      setFormData({
        fullName: editUser.name || '',
        email: editUser.email || '',
        role: normalizeRole(editUser.role),
        password: '',
        forcePasswordChange: false,
        sendWelcomeEmail: false
      });
    } else {
      setIsEditMode(false);
      setFormData({
        fullName: '',
        email: '',
        role: '',
        password: '',
        forcePasswordChange: true,
        sendWelcomeEmail: true
      });
    }
  }, [editUser]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim() && !isEditMode) return 'Email is required';
    if (!formData.role.trim()) return 'Role is required';
    if (!isEditMode && !formData.password.trim()) return 'Password is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const validationError = validateForm();
    if (validationError) {
      setLoading(false);
      setErrorMsg(validationError);
      return;
    }

    try {
      if (isEditMode) {
        if (!editUser?.id) {
          throw new Error('Missing user id for edit operation');
        }

        await axios.put(`http://localhost:8082/api/admin/users/${editUser.id}`, {
          fullName: formData.fullName,
          role: formData.role
        });
      } else {
        await axios.post('http://localhost:8082/api/admin/users/add', formData);
      }

      setShowSuccess(true);
    } catch (err) {
      console.error('Save failed:', err);

      let message = 'Unknown error occurred';

      if (err.response) {
        if (err.response.status === 400 && err.response.data) {
          message = err.response.data.message || 'Validation failed';
          if (err.response.data.errors) {
            message = err.response.data.errors
              .map((item) => `${item.field}: ${item.defaultMessage}`)
              .join(', ');
          }
        } else if (err.response.data?.message) {
          message = err.response.data.message;
        } else {
          message = err.response.statusText || `Error ${err.response.status}`;
        }
      } else if (err.request) {
        message = 'No response from server. Is backend running?';
      } else {
        message = err.message;
      }

      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
      {showSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={48} strokeWidth={2.5} />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {isEditMode ? 'User Updated Successfully' : 'User Created Successfully'}
            </h3>

            <p className="text-gray-600 mb-8">
              {formData.fullName} has been {isEditMode ? 'updated' : 'added'} to the system.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full py-4 bg-indigo-700 text-white rounded-2xl font-semibold hover:bg-indigo-800 transition-all shadow-md"
              >
                Return to User List
              </button>

              {!isEditMode && (
                <button
                  onClick={() => {
                    setFormData({
                      fullName: '',
                      email: '',
                      role: '',
                      password: '',
                      forcePasswordChange: true,
                      sendWelcomeEmail: true
                    });
                    setShowSuccess(false);
                    setErrorMsg(null);
                  }}
                  className="w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-all border border-gray-200"
                >
                  Add Another User
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="max-w-5xl mx-auto mt-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-5 rounded-r-xl">
          <p className="font-bold">Operation failed</p>
          <p className="mt-1">{errorMsg}</p>
        </div>
      )}

      <div className="max-w-5xl mx-auto space-y-8 pt-8 px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-2"
            >
              <ArrowLeft size={16} /> Back to Users
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit User' : 'Add New User'}
            </h1>
          </div>

          <span
            className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${
              isEditMode ? 'bg-amber-100 text-amber-800' : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            <ShieldCheck size={14} />
            {isEditMode ? 'Edit Mode' : 'New User'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div
              className={`px-8 py-5 ${
                isEditMode ? 'bg-amber-600' : 'bg-indigo-700'
              } text-white flex items-center gap-3`}
            >
              <User size={20} />
              <h2 className="text-lg font-semibold uppercase tracking-wide">
                {isEditMode ? 'Update User Profile' : 'User Information'}
              </h2>
            </div>

            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      disabled={isEditMode}
                      placeholder="Enter email address"
                      className={`w-full pl-12 pr-4 py-3 border rounded-xl outline-none transition-all ${
                        isEditMode
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                          : 'bg-gray-50 border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400'
                      }`}
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </div>

                {!isEditMode && (
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="password"
                        placeholder="Enter password"
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Role *</label>
                  <select
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                  >
                    <option value="">Select a role</option>
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="px-10 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-10 py-3 text-white font-medium rounded-xl shadow-md transition-all ${
                isEditMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {isEditMode ? <Save size={18} /> : <UserPlus size={18} />}
              {loading ? 'Saving...' : isEditMode ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;