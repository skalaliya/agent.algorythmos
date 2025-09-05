'use client'

import StatusPill from './StatusPill';

export function TriggerCard({
  on,
  title,
  icon,
}: {
  on?: boolean;
  title: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-sm">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-semibold">{title}</span>
      </div>
      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-200">
        {on ? 'On' : 'Off'}
      </span>
    </div>
  );
}

export function ForEachCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-[#7658E7]/30 bg-[#7658E7]/10 p-3">
      <div className="mb-2 text-sm font-semibold text-[#C8A9FF]">{title}</div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function StepRow({
  name,
  status,
  right,
}: {
  name: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="font-medium">{name}</span>
        <StatusPill status={status} />
      </div>
      {right}
    </div>
  );
}