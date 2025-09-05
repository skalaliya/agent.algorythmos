import { Worker, QueueEvents, Job } from 'bullmq';
import IORedis from 'ioredis';
import { executeRun } from '../runners/executeRun';

const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });

export function startRunWorker() {
  const worker = new Worker('run.execute', async (job: Job) => {
    const { runId } = job.data as { runId: string };
    await executeRun(runId);
  }, { connection, concurrency: 2 });

  const events = new QueueEvents('run.execute', { connection });
  events.on('failed', ({ jobId, failedReason }) => console.error('[run.execute] failed', jobId, failedReason));
  events.on('completed', ({ jobId }) => console.log('[run.execute] completed', jobId));

  worker.on('failed', (job, err) => console.error('[worker] job failed', job?.id, err));
  worker.on('error', (err) => console.error('[worker] error', err));
}
