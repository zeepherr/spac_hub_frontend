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
import Categories from "@/components/admin/Categories";

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
        Component: ProtectedRoute,
        children: [
          {
            element: <RoleRoute allowRoles={[ROLES.USER]} />,
            children: [
              {
                path: "/user",
                Component: PublicLayout,
                children: [
                  {
                    index: true,
                    Component: HomePage,
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
