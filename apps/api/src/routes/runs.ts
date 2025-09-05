import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { RunService } from '../services/run';

const runService = new RunService();

const createRunSchema = z.object({
  workflowId: z.string()
});

export async function runRoutes(fastify: FastifyInstance) {
  // Get all runs
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const runs = await prisma.run.findMany({
        include: {
          workflow: true,
          steps: {
            orderBy: { index: 'asc' }
          }
        },
        orderBy: { startedAt: 'desc' }
      });
      return reply.send(runs);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch runs' });
    }
  });

  // Get run by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const run = await prisma.run.findUnique({
        where: { id },
        include: {
          workflow: true,
          steps: {
            orderBy: { index: 'asc' }
          }
        }
      });
      
      if (!run) {
        return reply.status(404).send({ error: 'Run not found' });
      }
      
      return reply.send(run);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch run' });
    }
  });

  // Create and start a new run
  fastify.post('/', async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const body = createRunSchema.parse(request.body);
      const run = await runService.startRun(body.workflowId);
      return reply.status(201).send(run);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation error', details: error.issues });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to start run' });
    }
  });

  // Get runs for a specific workflow
  fastify.get('/workflow/:workflowId', async (request: FastifyRequest<{ Params: { workflowId: string } }>, reply: FastifyReply) => {
    try {
      const { workflowId } = request.params;
      const runs = await prisma.run.findMany({
        where: { workflowId },
        include: {
          steps: {
            orderBy: { index: 'asc' }
          }
        },
        orderBy: { startedAt: 'desc' }
      });
      return reply.send(runs);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch workflow runs' });
    }
  });
}
