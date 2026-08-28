<<<<<<< HEAD
import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(1, "กรุณากรอกชื่อ")
      .min(3, "ชื่อต้องมีอย่างน้อย 3 ตัวอักษร"),

    lastName: z
      .string()
      .trim()
      .min(1, "กรุณากรอกนามสกุล")
      .min(3, "นามสกุลต้องมีอย่างน้อย 3 ตัวอักษร"),

    email: z
      .string()
      .trim()
      .min(1, "กรุณากรอกอีเมล")
      .email("รูปแบบอีเมลไม่ถูกต้อง"),

    password: z
      .string()
      .min(1, "กรุณากรอกรหัสผ่าน")
      .min(8, "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),

    confirmPassword: z
      .string()
      .min(1, "กรุณายืนยันรหัสผ่าน"),

    acceptTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "กรุณายอมรับข้อกำหนดการใช้งาน",
      }),
  })
  .refine(
    (values) =>
      values.password === values.confirmPassword,
    {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirmPassword"],
    }
  );
=======
import z from "zod"
export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z.string().min(4, "Password requires at least 4 characters"),
});
>>>>>>> dev
