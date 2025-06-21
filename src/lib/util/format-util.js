// path: @/lib/util/format-util.js

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import moment from "moment";

dayjs.extend(utc);
dayjs.extend(timezone);

const FORMATS = {
  date: "YYYY-MM-DD HH:mm:ss",
  datetime: "YYYY-MM-DD HH:mm:ss",
  time: "HH:mm:ss",
};

/**
 * Format a date/time value using either a specified format string or a predefined format type.
 * Supports both dayjs and moment objects.
 *
 * @param {any} value - The date/time value to format.
 * @param {string} format - The format string or predefined format type (e.g., "date", "datetime", "time").
 * @param {string} tz - Optional timezone (default: 'Asia/Ho_Chi_Minh').
 * @returns {string|any} - The formatted date/time string or the original value if not a valid date/time.
 */
export function dateFormatter(
  value,
  valueType = "date",
  tz = "Asia/Ho_Chi_Minh"
) {
  const formatStr = FORMATS[valueType] || valueType;

  if (moment.isMoment(value)) {
    return tz
      ? moment(value).tz(tz).format(formatStr)
      : moment(value).format(formatStr);
  }
  if (dayjs.isDayjs(value)) {
    return tz ? value.tz(tz).format(formatStr) : value.format(formatStr);
  }
  if (typeof value === "string" || value instanceof Date) {
    return dayjs.tz(value, tz).format(formatStr);
  }

  return value;
}

/**
 * Formats a date into YYYY-MM-DD string format.
 *
 * @param {Date|string} date - The date to format.
 * @returns {string} - The formatted date string in YYYY-MM-DD format or null if date is falsy.
 */
export function formatDateYYYYMMDD(date) {
  if (!date) return null;
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats a date into YYYY-MM-DD string format.
 *
 * @param {Date|string} date - The date to format.
 * @returns {string} - The formatted date string in YYYY-MM-DD format or null if date is falsy.
 */
export function formatDateMMDD(date) {
  if (!date) return null;
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

/**
 * Formats a time string to HH:MM format by extracting hours and minutes.
 *
 * @param {string} timeString - The time string to format (typically in HH:MM:SS format).
 * @returns {string} - The formatted time string in HH:MM format or "..." if timeString is falsy.
 */
export function formatTimeHHMM(timeString) {
  if (!timeString) return "...";
  const timeParts = timeString.split(":");
  if (timeParts.length >= 2) {
    return `${timeParts[0]}:${timeParts[1]}`;
  }
  return timeString;
}

export function formatMoneyVND(amount) {
  if (!amount) return "...";
  return `₫${amount.toLocaleString()}`;
}

export function formatPercentage(value) {
  if (!value) return "...";
  return `${value}%`;
}
