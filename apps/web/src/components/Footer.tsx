import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Email Subscription */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent">
                <span className="text-sm font-bold text-white">A</span>
              </div>
              <span className="text-lg font-semibold text-white">Algorythmos</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Unlock the Real Value of Your Data
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="w-full rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-gray-400 hover:text-white transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/benefits" className="text-gray-400 hover:text-white transition-colors">
                  Benefits
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/roi-calculator" className="text-gray-400 hover:text-white transition-colors">
                  ROI (Return On Investment) calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pages</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="text-white font-semibold mb-4">Follow Us</h3>
            <div className="flex gap-2 mb-4">
              <a
                href="https://youtube.com/@algorythmos"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="YouTube"
              >
                <span className="text-xs">▶</span>
              </a>
              <a
                href="https://linkedin.com/company/algorythmos"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="LinkedIn"
              >
                <span className="text-xs font-bold">in</span>
              </a>
              <a
                href="https://x.com/algorythmos"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="X (Twitter)"
              >
                <span className="text-xs font-bold">X</span>
              </a>
              <a
                href="https://discord.gg/algorythmos"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="Discord"
              >
                <span className="text-xs">🎮</span>
              </a>
              <a
                href="/blog"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="Blog"
              >
                <span className="text-xs">✏</span>
              </a>
            </div>
            <div className="mb-4">
              <a
                href="/calendar"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-600 bg-gray-800 text-white hover:border-primary transition-colors"
                aria-label="Calendar"
              >
                <span className="text-xs">📅</span>
              </a>
            </div>
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-white px-4 py-2 text-sm font-medium text-white hover:bg-white hover:text-black transition-colors"
            >
              Contact Us →
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-white font-semibold">Algorythmos</div>
            <div className="text-gray-400 text-sm text-center">
              Visioned and Crafted by Algorythmos
            </div>
            <div className="text-gray-400 text-sm">
              © 2025 Algorythmos. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
