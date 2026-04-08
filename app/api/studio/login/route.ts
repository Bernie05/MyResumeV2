import {
  createStudioSessionToken,
  getStudioOwnerPassword,
  STUDIO_SESSION_COOKIE,
} from "@/lib/studio-auth";
import { NextResponse } from "next/server";

interface LoginRequestBody {
  password?: string;
}

export async function POST(request: Request) {
  const ownerPassword = getStudioOwnerPassword();

  if (!ownerPassword) {
    return NextResponse.json(
      { error: "RESUME_OWNER_PASSWORD is not configured." },
      { status: 500 },
    );
  }

  const body = ((await request.json().catch(() => null)) ??
    {}) as LoginRequestBody;
  const password = typeof body.password === "string" ? body.password : "";

  if (!password || password !== ownerPassword) {
    return NextResponse.json(
      { error: "Invalid owner password." },
      { status: 401 },
    );
  }

  const sessionToken = await createStudioSessionToken(ownerPassword);
  const response = NextResponse.json({ authenticated: true });

  response.cookies.set({
    name: STUDIO_SESSION_COOKIE,
    value: sessionToken,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  return response;
}
