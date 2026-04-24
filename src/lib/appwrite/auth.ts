import "server-only";
import { cookies } from "next/headers";
import { createSessionClient } from "./server";
import { SESSION_COOKIE_NAME } from "./config";

/**
 * Returns the currently authenticated admin user (server-side check).
 * Returns null if no session or invalid session. Logs the actual Appwrite
 * error and clears the stale session cookie so the next request doesn't
 * loop between /admin and /admin/login.
 */
export async function getCurrentUser() {
  let session;
  try {
    session = await createSessionClient();
  } catch (err) {
    console.error("[auth] createSessionClient threw:", err);
    return null;
  }

  if (!session) return null;

  try {
    const user = await session.account.get();
    return user;
  } catch (err) {
    console.error(
      "[auth] account.get() failed (cookie present but session invalid):",
      err instanceof Error ? `${err.name}: ${err.message}` : err
    );
    // Clear the bad cookie so the user lands cleanly on /admin/login
    try {
      const cookieStore = await cookies();
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      /* may not be writable in some contexts; ignore */
    }
    return null;
  }
}
