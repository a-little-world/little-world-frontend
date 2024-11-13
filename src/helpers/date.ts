import { format, formatDistance } from 'date-fns';
import { de, enGB } from 'date-fns/locale';

import { LANGUAGES } from '../constants/index.ts';

const two = (n: number) => (n < 10 ? `0${n}` : n);

export const formatTime = (date: Date) =>
  `${two(date.getHours())}:${two(date.getMinutes())}`;

export const formatEventTime = (date1: Date, date2: Date) => {
  if (!date2) return formatTime(date1);
  return `${formatTime(date1)} - ${formatTime(date2)}`;
};

export const formatDate = (
  date: Date,
  formatStr = 'cccc, LLLL do', // eslint-disable-line default-param-last
  locale: string,
) =>
  format(date, formatStr, {
    locale: locale === LANGUAGES.en ? enGB : de,
  });

export const formatTimeDistance = (from: Date, to: Date, locale: string) =>
  formatDistance(from, to, {
    addSuffix: true,
    locale: locale === LANGUAGES.en ? enGB : de,
  });

export function addMinutesToDate(date: Date, minutes: number) {
  const MINUTE_IN_MS = 60 * 1000;
  return new Date(date.getTime() + minutes * MINUTE_IN_MS);
}

export function getEndTime(
  startDate: Date,
  durationInMinutes: number,
  endDate?: Date,
) {
  if (endDate) {
    return endDate;
  }
  return addMinutesToDate(startDate, durationInMinutes);
}

export function formatDateForCalendarUrl(date: Date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}
