import React from 'react';
import { AgentStep } from '@/data/agents';

interface TemplateBoardProps {
  title: string;
  steps: AgentStep[];
}

export default function TemplateBoard({ title, steps }: TemplateBoardProps) {
  return (
    <div className="space-y-2">
      {steps.map((step, index) => (
        <div
          key={`${step.kind}-${index}`}
          className={`flex items-center gap-3 rounded-xl border px-3 py-2 text-sm ${
            step.kind === 'trigger'
              ? 'border-green-300/20 bg-green-300/10'
              : step.kind === 'group'
              ? 'border-purple-300/20 bg-purple-300/10'
              : 'border-white/10 bg-white/[0.02]'
          }`}
        >
          <div
            className={`h-6 w-6 rounded-full flex items-center justify-center ${
              step.kind === 'trigger'
                ? 'bg-green-500'
                : step.kind === 'group'
                ? 'bg-purple-500'
                : 'bg-gray-500'
            }`}
          >
            <span className="text-xs text-white">
              {step.kind === 'trigger' ? '⚡' : step.kind === 'group' ? '🔄' : index + 1}
            </span>
          </div>
          <div className={`font-semibold ${
            step.kind === 'trigger'
              ? 'text-green-100'
              : step.kind === 'group'
              ? 'text-purple-100'
              : 'text-white/90'
          }`}>
            {step.title}
            {step.subtitle && <span className="text-xs opacity-75 ml-2">• {step.subtitle}</span>}
          </div>
          {step.badge && (
            <span className="ml-auto rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-200">
              {step.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
