import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Template } from "@/data/templates";
import { TEMPLATES } from "@/data/templates";

export function generateStaticParams() {
  return TEMPLATES.map(t => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const t = TEMPLATES.find(x => x.slug === params.slug);
  if (!t) return {};
  return {
    title: `${t.title} • Templates • Algorythmos`,
    description: t.summary,
    openGraph: { title: t.title, description: t.summary }
  };
}

export default function TemplateDetail({ params }: { params: { slug: string } }) {
  const template: Template | undefined = TEMPLATES.find(t => t.slug === params.slug);
  if (!template) return notFound();

  return (
    <main className="bg-canvas text-white">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <Link href="/templates" className="text-sm text-white/60 hover:underline">&larr; All templates</Link>

        <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-6">
          <div className="flex flex-col gap-6 md:flex-row md:items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{template.title}</h1>
              {template.subtitle && <p className="mt-2 text-white/70">{template.subtitle}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/60">
                {template.integrations.map(i => (
                  <span key={i} className="rounded-full border border-white/10 px-2 py-0.5">{i}</span>
                ))}
              </div>

              <p className="mt-6 text-white/80">{template.summary}</p>

              <div className="mt-6">
                <Link
                  href={`/workflows/new?template=${template.slug}`}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-primary to-accent text-white px-6 py-3 font-medium hover:opacity-90 transition"
                >
                  Use this template
                </Link>
              </div>
            </div>

            {template.heroImage && (
              <div className="md:w-[320px] md:shrink-0">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-center text-white/60 text-sm">
                    Hero image placeholder
                    <br />
                    <span className="text-xs">{template.heroImage}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold">Steps in this workflow</h2>
          <ol className="mt-4 space-y-3">
            {template.steps.map(s => (
              <li key={s.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-semibold">Step {s.id}: {s.title}</div>
                {s.summary && <div className="text-sm text-white/70 mt-1">{s.summary}</div>}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </main>
  );
}
