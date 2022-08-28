import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { MeetingGroup } from "@prisma/client";
import { requireUserId } from "~/utils/session.server";
import { getMeetingGroups } from "~/utils/meetingGroup.server";
import Navbar from "~/components/navbar";
import Card from "~/components/card";

type LoaderData = {
  userId: string;
  meetingGroups: MeetingGroup[];
  url: string;
}

export const loader: LoaderFunction = async ({ request }) => {
  let res = await requireUserId(request);
  if (!res.userId && res.redirectUrl)
    return redirect(res.redirectUrl)
  else if (res.userId && !res.redirectUrl) {
    let meetingGroups = await getMeetingGroups();
    return json<LoaderData>({ userId: res.userId, meetingGroups, url: request.url })
  }
  else
    throw new Error("Unknown errror")
}
export default function Index() {
  const { userId, meetingGroups, url } = useLoaderData<LoaderData>();
  return (
    <div>
      <Navbar userId={userId} url={url} />
      <div className="grid lg:grid-flow-row grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        {meetingGroups.map((m) => (
          <Card text={m.name} key={m.id} link={`/meetingGroups/${m.id}`} className="mr-3 mb-3" />
        )
        )}
      </div>
    </div>
  );
}
