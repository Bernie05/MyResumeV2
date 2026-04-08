import {
  getStudioOwnerPassword,
  isStudioSessionTokenValid,
  STUDIO_SESSION_COOKIE,
} from "@/lib/studio-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${STUDIO_SESSION_COOKIE}=`))
    ?.split("=")
    .slice(1)
    .join("=");

  const authenticated = await isStudioSessionTokenValid(token);

  return NextResponse.json({
    authenticated,
    configured: Boolean(getStudioOwnerPassword()),
  });
}
