import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";
import Navbar from "~/components/navbar";


export const loader: LoaderFunction = async ({ request }) => {
  let res = await requireUserId(request);
  if (!res.userId && res.redirectUrl)
    return redirect(res.redirectUrl)
  else if (res.userId && !res.redirectUrl)
    return json({ userId: res.userId })
  else
    throw new Error("Unknown errror")
}
export default function Index() {
  const { userId } = useLoaderData();
  return (
    <div>
      <Navbar userId={userId} />
      <div className="grid lg:grid-flow-row grid-cols-1 lg:grid-cols-3">
        <div>
          {userId}
        </div>
      </div>
    </div>
  );
}
