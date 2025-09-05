import Hero from "@/components/Hero";

export default function HomePage() {
  return (
    <main className="bg-canvas text-white">
      {/* HERO SECTION */}
      <Hero />

      {/* TRUSTED BY SECTION */}
      <section aria-label="Trusted by" className="border-b border-white/5 bg-canvas">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <p className="mb-8 text-center text-xs uppercase tracking-widest text-white/50">
            Trusted by successful teams at
          </p>
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-80">
            {["Skyflow", "Tavus", "Ramp", "Cursor", "Lumos", "Motion"].map((company) => (
              <div
                key={company}
                className="text-sm font-medium text-white/60 transition hover:text-white/80"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA SECTION */}
      <section className="bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-gradient-to-r from-primary/10 via-accent/10 to-deep/10 p-8 text-center sm:p-12">
            <h3 className="text-3xl font-bold text-white">
              Automate real work, not demos.
            </h3>
            <p className="mt-4 text-lg text-white/70">
              Queue, schedule, and track jobs end-to-end. Start in minutes, scale with confidence.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="/signup"
                className="rounded-2xl bg-gradient-to-r from-primary to-accent px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
              >
                Begin Evolution
              </a>
              <a
                href="/tour"
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/[0.06]"
              >
                Interactive Tour
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
