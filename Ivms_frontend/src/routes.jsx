import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./components/NotFound";
import ProcurementHub from "./pages/ProcurementHub";
import ProcurementShipment from "./pages/ProcurementShipment";
import ProcurementLayout from "./pages/ProcurementLayout";
import ProcurementCreatePurchaseOrder from "./pages/ProcurementCreatePurchaseOrder";
import ProcurementManagePurchaseOrders from "./pages/ProcurementManagePurchaseOrders";
import ProcurementReceiveGoods from "./pages/ProcurementReceiveGoods";

// Financial Pages
import FinancialLedger from "./pages/FinancialLedger";
import FinancialReports from "./pages/FinancialReports";

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
      {
        path: "procurement",
        element: <ProcurementLayout />, // Use the new Layout here
        children: [
          {
            index: true, // Matches /procurement
            element: <ProcurementHub />
          },
          {
            path: "track-shipments", // Matches /procurement/track-shipments
            element: <ProcurementShipment />
          },
          {
            path: "create-purchase-order", // Matches /procurement/create-purchase-order
            element: <ProcurementCreatePurchaseOrder />
          },
          {
            path: "manage-purchase-orders", // Matches /procurement/manage-purchase-orders
            element: <ProcurementManagePurchaseOrders />
          },
          {
            path: "receive-goods", // Matches /procurement/receive-goods
            element: <ProcurementReceiveGoods />
          }

        ]
      },
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

      { path: '*', element: <NotFound /> }



    ]
  }
  
 


    

]);



 