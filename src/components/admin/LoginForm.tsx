"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { loginAction, type LoginResult } from "@/app/actions/admin/auth";

export default function LoginForm({ from }: { from: string }) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    LoginResult | null,
    FormData
  >(loginAction, null);

  // Server action returns { ok: true, redirectTo } on success; we navigate
  // here on the client to ensure the redirect actually fires (calling
  // Next.js redirect() inside the action can be silently swallowed by the
  // Netlify adapter in some configurations).
  useEffect(() => {
    if (state?.ok && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="from" value={from} />
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
          placeholder="you@blacklinestrategypartners.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
        />
      </div>
      {state && !state.ok && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}
      {state?.ok && (
        <p className="text-sm text-green-700" role="status">
          Signed in. Loading dashboard…
        </p>
      )}
      <button
        type="submit"
        disabled={pending || Boolean(state?.ok)}
        className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-6 py-3.5 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {pending ? "Signing in…" : state?.ok ? "Redirecting…" : "Sign In"}
        {!pending && !state?.ok && <ArrowRight size={16} />}
      </button>
    </form>
  );
}
