import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../index';

export async function stepRoutes(fastify: FastifyInstance) {
  // Get steps for a specific run
  fastify.get('/run/:runId', async (request: FastifyRequest<{ Params: { runId: string } }>, reply: FastifyReply) => {
    try {
      const { runId } = request.params;
      const steps = await prisma.runStep.findMany({
        where: { runId },
        orderBy: { index: 'asc' }
      });
      return reply.send(steps);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch run steps' });
    }
  });

  // Get step by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const step = await prisma.runStep.findUnique({
        where: { id },
        include: { run: true }
      });
      
      if (!step) {
        return reply.status(404).send({ error: 'Step not found' });
      }
      
      return reply.send(step);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch step' });
    }
  });

  // Update step status and output
  fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const { status, output, aiCredits, finishedAt } = request.body as any;
      
      const step = await prisma.runStep.update({
        where: { id },
        data: {
          status,
          output,
          aiCredits: aiCredits || 0,
          finishedAt: finishedAt || (status === 'completed' || status === 'failed' ? new Date() : undefined)
        }
      });
      
      return reply.send(step);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update step' });
    }
  });
}
