// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { auth } from "@clerk/nextjs";

declare global {
  var prisma: PrismaClient | undefined;
}

// Prevent multiple instances of Prisma in development
export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export async function getUserById() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  return user;
}

export async function createUserIfNotExists() {
  const { userId } = auth();

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: userId,
    },
  });

  if (user) {
    return user;
  }

  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.emailAddresses[0].emailAddress) {
    throw new Error("Clerk user not found");
  }

  return await prisma.user.create({
    data: {
      clerkId: userId,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: `${clerkUser.firstName} ${clerkUser.lastName}`,
    },
  });
}
