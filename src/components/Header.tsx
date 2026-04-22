"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Blog", href: "/blog" },
];

const toolLinks = [
  { label: "All Tools", href: "/tools" },
  { label: "FOCUS Founder Scorecard", href: "/scorecard" },
  { label: "Capital Conversion Compass", href: "/capital-conversion" },
  { label: "Founder Clarity Index", href: "/clarity-index" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="Blackline Strategy Partners"
            className="h-14 md:h-16 w-auto"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              {link.label}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-black transition-colors">
              Tools
              <ChevronDown size={14} />
            </button>
            {toolsOpen && (
              <div className="absolute top-full right-0 pt-3 w-64">
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg py-2">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-600 hover:text-black transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/contact"
            className="bg-black text-white text-sm font-medium px-6 py-2.5 rounded hover:bg-gray-800 transition-colors"
          >
            Book a Session
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block text-base font-medium text-gray-700 hover:text-black"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Tools
            </p>
            {toolLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-1.5 text-base font-medium text-gray-700 hover:text-black"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="block text-base font-medium text-gray-700 hover:text-black"
            onClick={() => setMobileOpen(false)}
          >
            Contact
          </Link>
          <Link
            href="/contact"
            className="block bg-black text-white text-center text-sm font-medium px-6 py-3 rounded hover:bg-gray-800"
            onClick={() => setMobileOpen(false)}
          >
            Book a Session
          </Link>
        </div>
      )}
    </header>
  );
}
