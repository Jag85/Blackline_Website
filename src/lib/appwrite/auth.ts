import "server-only";
import { createSessionClient } from "./server";

/**
 * Returns the currently authenticated admin user (server-side check).
 * Returns null if no session or invalid session.
 */
export async function getCurrentUser() {
  try {
    const session = await createSessionClient();
    if (!session) return null;
    const user = await session.account.get();
    return user;
  } catch {
    return null;
  }
}
