import React, { useState } from "react";
import { Package } from "lucide-react";

export function OrderProductImage({ images, title, className = "w-12 h-12" }) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (imgData) => {
    if (!imgData) return null;
    const firstImg = Array.isArray(imgData) ? imgData[0].imageUrl : imgData;
    if (!firstImg) return null;

    if (typeof firstImg === "string") return firstImg;
    return firstImg.url || firstImg.image || firstImg.path || firstImg.src || null;
  };

  const imageUrl = getImageUrl(images);

  if (!imageUrl || imageError) {
    return (
      <div
        className={`${className} rounded-xl bg-base-300 flex flex-col items-center justify-center text-base-content/40 shrink-0 border border-base-300`}
      >
        <Package className="w-1/2 h-1/2 stroke-[1.5]" />
      </div>
    );
  }

  return (
    <div
      className={`${className} rounded-xl bg-base-200 overflow-hidden shrink-0 border border-base-300 relative`}
    >
      <img
        src={imageUrl}
        alt={title || "Product image"}
        className="w-full h-full object-cover transition-opacity duration-200"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}