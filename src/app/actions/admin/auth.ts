"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Client, Account } from "node-appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  SESSION_COOKIE_NAME,
} from "@/lib/appwrite/config";
import { createSessionClient } from "@/lib/appwrite/server";

export interface LoginResult {
  ok: boolean;
  message?: string;
  /** When ok=true, the path to navigate to. Client does the push. */
  redirectTo?: string;
}

/**
 * Authenticate the admin user. On success, returns { ok: true, redirectTo }
 * so the client can navigate via router.push — calling Next.js redirect()
 * directly from a Server Action used with useActionState is unreliable on
 * Netlify and the navigation can be silently swallowed.
 */
export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData
): Promise<LoginResult> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin");

  if (!email || !password) {
    return { ok: false, message: "Email and password are required." };
  }

  // Use a fresh client (no session, no API key) to create the session.
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
  const account = new Account(client);

  let session;
  try {
    session = await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (err) {
    console.error("loginAction error:", err);
    const message =
      err instanceof Error
        ? `Sign-in failed: ${err.message}`
        : "Invalid email or password.";
    return { ok: false, message };
  }

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, session.secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(session.expire),
    });
  } catch (err) {
    console.error("loginAction cookie error:", err);
    return {
      ok: false,
      message: "Authenticated, but failed to set session cookie. Please retry.",
    };
  }

  return { ok: true, redirectTo: from };
}

export async function logoutAction() {
  try {
    const session = await createSessionClient();
    if (session) {
      await session.account.deleteSession({ sessionId: "current" });
    }
  } catch (err) {
    console.error("logoutAction error:", err);
  }
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/admin/login");
}
