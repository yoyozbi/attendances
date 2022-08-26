import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  const wisdomMan = await db.user.create({
    data: {
      email: "wisdomman@example.org",
      passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
    },
  })

}
seed();
