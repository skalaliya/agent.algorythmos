import { resolve } from 'node:path';
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(process.cwd(), '../../.env') });

import { startRunWorker } from './queue/worker';
import { startScheduler } from './schedulers/scheduler';

async function main() {
  startRunWorker();
  await startScheduler(); // registers repeatable monthly trigger(s)
  console.log('BullMQ worker + scheduler running');
}
main().catch((e) => { console.error(e); process.exit(1); });
