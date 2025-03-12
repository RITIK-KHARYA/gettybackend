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
  content: z.string(),
  spaceId: z.string(),
});
export const MessageSchema2 = z.object({
  spaceId: z.string(),
});