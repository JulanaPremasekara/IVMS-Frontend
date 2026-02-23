import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import NotFound from "./components/NotFound";
import ProcurementHub from "./pages/ProcurementHub";
import ProcurementShipment from "./pages/ProcurementShipment";
import ProcurementLayout from "./pages/ProcurementLayout";
import ProcurementCreatePurchaseOrder from "./pages/ProcurementCreatePurchaseOrder";
import ProcurementManagePurchaseOrders from "./pages/ProcurementManagePurchaseOrders";
import ProcurementReceiveGoods from "./pages/ProcurementReceiveGoods";
import FinancialLedger from "./pages/FinancialLedger";
import FinancialReports from "./pages/FinancialReports";
import SupplierPortal from "./pages/SupplierPortal";
import ManageVendors from "./pages/ManageVendors";
import RegisterVendor from "./pages/RegisterVendor";
import VendorAnalytics from "./pages/VendorAnalytics";
import VendorDirectory from "./pages/VendorDirectory";

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

      { path: '*', element: <NotFound /> }

      

    ]
  }
]);