import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const PUBLIC_PATHS = ["/login", "/setup", "/api", "/link-disabled"];
const KNOWN_SEGMENTS = ["tools", "login", "setup", "link-disabled", "admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Allow redirect routes (short codes)
  // These are single-segment paths that aren't known routes
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && !KNOWN_SEGMENTS.includes(segments[0])) {
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes: verify role from JWT
  if (pathname.startsWith("/admin")) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "your-secret-key-change-in-production"
      );
      const { payload } = await jose.jwtVerify(token, secret);
      // If token has role and it's not admin, block immediately.
      // If token has no role (old token), let through — server page will check via DB fallback.
      if (payload.role && payload.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
