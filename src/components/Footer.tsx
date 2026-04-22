import Link from "next/link";
import { Mail } from "lucide-react";
import SubscribeForm from "./SubscribeForm";
import { BUSINESS } from "@/lib/site";

// LinkedIn glyph (lucide-react in this project doesn't ship Linkedin)
function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.852 3.37-1.852 3.601 0 4.268 2.37 4.268 5.455v6.288zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zM7.119 20.452H3.554V9h3.565v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand + Newsletter spans wider */}
          <div className="lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-white.svg"
              alt="Blackline Strategy Partners"
              className="h-14 w-auto mb-4"
            />
            <p className="text-sm leading-relaxed mb-8">
              Clarity. Strategy. Momentum.
            </p>
            <SubscribeForm />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Free Tools */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Free Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/scorecard"
                  className="hover:text-white transition-colors"
                >
                  FOCUS Scorecard
                </Link>
              </li>
              <li>
                <Link
                  href="/capital-conversion"
                  className="hover:text-white transition-colors"
                >
                  Capital Conversion Convo
                </Link>
              </li>
              <li>
                <Link
                  href="/clarity-index"
                  className="hover:text-white transition-colors"
                >
                  Founder Clarity Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Get in Touch
            </h4>
            <div className="space-y-3 text-sm">
              <a
                href={`mailto:${BUSINESS.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors break-all"
              >
                <Mail size={16} className="shrink-0" />
                {BUSINESS.email}
              </a>
              <a
                href={BUSINESS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <LinkedInIcon size={16} />
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center space-y-2">
          <p>
            &copy; {new Date().getFullYear()} Blackline Strategy Partners, Inc.
            All rights reserved.
          </p>
          <p className="text-gray-500">
            Website by{" "}
            <a
              href="https://automatenexus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              AutomateNexus
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
