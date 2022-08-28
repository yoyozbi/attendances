import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/card";
import type { MeetingGroupWithMeetingAndGroup } from "~/utils/meetingGroup.server";
import { getMeetingGroupWithMeetingsAndGroups } from "~/utils/meetingGroup.server";
import { requireUserId } from "~/utils/session.server";


export const loader: LoaderFunction = async ({ params, request }) => {
  const res = await requireUserId(request);
  if (!res.userId && res.redirectUrl)
    return redirect(res.redirectUrl)
  else if (res.userId && !res.redirectUrl && params.id) {
    let meetingGroup = await getMeetingGroupWithMeetingsAndGroups(params.id)
    if (!meetingGroup)
      return json({}, { status: 404 })
    return json<LoaderData>({ meetingGroup, userId: res.userId })
  } else
    return json({}, { status: 404 })
}

type LoaderData = {
  meetingGroup: MeetingGroupWithMeetingAndGroup,
  userId: string
}

export const meta: MetaFunction = ({ data }) => {
  return {
    title: `Attendances | ${data.meetingGroup.name} meetingGroup`,
    "og:title": `attendances meetingGroups ${data.meetingGroup.name}`
  }
}
export default function MeetingGroupsId() {
  const { meetingGroup } = useLoaderData<LoaderData>();
  return (
    <div className="w-full">
      <h1 className="my-6 border-b-2 text-center text-3xl">
        {meetingGroup.name}
      </h1>
      <div className="grid lg:grid-flow-row grid-cols-1 sm:grid-cols-2">
        <div className="border-2 mb-2 mr-2">
          <div className="border-b-2">
            <h2 className="text-2xl">
              Groups
            </h2>
          </div>
          <div>
            {meetingGroup.groups.length > 0
              ? meetingGroup.groups.map((m) => <Card text={m.groupId} link={`/groups/${m.groupId}`} />)
              : <p>No groups</p>
            }
          </div>
        </div>
        <div className="border-2">
          <div className="border-b-2">
            <h2 className="text-2xl">
              Meetings
            </h2>
          </div>
          <div>
            {meetingGroup.meetings.length > 0
              ? meetingGroup.meetings.map((g) => <Card text={g.forDate} link={`/meetings/${g.id}`} />)
              : <p>No meetings</p>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
