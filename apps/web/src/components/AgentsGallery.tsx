"use client";

import { useMemo, useState } from "react";
import TemplateBoard from "@/components/TemplateBoard";
import { agentTemplates, categories, type AgentTemplate } from "@/data/agents";

export default function AgentsGallery() {
  const [active, setActive] = useState<(typeof categories)[number]>("Meeting Briefings");
  const filtered = useMemo(
    () => agentTemplates.filter((t) => t.category === active),
    [active]
  );

  return (
    <section className="border-t border-white/5 bg-canvas/95 py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={[
                  "rounded-xl border px-3 py-1.5 text-sm transition",
                  isActive
                    ? "border-brand-400/40 bg-brand-400/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                    : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]",
                ].join(" ")}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* Boards */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {filtered.map((tpl) => (
            <AgentCard key={tpl.id} tpl={tpl} />
          ))}
        </div>
      </div>
    </section>
  );
}

function AgentCard({ tpl }: { tpl: AgentTemplate }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white/90">{tpl.title}</h3>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/70">
          Template
        </span>
      </div>

      <TemplateBoard title={tpl.title} steps={tpl.steps} />

      <div className="mt-4 flex gap-2">
        <a
          href={`/templates/${tpl.id}`}
          className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          Show template
        </a>
        <a
          href={`/start?template=${tpl.id}`}
          className="rounded-xl px-3 py-2 text-sm font-semibold text-white"
          style={{ background: "linear-gradient(90deg,#6D00FF 0%,#7658E7 50%,#3715E0 100%)" }}
        >
          Try this agent
        </a>
      </div>
    </div>
  );
}
