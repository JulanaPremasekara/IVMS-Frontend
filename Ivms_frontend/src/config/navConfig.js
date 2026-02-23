// config/navConfig.js
import { 
  LayoutGrid, Package, Search, ShoppingCart, 
  Building2, DollarSign, BarChart3, FileText, Settings 
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
<<<<<<< HEAD
  { id: 'supplier', icon: Building2, label: 'Supplier Portal', path: '/supplier', children: ['supplier/manage','supplier/analytics']},
=======
  { id: 'supplier', icon: Building2, label: 'Supplier Portal', path: '/supplier', children: ['supplier/manage']},
>>>>>>> fa11df4041880a7d23082c8380fdfce7ced76bc2
  { id: 'ledger', icon: DollarSign, label: 'Financial Ledger', path: '/financial-ledger' },
  { id: 'reports', icon: BarChart3, label: 'Financial Reports', path: '/financial-reports' },
  { id: 'audit', icon: FileText, label: 'Audit Trail', path: '/audit' },
  { id: 'settings', icon: Settings, label: 'System Settings', path: '/user-management' },


];