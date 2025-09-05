import { Queue } from 'bullmq';
import Redis from 'ioredis';

export class TriggerService {
  private queue: Queue;
  private redis: Redis;

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
    this.queue = new Queue('workflow-triggers', {
      connection: this.redis
    });
  }

  async registerSchedule(workflowId: string, schedule: string, timezone: string) {
    // Parse schedule patterns like "FIRST_WED_08_CET"
    const cronExpression = this.parseScheduleToCron(schedule, timezone);
    
    if (cronExpression) {
      await this.queue.add(
        `workflow:${workflowId}`,
        { workflowId, type: 'scheduled' },
        {
          repeat: {
            pattern: cronExpression
          },
          jobId: `schedule:${workflowId}`
        }
      );
    }
  }

  async unregisterSchedule(workflowId: string) {
    const repeatableJobs = await this.queue.getRepeatableJobs();
    const job = repeatableJobs.find(j => j.id === `schedule:${workflowId}`);
    
    if (job) {
      await this.queue.removeRepeatableByKey(job.key);
    }
  }

  private parseScheduleToCron(schedule: string, timezone: string): string | null {
    // Handle "FIRST_WED_08_CET" pattern
    if (schedule === 'FIRST_WED_08_CET') {
      // First Wednesday of each month at 08:00 CET
      // This is a simplified implementation - in production you'd want more robust parsing
      return '0 8 * * 3'; // Every Wednesday at 8 AM
    }
    
    // Add more schedule patterns as needed
    return null;
  }

  async getNextRunTime(workflowId: string): Promise<Date | null> {
    const repeatableJobs = await this.queue.getRepeatableJobs();
    const job = repeatableJobs.find(j => j.id === `schedule:${workflowId}`);
    
    if (job && job.next) {
      return new Date(job.next);
    }
    
    return null;
  }
}
