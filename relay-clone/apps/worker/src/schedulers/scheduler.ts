import { nextFirstWednesdayAt8 } from "../utils/firstWed";
import { prisma } from "../db/prisma";
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL ?? "redis://localhost:6379");
const runQueue = new Queue("run.execute", { connection });

export async function startScheduler() {
  // naive approach: check every hour; enqueue if within window (±2m).
  setInterval(async () => {
    const workflows = await prisma.workflow.findMany({ where: { schedule: "FIRST_WED_08_CET" } });
    const now = new Date();
    for (const wf of workflows) {
      const next = nextFirstWednesdayAt8(wf.timezone ?? "Europe/Paris", now).toJSDate();
      const diff = Math.abs(next.getTime() - now.getTime());
      // within 2 minutes window: enqueue a run
      if (diff < 2 * 60 * 1000) {
        const run = await prisma.run.create({ data: { workflowId: wf.id, status: "queued", startedBy: "scheduler" } });
        await runQueue.add("execute", { runId: run.id }, { jobId: run.id, removeOnComplete: true });
      }
    }
  }, 60 * 1000);
}
