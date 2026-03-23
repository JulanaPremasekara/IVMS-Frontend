import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./components/NotFound";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

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
    path: '/login',
    element: <Login />
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      //{ index: true, element: <Dashboard/>}, // Default route
      { index: true, element: <Navigate to="/login" replace />}, // Default route redirects to login    
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
      element: <ProtectedRoute allowedRoles={["Inventory Manager"]}><InventoryHub_Register /></ProtectedRoute>
    },
    {
      path: "modify", // Matches /inventory/modify
      element: <ProtectedRoute allowedRoles={["Inventory Manager"]}><InventoryHub_Modify /></ProtectedRoute>
    },
    {
      path: "archive", // Matches /inventory/archive
      element: <ProtectedRoute allowedRoles={["Inventory Manager"]}><InventoryHub_Archive /></ProtectedRoute>
    },
    {
      path: "inventoryHub",
      element: <ProtectedRoute allowedRoles={["Inventory Manager"]}><InventoryHub /></ProtectedRoute>
    },
  ]
},
      {
        path:"search",
        element:<ProtectedRoute allowedRoles={["Inventory Manager"]}><InventoryHub_Search/></ProtectedRoute>
      },

      // 2. Procurement Module Routes
      {
        path: "procurement",
        element: <ProtectedRoute allowedRoles={["Procurement Officer"]}><ProcurementLayout /></ProtectedRoute>, 
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
        element: <ProtectedRoute allowedRoles={["Finance Manager"]}><FinancialLedger /></ProtectedRoute>
      },
      {
        path: "financial-reports",
        element: <ProtectedRoute allowedRoles={["Finance Manager"]}><FinancialReports /></ProtectedRoute>
      },

      {
        path: "admin", // Matches the path in your Sidebar
        element: <ProtectedRoute allowedRoles={[]}><AdminControl /></ProtectedRoute>
      },

      {
        path: "admin/users", 
        element: <ProtectedRoute allowedRoles={[]}><UserManagement /></ProtectedRoute>
      },

      {
        path: "admin/audit", 
        element: <ProtectedRoute allowedRoles={[]}><AuditLogs /></ProtectedRoute>
      },

      {
        path: "admin/operations", 
        element: <ProtectedRoute allowedRoles={[]}><AdminOperations /></ProtectedRoute>
      },
      {
        path: "admin/security", 
        element: <ProtectedRoute allowedRoles={[]}><SecurityAccessControl /></ProtectedRoute>
      },

      {
        path: "supplier",
        element: <ProtectedRoute allowedRoles={["Procurement Officer"]}><div className="w-full h-full"><Outlet /></div></ProtectedRoute>, // This allows child routes like /manage to render
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
        element: <ProtectedRoute allowedRoles={["Sales Representative"]}><SalesEngine /></ProtectedRoute>
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
        element: <ProtectedRoute allowedRoles={[]}><PlaceholderPage title="System Settings" icon="⚙️" description="Configure system preferences" /></ProtectedRoute>
      },
      { path: '*', element: <NotFound /> }

      
    ]
  }

]);
 
