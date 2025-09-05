import { WorkflowStep } from './workflow';

export class AIRunner {
  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { provider, model, prompt } = step.input || {};
    
    if (!provider || !model || !prompt) {
      throw new Error('AI step requires provider, model, and prompt');
    }

    // Resolve template variables in prompt
    const resolvedPrompt = this.resolveTemplate(prompt, context);
    
    // For now, return mock response
    // In production, this would call the actual AI service
    const mockResponse = this.generateMockResponse(provider, model, resolvedPrompt);
    
    return {
      output: mockResponse,
      credits: this.estimateCredits(resolvedPrompt, provider, model)
    };
  }

  private resolveTemplate(template: string, context: Record<string, any>): string {
    // Simple template resolution for {{variable}} syntax
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

  private generateMockResponse(provider: string, model: string, prompt: string): string {
    const responses: Record<string, Record<string, string>> = {
      openai: {
        'gpt-4': `This is a mock response from OpenAI GPT-4 for: "${prompt.substring(0, 100)}..."`,
        'gpt-3.5-turbo': `Mock OpenAI GPT-3.5 response to: "${prompt.substring(0, 100)}..."`,
        'o3': `Mock OpenAI o3 response regarding: "${prompt.substring(0, 100)}..."`
      },
      anthropic: {
        'claude-3-5-sonnet': `Mock Anthropic Claude 3.5 Sonnet analysis of: "${prompt.substring(0, 100)}..."`,
        'claude-3-haiku': `Mock Anthropic Claude 3 Haiku response to: "${prompt.substring(0, 100)}..."`
      },
      perplexity: {
        'sonar-reasoning-pro': `Mock Perplexity Sonar reasoning about: "${prompt.substring(0, 100)}..."`
      }
    };

    return responses[provider]?.[model] || `Mock ${provider} ${model} response to: "${prompt.substring(0, 100)}..."`;
  }

  private estimateCredits(prompt: string, provider: string, model: string): number {
    // Simple credit estimation
    const baseRates: Record<string, Record<string, number>> = {
      openai: {
        'gpt-4': 0.03,
        'gpt-3.5-turbo': 0.002,
        'o3': 0.015
      },
      anthropic: {
        'claude-3-5-sonnet': 0.015,
        'claude-3-haiku': 0.00025
      },
      perplexity: {
        'sonar-reasoning-pro': 0.02
      }
    };

    const rate = baseRates[provider]?.[model] || 0.01;
    const tokenCount = Math.ceil(prompt.length / 4); // Rough token estimation
    return Math.ceil(tokenCount * rate * 1000); // Convert to integer credits
  }
}
