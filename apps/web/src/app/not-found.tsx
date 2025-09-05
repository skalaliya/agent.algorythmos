import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-300 mb-6">Page not found</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link
            href="/"
            className="inline-block rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
          >
            Go Home
          </Link>
          <Link
            href="/runs"
            className="inline-block rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/[0.06] transition-colors"
          >
            View Runs
          </Link>
        </div>
      </div>
    </div>
  )
}
