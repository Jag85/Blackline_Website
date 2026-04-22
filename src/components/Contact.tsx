"use client";

import { useActionState } from "react";
import Image from "next/image";
import { Send, ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import { contactAction, type ContactResult } from "@/app/actions/contact";

export default function Contact() {
  const [state, formAction, pending] = useActionState<
    ContactResult | null,
    FormData
  >(contactAction, null);

  return (
    <section id="contact" className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left column */}
          <AnimateOnScroll variant="slide-left">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Get Started
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Ready to move forward?
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Book your first session or tell us about your business.
                We&apos;ll respond within 24 hours with a recommended starting
                point.
              </p>
              <div className="space-y-4 text-sm text-gray-600 mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <span>Tell us about your business and challenge</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xs font-bold">
                    2
                  </div>
                  <span>We recommend the right session for you</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black text-white rounded flex items-center justify-center text-xs font-bold">
                    3
                  </div>
                  <span>Get clarity and start executing</span>
                </div>
              </div>

              {/* Contact image */}
              <div className="relative rounded-lg overflow-hidden shadow-lg hidden md:block">
                <Image
                  src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80&auto=format&fit=crop"
                  alt="Professional handshake"
                  width={500}
                  height={250}
                  className="object-cover w-full h-[200px]"
                />
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right column - form */}
          <AnimateOnScroll variant="slide-right" delay={150}>
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              {state?.ok ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    Message Sent
                  </h3>
                  <p className="text-gray-600 text-sm">{state.message}</p>
                </div>
              ) : (
                <form action={formAction} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="Your name"
                    />
                  </div>
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
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                      placeholder="you@company.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Interested In
                    </label>
                    <select
                      id="service"
                      name="service"
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      <option value="">Select a service</option>
                      <option value="Strategy Session">
                        Strategy Session ($297)
                      </option>
                      <option value="Growth Roadmap Session">
                        Growth Roadmap Session ($997)
                      </option>
                      <option value="Core Retainer">
                        Core Retainer ($1,500/mo)
                      </option>
                      <option value="Fractional CSO">
                        Fractional CSO ($2,500/mo)
                      </option>
                      <option value="Not sure yet">Not sure yet</option>
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Tell us about your business
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="What's your biggest challenge right now?"
                    />
                  </div>
                  {state && !state.ok && (
                    <p
                      className="text-sm text-red-600"
                      role="alert"
                    >
                      {state.message}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={pending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-6 py-4 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {pending ? "Sending..." : "Send Message"}
                    {!pending && <ArrowRight size={16} />}
                  </button>
                </form>
              )}
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
