"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { TEMPLATES } from "@/data/templates";

export default function NewWorkflowPage() {
  const sp = useSearchParams();
  const slug = sp.get("template") ?? "";
  const t = TEMPLATES.find(x => x.slug === slug);

  return (
    <main className="bg-canvas text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/templates" className="text-sm text-white/60 hover:underline">&larr; Back to templates</Link>
        
        <h1 className="text-2xl font-bold mt-4">Create workflow</h1>
        {t ? (
          <>
            <p className="mt-2 text-white/70">Prefilled from template: <b>{t.title}</b></p>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-lg font-semibold mb-4">Template Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-white/60">Title:</span>
                  <span className="ml-2 text-white">{t.title}</span>
                </div>
                <div>
                  <span className="text-sm text-white/60">Summary:</span>
                  <span className="ml-2 text-white">{t.summary}</span>
                </div>
                <div>
                  <span className="text-sm text-white/60">Integrations:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {t.integrations.map(i => (
                      <span key={i} className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">
                        {i}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-white/60">Steps:</span>
                  <ol className="mt-2 space-y-2">
                    {t.steps.map(step => (
                      <li key={step.id} className="text-sm text-white/80">
                        {step.id}. {step.title}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              
              <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
                <p className="text-sm text-white/70">
                  🚧 <strong>Workflow Builder Coming Soon</strong><br />
                  This will be where you can customize and deploy the template as a live workflow.
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-white/70">Choose a template from the gallery to prefill.</p>
            <Link 
              href="/templates" 
              className="inline-block mt-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white px-4 py-2 font-medium hover:opacity-90 transition"
            >
              Browse Templates
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
