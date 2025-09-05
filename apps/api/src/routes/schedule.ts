import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { TriggerService } from '../services/trigger';

const triggerService = new TriggerService();

export async function scheduleRoutes(fastify: FastifyInstance) {
  // Get next run time for a workflow
  fastify.get('/workflow/:workflowId/next-run', async (request: FastifyRequest<{ Params: { workflowId: string } }>, reply: FastifyReply) => {
    try {
      const { workflowId } = request.params;
      const nextRun = await triggerService.getNextRunTime(workflowId);
      return reply.send({ nextRun });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to get next run time' });
    }
  });

  // Get all scheduled workflows
  fastify.get('/workflows', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // This would return all workflows with active schedules
      // For now, return a simple response
      return reply.send({ message: 'Schedule service is running' });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to get scheduled workflows' });
    }
  });
}
