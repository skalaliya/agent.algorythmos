import { resolve } from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(process.cwd(), '../../.env') });

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prisma } from './db/prisma';
import { enqueueRun } from './queue/producer';

async function main() {
  const app = Fastify({ logger: true });
  await app.register(cors, { 
    origin: process.env.WEB_ORIGIN || 'http://localhost:3000' 
  });

  app.get('/health', async () => ({ ok: true, env: process.env.NODE_ENV ?? 'dev' }));

  app.get('/workflows', async () => {
    const ws = await prisma.workflow.findMany({ select: { id: true, name: true, schedule: true, timezone: true } });
    return { items: ws };
  });

  app.get('/workflows/:id', async (req) => {
    const id = (req.params as { id: string }).id;
    const w = await prisma.workflow.findUnique({ where: { id } });
    if (!w) return app.httpErrors.notFound('Workflow not found');
    return w;
  });

  app.post('/runs', async (req, res) => {
    const { workflowId, startedBy } = (req.body ?? {}) as { workflowId: string; startedBy?: string };
    if (!workflowId) return res.status(400).send({ error: 'workflowId required' });
    const run = await prisma.run.create({ data: { workflowId, status: 'QUEUED', startedBy: startedBy ?? 'api' } });
    try {
      await enqueueRun(run.id);
    } catch (error) {
      console.error('Failed to enqueue run:', error);
    }
    return { run };
  });

  app.get('/runs/:id', async (req) => {
    const id = (req.params as { id: string }).id;
    const run = await prisma.run.findUnique({
      where: { id },
      include: { steps: { orderBy: { index: 'asc' } } }
    });
    if (!run) return app.httpErrors.notFound('Run not found');
    return run;
  });

  app.post('/runs/:id/retry', async (req) => {
    const id = (req.params as { id: string }).id;
    const run = await prisma.run.findUnique({ where: { id } });
    if (!run) return app.httpErrors.notFound('Run not found');
    
    const newRun = await prisma.run.create({
      data: {
        workflowId: run.workflowId,
        status: 'QUEUED',
        startedBy: 'retry'
      }
    });
    
    try {
      await enqueueRun(newRun.id);
    } catch (error) {
      console.error('Failed to enqueue retry run:', error);
    }
    
    return { run: newRun };
  });

  app.post('/runs/:id/cancel', async (req) => {
    const id = (req.params as { id: string }).id;
    const run = await prisma.run.findUnique({ where: { id } });
    if (!run) return app.httpErrors.notFound('Run not found');
    
    await prisma.run.update({
      where: { id },
      data: { status: 'FAILED', finishedAt: new Date() }
    });
    
    return { success: true };
  });

  app.get('/metrics', async () => {
    const runs = await prisma.run.findMany({
      select: { status: true, startedAt: true, finishedAt: true }
    });
    
    const runsStarted = runs.length;
    const runsCompleted = runs.filter(r => r.status === 'COMPLETED').length;
    const runsFailed = runs.filter(r => r.status === 'FAILED').length;
    
    const completedRuns = runs.filter(r => r.status === 'COMPLETED' && r.finishedAt);
    const durations = completedRuns.map(r => 
      new Date(r.finishedAt!).getTime() - new Date(r.startedAt).getTime()
    );
    
    const avgDuration = durations.length > 0 
      ? durations.reduce((a, b) => a + b, 0) / durations.length 
      : 0;
    
    const p95Duration = durations.length > 0
      ? durations.sort((a, b) => a - b)[Math.floor(durations.length * 0.95)]
      : 0;
    
    return {
      runs_started: runsStarted,
      runs_completed: runsCompleted,
      runs_failed: runsFailed,
      avg_duration_ms: Math.round(avgDuration),
      p95_duration_ms: Math.round(p95Duration)
    };
  });

  const port = Number(process.env.API_PORT ?? 8080);
  const host = process.env.API_HOST ?? '0.0.0.0';
  await app.listen({ port, host });
}
main().catch((err) => { console.error(err); process.exit(1); });
