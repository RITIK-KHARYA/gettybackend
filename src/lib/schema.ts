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

export const MessageSchema = z.object({
  spaceid: z.string(),
});

export const MessageSchema2 = z.object({
  message: z.string().min(1, {
    message: "atleast one character",
  }),
  spaceid: z.string(),
  image:z.string()
});