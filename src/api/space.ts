import { z } from "zod";
import prisma from "../lib/prisma";
import { formSchema } from "../lib/schema";
import { useSession } from "../lib/auth";

export default async function GetSpace() {
  const session = await useSession();
  const user = session?.data?.user;
  try {
    const space = await prisma.space.findMany({
      where: {
        banner: {
          startsWith: "https://utfs.io/",
        },
      },
      include: {
        users: {
          where: {
            role: "ADMIN",
          },
          select: {
            user: {
              select: {
                image: true,
                name: true,
              },
            },
            spaceId: true,
          },
        },
      },
    });
    // console.log("space", space);
    const spaceWithAdmin = space.map((s) => {
      return {
        ...s,
        users: { ...s.users[0].user },
      };
    });
    return spaceWithAdmin;
  } catch (error) {
    throw new Error("unable to find space");
    console.log("error in finding space", error);
  }
}

export async function CreateSpace(data: z.infer<typeof formSchema>) {
    const session = await useSession();
  const user = session?.data?.user;
  try {
    if (!user) {
      console.log("user not found");
      return;
    }
    const space = await prisma.space.create({
      data: {
        userid: user?.id,
        title: data.spacename,
        updatedAt: new Date(),
        description: data.bio,
        banner: data.banner,
        createdAt: new Date(),
      },
    });
    if (!space) {
      throw new Error("unable to create space");
    }
    await prisma.spaceUser.create({
      data: {
        spaceId: space.id,
        userId: user?.id,
        role: "ADMIN",
      },
    });
  } catch (error) {
    console.log("error in creating space", error);
  }
}
