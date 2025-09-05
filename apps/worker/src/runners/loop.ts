import { WorkflowStep } from './workflow';
import { WorkflowRunner } from './workflow';

export class LoopRunner {
  constructor(private workflowRunner: WorkflowRunner) {}

  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { items, children } = step.input || {};
    
    if (!items || !children || !Array.isArray(children)) {
      throw new Error('Loop step requires items and children');
    }

    // Resolve items from context
    const itemsPath = this.resolveItemsPath(items, context);
    const itemsToLoop = this.getNestedValue(context, itemsPath);
    
    if (!Array.isArray(itemsToLoop)) {
      throw new Error(`Items path ${itemsPath} does not resolve to an array`);
    }

    const results = [];
    let totalCredits = 0;

    // Execute children for each item
    for (let i = 0; i < itemsToLoop.length; i++) {
      const item = itemsToLoop[i];
      const itemContext = { ...context, item, index: i };
      
      const itemResults = [];
      
      for (const childStep of children) {
        try {
          const result = await this.executeChildStep(childStep, itemContext);
          itemResults.push({
            stepId: childStep.id,
            output: result.output,
            credits: result.credits || 0
          });
          totalCredits += result.credits || 0;
        } catch (error) {
          console.error(`Error executing loop child step ${childStep.id}:`, error);
          itemResults.push({
            stepId: childStep.id,
            error: error.message,
            credits: 0
          });
        }
      }
      
      results.push({
        item,
        index: i,
        results: itemResults
      });
    }

    return {
      output: {
        iterations: results.length,
        results,
        summary: `${results.length} iteration${results.length !== 1 ? 's' : ''}: ${results.length} successful`
      },
      credits: totalCredits
    };
  }

  private resolveItemsPath(items: string, context: Record<string, any>): string {
    // Handle simple path references like "s1.rows"
    return items.replace(/^\$\./, '');
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  private async executeChildStep(childStep: WorkflowStep, context: Record<string, any>) {
    // This is a simplified execution - in production, you'd want more robust step execution
    switch (childStep.type) {
      case 'ai':
        // Mock AI execution for now
        return {
          output: `Mock AI response for ${childStep.name}`,
          credits: 10
        };
      case 'linkedin.searchPosts':
        // Mock LinkedIn execution for now
        return {
          output: `Mock LinkedIn posts for ${childStep.name}`,
          credits: 0
        };
      default:
        return {
          output: `Mock execution for ${childStep.type}`,
          credits: 0
        };
    }
  }
}
