import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/lib/appwrite/config";

/**
 * Optimistic auth check for /admin/* routes.
 * - Redirects unauthenticated users to /admin/login.
 * - Real session validity is verified server-side in the admin layout.
 * - The login page itself is excluded from this check.
 *
 * Note: we intentionally do NOT redirect away from /admin/login even when
 * a session cookie exists. If the cookie is present but the session is
 * invalid (e.g. expired), the layout would bounce back here, creating a
 * redirect loop. Letting users see the login page if the session is bad
 * is the safe default.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE_NAME);

  // Public admin paths (no auth required for these routes)
  const publicAdminPaths = ["/admin/login", "/admin/debug"];

  if (
    pathname.startsWith("/admin") &&
    !publicAdminPaths.includes(pathname)
  ) {
    if (!session?.value) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
