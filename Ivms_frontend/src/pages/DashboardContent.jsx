import React from 'react';
import { Package, AlertTriangle, TrendingUp, ShoppingCart, PlusCircle, List } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color, iconBg }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
    <div className={`${iconBg} p-2 rounded-lg`}>
      <Icon size={20} className={color} />
    </div>
  </div>
);

const DashboardContent = () => {
  const stats = [
    { title: "Total SKUs", value: "1,234", icon: Package, color: "text-blue-600", iconBg: "bg-blue-50" },
    { title: "Low Stock Items", value: "23", icon: AlertTriangle, color: "text-amber-600", iconBg: "bg-amber-50" },
    { title: "Sales This Month", value: "$45,230", icon: TrendingUp, color: "text-green-600", iconBg: "bg-green-50" },
    { title: "Active Orders", value: "156", icon: ShoppingCart, color: "text-purple-600", iconBg: "bg-purple-50" },
  ];

  const navigate=useNavigate();

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {/* Navigate to Register Page */}
          <button 
            onClick={() => navigate('/inventory/register')} 
            className="w-full flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="bg-blue-50 p-2 rounded-lg mr-4 group-hover:bg-blue-100">
              <PlusCircle className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <p className="font-semibold">Register New SKU</p>
              <p className="text-sm text-gray-500">Add new product to inventory</p>
            </div>
          </button>

          {/* Navigate to Inventory Hub Table */}
          <button 
            onClick={() => navigate('/inventory/inventoryHub')} 
            className="w-full flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-colors group"
          >
            <div className="bg-blue-50 p-2 rounded-lg mr-4 group-hover:bg-blue-100">
              <List className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <p className="font-semibold">View Inventory</p>
              <p className="text-sm text-gray-500">Browse all products</p>
            </div>
          </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Recent Activity</h2>
          <div className="space-y-6">
            <ActivityItem color="bg-green-500" title="SKU-1043 registered" time="2 hours ago" />
            <ActivityItem color="bg-blue-500" title="Stock updated for SKU-1022" time="5 hours ago" />
            <ActivityItem color="bg-amber-500" title="Low stock alert: SKU-1015" time="1 day ago" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ color, title, time }) => (
  <div className="flex items-start">
    <div className={`w-2 h-2 rounded-full mt-2 mr-4 ${color}`} />
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{time}</p>
    </div>
  </div>
);

export default DashboardContent;