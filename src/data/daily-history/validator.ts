import { isSourceApproved } from './sources';
import { AajKaAkhyanaEvent } from './types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Strictly validates an Aaj Ka Akhyana event according to Akhyana's
 * Source-of-Truth and data integrity requirements.
 */
export function validateAajEvent(event: Partial<AajKaAkhyanaEvent>): ValidationResult {
  const errors: string[] = [];

  if (!event.id || typeof event.id !== 'string' || event.id.trim() === '') {
    errors.push('Event id is missing or invalid.');
  }

  // Validate date format MM-DD
  if (!event.date || typeof event.date !== 'string' || !/^\d{2}-\d{2}$/.test(event.date)) {
    errors.push(`Event date '${event.date}' is missing or does not match required format MM-DD (e.g. '09-28').`);
  }

  if (typeof event.year !== 'number' || isNaN(event.year)) {
    errors.push('Event year must be a valid number.');
  }

  if (!event.title || typeof event.title !== 'string' || event.title.trim() === '') {
    errors.push('Event title is missing or empty.');
  }

  if (!event.category || typeof event.category !== 'string') {
    errors.push('Event category is missing.');
  }

  if (!event.shortDescription || typeof event.shortDescription !== 'string' || event.shortDescription.trim() === '') {
    errors.push('Event shortDescription is missing or empty.');
  }

  if (!event.significance || typeof event.significance !== 'string' || event.significance.trim() === '') {
    errors.push('Event significance is missing or empty.');
  }

  if (!event.sourceId || typeof event.sourceId !== 'string' || event.sourceId.trim() === '') {
    errors.push('Event sourceId is missing.');
  } else if (!isSourceApproved(event.sourceId)) {
    errors.push(`Event sourceId '${event.sourceId}' is not in the approved sources registry.`);
  }

  if (!event.sourceName || typeof event.sourceName !== 'string' || event.sourceName.trim() === '') {
    errors.push('Event sourceName is missing.');
  }

  if (!event.sourceUrl || typeof event.sourceUrl !== 'string' || event.sourceUrl.trim() === '') {
    errors.push('Event sourceUrl is missing or empty.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Filter an array of raw events, returning only those that pass strict validation.
 */
export function filterValidAajEvents(events: AajKaAkhyanaEvent[]): AajKaAkhyanaEvent[] {
  return events.filter((e) => {
    const result = validateAajEvent(e);
    if (!result.valid) {
      if (__DEV__) {
        console.warn(`[AajKaAkhyana] Rejected invalid event '${e.id || 'unknown'}':`, result.errors);
      }
      return false;
    }
    return true;
  });
}
