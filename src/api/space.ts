import { z } from "zod";
import prisma from "../lib/prisma";
import { formSchema, formSchema2 } from "../lib/schema";
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
      include: {
        users: {
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
    c.header(
      "Cache-Control",
      "public, max-age=3600, stale-while-revalidate=1800"
    );
    return c.json({ data }, 200);
  })

  .post("/api/findspace", zValidator("json", formSchema2), async (c) => {
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const space = await prisma.space.findMany({
      where: {
        title: c.req.valid("json").spacename,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const data = space.map((space) => {
      return {
        id: space.id,
        title: space.title,
        description: space.description,
        banner: space.banner,
        createdAt: space.createdAt,
        userId: space.userid,
      };
    });
    return c.json({ data }, 200);
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
    await prisma.spaceUser.upsert({
      where: {
        userId_spaceId: {
          spaceId: space.id,
          userId: user.id,
        },
      },
      update: {
        role: "ADMIN",
      },
      create: {
        spaceId: space.id,
        userId: user.id,
        role: Role.ADMIN,
      },
    });
    return c.json({ message: "Space created", data: space }, 200);
  });

export default spaceApp;
