import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Algorythmos</h1>
        <p className="text-gray-300">Automate your workflows with AI-powered automation</p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Recent Runs</h2>
        <Link
          href="/runs"
          className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-2xl hover:opacity-90 transition-opacity"
        >
          View All Runs
        </Link>
      </div>

      <div className="text-center py-12">
        <p className="text-gray-400">Welcome to Algorythmos! Navigate to the Runs page to see your workflow executions.</p>
        <div className="mt-6">
          <Link
            href="/runs"
            className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-2xl hover:opacity-90 transition-opacity inline-block"
          >
            View Runs
          </Link>
        </div>
      </div>
    </div>
  )
}
