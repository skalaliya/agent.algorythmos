import { prisma } from '../index';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

export class RunService {
  private queue: Queue;
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.queue = new Queue('workflow-runs', {
      connection: this.redis
    });
  }

  async startRun(workflowId: string) {
    // Get workflow
    const workflow = await prisma.workflow.findUnique({
      where: { id: workflowId }
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Create run record
    const run = await prisma.run.create({
      data: {
        workflowId,
        status: 'QUEUED',
        startedAt: new Date()
      }
    });

    // Enqueue run job
    await this.queue.add(
      'execute-workflow',
      {
        runId: run.id,
        workflowId,
        definition: workflow.definition
      },
      {
        jobId: `run:${run.id}`,
        priority: 1
      }
    );

    return run;
  }

  async getRunById(id: string) {
    return prisma.run.findUnique({
      where: { id },
      include: {
        workflow: true,
        steps: {
          orderBy: { index: 'asc' }
        }
      }
    });
  }

  async getRunsByWorkflow(workflowId: string) {
    return prisma.run.findMany({
      where: { workflowId },
      include: {
        steps: {
          orderBy: { index: 'asc' }
        }
      },
      orderBy: { startedAt: 'desc' }
    });
  }

  async updateRunStatus(id: string, status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED', finishedAt?: Date) {
    return prisma.run.update({
      where: { id },
      data: {
        status,
        finishedAt: finishedAt || (status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined)
      }
    });
  }

  async updateRunCredits(id: string, credits: number) {
    return prisma.run.update({
      where: { id },
      data: {
        aiCredits: credits
      }
    });
  }
}
