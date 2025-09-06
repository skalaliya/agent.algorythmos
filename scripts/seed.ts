import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  try {
    // Create demo user
    const user = await prisma.user.upsert({
      where: { email: 'demo@algorythmos-ai-agents.com' },
      update: {},
      create: {
        email: 'demo@algorythmos-ai-agents.com'
      }
    });

    console.log('✅ Demo user created:', user.email);

    // Read workflow definition
    const workflowPath = path.join(__dirname, '../docs/linkedIn-post-analyzer.json');
    const workflowData = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));

    // Create demo workflow
    const workflow = await prisma.workflow.upsert({
      where: { id: 'demo-workflow-id' },
      update: {
        definition: workflowData
      },
      create: {
        id: 'demo-workflow-id',
        name: workflowData.name,
        definition: workflowData,
        schedule: workflowData.schedule,
        timezone: workflowData.timezone,
        userId: user.id
      }
    });

    console.log('✅ Demo workflow created:', workflow.name);
    console.log('📋 Workflow ID:', workflow.id);

    // Create a sample run
    const run = await prisma.run.create({
      data: {
        workflowId: workflow.id,
        status: 'COMPLETED',
        startedAt: new Date(),
        finishedAt: new Date(),
        aiCredits: 150
      }
    });

    console.log('✅ Sample run created:', run.id);

    // Create sample run steps
    const steps = [
      {
        runId: run.id,
        index: 0,
        name: 'Create table',
        type: 'table.constants',
        input: { rows: [{ topic: 'Relay' }] },
        output: { rows: [{ topic: 'Relay' }] },
        status: 'COMPLETED',
        aiCredits: 0,
        startedAt: new Date(),
        finishedAt: new Date()
      },
      {
        runId: run.id,
        index: 1,
        name: 'For each row',
        type: 'loop',
        input: { items: 's1.rows' },
        output: { iterations: 1, summary: '1 iteration: 1 successful' },
        status: 'COMPLETED',
        aiCredits: 120,
        startedAt: new Date(),
        finishedAt: new Date()
      },
      {
        runId: run.id,
        index: 2,
        name: 'AI Agent (Claude Sonnet 4)',
        type: 'ai',
        input: { provider: 'anthropic', model: 'claude-3-5-sonnet' },
        output: 'Mock AI response for report generation',
        status: 'COMPLETED',
        aiCredits: 30,
        startedAt: new Date(),
        finishedAt: new Date()
      },
      {
        runId: run.id,
        index: 3,
        name: 'Send email',
        type: 'email.send',
        input: { to: 'me@example.com', subject: 'LinkedIn Analyzer' },
        output: { messageId: 'mock-123', sent: true },
        status: 'COMPLETED',
        aiCredits: 0,
        startedAt: new Date(),
        finishedAt: new Date()
      }
    ];

    for (const step of steps) {
      await prisma.runStep.create({ data: step });
    }

    console.log('✅ Sample run steps created');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - User: ${user.email}`);
    console.log(`   - Workflow: ${workflow.name} (${workflow.id})`);
    console.log(`   - Sample run: ${run.id}`);
    console.log(`   - Total AI credits used: 150`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
