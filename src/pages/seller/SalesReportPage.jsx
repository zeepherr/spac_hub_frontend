import React, { useState, useMemo } from "react";
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  ArrowLeft, 
  Calendar,
  Filter,
  Package
} from "lucide-react";
import { useNavigate } from "react-router";
import { useSellingOrders } from "@/hook/order/useSellingOrder";
import { StatCards } from "@/components/userSellerDashboard/StatCards";
import { RevenueChart } from "@/components/userSellerDashboard/RevenueChart";
import { TransactionTable } from "@/components/userSellerDashboard/TransactionTable";

export default function SalesReportPage() {
  const navigate = useNavigate();
  const { data: sellingOrders = [], isLoading } = useSellingOrders();
  const [statusFilter, setStatusFilter] = useState("ALL");

  // 1. Analytics Calculation Logic
  const analytics = useMemo(() => {
    if (!sellingOrders || sellingOrders.length === 0) {
      return {
        totalSales: 0,
        pendingPayout: 0,
        completedCount: 0,
        averageOrderValue: 0,
        monthlyData: [],
        monthOverMonthChange: 0,
      };
    }

    const pendingStatuses = [
      "PAID",
      "SELLER_SHIPPING",
      "INSPECTION_PENDING",
      "INSPECTING",
      "NEEDS_REVIEW",
      "VERIFIED",
      "SHIPPING_TO_BUYER",
    ];

    let salesTotal = 0;
    let payoutTotal = 0;
    let completedOrdersCount = 0;

    const now = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      months.push({ key: monthKey, label, total: 0, count: 0 });
    }

    const monthlyMap = new Map(months.map((m) => [m.key, m]));

    sellingOrders.forEach((order) => {
      const price = Number(order.agreedPrice || order.totalPrice || 0);

      if (order.status === "COMPLETED") {
        salesTotal += price;
        completedOrdersCount += 1;

        if (order.createdAt) {
          const orderDate = new Date(order.createdAt);
          const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
          if (monthlyMap.has(monthKey)) {
            const current = monthlyMap.get(monthKey);
            current.total += price;
            current.count += 1;
          }
        }
      }

      if (pendingStatuses.includes(order.status)) {
        payoutTotal += price;
      }
    });

    const chartData = Array.from(monthlyMap.values());
    const currentMonthSales = chartData[chartData.length - 1]?.total || 0;
    const previousMonthSales = chartData[chartData.length - 2]?.total || 0;

    let momChange = 0;
    if (previousMonthSales > 0) {
      momChange = Math.round(((currentMonthSales - previousMonthSales) / previousMonthSales) * 100);
    } else if (currentMonthSales > 0) {
      momChange = 100;
    }

    const avgOrderValue = completedOrdersCount > 0 ? Math.round(salesTotal / completedOrdersCount) : 0;

    return {
      totalSales: salesTotal,
      pendingPayout: payoutTotal,
      completedCount: completedOrdersCount,
      averageOrderValue: avgOrderValue,
      monthlyData: chartData,
      monthOverMonthChange: momChange,
    };
  }, [sellingOrders]);

  // 2. Filter Table Items
  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return sellingOrders;
    if (statusFilter === "COMPLETED") return sellingOrders.filter((o) => o.status === "COMPLETED");
    if (statusFilter === "PENDING") {
      const pendingStatuses = ["PAID", "SELLER_SHIPPING", "INSPECTION_PENDING", "INSPECTING", "NEEDS_REVIEW", "VERIFIED", "SHIPPING_TO_BUYER"];
      return sellingOrders.filter((o) => pendingStatuses.includes(o.status));
    }
    return sellingOrders;
  }, [sellingOrders, statusFilter]);

  if (isLoading) {
    return (
      /* 🟢 ปรับเปลี่ยน Skeleton Container เป็น w-full */
      <div className="w-full p-4 sm:p-6 md:p-8 space-y-6">
        <div className="skeleton h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="skeleton h-72 rounded-3xl" />
      </div>
    );
  }

  return (
    /* 🟢 เปลี่ยนจาก max-w-6xl mx-auto เป็น w-full เพื่อขยายเต็มหน้าจอ */
    <div className="w-full p-4 sm:p-6 md:p-8 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-circle btn-ghost btn-sm cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-base-content tracking-tight">Sales Analytics & Report</h1>
            <p className="text-xs text-base-content/60 font-medium">
              Monitor your revenue trends and detailed selling operations
            </p>
          </div>
        </div>
      </div>

      {/* Sub-components */}
      <StatCards analytics={analytics} />
      <RevenueChart monthlyData={analytics.monthlyData} />
      <TransactionTable
        orders={filteredOrders}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </div>
  );
}