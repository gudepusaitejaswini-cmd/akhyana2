import { RAW_AAJ_EVENTS } from './events';
import { APPROVED_SOURCES, getApprovedSource, isSourceApproved } from './sources';
import { AajCategory, AajKaAkhyanaEvent, ApprovedSource } from './types';
import { filterValidAajEvents, validateAajEvent } from './validator';

export * from './types';
export * from './sources';
export * from './validator';

/**
 * Filtered array containing only strictly validated, source-backed events.
 */
export const AAJ_EVENTS: AajKaAkhyanaEvent[] = filterValidAajEvents(RAW_AAJ_EVENTS);

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Helper to format month and day into standard MM-DD key (e.g. 9 and 28 -> '09-28').
 */
export function formatMonthDayKey(month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${mm}-${dd}`;
}

/**
 * Helper to format month and day into human-readable label (e.g. 9 and 28 -> '28 September').
 */
export function formatMonthDayLabel(month: number, day: number): string {
  const monthName = MONTH_NAMES[month - 1] || 'Unknown';
  return `${day} ${monthName}`;
}

/**
 * Get current local calendar date details.
 */
export function getTodayDate(): {
  month: number;
  day: number;
  year: number;
  formattedKey: string;
  displayString: string;
} {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();
  const formattedKey = formatMonthDayKey(month, day);
  const displayString = `${day} ${MONTH_NAMES[month - 1]} ${year}`;

  return { month, day, year, formattedKey, displayString };
}

/**
 * Returns all validated events for a specific calendar month and day.
 */
export function getEventsForDate(month: number, day: number): AajKaAkhyanaEvent[] {
  const key = formatMonthDayKey(month, day);
  return AAJ_EVENTS.filter((e) => e.date === key).sort((a, b) => a.year - b.year);
}

/**
 * Returns all validated events for today's date.
 */
export function getTodayEvents(): AajKaAkhyanaEvent[] {
  const { month, day } = getTodayDate();
  return getEventsForDate(month, day);
}

/**
 * Returns the primary featured event for today to display in the Home preview card.
 */
export function getFeaturedTodayEvent(): AajKaAkhyanaEvent | null {
  const todayEvents = getTodayEvents();
  return todayEvents.length > 0 ? todayEvents[0] : null;
}

/**
 * Returns all distinct dates present in the curated dataset.
 */
export function getAllAvailableDates(): {
  month: number;
  day: number;
  formattedKey: string;
  displayString: string;
  count: number;
}[] {
  const map = new Map<string, number>();
  AAJ_EVENTS.forEach((e) => {
    map.set(e.date, (map.get(e.date) || 0) + 1);
  });

  const dates: {
    month: number;
    day: number;
    formattedKey: string;
    displayString: string;
    count: number;
  }[] = [];

  for (const [key, count] of map.entries()) {
    const [mm, dd] = key.split('-').map((v) => parseInt(v, 10));
    dates.push({
      month: mm,
      day: dd,
      formattedKey: key,
      displayString: formatMonthDayLabel(mm, dd),
      count,
    });
  }

  return dates.sort((a, b) => {
    if (a.month !== b.month) return a.month - b.month;
    return a.day - b.day;
  });
}
