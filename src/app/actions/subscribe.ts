"use server";

import { addSubscriber } from "@/lib/appwrite/subscribers";

export interface SubscribeResult {
  ok: boolean;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function subscribeAction(
  _prev: SubscribeResult | null,
  formData: FormData
): Promise<SubscribeResult> {
  const email = String(formData.get("email") || "").trim();

  if (!email) {
    return { ok: false, message: "Email is required." };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const result = await addSubscriber(email);
  if (result.ok) {
    return { ok: true, message: "Thanks! You're subscribed." };
  }
  if (result.reason === "duplicate") {
    return { ok: true, message: "You're already subscribed." };
  }
  return {
    ok: false,
    message: "Something went wrong. Please try again.",
  };
}
