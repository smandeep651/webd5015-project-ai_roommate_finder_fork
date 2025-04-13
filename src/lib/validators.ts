import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(7, "Must be at least 7 characters")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[!@#$%^&*]/, "Must include a special character");
