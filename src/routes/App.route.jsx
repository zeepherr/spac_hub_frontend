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
import EditProfile from "@/pages/public/user/EditProfile";
import NotFound from "@/components/์NotFound";

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
                    path: "profile",
                    Component: Profile,
                  },
                  {
                    path: "profile/edit",
                    Component: EditProfile,
                  },
                  {
                    path: "favorites",
                    element: null,
                  },
                  {
                    path: "*",
                    Component: NotFound
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
                path: "categories",
                Component: Categories,
              },
              {
                path: "*",
                Component: NotFound
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
      {
        path: "*",
        Component: NotFound
      },
    ],
  },
  //admin routes

  {
    path: "*",
    Component: NotFound
  },
]);

export default router;
