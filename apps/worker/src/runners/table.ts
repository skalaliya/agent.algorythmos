import { WorkflowStep } from './workflow';

export class TableRunner {
  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { rows } = step.input || {};
    
    if (!rows || !Array.isArray(rows)) {
      throw new Error('Table step requires rows array');
    }

    return {
      output: { rows },
      credits: 0
    };
  }
}
