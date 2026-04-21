"use client";

import { useActionState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import {
  subscribeAction,
  type SubscribeResult,
} from "@/app/actions/subscribe";

export default function SubscribeForm() {
  const [state, formAction, pending] = useActionState<
    SubscribeResult | null,
    FormData
  >(subscribeAction, null);

  return (
    <div>
      <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
        Newsletter
      </h4>
      <p className="text-sm text-gray-400 mb-4 leading-relaxed">
        Strategy insights for founders, delivered occasionally.
      </p>
      <form action={formAction} className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Mail
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="you@company.com"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-800 border border-gray-700 rounded text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-white transition-colors"
              disabled={pending}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-1.5 bg-white text-black text-sm font-medium px-4 py-2.5 rounded hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Subscribe"
          >
            {pending ? (
              "..."
            ) : (
              <>
                Subscribe
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
        {state && (
          <p
            className={`text-xs ${
              state.ok ? "text-green-400" : "text-red-400"
            }`}
            role="status"
          >
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
