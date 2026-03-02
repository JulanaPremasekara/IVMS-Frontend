// config/navConfig.js
import { 
  LayoutGrid, Package, Search, ShoppingCart, 
  Building2, DollarSign, BarChart3, FileText, Settings,ShieldCheck 
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', path: '/' },
  { 
    id: 'inventory', 
    icon: Package, 
    label: 'Inventory Hub', 
    path: '/inventory',
    children: ['/inventory/register', '/inventory/modify', '/inventory/archive','/inventory/inventoryHub']
  },
  { id: 'search', icon: Search, label: 'Inventory Search', path: '/search' },
  { id: 'sales', icon: ShoppingCart, label: 'Sales Engine', path: '/sales' },
  { id: 'procurement', icon: ShoppingCart, label: 'Procurement Hub', path: '/procurement',children: ['/procurement/track-shipments', '/procurement/create-purchase-order', '/procurement/manage-purchase-orders', '/procurement/receive-goods'] },
  { id: 'supplier', icon: Building2, label: 'Supplier Portal', path: '/supplier', children: ['/supplier/manage','/supplier/analytics','/supplier/directory','/supplier/register','/supplier/directory/overview' ]},
  { id: 'ledger', icon: DollarSign, label: 'Financial Ledger', path: '/financial-ledger' },
  { id: 'reports', icon: BarChart3, label: 'Financial Reports', path: '/financial-reports' },
  {
    id: 'admin-control',
    icon: ShieldCheck,
    label: 'Admin Control',
    path: '/admin',
  },
  { id: 'settings', icon: Settings, label: 'System Settings', path: '/user-management' },

];



