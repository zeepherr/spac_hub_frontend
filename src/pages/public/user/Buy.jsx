import {
    Clock3,
    PackageCheck,
    ShoppingBag,
    ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router";

import DashboardStatCard from "@/components/userDashboard/DashboardStatCard";
import PendingReceipt from "@/components/userDashboard/PendingReceipt";
import RecentMessages from "@/components/userDashboard/RecentMessages";
import RecentOrders from "@/components/userDashboard/RecentOrders";
import useAuthStore from "@/stores/auth.store";

/*
 * Mock Data ของหน้า User Dashboard
 *
 * ตอนนี้ยังไม่มี Backend จึงกำหนดข้อมูลไว้ก่อน
 * ภายหลังสามารถลบตัวแปรนี้แล้วเปลี่ยนไปใช้ API ได้
 */
const dashboardMock = {
    summary: {
        cartItems: 3,
        totalOrders: 5,
        processingOrders: 1,
        shippingOrders: 2,
    },

    pendingReceipt: {
        id: "order-001",
        orderNumber: "ORD-20250609-001",
        productName:
            "ASUS TUF Gaming GeForce RTX 3060 Ti 8GB",
        message:
            "คุณมี 1 รายการที่รอยืนยันรับสินค้า",
    },

    recentMessages: [
        {
            id: "message-001",
            conversationId: "conversation-001",
            senderName: "เกย์ตัวท็อป",
            senderImageUrl: "",
            message:
                "สวัสดีครับ สินค้าพร้อมจัดส่งแล้วนะครับ",
            createdAt: "2026-09-03T06:20:00.000Z",
            isUnread: true,
        },
        {
            id: "message-002",
            conversationId: "conversation-002",
            senderName: "NextGen Gadget",
            senderImageUrl: "",
            message: "ขอบคุณครับผม 🙏",
            createdAt: "2026-09-03T04:00:00.000Z",
            isUnread: true,
        },
    ],

    recentOrders: [
        {
            id: "order-001",
            orderNumber: "ORD-20250609-001",
            productName:
                "ASUS TUF Gaming GeForce RTX 3060 Ti 8GB",
            productImageUrl: "",
            price: 7900,
            status: "PENDING_PAYMENT",
            createdAt: "2026-06-09T10:00:00.000Z",
        },
        {
            id: "order-002",
            orderNumber: "ORD-20250607-002",
            productName:
                "Dell Latitude 5420 i5-1145G7 16GB 512GB SSD",
            productImageUrl: "",
            price: 12900,
            status: "SHIPPING",
            createdAt: "2026-06-07T13:30:00.000Z",
        },
        {
            id: "order-003",
            orderNumber: "ORD-20250605-003",
            productName: "AMD Ryzen 5 5600X",
            productImageUrl: "",
            price: 4290,
            status: "COMPLETED",
            createdAt: "2026-06-05T09:15:00.000Z",
        },
    ],
};

function Buy() {
    const navigate = useNavigate();

    const user = useAuthStore(
        (state) => state.user,
    );

    /*
     * นำ Mock Data มาใช้งาน
     */
    const {
        summary,
        pendingReceipt,
        recentMessages,
        recentOrders,
    } = dashboardMock;

    function handleConfirmReceipt(orderId) {
        console.log(
            "ยืนยันรับสินค้าของ Order:",
            orderId,
        );
    }

    return (
        <section className="min-h-full bg-base-200/30 px-5 py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* หัวข้อด้านบน */}
                <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-base-content">
                            สวัสดี,{" "}
                            {user?.firstName ||
                                "ผู้ใช้งาน"}{" "}
                            👋
                        </h1>

                        <p className="mt-2 text-sm text-base-content/60">
                            ติดตามคำสั่งซื้อและกิจกรรมของคุณ
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
                    >
                        <ShoppingBag
                            size={19}
                            aria-hidden="true"
                        />

                        เลือกซื้อสินค้า
                    </button>
                </header>

                {/* การ์ดสรุป 4 ช่อง */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardStatCard
                        title="สินค้าในตะกร้า"
                        value={summary.cartItems}
                        icon={ShoppingCart}
                        iconClassName="text-emerald-600"
                        iconBackgroundClassName="bg-emerald-50"
                        onClick={() =>
                            console.log("เปิดตะกร้า")
                        }
                    />

                    <DashboardStatCard
                        title="คำสั่งซื้อทั้งหมด"
                        value={summary.totalOrders}
                        icon={ShoppingBag}
                        iconClassName="text-orange-600"
                        iconBackgroundClassName="bg-orange-50"
                        onClick={() =>
                            console.log(
                                "เปิดคำสั่งซื้อทั้งหมด",
                            )
                        }
                    />

                    <DashboardStatCard
                        title="กำลังดำเนินการ"
                        value={summary.processingOrders}
                        icon={Clock3}
                        iconClassName="text-amber-600"
                        iconBackgroundClassName="bg-amber-50"
                        onClick={() =>
                            console.log(
                                "เปิดรายการกำลังดำเนินการ",
                            )
                        }
                    />

                    <DashboardStatCard
                        title="กำลังจัดส่ง"
                        value={summary.shippingOrders}
                        icon={PackageCheck}
                        iconClassName="text-blue-600"
                        iconBackgroundClassName="bg-blue-50"
                        onClick={() =>
                            console.log(
                                "เปิดรายการกำลังจัดส่ง",
                            )
                        }
                    />
                </div>

                {/* ยืนยันสินค้าและข้อความ */}
                <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                    <PendingReceipt
                        pendingReceipt={pendingReceipt}
                        onConfirm={
                            handleConfirmReceipt
                        }
                    />

                    <RecentMessages
                        messages={recentMessages}
                        onViewAll={() =>
                            console.log(
                                "เปิดข้อความทั้งหมด",
                            )
                        }
                        onOpenMessage={(
                            conversationId,
                        ) =>
                            console.log(
                                "เปิด Conversation:",
                                conversationId,
                            )
                        }
                    />
                </div>

                {/* คำสั่งซื้อล่าสุด */}
                <div className="mt-5">
                    <RecentOrders
                        orders={recentOrders}
                        onViewAll={() =>
                            console.log(
                                "เปิดคำสั่งซื้อทั้งหมด",
                            )
                        }
                        onOpenOrder={(orderId) =>
                            console.log(
                                "เปิดคำสั่งซื้อ:",
                                orderId,
                            )
                        }
                    />
                </div>
            </div>
        </section>
    );
}

export default Buy;