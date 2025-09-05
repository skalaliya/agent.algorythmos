import { notFound } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import StepTimeline from '@/components/StepTimeline';
import StatusPill from '@/components/StatusPill';
import { revalidatePath } from 'next/cache';

interface RunDetailPageProps {
  params: { id: string };
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const run = await api.get(`/runs/${params.id}`);

  if (!run) {
    notFound();
  }

  const revalidate = async () => {
    'use server';
    revalidatePath(`/runs/${params.id}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link href="/runs" className="mb-4 inline-block text-primary hover:text-accent">
          ← Back to runs
        </Link>
        <h1 className="mb-2 text-3xl font-bold text-white">Run Details</h1>
        <p className="text-gray-300">Run ID: {run.id}</p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <dt className="text-sm font-medium text-gray-400">Status</dt>
            <dd className="mt-1">
              <StatusPill status={run.status} />
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-400">Started</dt>
            <dd className="mt-1 text-sm text-white">
              {run.started_at ? new Date(run.started_at).toLocaleString() : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-400">AI Credits</dt>
            <dd className="mt-1 text-sm text-white">{run.ai_credits}</dd>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="border-b border-white/5 px-6 py-4">
          <h2 className="text-lg font-medium text-white">Steps</h2>
        </div>
        <div className="p-6">
          <StepTimeline runId={run.id} steps={run.steps} onRefresh={revalidate} />
        </div>
      </div>
    </div>
  );
}