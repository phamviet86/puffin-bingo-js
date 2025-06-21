// path: @/lib/util/check-util.js

/**
 * Check if a date is within a range with updated logic
 * @param {Date|string|null} startDate - The start date of the range (ISO format: 2025-05-07T00:00:00.000Z or null)
 * @param {Date|string|null} endDate - The end date of the range (ISO format: 2025-05-07T00:00:00.000Z or null)
 * @param {Date|string} selectedDate - The date to check (formats: 2025-05-15 or 2025-05-07T00:00:00.000Z)
 * @returns {boolean} True if the date is within the range, false otherwise
 */
export function isDateInRange(startDate, endDate, selectedDate) {
  // Normalize all dates to avoid time comparison issues
  let normalizedStart = null;
  if (startDate) {
    normalizedStart = new Date(startDate);
    normalizedStart.setHours(0, 0, 0, 0);
  }

  let normalizedEnd = null;
  if (endDate) {
    normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(23, 59, 59, 999); // End of day
  }

  // Handle selectedDate in both ISO and YYYY-MM-DD formats
  let normalizedDate = new Date(selectedDate);
  normalizedDate.setHours(12, 0, 0, 0); // Noon to avoid timezone issues

  // Validate all dates
  if (
    (normalizedStart && isNaN(normalizedStart.getTime())) ||
    (normalizedEnd && isNaN(normalizedEnd.getTime())) ||
    isNaN(normalizedDate.getTime())
  ) {
    return false;
  }

  // CASE 1: startDate và endDate not null
  if (normalizedStart && normalizedEnd) {
    return normalizedStart <= normalizedDate && normalizedDate <= normalizedEnd;
  }

  // CASE 2: startDate not null, endDate null
  if (normalizedStart && !normalizedEnd) {
    return normalizedStart <= normalizedDate;
  }

  // CASE 3: các trường hợp khác
  return false;
}
