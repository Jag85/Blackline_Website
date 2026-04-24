import "server-only";
import { createSessionClient } from "./server";

/**
 * Returns the currently authenticated admin user (server-side check).
 * Returns null if no session or invalid session. Never throws — any
 * Appwrite error is caught and logged so the caller can simply check
 * for null without wrapping in try/catch.
 *
 * Note: we intentionally do NOT delete the session cookie when
 * validation fails. Writing cookies from a Server Component (which
 * is where this is normally called) is not allowed in Next.js and
 * can create errors that escape try/catch in some edge cases.
 * The proxy redirects users to /admin/login when the cookie is
 * missing; users with an invalid cookie will see the login page
 * after the layout's redirect call below.
 */
export async function getCurrentUser() {
  try {
    const session = await createSessionClient();
    if (!session) return null;
    const user = await session.account.get();
    return user;
  } catch (err) {
    console.error(
      "[auth] getCurrentUser failed:",
      err instanceof Error ? `${err.name}: ${err.message}` : err
    );
    return null;
  }
}
