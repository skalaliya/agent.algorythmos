import { Queue } from 'bullmq';
import IORedis from 'ioredis';
const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });
export const runQueue = new Queue('run.execute', { connection });
export async function enqueueRun(runId: string) {
  return runQueue.add('execute', { runId }, { jobId: runId, removeOnComplete: true, attempts: 3, backoff: { type: 'exponential', delay: 2000 } });
}
