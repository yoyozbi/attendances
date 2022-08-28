import { db } from "./db.server";
import { MeetingGroup, Prisma } from "@prisma/client";
export type MeetingGroupWithMeetingAndGroup = Prisma.MeetingGroupGetPayload<{ include: { meetings: true, groups: true } }>;

export async function getMeetingGroups(): Promise<MeetingGroup[]> {
  return await db.meetingGroup.findMany();
}

export async function getMeetingGroup(id: string): Promise<MeetingGroup | null> {
  return await db.meetingGroup.findUnique({ where: { id } })
}
export async function getMeetingGroupWithMeetingsAndGroups(id: string): Promise<MeetingGroupWithMeetingAndGroup | null> {
  return await db.meetingGroup.findUnique({ where: { id }, include: { meetings: true, groups: true } })
}
