import Link from "next/link";
import { TEMPLATES } from "@/data/templates";

export const metadata = { title: "Templates • Algorythmos" };

export default function TemplatesPage() {
  return (
    <main className="bg-canvas text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold">Templates</h1>
        <p className="mt-2 text-white/70">
          Start with a ready-made workflow. Click to see the full recipe.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map(t => (
            <Link
              key={t.slug}
              href={`/templates/${t.slug}`}
              className="block rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="text-lg font-semibold">{t.title}</div>
              <div className="mt-1 text-sm text-white/70 line-clamp-2">{t.subtitle ?? t.summary}</div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                {t.integrations.map(i => (
                  <span key={i} className="rounded-full border border-white/10 px-2 py-0.5">
                    {i}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}