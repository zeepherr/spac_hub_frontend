import { animate } from "motion";
import { createContext, useCallback, useContext, useRef } from "react";

// ดีไซน์ที่ 7 - เวอร์ชัน minimal ของ "จุดลอยเข้าตะกร้า" (ดีไซน์ก่อนหน้า) ตัดส่วนตกแต่งออกให้เหลือ
// น้อยที่สุด: ไม่มี box-shadow/เงา, ไม่มี scale ระหว่างทาง, ไม่ไล่สี - เหลือแค่จุดกลมสีเดียวลอยเป็นทาง
// โค้งเบาๆ แล้วจางหายไปตอนใกล้ถึงปลายทาง ให้ความรู้สึก "ลอย" แบบเรียบง่ายที่สุดเท่าที่ยังพอมองเห็น
// การเคลื่อนไหวอยู่ (ต่างจากดีไซน์ minimal สุดขั้วก่อนหน้าที่ตัดจุดลอยออกไปเลย เหลือแค่ไอคอนเด้ง)

const CartFlyAnimationContext = createContext(null);

const FLOAT_DURATION = 0.6;
const FLOAT_ARC_HEIGHT = 40; // ยกจุดกึ่งกลางเส้นทางขึ้นเบาๆ พอให้เห็นเป็นทางโค้ง ไม่ใช่เส้นตรงทื่อๆ
const DOT_SIZE = 8; // เล็กลงจากดีไซน์ก่อนหน้า (12px) ให้ดูกวนสายตาน้อยลง

// จุดกลมเล็กๆ ลอยจาก origin ไปยังปลายทาง (ไอคอนตะกร้า) เป็นทางโค้งเบาๆ ไม่มีเงา/glow ใดๆ
function spawnFloatingDot(fromX, fromY, toX, toY, onArrive) {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const midX = dx / 2;
  const midY = dy / 2 - FLOAT_ARC_HEIGHT;

  const dot = document.createElement("div");
  dot.style.position = "fixed";
  dot.style.left = `${fromX - DOT_SIZE / 2}px`;
  dot.style.top = `${fromY - DOT_SIZE / 2}px`;
  dot.style.width = `${DOT_SIZE}px`;
  dot.style.height = `${DOT_SIZE}px`;
  dot.style.borderRadius = "9999px";
  dot.style.background = "#f97316";
  dot.style.zIndex = "9999";
  dot.style.pointerEvents = "none";
  document.body.appendChild(dot);

  animate(
    dot,
    { x: [0, midX, dx], y: [0, midY, dy], opacity: [1, 1, 0] },
    { duration: FLOAT_DURATION, ease: "easeInOut" },
  ).then(() => {
    dot.remove();
    onArrive?.();
  });
}

/**
 * Provider นี้ต้องครอบทั้งแอปไว้ (เช่นใน main.jsx / App.jsx รอบนอกสุด หรืออย่างน้อยรอบ Router)
 * เพราะปุ่ม "เพิ่มลงตะกร้า" อยู่คนละ component กับไอคอนตะกร้าใน Header คนละที่กันเลย
 * ใช้ Context เก็บตำแหน่งไอคอนตะกร้าไว้กลาง ๆ ให้ทุกปุ่ม "เพิ่มลงตะกร้า" เรียก flyToCart() ได้จากทุกหน้า
 */
export function CartFlyAnimationProvider({ children }) {
  const cartIconRef = useRef(null);
  const cartRingRef = useRef(null);

  const bumpCartIcon = useCallback(() => {
    if (!cartIconRef.current) return;

    animate(
      cartIconRef.current,
      { scale: [1, 1.18, 1] },
      { duration: 0.28, ease: "easeOut" },
    );
  }, []);

  // sourceEl = element ที่จุดจะเริ่มลอยออกจากตรงกลาง - imageUrl ไม่ได้ใช้ในดีไซน์นี้ (เก็บพารามิเตอร์
  // ไว้เฉยๆ เพื่อไม่ต้องแก้จุดที่เรียก flyToCart(ref, imageUrl) ในไฟล์อื่นๆ อยู่แล้ว)
  const flyToCart = useCallback(
    (sourceEl) => {
      if (!cartIconRef.current) return;

      if (!sourceEl) {
        bumpCartIcon();
        return;
      }

      const fromRect = sourceEl.getBoundingClientRect();
      const toRect = cartIconRef.current.getBoundingClientRect();

      spawnFloatingDot(
        fromRect.left + fromRect.width / 2,
        fromRect.top + fromRect.height / 2,
        toRect.left + toRect.width / 2,
        toRect.top + toRect.height / 2,
        bumpCartIcon,
      );
    },
    [bumpCartIcon],
  );

  return (
    <CartFlyAnimationContext.Provider
      value={{ cartIconRef, cartRingRef, flyToCart }}
    >
      {children}
    </CartFlyAnimationContext.Provider>
  );
}

export function useCartFlyAnimation() {
  const ctx = useContext(CartFlyAnimationContext);
  if (!ctx) {
    throw new Error(
      "useCartFlyAnimation ต้องถูกเรียกภายใต้ <CartFlyAnimationProvider> เท่านั้น - เช็คว่าครอบ Router/App ไว้แล้วหรือยัง",
    );
  }
  return ctx;
}
