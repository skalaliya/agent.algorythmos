import { WorkflowStep } from './workflow';

export class LogRunner {
  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { message, level = 'info' } = step.input || {};
    
    if (!message) {
      throw new Error('Log step requires message');
    }

    // Resolve template variables
    const resolvedMessage = this.resolveTemplate(message, context);
    
    // Log the message
    const logLevel = level.toLowerCase();
    switch (logLevel) {
      case 'error':
        console.error(`[WORKFLOW LOG] ${resolvedMessage}`);
        break;
      case 'warn':
        console.warn(`[WORKFLOW LOG] ${resolvedMessage}`);
        break;
      case 'debug':
        console.debug(`[WORKFLOW LOG] ${resolvedMessage}`);
        break;
      default:
        console.log(`[WORKFLOW LOG] ${resolvedMessage}`);
    }

    return {
      output: {
        message: resolvedMessage,
        level: logLevel,
        timestamp: new Date().toISOString()
      },
      credits: 0
    };
  }

  private resolveTemplate(template: string, context: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (match, variable) => {
      const value = this.getNestedValue(context, variable.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }
}
