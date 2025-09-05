import fs from 'fs';
import path from 'path';

export interface LinkedInPost {
  activityId: string;
  content: string;
  reactions: number;
  comments: number;
  date: string;
  author: string;
  activityUrl: string;
  shareUrl: string;
}

export class LinkedInService {
  private fixturePath: string;

  constructor() {
    this.fixturePath = path.join(__dirname, '../../../../packages/fixtures/linkedin-posts.json');
  }

  async searchPosts(query: string, limit: number = 10): Promise<LinkedInPost[]> {
    try {
      // In a real implementation, this would call the LinkedIn API
      // For now, we return mock data from fixture
      const posts = await this.getMockPosts();
      
      // Filter by query (simple text search)
      const filteredPosts = posts.filter(post => 
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.author.toLowerCase().includes(query.toLowerCase())
      );
      
      return filteredPosts.slice(0, limit);
    } catch (error) {
      console.error('Error searching LinkedIn posts:', error);
      // Return deterministic mock data if fixture fails
      return this.getDeterministicMockPosts(query, limit);
    }
  }

  async getHealth(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString()
    };
  }

  private async getMockPosts(): Promise<LinkedInPost[]> {
    try {
      if (fs.existsSync(this.fixturePath)) {
        const data = fs.readFileSync(this.fixturePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not read LinkedIn fixture, using deterministic mock data');
    }
    
    return this.getDeterministicMockPosts('default', 10);
  }

  private getDeterministicMockPosts(query: string, limit: number): LinkedInPost[] {
    const basePosts: LinkedInPost[] = [
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
      },
      {
        activityId: 'post_006',
        content: `Just attended an amazing conference on ${query}. The innovation happening is incredible.`,
        reactions: 78,
        comments: 15,
        date: '2024-01-10T13:25:00Z',
        author: 'Lisa Brown',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:128',
        shareUrl: 'https://linkedin.com/posts/lisabrown_128'
      },
      {
        activityId: 'post_007',
        content: `The impact of ${query} on customer experience cannot be overstated. Here's my take.`,
        reactions: 123,
        comments: 29,
        date: '2024-01-09T08:55:00Z',
        author: 'Robert Taylor',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:129',
        shareUrl: 'https://linkedin.com/posts/roberttaylor_129'
      },
      {
        activityId: 'post_008',
        content: `New case study: How we implemented ${query} and saw 300% improvement in efficiency.`,
        reactions: 189,
        comments: 42,
        date: '2024-01-08T15:40:00Z',
        author: 'Jennifer Lee',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:130',
        shareUrl: 'https://linkedin.com/posts/jenniferlee_130'
      },
      {
        activityId: 'post_009',
        content: `The debate around ${query} continues. Here are the key arguments from both sides.`,
        reactions: 95,
        comments: 31,
        date: '2024-01-07T12:30:00Z',
        author: 'Thomas Anderson',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:131',
        shareUrl: 'https://linkedin.com/posts/thomasanderson_131'
      },
      {
        activityId: 'post_010',
        content: `Just released our quarterly report on ${query} trends. The data tells an interesting story.`,
        reactions: 145,
        comments: 38,
        date: '2024-01-06T10:15:00Z',
        author: 'Amanda Garcia',
        activityUrl: 'https://linkedin.com/feed/update/urn:li:activity:132',
        shareUrl: 'https://linkedin.com/posts/amandagarcia_132'
      }
    ];

    return basePosts.slice(0, limit);
  }
}
