import Link from "next/link";
import Image from "next/image";
import { Mail, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Image
              src="/logo.png"
              alt="Blackline Strategy Partners"
              width={220}
              height={55}
              className="h-12 w-auto brightness-0 invert mb-4"
            />
            <p className="text-sm leading-relaxed">
              Clarity. Strategy. Momentum.
            </p>
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
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
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
                href="mailto:info@blacklinestrategy.com"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail size={16} />
                info@blacklinestrategy.com
              </a>
              <a
                href="#"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <ExternalLink size={16} />
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
