import { Hono } from "hono";
import prisma from "../lib/prisma";
import { auth } from "../lib/auth";

const userApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>().get("/api/user", async (c) => {

  const users = await prisma.user.findMany({
    include:{
      sessions:true
    }
  });
console.log("hehehehhehehheheh")
  
  return c.json({ message: "Data received", data: users});
});

export default userApp;



