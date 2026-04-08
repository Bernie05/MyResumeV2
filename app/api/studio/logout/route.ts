import { STUDIO_SESSION_COOKIE } from "@/lib/studio-auth";
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set({
    name: STUDIO_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return response;
}
