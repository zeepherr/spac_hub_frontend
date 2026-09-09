import {
  ClipboardCheck,
  ClipboardList,
  LayoutGrid,
  ListTree,
  MessageSquareText,
  PackageCheck,
  ScanLine,
  Images
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutGrid,
    end: true,
  },
  {
    name: "Categories",
    path: "/admin/categories",
    icon: ListTree,
  },
  {
    name: "Awaiting Receipt",
    path: "/admin/orders/awaiting-receipt",
    icon: ScanLine,
  },
  {
    name: "Inspection",
    path: "/admin/orders/inspection",
    icon: ClipboardCheck,
  },
  {
    name: "Ready to Ship",
    path: "/admin/orders/ready-to-ship",
    icon: PackageCheck,
  },
  {
    name: "Shipping Summary",
    path: "/admin/orders/summary",
    icon: ClipboardList,
  },
  {
    name: "Chat",
    path: "/admin/chats",
    icon: MessageSquareText,
  },
  {
    name: "Web Assets",
    path: "/admin/web-assets",
    icon: Images,
  },
];

const desktopSidebarTransition = {
  type: "spring",
  stiffness: 320,
  damping: 34,
  mass: 0.7,
};

const mobileDrawerTransition = {
  type: "spring",
  stiffness: 380,
  damping: 38,
  mass: 0.8,
};

export { desktopSidebarTransition, menuItems, mobileDrawerTransition };
