import AllProduct from "@/components/auth/AllProduct";
import CategoryListingPage from "@/components/category/ListByCategory";
import NotFound from "@/components/NotFound";
import ProfileLayout from "@/layouts/ProfileLayout";
import Categories from "@/pages/admin/Categories";
import CartPage from "@/pages/cart/CartPage";
import ListingDetailPage from "@/pages/listing/ListingDeatailPage";
import CatagoryPage from "@/pages/public/CatagoryPage";
import ListingPage from "@/pages/public/ListingPage";
import Buy from "@/pages/public/user/Buy";
import CreateProductPage from "@/pages/public/user/CreateProductPage";
import EditProfile from "@/pages/public/user/EditProfile";
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
<<<<<<< HEAD
import CreateProductPage from "@/pages/public/user/CreateProductPage";
import Categories from "@/pages/admin/Categories";
import CatagoryPage from "@/pages/public/CatagoryPage";
import EditProfile from "@/pages/public/user/EditProfile";

import ListingPage from "@/pages/public/ListingPage";
import { Component } from "lucide-react";
import ListingDetailPage from "@/pages/listing/ListingDeatailPage";
import CategoryListingPage from "@/components/category/ListByCategory";
import AllProduct from "@/components/auth/AllProduct";
import CartPage from "@/pages/cart/CartPage";
=======
>>>>>>> dev

import ActionRequired from "@/pages/admin/ActionRequired";
import AdminChats from "@/pages/admin/AdminChats";
import AwaitingReceipt from "@/pages/admin/AwaitingReceipt";
import Inspection from "@/pages/admin/Inspection";
import ReadyToShip from "@/pages/admin/ReadyToShip";
<<<<<<< HEAD
import ActionRequired from "@/pages/admin/ActionRequired";
import AdminChats from "@/pages/admin/AdminChats";
import NotFound from "@/components/NotFound";
=======
>>>>>>> dev

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
        path: "products",
        Component: ListingPage,
        children: [
          {
            index: true, // 👈 เพิ่มใหม่ - ตรงกับ path "/products" เป๊ะๆ
            Component: AllProduct,
          },
          {
            path: "categories",
            Component: CatagoryPage,
            children: [
              {
                path: ":categoryId",
                Component: CategoryListingPage,
              },
            ],
          },
          {
            path: ":id",
            Component: ListingDetailPage,
          },
        ],
      },
      {
        path: "/store",
        Component: CartPage,
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
                    Component: NotFound,
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
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },
  //admin routes

  {
    path: "*",
    Component: NotFound,
  },
]);

export default router;
