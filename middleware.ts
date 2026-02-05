import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/setup", "/api", "/link-disabled"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow redirect routes (short codes)
  // These are single-segment paths that aren't known routes like /tools
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !["tools", "login", "setup", "link-disabled"].includes(segments[0])) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
