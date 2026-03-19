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

// --- Inventory Hub ---
import InventoryHub from "./pages/InventoryHub";
import InventoryHub_Register from "./pages/InventoryHub_Register";
import InventoryHub_Modify from "./pages/InventoryHub_Modify";
import InventoryHub_Archive from "./pages/InventoryHub_Archive";
import InventoryHub_Search from "./pages/InventoryHub_Search";
import InventoryDashboard from "./pages/InventoryDashboard";
import DashboardContent from "./pages/DashboardContent";

// --- Financial ---
import FinancialLedger from "./pages/FinancialLedger";
import FinancialReports from "./pages/FinancialReports";

// --- Sales ---
import SalesEngine from "./pages/SalesEngine";

// --- Admin ---
import AdminControl from "./pages/Admincontrol";
import UserManagement from "./pages/Usermanagement";
import AuditLogs from "./pages/Auditlogs";
import AdminOperations from "./pages/Adminoperations";
import SecurityAccessControl from "./pages/Securityaccesscontrol";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [

      // ✅ Inventory Module
      {
        path: "inventory",
        element: <InventoryDashboard />,
        children: [
          { index: true, element: <DashboardContent /> },
          { path: "register", element: <InventoryHub_Register /> },
          { path: "modify", element: <InventoryHub_Modify /> },
          { path: "archive", element: <InventoryHub_Archive /> },
          { path: "inventoryHub", element: <InventoryHub /> },
        ]
      },

      {
        path: "search",
        element: <InventoryHub_Search />
      },

      // ✅ Procurement Module
      {
        path: "procurement",
        element: <ProcurementLayout />,
        children: [
          { index: true, element: <ProcurementHub /> },
          { path: "track-shipments", element: <ProcurementShipment /> },
          { path: "create-purchase-order", element: <ProcurementCreatePurchaseOrder /> },
          { path: "manage-purchase-orders", element: <ProcurementManagePurchaseOrders /> },
          { path: "receive-goods", element: <ProcurementReceiveGoods /> }
        ]
      },

      // ✅ Supplier Module (FIXED)
      {
        path: "supplier",
        element: <div className="w-full h-full"><Outlet /></div>,
        children: [
          { index: true, element: <SupplierPortal /> },
          { path: "manage", element: <ManageVendors /> },
          { path: "register", element: <RegisterVendor /> },
          { path: "analytics", element: <VendorAnalytics /> },
          { path: "directory", element: <VendorDirectory /> }
        ]
      },

      // ✅ Financial
      { path: "financial-ledger", element: <FinancialLedger /> },
      { path: "financial-reports", element: <FinancialReports /> },

      // ✅ Admin
      { path: "admin", element: <AdminControl /> },
      { path: "admin/users", element: <UserManagement /> },
      { path: "admin/audit", element: <AuditLogs /> },
      { path: "admin/operations", element: <AdminOperations /> },
      { path: "admin/security", element: <SecurityAccessControl /> },

      // ✅ Sales
      { path: "sales", element: <SalesEngine /> },

      // ✅ Not Found
      { path: "*", element: <NotFound /> }

    ]
  }
]);
