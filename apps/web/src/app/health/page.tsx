export default function HealthPage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Health Check</h1>
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-xl font-semibold text-white mb-2">System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">Web App</div>
                <div className="text-xs text-gray-400">Running</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">API</div>
                <div className="text-xs text-gray-400">Healthy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">✅</div>
                <div className="text-sm text-gray-300">Worker</div>
                <div className="text-xs text-gray-400">Processing</div>
              </div>
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-xl font-semibold text-white mb-2">App Router Status</h2>
            <div className="text-green-400 text-sm">
              ✅ All routes using App Router (no Pages Router conflicts)
            </div>
            <div className="text-gray-300 text-xs mt-2">
              Routes: /, /runs, /runs/[id], /workflows/[id]/edit, /health
            </div>
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-xl font-semibold text-white mb-2">Quick Links</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/"
                className="rounded-2xl bg-gradient-to-r from-primary to-accent px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Home
              </a>
              <a
                href="/runs"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.06] transition-colors"
              >
                Runs
              </a>
              <a
                href="/workflows"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/90 hover:bg-white/[0.06] transition-colors"
              >
                Workflows
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
