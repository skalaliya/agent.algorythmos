import RunCard from '../../components/RunCard'
import { api } from '../../lib/api'

export default async function RunsPage() {
  const runs = await api.get('/api/runs')

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Runs</h1>
        <p className="text-gray-300">Monitor and manage your workflow executions</p>
      </div>

      {runs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No runs yet. Create your first workflow to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {runs.map((run: any) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      )}
    </div>
  )
}