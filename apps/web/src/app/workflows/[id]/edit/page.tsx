import CanvasFrame from '../../../../components/CanvasFrame';
import { TriggerCard, ForEachCard, StepRow } from '../../../../components/StepCard';
import { api } from '../../../../lib/api';
import { notFound } from 'next/navigation';

interface WorkflowEditPageProps {
  params: { id: string };
}

export default async function WorkflowEditPage({ params }: WorkflowEditPageProps) {
  const workflow = await api.get(`/workflows/${params.id}`);

  if (!workflow) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-white">Edit Workflow: {workflow.name}</h1>
      <CanvasFrame title="Lead qualifier">
        <div className="space-y-2">
          <TriggerCard title="Instant trigger • New demo request received" on />
          <ForEachCard title="For each item in Competitors">
            <StepRow name="Get recent LinkedIn posts" status="COMPLETED" />
            <StepRow name="Write report for each competitor" status="RUNNING" />
          </ForEachCard>
          <StepRow name="Email report to myself" status="QUEUED" />
        </div>
      </CanvasFrame>
    </div>
  );
}