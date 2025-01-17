import { Hono } from "hono";
import prisma from "../lib/prisma";
import { auth } from "../lib/auth";

const userApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().get("/api/user", async (c) => {
  const user = c.get("user")
  const users = await prisma.user.findMany();
  return c.json({ message: "Data received", data: users, user });
});

export default userApp;



