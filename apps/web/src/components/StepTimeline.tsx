'use client';

import { useState, Fragment } from 'react';
import { ChevronDown, ChevronRight, RefreshCw, Square } from 'lucide-react';
import StatusPill from './StatusPill';
import { api } from '@/lib/api';

type Step = {
  id: string;
  name: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  started_at?: string;
  finished_at?: string;
  duration_ms?: number;
  logs?: string[];
};

export default function StepTimeline({
  runId,
  steps,
  canAct = true,
  onRefresh,
}: {
  runId: string;
  steps: Step[];
  canAct?: boolean;
  onRefresh?: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState<'retry' | 'cancel' | null>(null);

  const toggle = (id: string) => setOpen((s) => ({ ...s, [id]: !s[id] }));

  const ms = (v?: number) => {
    if (v == null) return '—';
    const s = Math.floor(v / 1000);
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}m ${r}s`;
  };

  const act = async (kind: 'retry' | 'cancel') => {
    setBusy(kind);
    try {
      await api.post(`/runs/${runId}/${kind}`, {});
      onRefresh?.();
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {canAct && (
          <div className="flex items-center gap-2">
            <button
              disabled={busy !== null}
              onClick={() => act('retry')}
              className="rounded-2xl px-3 py-1.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
              style={{
                background:
                  'linear-gradient(90deg,#6D00FF 0%,#7658E7 50%,#3715E0 100%)',
              }}
            >
              {busy === 'retry' ? 'Retrying…' : 'Retry run'}
            </button>
            <button
              disabled={busy !== null}
              onClick={() => act('cancel')}
              className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-60 hover:bg-white/[0.06]"
            >
              {busy === 'cancel' ? 'Cancelling…' : 'Cancel run'}
            </button>
            <button
              onClick={onRefresh}
              className="inline-flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-white/80 hover:bg-white/[0.06]"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        )}
      </div>

      <ol className="relative ml-2 space-y-2 before:absolute before:left-[-1px] before:top-0 before:h-full before:w-px before:bg-white/10">
        {steps.map((s, idx) => (
          <li key={s.id} className="relative pl-5">
            <span className="absolute left-[-5px] top-2 h-2 w-2 rounded-full bg-white/60" />
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-1 flex items-center gap-2">
                    <button
                      onClick={() => toggle(s.id)}
                      className="text-white/70 hover:text-white"
                      aria-label="Toggle logs"
                    >
                      {open[s.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <h3 className="truncate font-semibold">
                      {idx + 1}. {s.name}
                    </h3>
                    <StatusPill status={s.status} />
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-white/70">
                    <div>
                      <span className="text-white/50">Started:</span>{' '}
                      {s.started_at
                        ? new Date(s.started_at).toLocaleString()
                        : '—'}
                    </div>
                    <div>
                      <span className="text-white/50">Duration:</span>{' '}
                      {ms(s.duration_ms)}
                    </div>
                  </div>
                </div>
                {s.status === 'RUNNING' && (
                  <Square className="h-4 w-4 animate-pulse text-white/50" />
                )}
              </div>

              {open[s.id] && (
                <div className="mt-3 rounded-xl bg-black/40 p-3">
                  <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-white/85">
                    {(s.logs && s.logs.length
                      ? s.logs.join('\n')
                      : 'No logs for this step.') as string}
                  </pre>
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
