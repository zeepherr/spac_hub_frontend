import { animate } from "motion";
import { createContext, useCallback, useContext, useRef } from "react";

const CartFlyAnimationContext = createContext(null);

const FLY_DURATION = 0.4;
const FLY_EASE = "easeIn";
const END_SCALE = 0.08;
const KNOCK_IMPULSE = 6;

function spawnShrinkingGhost(sourceEl, imageUrl, toX, toY, onArrive) {
  const fromRect = sourceEl.getBoundingClientRect();

  const ghost = document.createElement("div");
  ghost.style.position = "fixed";
  ghost.style.left = `${fromRect.left}px`;
  ghost.style.top = `${fromRect.top}px`;
  ghost.style.width = `${fromRect.width}px`;
  ghost.style.height = `${fromRect.height}px`;
  ghost.style.borderRadius = "12px";
  ghost.style.overflow = "hidden";
  ghost.style.background = "#fff";
  ghost.style.border = "1px solid #e5e5e5";
  ghost.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
  ghost.style.zIndex = "9999";
  ghost.style.pointerEvents = "none";

  if (imageUrl) {
    const img = document.createElement("img");
    img.src = imageUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
    ghost.appendChild(img);
  }

  document.body.appendChild(ghost);

  const dx = toX - (fromRect.left + fromRect.width / 2);
  const dy = toY - (fromRect.top + fromRect.height / 2);

  animate(
    ghost,
    { x: [0, dx], y: [0, dy], scale: [1, END_SCALE], opacity: [1, 1, 0] },
    {
      duration: FLY_DURATION,
      ease: FLY_EASE,
      opacity: { times: [0, 0.85, 1] },
    },
  ).then(() => {
    ghost.remove();
    onArrive?.();
  });
}

export function CartFlyAnimationProvider({ children }) {
  const cartIconRef = useRef(null);
  const cartRingRef = useRef(null);

  const flyToCart = useCallback((sourceEl, imageUrl) => {
    if (!sourceEl || !cartIconRef.current) return;

    const toRect = cartIconRef.current.getBoundingClientRect();

    spawnShrinkingGhost(
      sourceEl,
      imageUrl,
      toRect.left + toRect.width / 2,
      toRect.top + toRect.height / 2,
      () => {
        animate(
          cartIconRef.current,
          { x: 0, y: 0 },
          {
            type: "spring",
            stiffness: 500,
            damping: 12,
            x: { velocity: (Math.random() - 0.5) * KNOCK_IMPULSE },
            y: { velocity: -KNOCK_IMPULSE },
          },
        );

        if (cartRingRef.current) {
          animate(
            cartRingRef.current,
            { scale: [1, 2.2], opacity: [0.8, 0] },
            { duration: 0.5, ease: "easeOut" },
          );
        }
      },
    );
  }, []);

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
