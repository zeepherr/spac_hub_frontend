import { useLocation, useSearchParams } from "react-router";
import CheckoutStep4 from "@/components/cart/CheckoutStep4";

// route ใหม่ "/checkoutstep3" - การ์ด "สั่งซื้อสำเร็จแล้ว" (indicator step 3 "ยืนยัน") แยกออกมาเป็น route จริง
// ของตัวเองแล้ว (เดิมโค้ดนี้อยู่ใน PaymentSuccessPage.jsx ตอน isConfirmed === true) เพื่อให้เลข step ตรงกับ
// URL: /checkoutstep1 (จัดส่ง) -> /checkoutstep2 (กำลังนำไปหน้าชำระเงิน) -> Stripe -> /payment/success
// (loading สั้นๆ รอ 3 วิ - path นี้คงที่เพราะตั้งเป็น success_url ของ Stripe ไว้ที่ backend) -> /checkoutstep3
// (หน้านี้ - การ์ดสำเร็จ) PaymentSuccessPage.jsx เป็นคน navigate มาที่นี่เองหลังจากรอ 3 วิ (ดู state ด้านล่าง)
//
// sessionId รับมาจาก 2 ทาง: location.state (ที่ PaymentSuccessPage.jsx ส่งมาตอน navigate) เป็นทางหลัก
// เผื่อไว้อีกทางคือ query param ?session_id= ตรงๆ (เผื่อมีคน refresh หน้านี้แล้ว location.state หาย จะได้ยังมี
// เลขอ้างอิงโชว์อยู่ ถึงแม้ค่านี้จะปลอมได้ง่ายๆ แค่พิมพ์ URL เอง ก็แค่โชว์เป็นข้อมูลอ้างอิงเฉยๆ ไม่ได้เอาไปใช้ยืนยัน
// อะไรจริงจัง)
function CheckoutStep3Page() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const sessionId = location.state?.sessionId ?? searchParams.get("session_id");

  return <CheckoutStep4 sessionId={sessionId} />;
}

export default CheckoutStep3Page;
