import "server-only";
import { Client, Account, Databases, Storage, Users } from "node-appwrite";
import { cookies } from "next/headers";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SESSION_COOKIE_NAME,
} from "./config";

const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || "";

/**
 * Admin client — uses the API key to bypass user-level permissions.
 * Use for: reading/writing posts, listing contacts/subscribers, all admin ops.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

  return {
    client,
    databases: new Databases(client),
    storage: new Storage(client),
    users: new Users(client),
  };
}

/**
 * Session client — uses the session cookie to act AS the logged-in user.
 * Use for: verifying the current admin user, logout.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  if (!session?.value) {
    return null;
  }

  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setSession(session.value);

  return {
    client,
    account: new Account(client),
    databases: new Databases(client),
  };
}
