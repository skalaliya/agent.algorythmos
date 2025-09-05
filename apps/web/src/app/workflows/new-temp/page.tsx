import Link from "next/link";

export default function NewWorkflowPage() {
  return (
    <main className="bg-canvas text-white">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/templates" className="text-sm text-white/60 hover:underline">&larr; Back to templates</Link>
        
        <h1 className="text-2xl font-bold mt-4">Create workflow</h1>
        
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-white/70">Choose a template from the gallery to prefill.</p>
          <Link 
            href="/templates" 
            className="inline-block mt-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white px-4 py-2 font-medium hover:opacity-90 transition"
          >
            Browse Templates
          </Link>
        </div>
        
        <div className="mt-6 p-4 rounded-xl border border-white/10 bg-white/5">
          <p className="text-sm text-white/70">
            🚧 <strong>Workflow Builder Coming Soon</strong><br />
            This will be where you can customize and deploy templates as live workflows.
          </p>
        </div>
      </div>
    </main>
  );
}
