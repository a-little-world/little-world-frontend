import {
  addDays,
  addMonths,
  getDate,
  getDay,
  isAfter,
  isBefore,
  startOfMonth,
} from 'date-fns';

import { COMMUNITY_EVENT_FREQUENCIES } from '../constants/index.ts';

export interface Event {
  id: string;
  frequency: string;
  description: string;
  image?: string;
  group_id?: string;
  title: string;
  time: string;
  end_time?: string;
  link: string;
}

export interface CalendarEvent {
  frequency: string;
  description: string;
  durationInMinutes: number;
  title: string;
  endDate?: Date;
  startDate: Date;
  link: string;
}

export function calculateNextOccurrence(
  startDate: string | Date,
  frequency: string,
): Date {
  if (!frequency || frequency === COMMUNITY_EVENT_FREQUENCIES.once) {
    return new Date(startDate);
  }

  const originalDate = new Date(startDate);
  const now = new Date();

  // Early return if the original date is in the future
  if (isAfter(originalDate, now)) {
    return originalDate;
  }

  const originalDayOfWeek = getDay(originalDate);
  const currentDayOfWeek = getDay(now);

  // Preserve the original time (hours, minutes, seconds)
  const originalTime = {
    hours: originalDate.getHours(),
    minutes: originalDate.getMinutes(),
    seconds: originalDate.getSeconds(),
    milliseconds: originalDate.getMilliseconds(),
  };

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.weekly) {
    // Calculate days until next occurrence of the same weekday
    const daysUntilNext = (originalDayOfWeek - currentDayOfWeek + 7) % 7;
    // If it's the same day, go to next week
    const daysToAdd = daysUntilNext === 0 ? 7 : daysUntilNext;
    const nextDate = addDays(now, daysToAdd);

    // Set the original time
    nextDate.setHours(
      originalTime.hours,
      originalTime.minutes,
      originalTime.seconds,
      originalTime.milliseconds,
    );
    return nextDate;
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.fortnightly) {
    // Calculate days until next occurrence of the same weekday
    const daysUntilNext = (originalDayOfWeek - currentDayOfWeek + 7) % 7;
    // If it's the same day, go to next fortnight (2 weeks)
    const daysToAdd = daysUntilNext === 0 ? 14 : daysUntilNext;
    const nextDate = addDays(now, daysToAdd);

    // Set the original time
    nextDate.setHours(
      originalTime.hours,
      originalTime.minutes,
      originalTime.seconds,
      originalTime.milliseconds,
    );
    return nextDate;
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.monthly) {
    // For monthly, find the same week of month and day of week
    const weekOfMonth = Math.ceil(getDate(originalDate) / 7);

    // Start with current month
    let nextDate = startOfMonth(now);
    // Move to the correct week of month
    nextDate = addDays(nextDate, (weekOfMonth - 1) * 7);
    // Adjust to the correct day of week
    while (getDay(nextDate) !== originalDayOfWeek) {
      nextDate = addDays(nextDate, 1);
    }

    // If this date is in the past, move to next month
    if (isBefore(nextDate, now)) {
      nextDate = addMonths(nextDate, 1);
    }

    // Set the original time
    nextDate.setHours(
      originalTime.hours,
      originalTime.minutes,
      originalTime.seconds,
      originalTime.milliseconds,
    );
    return nextDate;
  }

  return originalDate;
}
