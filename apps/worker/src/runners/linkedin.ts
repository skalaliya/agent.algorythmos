import { WorkflowStep } from './workflow';

export class LinkedInRunner {
  async execute(step: WorkflowStep, context: Record<string, any>) {
    const { query, limit } = step.input || {};
    
    if (!query) {
      throw new Error('LinkedIn step requires query');
    }

    // Resolve template variables
    const resolvedQuery = this.resolveTemplate(query, context);
    const resolvedLimit = limit || 10;

    // Mock LinkedIn posts (in production, this would call the LinkedIn API)
    const posts = this.generateMockPosts(resolvedQuery, resolvedLimit);
    
    return {
      output: posts,
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

  private generateMockPosts(query: string, limit: number) {
    const mockPosts = [
      {
        activityId: 'post_001',
        content: `Great insights on ${query}! This is exactly what the industry needs right now.`,
        reactions: 45,
        comments: 12,
        date: '2024-01-15T10:30:00Z',
        author: 'John Smith',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:123',
        shareUrl: 'https://linkedin.com/posts/johnsmith_123'
      },
      {
        activityId: 'post_002',
        content: `Just published a new article about ${query}. Check it out and let me know your thoughts!`,
        reactions: 89,
        comments: 23,
        date: '2024-01-14T14:15:00Z',
        author: 'Sarah Johnson',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:124',
        shareUrl: 'https://linkedin.com/posts/sarahjohnson_124'
      },
      {
        activityId: 'post_003',
        content: `The future of ${query} is here. Companies need to adapt or risk being left behind.`,
        reactions: 156,
        comments: 34,
        date: '2024-01-13T09:45:00Z',
        author: 'Mike Chen',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:125',
        shareUrl: 'https://linkedin.com/posts/mikechen_125'
      },
      {
        activityId: 'post_004',
        content: `Excited to share our latest research findings on ${query}. The results are promising!`,
        reactions: 67,
        comments: 18,
        date: '2024-01-12T16:20:00Z',
        author: 'Emily Davis',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:126',
        shareUrl: 'https://linkedin.com/posts/emilydavis_126'
      },
      {
        activityId: 'post_005',
        content: `${query} has transformed how we think about business strategy. Here's why it matters.`,
        reactions: 234,
        comments: 56,
        date: '2024-01-11T11:10:00Z',
        author: 'David Wilson',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:127',
        shareUrl: 'https://linkedin.com/posts/davidwilson_127'
      }
    ];

    return mockPosts.slice(0, limit);
  }
}
