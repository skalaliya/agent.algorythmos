import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '../index';
import { WorkflowService } from '../services/workflow';

const workflowService = new WorkflowService();

const createWorkflowSchema = z.object({
  name: z.string(),
  definition: z.record(z.string(), z.any()),
  schedule: z.string().optional(),
  timezone: z.string().default('Europe/Paris'),
  userId: z.string()
});

const updateWorkflowSchema = z.object({
  name: z.string().optional(),
  definition: z.record(z.string(), z.any()).optional(),
  schedule: z.string().optional(),
  timezone: z.string().optional()
});

export async function workflowRoutes(fastify: FastifyInstance) {
  // Get all workflows
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const workflows = await prisma.workflow.findMany({
        include: {
          runs: {
            orderBy: { startedAt: 'desc' },
            take: 1
          }
        }
      });
      return reply.send(workflows);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch workflows' });
    }
  });

  // Get workflow by ID
  fastify.get('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const workflow = await prisma.workflow.findUnique({
        where: { id },
        include: { runs: true }
      });
      
      if (!workflow) {
        return reply.status(404).send({ error: 'Workflow not found' });
      }
      
      return reply.send(workflow);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to fetch workflow' });
    }
  });

  // Create workflow
  fastify.post('/', async (request: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
    try {
      const body = createWorkflowSchema.parse(request.body);
      const workflow = await workflowService.createWorkflow(body);
      return reply.status(201).send(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation error', details: error.issues });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to create workflow' });
    }
  });

  // Update workflow
  fastify.put('/:id', async (request: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const body = updateWorkflowSchema.parse(request.body);
      const workflow = await workflowService.updateWorkflow(id, body);
      return reply.send(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Validation error', details: error.issues });
      }
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to update workflow' });
    }
  });

  // Delete workflow
  fastify.delete('/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      await workflowService.deleteWorkflow(id);
      return reply.status(204).send();
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete workflow' });
    }
  });

  // Enable/disable workflow schedule
  fastify.post('/:id/schedule', async (request: FastifyRequest<{ Params: { id: string }, Body: { enabled: boolean } }>, reply: FastifyReply) => {
    try {
      const { id } = request.params;
      const { enabled } = request.body;
      const workflow = await workflowService.toggleSchedule(id, enabled);
      return reply.send(workflow);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Failed to toggle workflow schedule' });
    }
  });
}
