import { describe, it, expect } from 'vitest';
import { nextFirstWednesdayAt8 } from '../src/utils/firstWed';

describe('nextFirstWednesdayAt8 (Europe/Paris)', () => {
  it('rolls to the next month when first-Wed has passed', () => {
    const dt = nextFirstWednesdayAt8('Europe/Paris', new Date('2025-09-03T09:00:00+02:00')); // Sep 3, 2025 is first Wed at 09:00 CEST
    expect(dt.toISODate()).toBe('2025-10-01'); // next first Wed
    expect(dt.hour).toBe(8);
  });
  it('handles DST change around March/Oct by keeping 08:00 local', () => {
    const a = nextFirstWednesdayAt8('Europe/Paris', new Date('2025-03-01T00:00:00+01:00')); // before spring forward
    expect(a.hour).toBe(8);
    const b = nextFirstWednesdayAt8('Europe/Paris', new Date('2025-10-20T00:00:00+02:00')); // before fall back
    expect(b.hour).toBe(8);
  });
});
