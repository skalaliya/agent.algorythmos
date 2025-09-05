'use client'

import Link from 'next/link'
import StatusPill from './StatusPill'

interface Run {
  id: string
  workflowId: string
  status: string
  startedAt: string
  finishedAt?: string
  startedBy?: string
  aiCredits: number
  steps: Array<{
    id: string
    name: string
    type: string
    status: string
  }>
}

interface RunCardProps {
  run: Run
}

export default function RunCard({ run }: RunCardProps) {
  return (
    <Link href={`/runs/${run.id}`}>
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:bg-white/[0.04] transition-colors cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium text-white">Run {run.id.slice(-8)}</h3>
          <StatusPill status={run.status} />
        </div>
        
        <div className="text-sm text-gray-400 mb-4">
          Started {new Date(run.startedAt).toLocaleString()}
        </div>

        {run.steps && run.steps.length > 0 && (
          <div className="text-sm text-gray-500 mb-4">
            {run.steps.length} steps
          </div>
        )}

        <div className="flex justify-between text-sm text-gray-500">
          <span>Credits: {run.aiCredits}</span>
          {run.finishedAt && (
            <span>Duration: {Math.round((new Date(run.finishedAt).getTime() - new Date(run.startedAt).getTime()) / 1000)}s</span>
          )}
        </div>
      </div>
    </Link>
  )
}
