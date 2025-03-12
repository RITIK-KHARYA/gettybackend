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
  .post("/api/message", zValidator("json", MessageSchema), async (c) => {
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const body = c.req.valid("json");
    const message = await prisma.message.create({
      data: {
        content: body.content,
        userId: user.id,
        spaceId: body.spaceId,
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
  .get("/api/message", zValidator("json", MessageSchema2), async (c) => {
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const body = c.req.valid("json");
    const messages = await prisma.message.findMany({
      where: {
        spaceId: body.spaceId,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            messages: {
              select: {
                content: true,
                createdAt: true,
              },
            },
          },
        },
        space: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return c.json({ messages }, 200);
  });
export default messageApp;
