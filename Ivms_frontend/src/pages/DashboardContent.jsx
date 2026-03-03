import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Package, AlertTriangle, TrendingUp, ShoppingCart, 
  PlusCircle, List, Search, History 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BackButton from "../components/ui/BackButton";

const StatCard = ({ title, value, icon: Icon, color, iconBg }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex justify-between items-start hover:shadow-md transition-shadow">
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
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/products');
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to sync dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRealTimeStats();
  }, []);

  const totalSKUs = products.length;
  const lowStockItems = products.filter(p => p.initialStock <= 5).length;
  const totalInventoryValue = products.reduce((acc, p) => acc + (p.unitPrice * p.initialStock || 0), 0);

  const stats = [
    { title: "Total SKUs", value: loading ? "..." : totalSKUs, icon: Package, color: "text-blue-600", iconBg: "bg-blue-50" },
    { title: "Low Stock Items", value: loading ? "..." : lowStockItems, icon: AlertTriangle, color: "text-amber-600", iconBg: "bg-amber-50" },
    { title: "Inventory Value", value: loading ? "..." : `$${totalInventoryValue.toLocaleString()}`, icon: TrendingUp, color: "text-green-600", iconBg: "bg-green-50" },
    { title: "Active Orders", value: "0", icon: ShoppingCart, color: "text-purple-600", iconBg: "bg-purple-50" },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <BackButton />
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-4">Inventory Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => <StatCard key={idx} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Management Actions</h2>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/inventory/register')} 
              className="w-full flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-all hover:border-blue-200 group"
            >
              <div className="bg-blue-50 p-2 rounded-lg mr-4 group-hover:bg-blue-100">
                <PlusCircle className="text-blue-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Register New SKU</p>
                <p className="text-sm text-gray-500">Add a new product to the master database</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/inventory/search')} 
              className="w-full flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-all hover:border-amber-200 group"
            >
              <div className="bg-amber-50 p-2 rounded-lg mr-4 group-hover:bg-amber-100">
                <Search className="text-amber-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold">Search & Modify Inventory</p>
                <p className="text-sm text-gray-500">Check ATP, Modify stock, or Archive items</p>
              </div>
            </button>

            <button 
              onClick={() => navigate('/inventory/inventoryHub')} 
              className="w-full flex items-center p-4 border rounded-xl hover:bg-gray-50 transition-all hover:border-purple-200 group"
            >
              <div className="bg-purple-50 p-2 rounded-lg mr-4 group-hover:bg-purple-100">
                <List className="text-purple-600" size={24} />
              </div>
              <div className="text-left">
                <p className="font-semibold">View Master List</p>
                <p className="text-sm text-gray-500">Full table view of all active inventory</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">System Log</h2>
            <History size={18} className="text-gray-400" />
          </div>
          <div className="space-y-6">
            {products.slice(-4).reverse().map((p, i) => (
              <ActivityItem 
                key={i}
                color="bg-green-500" 
                title={`New SKU: ${p.name}`} 
                subtitle={`SKU #${p.skuCode} added to ${p.warehouseLocation}`}
                time="Recent" 
              />
            ))}
            {products.length === 0 && (
              <div className="text-center py-8">
                <Package className="mx-auto text-gray-300 mb-2" size={40} />
                <p className="text-gray-400 text-sm">No recent entries found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ color, title, subtitle, time }) => (
  <div className="flex items-start">
    <div className={`w-2 h-2 rounded-full mt-2 mr-4 ${color} shrink-0`} />
    <div className="flex-1">
      <p className="font-medium text-gray-800 leading-none">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
    </div>
    <p className="text-xs text-gray-400 whitespace-nowrap ml-2">{time}</p>
  </div>
);

export default DashboardContent;