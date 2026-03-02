import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Users, Award, TrendingUp, Eye, Plus, Clock, AlertCircle } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { StatCard } from '../components/ui/StatCard';

const SupplierPortal = () => {
  const navigate = useNavigate();
  // Initialize with default values to prevent "undefined" errors
  const [stats, setStats] = useState({ total: 0, pending: 0 });
  const [recentVendors, setRecentVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch Stats
      const statsRes = await fetch("http://localhost:8080/api/v1/vendors/stats");
      if (!statsRes.ok) throw new Error("Backend unreachable");
      const statsData = await statsRes.json();
      setStats(statsData);

      // Fetch Recent Vendors
      const vendorsRes = await fetch("http://localhost:8080/api/v1/vendors");
      const vendorsData = await vendorsRes.json();
      setRecentVendors(Array.isArray(vendorsData) ? vendorsData.slice(0, 5) : []);
      setError(null);
    } catch (error) {
      console.error("Dashboard Sync Error:", error);
      setError("Connection error. Ensure the Spring Boot app is running on port 8080.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <div className="space-y-6">
      {/* Error Alert Bar */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Supplier Portal</h1>
          <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">Intelligent Vendor Management Dashboard</p>
        </div>
        <div className="flex flex-wrap gap-2">
          
          <ActionButton label="Manage Vendors" variant="primary" onClick={() => navigate('/supplier/manage')} />
          <ActionButton label="Vendor Directory" variant="primary" onClick={() => navigate('/supplier/directory')} />
          <ActionButton label="Analytics" variant="primary" onClick={() => navigate('/supplier/analytics')} /> 
          <ActionButton label="Add Vendor" icon={Plus} variant="primary" onClick={() => navigate('/supplier/register')} />
          
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Added optional chaining ?. and fallbacks to prevent crashes */}
        <StatCard title="Total Vendors" value={stats?.total?.toString() || "0"} icon={Layout} colorClass="text-orange-600" bgColor="bg-orange-600" />
        <StatCard title="Pending Approvals" value={stats?.pending?.toString() || "0"} icon={Users} colorClass="text-yellow-600" bgColor="bg-yellow-500" />
        <StatCard title="Avg. Reliability" value="8.5/10" icon={Award} colorClass="text-emerald-600" bgColor="bg-emerald-600" />
        <StatCard title="Total Contracts" value="0" icon={TrendingUp} colorClass="text-blue-600" bgColor="bg-[#1e3a8a]" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-slate-50/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-800">Recent Onboarding Activity</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-10 text-center text-xs text-slate-400 animate-pulse">Loading activity...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                <tr>
                  <th className="px-6 py-3">Vendor</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentVendors.length > 0 ? recentVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="px-6 py-4 text-xs font-bold text-slate-700">{vendor.companyName}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${vendor.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {vendor.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="2" className="px-6 py-10 text-center text-xs text-slate-400">No recent activity found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;