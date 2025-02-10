import { z } from "zod";
import prisma from "../lib/prisma";
import { formSchema } from "../lib/schema";
import { auth } from "../lib/auth";
import { Hono } from "hono";
import { getServerSession } from "../lib/session";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";

const spaceApp = new Hono()
  .get("/api/space", async (c) => {
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }

    const spaces = await prisma.space.findMany({
      where: {
        userid: user.id,
      },
      include: {
        users: {
          where: {
            role: "ADMIN",
          },
          include: {
            user: true,
          },
        },
      },
    });
    const data = spaces.map((space) => {
      return {
        id: space.id,
        title: space.title,
        description: space.description,
        banner: space.banner,
        createdAt: space.createdAt,
        userId: space.userid,
        spaceAdmin: space.users.map((user) => {
          return { name: user.user.name, image: user.user.image };
        }),
      };
    });
    return c.json({ data}, 200);
  })
  .post("/api/space", zValidator("json", formSchema), async (c) => {
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

    const space = await prisma.space.create({
      data: {
        title: body.spacename,
        description: body.bio,
        banner: body.banner,
        userid: user.id,
      },
    });
    return c.json({ message: "Data received" }, 200);
  });

export default spaceApp;
