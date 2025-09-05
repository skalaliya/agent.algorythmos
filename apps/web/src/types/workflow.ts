export interface Workflow {
  id: string;
  name: string;
  definition?: WorkflowDefinition;
  schedule?: string;
  timezone?: string;
  createdAt?: string;
  runs?: Run[];
}

export interface WorkflowDefinition {
  name: string;
  timezone: string;
  schedule?: string;
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  input?: any;
  children?: WorkflowStep[];
}

export interface Run {
  id: string;
  workflowId: string;
  startedBy?: string;
  startedAt: string;
  finishedAt?: string;
  status: string;
  aiCredits: number;
  steps: RunStep[];
  workflow: Workflow;
}

export interface RunStep {
  id: string;
  runId: string;
  parentStepId?: string;
  index: number;
  name: string;
  type: string;
  input?: any;
  output?: any;
  status: string;
  aiCredits: number;
  startedAt?: string;
  finishedAt?: string;
  run: Run;
}
