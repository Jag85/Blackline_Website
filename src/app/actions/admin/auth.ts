"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// Use the universal `appwrite` SDK (not `node-appwrite`) for session
// creation. The server SDK does not return the session `secret` field
// in its response when called without an API key, but the universal
// SDK does — and we need that secret to persist the session in a cookie.
import { Client as AppwriteClient, Account as AppwriteAccount } from "appwrite";
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

  // Universal SDK — works server-side via fetch and returns session.secret.
  const client = new AppwriteClient()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);
  const account = new AppwriteAccount(client);

  let session;
  try {
    session = await account.createEmailPasswordSession({
      email,
      password,
    });
  } catch (err) {
    console.error("[login] createEmailPasswordSession threw:", err);
    const message =
      err instanceof Error
        ? `Sign-in failed: ${err.message}`
        : "Invalid email or password.";
    return { ok: false, message };
  }

  if (!session?.secret || session.secret.length === 0) {
    console.error(
      "[login] session created but secret missing. Keys:",
      Object.keys(session || {})
    );
    return {
      ok: false,
      message:
        "Sign-in succeeded but Appwrite did not return a session secret. Make sure a Web platform is added in Appwrite (Overview → Add platform → Web app) with your site's hostname.",
    };
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
    console.error("[login] cookie set error:", err);
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
