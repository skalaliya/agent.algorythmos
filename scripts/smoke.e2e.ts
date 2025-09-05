import { execSync } from 'child_process';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

async function smokeTest() {
  console.log('🧪 Starting E2E smoke test...');

  try {
    // 1. Health check
    console.log('1. Checking API health...');
    const healthResponse = await fetch(`${API_URL}/health`);
    if (!healthResponse.ok) throw new Error('Health check failed');
    console.log('✅ API is healthy');

    // 2. Get workflows
    console.log('2. Fetching workflows...');
    const workflowsResponse = await fetch(`${API_URL}/workflows`);
    if (!workflowsResponse.ok) throw new Error('Failed to fetch workflows');
    const workflows = await workflowsResponse.json();
    console.log(`✅ Found ${workflows.items.length} workflows`);

    // 3. Create a run
    console.log('3. Creating a new run...');
    const createRunResponse = await fetch(`${API_URL}/runs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        workflowId: workflows.items[0].id, 
        startedBy: 'smoke-test' 
      })
    });
    if (!createRunResponse.ok) throw new Error('Failed to create run');
    const { run } = await createRunResponse.json();
    console.log(`✅ Created run: ${run.id}`);

    // 4. Poll for completion
    console.log('4. Waiting for run completion...');
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds max
    
    while (attempts < maxAttempts) {
      const runResponse = await fetch(`${API_URL}/runs/${run.id}`);
      if (!runResponse.ok) throw new Error('Failed to fetch run');
      const runData = await runResponse.json();
      
      if (runData.status === 'COMPLETED') {
        console.log('✅ Run completed successfully');
        break;
      } else if (runData.status === 'FAILED') {
        throw new Error('Run failed');
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }
    
    if (attempts >= maxAttempts) {
      throw new Error('Run did not complete within timeout');
    }

    // 5. Check metrics
    console.log('5. Checking metrics...');
    const metricsResponse = await fetch(`${API_URL}/metrics`);
    if (!metricsResponse.ok) throw new Error('Failed to fetch metrics');
    const metrics = await metricsResponse.json();
    console.log('✅ Metrics:', metrics);

    console.log('🎉 All smoke tests passed!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Smoke test failed:', error);
    process.exit(1);
  }
}

smokeTest();
