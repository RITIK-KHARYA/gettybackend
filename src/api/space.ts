import { z } from "zod";
import prisma from "../lib/prisma";
import { formSchema, formSchema2 } from "../lib/schema";
import { auth } from "../lib/auth";
import { Hono } from "hono";
import { getServerSession } from "../lib/session";
import { zValidator } from "@hono/zod-validator";
import { Role } from "@prisma/client";

const spaceApp = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}>()
  .get("/api/space", async (c) => {
    const startime = new Date().getTime();
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
            space: {
              select: {
                _count: true,
              },
            },
          },
        },
        _count: {
          select: {
            likes: true,
            users: {
              where: {
                role: Role.MEMEBER,
              },
            },
          },
        },
      },
    });
    const endtime = new Date().getTime();
    console.log((endtime - startime) / 1000);

    const data = spaces.map((space) => {
      return {
        id: space.id,
        title: space.title,
        description: space.description,
        banner: space.banner,
        likes: space._count.likes,
        createdAt: space.createdAt,
        Role: space._count.users, //count of the users with the role of members
        userId: space.userid,
        spaceAdmin: space.users.map((user) => {
          return {
            name: user.user.name,
            image: user.user.image,
            Role: user.role == Role.ADMIN ? "Admin" : "Member",
          };
        }),
      };
    });
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
      include: {
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return c.json({ space }, 200);
  })
  .get("/api/space/:id", async (c) => {
    const id = c.req.param("id");
    const { user } = await getServerSession(c);
    if (!user) {
      return c.json(
        {
          message: "Unauthorized",
        },
        401
      );
    }
    const space = await prisma.space.findUnique({
      where: {
        id: id,
      },
      select: {
        title: true,
        description: true,
        createdAt: true,
        banner: true,
        media: true,
        _count: {
          select: {
            likes: true,
            media: true,
            users: true,
          },
        },
        updatedAt: true,
        id: true,
      },
    });

    if (!space) return c.json({ message: "Space not found" }, 404);

    return c.json({ space }, 200);
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
