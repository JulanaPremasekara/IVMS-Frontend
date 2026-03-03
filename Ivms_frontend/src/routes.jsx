import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./components/NotFound";

// --- Procurement Pages ---
import ProcurementHub from "./pages/ProcurementHub";
import ProcurementShipment from "./pages/ProcurementShipment";
import ProcurementLayout from "./pages/ProcurementLayout";
import ProcurementCreatePurchaseOrder from "./pages/ProcurementCreatePurchaseOrder";
import ProcurementManagePurchaseOrders from "./pages/ProcurementManagePurchaseOrders";
import ProcurementReceiveGoods from "./pages/ProcurementReceiveGoods";
import SupplierPortal from "./pages/SupplierPortal";
import ManageVendors from "./pages/ManageVendors";
import RegisterVendor from "./pages/RegisterVendor";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorDirectory from "./pages/VendorDirectory";

// --- Inventory Hub Pages (Your Specific Part) ---
import InventoryHub from "./pages/InventoryHub"; 
import InventoryHub_Register from "./pages/InventoryHub_Register"; // UC-101
import InventoryHub_Modify from "./pages/InventoryHub_Modify";     // UC-103
import InventoryHub_Archive from "./pages/InventoryHub_Archive";   // UC-104



// --- Financial Pages ---
import FinancialLedger from "./pages/FinancialLedger";
import FinancialReports from "./pages/FinancialReports";
import InventoryDashboard from "./pages/InventoryDashboard";
import InventoryHub_Search from "./pages/InventoryHub_Search";
import DashboardContent from "./pages/DashboardContent";

// Sales Engine
import SalesEngine from "./pages/SalesEngine";

// Placeholder Pages
import PlaceholderPage from "./components/PlaceholderPage";

// Admin Control
import AdminControl from "./pages/Admincontrol";

//User management
import UserManagement from "./pages/Usermanagement";

//Audit logs
import AuditLogs from "./pages/Auditlogs";

//Admin operation

import AdminOperations from "./pages/Adminoperations";

//Security Access Control
import SecurityAccessControl from "./pages/Securityaccesscontrol";


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // { index: true, element: <Dashboard/>}, // Default route    
      {
  path: "inventory",
  element: <InventoryDashboard />,
  children: [
    {
      index: true, // This makes DashboardContent the default view
      element: <DashboardContent />
    },
    {
      path: "register", // Matches /inventory/register
      element: <InventoryHub_Register />
    },
    {
    path: "search",
    element: <InventoryHub_Search />,
    },
    {
      path: "modify", // Matches /inventory/modify
      element: <InventoryHub_Modify />
    },
    {
      path: "archive", // Matches /inventory/archive
      element: <InventoryHub_Archive />
    },
    {
      path: "inventoryHub",
      element: <InventoryHub />
    },
  ]
},
      {
        path:"search",
        element:<InventoryHub_Search/>
      },

      // 2. Procurement Module Routes
      {
        path: "procurement",
        element: <ProcurementLayout />, 
        children: [
          {
            index: true,
            element: <ProcurementHub />
          },
          {
            path: "track-shipments",
            element: <ProcurementShipment />
          },
          {
            path: "create-purchase-order",
            element: <ProcurementCreatePurchaseOrder />
          },
          {
            path: "manage-purchase-orders",
            element: <ProcurementManagePurchaseOrders />
          },
          {
            path: "receive-goods",
            element: <ProcurementReceiveGoods />
          }
        ]
      },

      // 3. Financial Module Routes
      {
        path: "financial-ledger",
        element: <FinancialLedger />
      },
      {
        path: "financial-reports",
        element: <FinancialReports />
      },

      {
        path: "admin", // Matches the path in your Sidebar
        element: <AdminControl />
      },

      {
        path: "admin/users", 
        element: <UserManagement />
      },

      {
        path: "admin/audit", 
        element: <AuditLogs />
      },

      {
        path: "admin/operations", 
        element: <AdminOperations />
      },
      {
        path: "admin/security", 
        element: <SecurityAccessControl />
      },



      {
        path: "supplier",
        element: <div className="w-full h-full"><Outlet /></div>, // This allows child routes like /manage to render
        children: [
          {
            index: true, // This is /supplier
            element: <SupplierPortal />
          },
          {
            path: "manage", // This is /supplier/manage
            element: <ManageVendors />
          },
          { path: "register", 
            element: <RegisterVendor /> 
          },

          { path: "analytics", 
            element: <VendorAnalytics />
          },

          { path: "directory",
            element: <VendorDirectory /> }

        ]
      },

      {
        path: "sales",
        element: <SalesEngine />
      },
      {
        path: "inventory",
        element: <PlaceholderPage title="Inventory Hub" icon="📦" description="Manage your inventory and stock levels" />
      },
      {
        path: "search",
        element: <PlaceholderPage title="Inventory Search" icon="🔍" description="Search and track inventory items" />
      },
      {
        path: "supplier",
        element: <PlaceholderPage title="Supplier Portal" icon="👥" description="Collaborate with your suppliers" />
      },
      {
        path: "audit",
        element: <PlaceholderPage title="Audit Trail" icon="📋" description="Monitor system activities and changes" />
      },
      {
        path: "user-management",
        element: <PlaceholderPage title="System Settings" icon="⚙️" description="Configure system preferences" />
      },



      // 404 Not Found Handler
      { path: '*', element: <NotFound /> }

      

    ]
  }
  
 


    

]);



 