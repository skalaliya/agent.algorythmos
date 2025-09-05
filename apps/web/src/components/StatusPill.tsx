'use client'

interface StatusPillProps {
  status: string
}

export default function StatusPill({ status }: StatusPillProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'FAILED':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'RUNNING':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'QUEUED':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {status === 'RUNNING' && (
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-spin-slow mr-1.5" />
      )}
      {status}
    </span>
  )
}
