"use server";

import { createContact } from "@/lib/appwrite/contacts";

export interface ContactResult {
  ok: boolean;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function contactAction(
  _prev: ContactResult | null,
  formData: FormData
): Promise<ContactResult> {
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const service = String(formData.get("service") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name) return { ok: false, message: "Name is required." };
  if (!email) return { ok: false, message: "Email is required." };
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  try {
    await createContact({ name, email, service, message });
    return {
      ok: true,
      message: "Thanks for reaching out — we'll respond within 24 hours.",
    };
  } catch (err) {
    console.error("contactAction error:", err);
    return {
      ok: false,
      message: "Something went wrong. Please try again or email us directly.",
    };
  }
}
