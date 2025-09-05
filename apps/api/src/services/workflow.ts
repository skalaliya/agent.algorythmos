import { prisma } from '../index';
import { TriggerService } from './trigger';

export interface CreateWorkflowData {
  name: string;
  definition: Record<string, any>;
  schedule?: string;
  timezone?: string;
}

export interface UpdateWorkflowData {
  name?: string;
  definition?: Record<string, any>;
  schedule?: string;
  timezone?: string;
}

export class WorkflowService {
  private triggerService = new TriggerService();

  async createWorkflow(data: CreateWorkflowData) {
    const workflow = await prisma.workflow.create({
      data: {
        name: data.name,
        definition: data.definition,
        schedule: data.schedule,
        timezone: data.timezone || 'Europe/Paris'
      }
    });

    // If schedule is provided, register it
    if (data.schedule) {
      await this.triggerService.registerSchedule(workflow.id, data.schedule, data.timezone || 'Europe/Paris');
    }

    return workflow;
  }

  async updateWorkflow(id: string, data: UpdateWorkflowData) {
    const workflow = await prisma.workflow.update({
      where: { id },
      data
    });

    // Update schedule if changed
    if (data.schedule !== undefined) {
      if (data.schedule) {
        await this.triggerService.registerSchedule(id, data.schedule, data.timezone || workflow.timezone);
      } else {
        await this.triggerService.unregisterSchedule(id);
      }
    }

    return workflow;
  }

  async deleteWorkflow(id: string) {
    // Unregister schedule first
    await this.triggerService.unregisterSchedule(id);

    // Delete workflow and all related data
    await prisma.workflow.delete({
      where: { id }
    });
  }

  async toggleSchedule(id: string, enabled: boolean) {
    const workflow = await prisma.workflow.findUnique({
      where: { id }
    });

    if (!workflow) {
      throw new Error('Workflow not found');
    }

    if (enabled && workflow.schedule) {
      await this.triggerService.registerSchedule(id, workflow.schedule, workflow.timezone);
    } else {
      await this.triggerService.unregisterSchedule(id);
    }

    return workflow;
  }

  async getWorkflowById(id: string) {
    return prisma.workflow.findUnique({
      where: { id },
      include: { runs: true }
    });
  }

  async getAllWorkflows() {
    return prisma.workflow.findMany({
      include: {
        runs: {
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      }
    });
  }
}
