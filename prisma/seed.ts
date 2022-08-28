import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function seed() {
  let r = await db.user.findUnique({ where: { email: "wisdomman@example.org" } })
  if (!r)
    await db.user.create({
      data: {
        email: "wisdomman@example.org",
        passwordHash: "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u",
      },
    });
  let meetingGroups = ["Fanfare 2022", "Fanfare 2021", "Fanfare 2023"]
  for (let m of meetingGroups) {
    let r = await db.meetingGroup.findMany({ where: { name: m } })
    if (r.length === 0)
      await db.meetingGroup.create({
        data: {
          name: m
        }
      })
  }

}
seed();
