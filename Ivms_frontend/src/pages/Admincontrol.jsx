import React from 'react';
import { Users, Shield, History, Settings, UserPlus, Database, Activity } from 'lucide-react';
import { QuickActionCard } from '../components/ui/QuickActionCard';
import { StatCard } from '../components/ui/StatCard';

const AdminControl = () => {
  const adminSections = [
    {
      title: "User Management",
      subtitle: "Add new users, modify existing accounts, and manage user information",
      icon: Users,
      colorClass: "bg-blue-600",
      path: "/admin/users"
    },
    {
      title: "Audit Trail & Compliance",
      subtitle: "All admin actions are automatically logged. View complete system history and compliance reports.",
      icon: History,
      colorClass: "bg-emerald-500",
      path: "/admin/audit"
    },
    {
      title: "Admin Operations",
      subtitle: "Reset passwords, manage accounts, and execute warehouse transfers",
      icon: Settings,
      colorClass: "bg-amber-500",
      path: "/admin/operations"
    },
    {
      title: "Security & Access Control",
      subtitle: "Deactivate user accounts, archive warehouses, and manage security",
      icon: Shield,
      colorClass: "bg-rose-500",
      path: "/admin/security"
    }
  ];

  const stats = [
    { title: "Active Users", value: "24", icon: Users, colorClass: "text-blue-600", bgColor: "bg-blue-100" },
    { title: "User Roles", value: "5", icon: Shield, colorClass: "text-purple-600", bgColor: "bg-purple-100" },
    { title: "Today's Actions", value: "147", icon: Activity, colorClass: "text-amber-600", bgColor: "bg-amber-100" },
    { title: "System Status", value: "Operational", icon: Database, colorClass: "text-emerald-600", bgColor: "bg-emerald-100" }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-slate-800">Admin Control</h1>
          <span className="bg-[#1e3a8a] text-white text-[10px] px-2 py-0.5 rounded font-bold uppercase">Administrator</span>
        </div>
        <p className="text-slate-500 text-sm">Centralized system administration for user management, security, and operational control</p>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {adminSections.map((section, index) => (
          <QuickActionCard key={index} {...section} />
        ))}
      </div>

      {/* Bottom Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AdminControl;