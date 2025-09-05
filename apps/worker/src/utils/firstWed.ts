import { DateTime } from 'luxon';

export function nextFirstWednesdayAt8(tz = 'Europe/Paris', from?: Date) {
  const now = DateTime.fromJSDate(from ?? new Date(), { zone: tz }).plus({ minutes: 1 });
  // Start from first day of this month; if past, move to next month
  let base = now.set({ day: 1, hour: 8, minute: 0, second: 0, millisecond: 0 });
  if (base < now) base = base.plus({ months: 1 }).set({ day: 1 });

  // Find first Wednesday
  let dt = base;
  while (dt.weekday !== 3) dt = dt.plus({ days: 1 }); // 1=Mon ... 7=Sun; 3=Wed
  // 08:00 local already set; Luxon handles DST automatically
  return dt;
}
