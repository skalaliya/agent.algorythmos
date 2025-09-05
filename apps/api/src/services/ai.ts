import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export interface AIProvider {
  name: string;
  generateResponse(prompt: string, model: string): Promise<{ text: string; credits: number }>;
}

export interface AIConfig {
  openai?: {
    apiKey: string;
  };
  anthropic?: {
    apiKey: string;
  };
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private config: AIConfig;

  constructor() {
    this.config = {
      openai: process.env.OPENAI_API_KEY ? { apiKey: process.env.OPENAI_API_KEY } : undefined,
      anthropic: process.env.ANTHROPIC_API_KEY ? { apiKey: process.env.ANTHROPIC_API_KEY } : undefined
    };

    this.initializeProviders();
  }

  private initializeProviders() {
    // OpenAI provider
    if (this.config.openai) {
      const openai = new OpenAI({ apiKey: this.config.openai.apiKey });
      this.providers.set('openai', new OpenAIProvider(openai));
    } else {
      this.providers.set('openai', new MockAIProvider('openai'));
    }

    // Anthropic provider
    if (this.config.anthropic) {
      const anthropic = new Anthropic({ apiKey: this.config.anthropic.apiKey });
      this.providers.set('anthropic', new AnthropicProvider(anthropic));
    } else {
      this.providers.set('anthropic', new MockAIProvider('anthropic'));
    }

    // Perplexity provider (mock for now)
    this.providers.set('perplexity', new MockAIProvider('perplexity'));
  }

  async generateResponse(provider: string, model: string, prompt: string): Promise<{ text: string; credits: number }> {
    const aiProvider = this.providers.get(provider);
    if (!aiProvider) {
      throw new Error(`Unknown AI provider: ${provider}`);
    }

    return await aiProvider.generateResponse(prompt, model);
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  estimateCredits(provider: string, model: string, prompt: string): number {
    // Simple credit estimation based on prompt length and model
    const baseRate = this.getBaseRate(provider, model);
    const tokenCount = this.estimateTokenCount(prompt);
    return Math.ceil(tokenCount * baseRate);
  }

  private getBaseRate(provider: string, model: string): number {
    const rates: Record<string, Record<string, number>> = {
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

    return rates[provider]?.[model] || 0.01;
  }

  private estimateTokenCount(text: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
  }
}

class OpenAIProvider implements AIProvider {
  constructor(private client: OpenAI) {}

  async generateResponse(prompt: string, model: string): Promise<{ text: string; credits: number }> {
    try {
      const completion = await this.client.chat.completions.create({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000
      });

      const text = completion.choices[0]?.message?.content || '';
      const usage = completion.usage;
      const credits = usage ? usage.total_tokens * 0.001 : this.estimateCredits(prompt);

      return { text, credits };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate OpenAI response');
    }
  }

  private estimateCredits(prompt: string): number {
    return Math.ceil(prompt.length / 4) * 0.001;
  }
}

class AnthropicProvider implements AIProvider {
  constructor(private client: Anthropic) {}

  async generateResponse(prompt: string, model: string): Promise<{ text: string; credits: number }> {
    try {
      const message = await this.client.messages.create({
        model: model,
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      });

      const text = message.content[0]?.text || '';
      const usage = message.usage;
      const credits = usage ? usage.input_tokens * 0.0000015 + usage.output_tokens * 0.000006 : this.estimateCredits(prompt);

      return { text, credits };
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error('Failed to generate Anthropic response');
    }
  }

  private estimateCredits(prompt: string): number {
    return Math.ceil(prompt.length / 4) * 0.0000015;
  }
}

class MockAIProvider implements AIProvider {
  constructor(private providerName: string) {}

  async generateResponse(prompt: string, model: string): Promise<{ text: string; credits: number }> {
    // Generate deterministic mock responses
    const mockResponses: Record<string, string> = {
      'openai': `This is a mock response from OpenAI (${model}) for: "${prompt.substring(0, 50)}..."`,
      'anthropic': `Here's a mock response from Anthropic (${model}) regarding: "${prompt.substring(0, 50)}..."`,
      'perplexity': `Mock Perplexity (${model}) analysis of: "${prompt.substring(0, 50)}..."`
    };

    const text = mockResponses[this.providerName] || `Mock response from ${this.providerName}`;
    const credits = this.estimateCredits(prompt);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return { text, credits };
  }

  private estimateCredits(prompt: string): number {
    return Math.ceil(prompt.length / 4) * 0.001;
  }
}
