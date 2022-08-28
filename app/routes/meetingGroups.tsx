import type { LoaderFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { useLoaderData, Outlet } from "@remix-run/react";
import { requireUserId } from "~/utils/session.server";
import Navbar from "~/components/navbar";

export const loader: LoaderFunction = async ({ request }) => {
  const res = await requireUserId(request);
  if (!res.userId && res.redirectUrl)
    return redirect(res.redirectUrl);
  else if (res.userId && !res.redirectUrl)
    return json({ userId: res.userId, url: request.url })
  else
    return json({}, { status: 500, statusText: "Unknown error" })
}

export default function MeetingGroupsIndex() {
  const { userId, url } = useLoaderData()
  return (
    <>
      <Navbar userId={userId} url={url} />
      <main>
        <Outlet />
      </main>
    </>
  );

}
