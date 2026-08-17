import { format, parseISO, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

/**
 * Format a value based on its dataType and bodyType.
 */
export const formatValue = (value, dataType, bodyType) => {
  if (value === null || value === undefined) return '';

  // Date and Time types
  if (
    [
      'LocalDate',
      'LocalDateTime',
      'OffsetDateTime',
      'ZonedDateTime',
      'Instant',
    ].includes(dataType)
  ) {
    return formatDateValue(value, dataType, bodyType);
  }

  // Handle other types
  if (bodyType === 'currency') {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  }
  if (bodyType === 'percentage') {
    return new Intl.NumberFormat('en-US', { style: 'percent' }).format(value / 100);
  }
  if (bodyType === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
};

export const formatDateValue = (value, dataType, bodyType) => {
  if (!value) return '';

  let dateObj;
  let tzStr = '';

  // 1. Pre-process value based on dataType
  if (dataType === 'LocalDate') {
    // LocalDate is usually 'YYYY-MM-DD'. Parse it as-is without timezone shifting
    dateObj = parse(value, 'yyyy-MM-dd', new Date());
  } else if (dataType === 'ZonedDateTime') {
    // e.g. "2026-07-30T14:30:45+05:30[Asia/Kolkata]"
    // Extract timezone name if exists
    const tzMatch = value.match(/\[(.*?)\]$/);
    if (tzMatch) {
      tzStr = tzMatch[1];
    }
    // Remove the bracketed timezone for parsing
    const isoString = value.replace(/\[.*?\]$/, '');
    dateObj = parseISO(isoString);
  } else if (dataType === 'LocalDateTime') {
    // LocalDateTime is ISO string without offset, parseISO treats it as local
    dateObj = parseISO(value);
  } else {
    // OffsetDateTime, Instant
    dateObj = parseISO(value);
  }

  if (isNaN(dateObj)) {
    return value; // fallback
  }

  // 2. Format based on bodyType
  const dateFmt = 'MM/dd/yyyy';
  const timeFmt = 'HH:mm';

  switch (bodyType) {
    case 'dateOnly':
      return format(dateObj, dateFmt);
    case 'timeOnly':
      return format(dateObj, timeFmt);
    case 'dateTime':
      return format(dateObj, `${dateFmt} ${timeFmt}`);
    case 'timezoneDate':
      if (tzStr) return formatInTimeZone(dateObj, tzStr, `${dateFmt} zzz`);
      return format(dateObj, `${dateFmt} zzz`);
    case 'timezoneTime':
      if (tzStr) return formatInTimeZone(dateObj, tzStr, `${timeFmt} zzz`);
      return format(dateObj, `${timeFmt} zzz`);
    case 'timezoneDateTime': 
      if (tzStr) return formatInTimeZone(dateObj, tzStr, `${dateFmt} ${timeFmt} zzz`);
      return format(dateObj, `${dateFmt} ${timeFmt} zzz`);
    default:
      // Default formatting if bodyType is not specified but dataType is a date
      return format(dateObj, `${dateFmt} ${timeFmt}`);
  }
};
