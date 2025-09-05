

export default function CanvasFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <div
          className="h-6 w-6 rounded-xl"
          style={{
            background:
              'linear-gradient(90deg,#6D00FF 0%,#7658E7 50%,#3715E0 100%)',
          }}
        />
      </div>
      <div className="rounded-2xl bg-white/[0.02] p-3 sm:p-4">{children}</div>
    </section>
  );
}
