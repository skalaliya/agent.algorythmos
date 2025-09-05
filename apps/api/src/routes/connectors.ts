import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { LinkedInService } from '../services/connectors/linkedin';

const linkedInService = new LinkedInService();

const linkedInSearchSchema = z.object({
  query: z.string(),
  limit: z.number().min(1).max(100).default(10)
});

export async function connectorRoutes(fastify: FastifyInstance) {
  // LinkedIn search posts
  fastify.post('/linkedin/searchPosts', async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const body = linkedInSearchSchema.parse(request.body);
      const posts = await linkedInService.searchPosts(body.query, body.limit);
      return reply.send(posts);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to search LinkedIn posts' });
    }
  });

  // LinkedIn connector health check
  fastify.get('/linkedin/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const health = await linkedInService.getHealth();
      return reply.send(health);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'LinkedIn connector unhealthy' });
    }
  });
}
