import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { AIRunner } from './ai';
import { EmailRunner } from './email';
import { LinkedInRunner } from './linkedin';
import { TableRunner } from './table';
import { LoopRunner } from './loop';
import { LogRunner } from './log';

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  input?: any;
  children?: WorkflowStep[];
}

export interface WorkflowDefinition {
  name: string;
  timezone: string;
  schedule?: string;
  steps: WorkflowStep[];
}

export class WorkflowRunner {
  private aiRunner: AIRunner;
  private emailRunner: EmailRunner;
  private linkedInRunner: LinkedInRunner;
  private tableRunner: TableRunner;
  private loopRunner: LoopRunner;
  private logRunner: LogRunner;

  constructor(private prisma: PrismaClient, private redis: Redis) {
    this.aiRunner = new AIRunner();
    this.emailRunner = new EmailRunner();
    this.linkedInRunner = new LinkedInRunner();
    this.tableRunner = new TableRunner();
    this.loopRunner = new LoopRunner(this);
    this.logRunner = new LogRunner();
  }

  async executeWorkflow(runId: string, workflowId: string, definition: WorkflowDefinition) {
    try {
      // Update run status to running
      await this.prisma.run.update({
        where: { id: runId },
        data: { status: 'RUNNING' }
      });

      // Create initial step records
      const stepRecords = await this.createStepRecords(runId, definition.steps);
      
      // Execute steps
      const context: Record<string, any> = {};
      let totalCredits = 0;

      for (const step of definition.steps) {
        try {
          const result = await this.executeStep(step, context, stepRecords);
          totalCredits += result.credits || 0;
          
          // Update step record
          await this.updateStepRecord(stepRecords[step.id], 'COMPLETED', result.output, result.credits);
          
          // Update context with step output
          context[step.id] = result.output;
          
        } catch (error) {
          console.error(`Error executing step ${step.id}:`, error);
          
          // Update step record with error
          await this.updateStepRecord(stepRecords[step.id], 'FAILED', { error: (error as Error).message }, 0);
          
          // Update run status to failed
          await this.prisma.run.update({
            where: { id: runId },
            data: { 
              status: 'FAILED',
              finishedAt: new Date()
            }
          });
          
          throw error;
        }
      }

      // Update run status to completed
      await this.prisma.run.update({
        where: { id: runId },
        data: { 
          status: 'COMPLETED',
          finishedAt: new Date(),
          aiCredits: totalCredits
        }
      });

      console.log(`Workflow execution completed: ${runId}`);

    } catch (error) {
      console.error(`Workflow execution failed: ${runId}`, error);
      
      // Ensure run is marked as failed
      await this.prisma.run.update({
        where: { id: runId },
        data: { 
          status: 'FAILED',
          finishedAt: new Date()
        }
      });
      
      throw error;
    }
  }

  private async executeStep(step: WorkflowStep, context: Record<string, any>, stepRecords: Record<string, any>) {
    console.log(`Executing step: ${step.id} (${step.type})`);

    // Update step status to running
    await this.updateStepRecord(stepRecords[step.id], 'RUNNING');

    let result: any;

    switch (step.type) {
      case 'ai':
        result = await this.aiRunner.execute(step, context);
        break;
      case 'email.send':
        result = await this.emailRunner.execute(step, context);
        break;
      case 'linkedin.searchPosts':
        result = await this.linkedInRunner.execute(step, context);
        break;
      case 'table.constants':
        result = await this.tableRunner.execute(step, context);
        break;
      case 'loop':
        result = await this.loopRunner.execute(step, context);
        break;
      case 'log':
        result = await this.logRunner.execute(step, context);
        break;
      default:
        throw new Error(`Unknown step type: ${step.type}`);
    }

    return result;
  }

  private async createStepRecords(runId: string, steps: WorkflowStep[]): Promise<Record<string, any>> {
    const stepRecords: Record<string, any> = {};
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepRecord = await this.prisma.runStep.create({
        data: {
          runId,
          index: i,
          name: step.name,
          type: step.type,
          input: step.input,
          status: 'PENDING',
          startedAt: new Date()
        }
      });
      
      stepRecords[step.id] = stepRecord;
    }
    
    return stepRecords;
  }

  private async updateStepRecord(stepRecord: any, status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED', output?: any, aiCredits?: number) {
    await this.prisma.runStep.update({
      where: { id: stepRecord.id },
      data: {
        status,
        output,
        aiCredits: aiCredits || 0,
        finishedAt: status === 'COMPLETED' || status === 'FAILED' ? new Date() : undefined
      }
    });
  }
}
