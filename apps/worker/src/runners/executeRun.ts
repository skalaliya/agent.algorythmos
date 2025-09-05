import { prisma } from '../db/prisma';

type Step = { id: string; type: string; name?: string; [k: string]: any };

export async function executeRun(runId: string) {
  const run = await prisma.run.findUnique({ where: { id: runId }, include: { workflow: true } });
  if (!run) throw new Error('Run not found');

  const def = (run.workflow as any).definition ?? run.workflow.definition;
  const steps: Step[] = def?.steps ?? [];
  await prisma.run.update({ where: { id: runId }, data: { status: 'RUNNING', startedAt: new Date() } });

  let idx = 1;
  let totalCredits = 0;

  // Simple context map for referencing outputs by step id
  const ctx = new Map<string, any>();

  for (const step of steps) {
    const startedAt = new Date();
    try {
      const input = resolveInput(step, ctx);
      const result = await runStep(step, input, ctx); // implement mapping to your existing runners
      const aiCredits = Number(result?.aiCredits ?? 0);
      totalCredits += aiCredits;

      await prisma.runStep.create({
        data: {
          runId,
          index: idx++,
          name: step.name ?? step.type,
          type: step.type,
          status: 'COMPLETED',
          startedAt,
          finishedAt: new Date(),
          input,
          output: result,
          aiCredits
        }
      });
    } catch (err: any) {
      await prisma.runStep.create({
        data: {
          runId, index: idx++, name: step.name ?? step.type, type: step.type, status: 'FAILED',
          startedAt, finishedAt: new Date(), input: {}, output: { error: String(err?.message ?? err) }
        }
      });
      await prisma.run.update({ where: { id: runId }, data: { status: 'FAILED', finishedAt: new Date(), aiCredits: totalCredits } });
      throw err;
    }
  }

  await prisma.run.update({ where: { id: runId }, data: { status: 'COMPLETED', finishedAt: new Date(), aiCredits: totalCredits } });
}

// --- helpers (adjust to your runners) ---
function resolveInput(step: Step, ctx: Map<string, any>) { return step; }

async function runStep(step: Step, input: any, ctx: Map<string, any>) {
  // route to existing runners based on step.type
  // e.g. if (step.type.startsWith('table')) return tableRunner(step);
  // For now return a mock to keep pipeline alive if runner not wired:
  return { ok: true, note: `Executed ${step.type} (mock)` };
}
