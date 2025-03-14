import { Hono } from "hono";
import { getServerSession } from "../lib/session";
import { auth } from "../lib/auth";
import { MessageSchema, MessageSchema2 } from "../lib/schema";
import prisma from "../lib/prisma";
import { zValidator } from "@hono/zod-validator";

const messageApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .post("/api/message", zValidator("json", MessageSchema2), async (c) => {
    const { user } = await getServerSession(c);
    console.log(user);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const body = c.req.valid("json");
    console.log(body);
    const message = await prisma.message.create({
      data: {
        content: body.message,
        userId: user.id,
        spaceId: body.spaceid,
        createdAt: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        space: true,
      },
    });
    return c.json({ message: "Message created", data: message }, 200);
  })
  .get("/api/space/:spaceid/message", async (c) => {
    const spaceid = c.req.param("spaceid");
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const messages = await prisma.message.findMany({
      where: {
        spaceId: spaceid,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            id: true,
          },
        },
        space: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    return c.json({ messages }, 200);
  });
export default messageApp;
