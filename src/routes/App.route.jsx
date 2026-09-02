import ProfileLayout from "@/layouts/ProfileLayout";
import Buy from "@/pages/public/user/Buy";
import Profile from "@/pages/public/user/Profile";
import Sell from "@/pages/public/user/Sell";
import { createBrowserRouter } from "react-router";
import AdminLayout from "../layouts/AdminLayout";
import AuthLayout from "../layouts/AuthLayout";
import PublicLayout from "../layouts/PublicLayout";
import Dashboard from "../pages/admin/Dashboard";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import VerifyPage from "../pages/auth/VerifyPage";
import HomePage from "../pages/public/HomePage";
import ProtectedRoute from "./Protected.route";
import RoleRoute, { ROLES } from "./Role.route";
import CreateProductPage from "@/pages/public/user/CreateProductPage";
import Categories from "@/pages/admin/Categories";
import CatagoryPage from "@/pages/public/CatagoryPage";

import AwaitingReceipt from "@/pages/admin/AwaitingReceipt";
import Inspection from "@/pages/admin/Inspection";
import ReadyToShip from "@/pages/admin/ReadyToShip";
import ActionRequired from "@/pages/admin/ActionRequired";
import AdminChats from "@/pages/admin/AdminChats";

const router = createBrowserRouter([
  {
    path: "/",
    Component: PublicLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "categories",
        Component: CatagoryPage,
      },
      {
        Component: ProtectedRoute,
        children: [
          {
            element: <RoleRoute allowRoles={[ROLES.USER]} />,
            children: [
              {
                path: "user",
                Component: ProfileLayout,
                children: [
                  {
                    index: true,
                    Component: Buy,
                  },
                  {
                    path: "sell",
                    Component: Sell,
                  },
                  {
                    path: "sell/create",
                    Component: CreateProductPage,
                  },
                  {
                    path: "details",
                    Component: Profile,
                  },
                  {
                    path: "favorites",
                    element: null,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  {
    Component: ProtectedRoute,
    children: [
      {
        element: <RoleRoute allowRoles={[ROLES.ADMIN]} />,
        children: [
          {
            path: "/admin",
            Component: AdminLayout,
            children: [
              {
              index: true,
              Component: Dashboard,
            },
            {
              path: "orders/awaiting-receipt",
              Component: AwaitingReceipt,
            },
            {
              path: "orders/inspection",
              Component: Inspection,
            },
            {
              path: "orders/ready-to-ship",
              Component: ReadyToShip,
            },
            {
              path: "orders/action-required",
              Component: ActionRequired,
            },
            {
              path: "chats",
              Component: AdminChats,
            },
            {
              path: "categories",
              Component: Categories,
            },
            ],
          },
        ],
      },
    ],
  },
  //auth
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/verify-email",
        Component: VerifyPage,
      },
    ],
  },
  //admin routes

  {
    path: "*",
    element: <p>This page is not found</p>,
  },
]);

export default router;
