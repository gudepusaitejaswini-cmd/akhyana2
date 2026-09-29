import {
  AAJ_EVENTS,
  APPROVED_SOURCES,
  formatMonthDayKey,
  formatMonthDayLabel,
  getAdjacentDate,
  getAllAvailableDates,
  getApprovedSource,
  getAvailableDates,
  getDaysInMonth,
  getEventsByCategory,
  getEventsForDate,
  getEventsForToday,
  getFeaturedTodayEvent,
  getTodayDate,
  getTodayEvents,
  hasEventsOnDate,
  isSourceApproved,
  validateAajEvent,
} from './src/data/daily-history';
import { AajKaAkhyanaEvent } from './src/data/daily-history/types';

console.log('==============================================');
console.log('  AAJ KA AKHYANA — 15-POINT COMPREHENSIVE SUITE');
console.log('==============================================\n');

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  } else {
    console.log(`✅ ${msg}`);
  }
}

// 1. 26 January (01-26) -> Republic Day event exists
const jan26Events = getEventsForDate(1, 26);
assert(jan26Events.length >= 1, 'Point 1: 26 January returns records');
assert(jan26Events.some(e => e.title.includes('Constitution')), 'Point 1: 26 January contains Constitution Enactment');

// 2. 15 August (08-15) -> Independence Day event exists
const aug15Events = getEventsForDate(8, 15);
assert(aug15Events.length >= 1, 'Point 2: 15 August returns records');
assert(aug15Events.some(e => e.title.includes('Independence')), 'Point 2: 15 August contains Indian Independence');

// 3. 29 September (09-29) -> Correctly searches 09-29 and returns verified events
const sep29Events = getEventsForDate(9, 29);
assert(sep29Events.length >= 2, 'Point 3: 29 September contains verified historical events');
assert(sep29Events.some(e => e.title.includes('Matangini Hazra')), 'Point 3: Contains Matangini Hazra Quit India milestone');
assert(sep29Events.some(e => e.title.includes('Haj Notes')), 'Point 3: Contains RBI Haj Currency milestone');

// 4. Date with multiple events -> all events appear
const sep28Events = getEventsForDate(9, 28);
assert(sep28Events.length === 4, 'Point 4: 28 September contains all 4 verified events');
const titles28 = sep28Events.map(e => e.title);
assert(titles28.some(t => t.includes('Bhagat Singh')), 'Point 4: Contains Bhagat Singh birth');
assert(titles28.some(t => t.includes('Sarda Act')), 'Point 4: Contains Sarda Act');
assert(titles28.some(t => t.includes('ASTROSAT')), 'Point 4: Contains ASTROSAT launch');
assert(titles28.some(t => t.includes('Bahadur Shah Zafar')), 'Point 4: Contains Bahadur Shah Zafar accession');

// 5. Date with no events -> returns empty array
const emptyEvents = getEventsForDate(9, 30);
assert(emptyEvents.length === 0, 'Point 5: Date with no event (30 Sept) returns empty array');

// 6. Category filter works on selected date
const movementsSep29 = getEventsByCategory(9, 29, 'Movements');
assert(movementsSep29.length === 1 && movementsSep29[0].title.includes('Matangini Hazra'), 'Point 6: 29 September + Movements returns Matangini Hazra');
const battlesSep29 = getEventsByCategory(9, 29, 'Battles');
assert(battlesSep29.length === 0, 'Point 6: 29 September + Battles returns 0 events');

// 7. Full-year representation: every calendar month (1..12) has verified events
for (let m = 1; m <= 12; m++) {
  const monthEvents = AAJ_EVENTS.filter(e => parseInt(e.date.split('-')[0], 10) === m);
  assert(monthEvents.length >= 1, `Point 7: Month ${m} has at least 1 source-verified historical event`);
}

// 8. Event validation requirements
const validEvent: AajKaAkhyanaEvent = {
  id: 'test-event-1',
  date: '09-29',
  displayDate: '29 September',
  year: 1942,
  title: 'Valid Milestone',
  category: 'Movements',
  shortDescription: 'Valid documented historical description.',
  significance: 'Significant milestone in national history.',
  sourceId: 'nai',
  sourceName: 'National Archives of India',
  sourceUrl: 'https://nationalarchives.nic.in/',
};
assert(validateAajEvent(validEvent).valid === true, 'Point 8: Event with approved source and URL passes validation');

const badSourceEvent: Partial<AajKaAkhyanaEvent> = {
  id: 'test-no-src',
  date: '09-29',
  year: 1942,
  title: 'No Source Event',
  category: 'Battles',
  shortDescription: 'Desc',
  significance: 'Signif',
};
assert(validateAajEvent(badSourceEvent).valid === false, 'Point 8: Event missing sourceId is rejected');

const badUrlEvent: Partial<AajKaAkhyanaEvent> = {
  ...validEvent,
  sourceUrl: '',
};
assert(validateAajEvent(badUrlEvent).valid === false, 'Point 8: Event missing sourceUrl is rejected');

// 9. Source verification on entire dataset
AAJ_EVENTS.forEach(event => {
  assert(isSourceApproved(event.sourceId), `Point 9: Source '${event.sourceId}' is in approved registry`);
  const src = getApprovedSource(event.sourceId);
  assert(Boolean(src?.url), `Point 9: Approved source '${event.sourceId}' has verified URL`);
  assert(Boolean(event.sourceUrl), `Point 9: Event '${event.id}' has explicit sourceUrl`);
});

// 10. Reusable functions & aliases
assert(typeof getEventsForToday === 'function', 'Point 10: getEventsForToday is exported');
assert(typeof getTodayEvents === 'function', 'Point 10: getTodayEvents is exported');
assert(typeof getAvailableDates === 'function', 'Point 10: getAvailableDates is exported');
assert(getAllAvailableDates().length > 10, 'Point 10: getAllAvailableDates returns multi-date calendar');
assert(hasEventsOnDate(9, 29) === true, 'Point 10: hasEventsOnDate(9, 29) is true');
assert(hasEventsOnDate(9, 30) === false, 'Point 10: hasEventsOnDate(9, 30) is false');

// 11. Calendar navigation helper
const nextFromSep29 = getAdjacentDate(9, 29, 1);
assert(nextFromSep29.month === 9 && nextFromSep29.day === 30, 'Point 11: 29 Sept + 1 day = 30 Sept');
const prevFromJan1 = getAdjacentDate(1, 1, -1);
assert(prevFromJan1.month === 12 && prevFromJan1.day === 31, 'Point 11: 1 Jan - 1 day = 31 Dec');
assert(getDaysInMonth(2) >= 28, 'Point 11: getDaysInMonth(2) returns valid days');

// 12. Heritage Voices schema independence
assert(AAJ_EVENTS.every(e => !('authorId' in e)), 'Point 12: Aaj Ka Akhyana events do not use Heritage Voices authorId schema');

// 13. Deterministic execution
const runA = getEventsForDate(9, 29);
const runB = getEventsForDate(9, 29);
assert(JSON.stringify(runA) === JSON.stringify(runB), 'Point 13: Data is purely deterministic across executions');

// 14. Today dynamically changes based on system date
const today = getTodayDate();
const sys = new Date();
assert(today.month === sys.getMonth() + 1, 'Point 14: Month matches local system calendar');
assert(today.day === sys.getDate(), 'Point 14: Day matches local system calendar');
assert(today.year === sys.getFullYear(), 'Point 14: Year matches local system calendar');
assert(today.formattedKey === formatMonthDayKey(sys.getMonth() + 1, sys.getDate()), 'Point 14: Formatted key matches system date');

const feat = getFeaturedTodayEvent();
assert(Boolean(feat), 'Point 14: Featured today event is resolved successfully');

// 15. All approved sources registered
const approvedKeys = Object.keys(APPROVED_SOURCES);
assert(AAJ_EVENTS.every(e => approvedKeys.includes(e.sourceId)), 'Point 15: Every event strictly maps to an approved Akhyana source');

console.log('\n==============================================');
console.log('  ALL 15 POINTS PASSED WITH 100% SUCCESS!     ');
console.log('==============================================\n');
