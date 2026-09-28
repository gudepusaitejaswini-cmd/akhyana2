/**
 * Completed Years Persistence Helper
 * Handles durable storage of completed quiz years across sessions.
 */

const STORAGE_KEY = '@akhyana/completed_years';

// In-memory fallback / cache for fast synchronous access
let memoryCompletedYears: number[] = [];
let isInitialized = false;

function getStorage() {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
}

export async function getCompletedYears(): Promise<number[]> {
  if (isInitialized) {
    return [...memoryCompletedYears];
  }
  try {
    const storage = getStorage();
    if (storage) {
      const stored = storage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            memoryCompletedYears = parsed.filter((item): item is number => typeof item === 'number');
          } else {
            memoryCompletedYears = [];
          }
        } catch {
          memoryCompletedYears = [];
        }
      }
    }
  } catch (e) {
    console.warn('Failed to load completed years from storage', e);
  }
  isInitialized = true;
  return [...memoryCompletedYears];
}

export function isYearCompleted(year: number): boolean {
  return memoryCompletedYears.includes(year);
}

export async function addCompletedYear(year: number): Promise<number[]> {
  const current = await getCompletedYears();
  if (!current.includes(year)) {
    const updated = [...current, year].sort((a, b) => a - b);
    memoryCompletedYears = updated;
    try {
      const storage = getStorage();
      if (storage) {
        storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
    } catch (e) {
      console.warn('Failed to save completed year', e);
    }
    return updated;
  }
  return current;
}

export function clearCompletedYears(): void {
  memoryCompletedYears = [];
  try {
    const storage = getStorage();
    if (storage) {
      storage.removeItem(STORAGE_KEY);
    }
  } catch (e) {
    console.warn('Failed to clear completed years from storage', e);
  }
}
