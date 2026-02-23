import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Users, Award, TrendingUp, Eye, BarChart2, Folder,FolderOpen, Plus } from 'lucide-react';
import { ActionButton } from '../components/ui/ActionButton';
import { StatCard } from '../components/ui/StatCard';

const SupplierPortal = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Supplier Portal</h1>
          <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">
            Intelligent Vendor Management Dashboard
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {/* LINK TO THE MANAGE PAGE */}
          <ActionButton 
            label="Manage Vendors" 
            icon={Eye} 
            variant="secondary" 
            onClick={() => navigate('/supplier/manage')} 
          />
          <ActionButton label="Analytics" icon={BarChart2} variant="secondary" onClick={() => navigate('/supplier/analytics')}/>
          <ActionButton label="Vendor Directory" icon={FolderOpen} variant="secondary" onClick={() => navigate('/supplier/directory')} />
          <ActionButton label="Add Vendor" icon={Plus} variant="primary" onClick={() => navigate('/supplier/register')}   />
          
        
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <StatCard title="Total Vendors" value="87" icon={Layout} colorClass="text-orange-600" bgColor="bg-orange-600" />
        <StatCard title="Pending Approvals" value="5" icon={Users} colorClass="text-yellow-600" bgColor="bg-yellow-500" />
        <StatCard title="Avg. Reliability" value="8.5/10" icon={Award} colorClass="text-emerald-600" bgColor="bg-emerald-600" />
        <StatCard title="Total Contracts" value="142" icon={TrendingUp} colorClass="text-blue-600" bgColor="bg-[#1e3a8a]" />
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-md">
              <Layout className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Recent Vendors</h3>
          </div>
        </div>
        <div className="p-12 text-center">
          <Users className="w-8 h-8 text-slate-300 mx-auto mb-4" />
          <h3 className="text-slate-800 font-bold">No Recent Activity</h3>
          <p className="text-slate-400 text-xs mt-1">Start by adding a new vendor to the portal.</p>
        </div>
      </div>
    </div>
  );
};

export default SupplierPortal;