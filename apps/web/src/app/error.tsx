'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold text-white mb-4">Something went wrong</h1>
        <p className="text-gray-300 mb-6">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        )}
        <div className="space-x-4">
          <button
            onClick={reset}
            className="inline-block rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-block rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/[0.06] transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
