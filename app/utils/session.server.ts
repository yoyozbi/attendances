import bcrypt from "bcryptjs";
import {
  createCookieSessionStorage,
  redirect
} from "@remix-run/node";

import { db } from "./db.server";

const sessionSecret = process.env.SESSION_SECRET

if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_SESSION",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  }
})

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
): Promise<{ redirectUrl: string | undefined, userId: string | undefined }> {
  const searchParams = new URLSearchParams([
    ["redirectTo", redirectTo],
  ]);

  const session = await getUserSession(request);
  if (!session)
    return { redirectUrl: `/login?${searchParams}`, userId: undefined }
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string")
    return { redirectUrl: `/login?${searchParams}`, userId: undefined }

  return { userId, redirectUrl: undefined };
}

type LoginForm = {
  email: string;
  password: string;
};

export async function register({
  email,
  password,
}: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { email: email.toLowerCase(), passwordHash },
  });
  return { id: user.id, email };
}

export async function login({
  email,
  password,
}: LoginForm) {
  email = email.toLowerCase();
  const user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.passwordHash
  );
  if (!isCorrectPassword) return null;
  return { id: user.id, email };
}

export async function logout(request: Request): Promise<void> {
  const session = await getUserSession(request);
  let url = new URL(request.url);
  let redirectTo = url.searchParams.get("redirectTo");
  throw redirect(`/login?redirectTo=${redirectTo}`, {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
