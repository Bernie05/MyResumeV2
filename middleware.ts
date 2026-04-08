import {
  isStudioSessionTokenValid,
  STUDIO_SESSION_COOKIE,
} from "@/lib/studio-auth";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = request.cookies.get(STUDIO_SESSION_COOKIE)?.value;
  const isAuthenticated = await isStudioSessionTokenValid(sessionToken);

  if (pathname === "/studio/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/studio", request.url));
    }

    return NextResponse.next();
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/studio/login", request.url);
  const nextPath = `${pathname}${search}`;

  if (nextPath && nextPath !== "/studio") {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio/:path*"],
};
