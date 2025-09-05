import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { EmailService } from '../services/email';

const emailService = new EmailService();

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
  text: z.string().optional()
});

export async function emailRoutes(fastify: FastifyInstance) {
  // Send email
  fastify.post('/send', async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const body = sendEmailSchema.parse(request.body);
      const result = await emailService.sendEmail(body);
      return reply.send(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation error', details: error.errors });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to send email' });
    }
  });

  // Email service health check
  fastify.get('/health', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const health = await emailService.getHealth();
      return reply.send(health);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Email service unhealthy' });
    }
  });
}
