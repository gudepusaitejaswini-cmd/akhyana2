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

export const MONTH_NAMES = [
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

export const MONTH_SHORT_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
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
export function getEventsForToday(): AajKaAkhyanaEvent[] {
  const { month, day } = getTodayDate();
  return getEventsForDate(month, day);
}

/**
 * Backward-compatible alias for getEventsForToday.
 */
export function getTodayEvents(): AajKaAkhyanaEvent[] {
  return getEventsForToday();
}

/**
 * Returns all validated events for a date filtered by category.
 */
export function getEventsByCategory(
  month: number,
  day: number,
  category: 'All' | AajCategory
): AajKaAkhyanaEvent[] {
  const events = getEventsForDate(month, day);
  if (category === 'All') return events;
  return events.filter((e) => e.category === category);
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

/**
 * Alias for getAllAvailableDates.
 */
export function getAvailableDates() {
  return getAllAvailableDates();
}

/**
 * Check if any verified events exist for a given calendar date.
 */
export function hasEventsOnDate(month: number, day: number): boolean {
  const key = formatMonthDayKey(month, day);
  return AAJ_EVENTS.some((e) => e.date === key);
}

/**
 * Number of days in a given month.
 */
export function getDaysInMonth(month: number, year = 2024): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Returns the adjacent calendar date (+1 day or -1 day), handling month and year boundary rollover.
 */
export function getAdjacentDate(
  month: number,
  day: number,
  offsetDays: -1 | 1
): { month: number; day: number } {
  // Use a fixed reference leap year to allow Feb 29 navigation
  const referenceYear = 2024;
  const targetDate = new Date(referenceYear, month - 1, day + offsetDays);
  return {
    month: targetDate.getMonth() + 1,
    day: targetDate.getDate(),
  };
}
