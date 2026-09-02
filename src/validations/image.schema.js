import { z } from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const identifyProductImageSchema = z.object({
  image: z
    .instanceof(File, {
      message: "Product image is required",
    })
    .refine(
      (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
      "Only JPEG, PNG, and WebP images are allowed",
    ),
});

export const listingImagesSchema = z.object({
  images: z
    .array(z.instanceof(File))
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images are allowed")
    .refine(
      (files) => files.every((file) => ALLOWED_IMAGE_TYPES.includes(file.type)),
      "Only JPEG, PNG, and WebP images are allowed",
    ),
});

export const profileImageSchema = z.object({
  image: z
    .instanceof(File, {
      message: "กรุณาเลือกไฟล์รูปภาพ",
    })
    .refine(
      (file) =>
        ALLOWED_IMAGE_TYPES.includes(
          file.type,
        ),
      "รองรับเฉพาะไฟล์ JPEG, PNG และ WebP",
    )
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "รูปภาพต้องมีขนาดไม่เกิน 5 MB",
    ),
});