"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

interface AppwriteSessionResponse {
  $id?: string;
  userId?: string;
  expire?: string;
  secret?: string;
  message?: string;
  type?: number;
  code?: number;
}

/**
 * Authenticate the admin user. On success, returns { ok: true, redirectTo }
 * so the client can navigate via router.push.
 *
 * Implementation note: we call the Appwrite REST API directly via fetch
 * instead of using either Appwrite SDK. Both SDKs strip the session
 * secret from the response when called server-side (they assume the
 * browser will handle the Set-Cookie header instead). Direct REST gives
 * us access to both the JSON body and headers so we can reliably grab
 * the session secret regardless of which channel Appwrite uses.
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

  let response: Response;
  try {
    response = await fetch(`${APPWRITE_ENDPOINT}/account/sessions/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Appwrite-Project": APPWRITE_PROJECT_ID,
        "X-Appwrite-Response-Format": "1.7.0",
      },
      body: JSON.stringify({ email, password }),
      // Don't follow redirects — Appwrite responds 201, no redirect expected.
      redirect: "manual",
    });
  } catch (err) {
    console.error("[login] fetch threw:", err);
    return {
      ok: false,
      message: `Sign-in failed: network error reaching ${APPWRITE_ENDPOINT}.`,
    };
  }

  let body: AppwriteSessionResponse = {};
  try {
    body = (await response.json()) as AppwriteSessionResponse;
  } catch {
    /* non-JSON response; body stays empty */
  }

  if (!response.ok) {
    console.error(
      "[login] Appwrite returned",
      response.status,
      "body:",
      body
    );
    return {
      ok: false,
      message:
        body?.message ||
        `Sign-in failed (${response.status}). Check your email and password.`,
    };
  }

  // Try the JSON body first
  let secret: string | undefined = body?.secret;

  // Fallback: parse from Set-Cookie header (Appwrite sets a_session_<projectId>)
  if (!secret) {
    const headers = response.headers;
    // Node's fetch supports getSetCookie() (returns string[]) since 18.14
    const setCookieList: string[] =
      typeof (headers as unknown as { getSetCookie?: () => string[] })
        .getSetCookie === "function"
        ? (headers as unknown as { getSetCookie: () => string[] }).getSetCookie()
        : (headers.get("set-cookie") || "").split(/,(?=\s*\w+=)/);

    for (const raw of setCookieList) {
      const m = raw.match(/a_session_[^=]+=([^;]+)/);
      if (m) {
        try {
          secret = decodeURIComponent(m[1]);
        } catch {
          secret = m[1];
        }
        break;
      }
    }
  }

  if (!secret) {
    console.error(
      "[login] could not extract session secret. Body keys:",
      Object.keys(body || {}),
      "Cookies:",
      response.headers.get("set-cookie")
    );
    return {
      ok: false,
      message:
        "Sign-in succeeded but no session secret was returned. Check the Netlify Function logs for [login] details.",
    };
  }

  // Default expiry: 1 year. If Appwrite gave us an expire timestamp, use it.
  const expires = body?.expire
    ? new Date(body.expire)
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
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
