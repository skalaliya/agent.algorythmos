'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent">
              <span className="text-sm font-bold text-white">A</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">algorythmos.app</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/product" className="text-gray-600 hover:text-gray-900 transition-colors">
              Product
            </Link>
            <Link href="/resources" className="text-gray-600 hover:text-gray-900 transition-colors">
              Resources
            </Link>
            <Link href="/templates" className="text-gray-600 hover:text-gray-900 transition-colors">
              Templates
            </Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link 
              href="/signup" 
              className="rounded-lg bg-gradient-to-r from-primary to-accent px-4 py-2 font-medium text-white transition-opacity hover:opacity-90"
            >
              Start for free
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
