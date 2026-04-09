import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type GetTokenRequest = Parameters<typeof getToken>[0]["req"];

function getAuthSecret(): string {
  return process.env.AUTH_SECRET?.trim() ?? "";
}

function getInternalSecretNextPath(pathname: string, search: string) {
  if (!pathname.startsWith("/secret") || pathname === "/secret/login") {
    return null;
  }

  const nextPath = `${pathname}${search}`;

  if (nextPath === "/secret") {
    return null;
  }

  return nextPath;
}

export default async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = await getToken({
    req: request as unknown as GetTokenRequest,
    secret: getAuthSecret() || undefined,
  });

  const isAuthenticated = Boolean(token);

  if (pathname === "/secret/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/secret", request.url));
    }

    return NextResponse.next();
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/secret/login", request.url);
  const nextPath = getInternalSecretNextPath(pathname, search);

  if (nextPath) {
    loginUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/secret/:path*"],
};
