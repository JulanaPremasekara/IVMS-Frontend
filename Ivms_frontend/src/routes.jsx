import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./components/NotFound";

// --- Procurement Pages ---
import ProcurementHub from "./pages/ProcurementHub";
import ProcurementShipment from "./pages/ProcurementShipment";
import ProcurementLayout from "./pages/ProcurementLayout";
import ProcurementCreatePurchaseOrder from "./pages/ProcurementCreatePurchaseOrder";
import ProcurementManagePurchaseOrders from "./pages/ProcurementManagePurchaseOrders";
import ProcurementReceiveGoods from "./pages/ProcurementReceiveGoods";

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


export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
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

      // 404 Not Found Handler
      { path: '*', element: <NotFound /> }
    ]
  }
]);