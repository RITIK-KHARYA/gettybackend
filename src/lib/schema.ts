import { z } from "zod";

export const formSchema = z.object({
  spacename: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  bio: z.string().min(10, {
    message: "Username must be at least 2 characters.",
  }),
  banner: z.string()
});
export const formSchema2 = z.object({
  spacename: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});