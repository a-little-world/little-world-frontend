import { format } from 'date-fns';
import { de, enGB } from 'date-fns/locale';

import { ADVENT_DOORS_ENDPOINT } from '../../../api/endpoints';
import { apiFetch } from '../../../api/helpers';
import { ApiError } from '../../../api/types';
import { LANGUAGES } from '../../../constants/index';

/** A door is almost full once this many learner seats, or fewer, remain. */
export const ALMOST_FULL_FREE_SEATS = 3;

export const ADVENT_DOORS_KEY = ADVENT_DOORS_ENDPOINT;

export type DoorPayload = {
  id: string;
  day: number;
  date: string;
  start_time: string;
  end_time: string;
  starts_at: string;
  ends_at: string;
  company: string;
  capacity: number;
  booked: number;
  booked_by_me: boolean;
  join_path: string;
};

export type AdventDoor = {
  id: string;
  day: number;
  date: string;
  startTime: string;
  endTime: string;
  startsAt: string;
  endsAt: string;
  company: string;
  capacity: number;
  booked: number;
  bookedByMe: boolean;
  joinPath: string;
};

export type DoorVisual = 'open' | 'almost' | 'booked' | 'full';

const dateLocale = (language: string) =>
  language === LANGUAGES.en ? enGB : de;

export const toDoor = (payload: DoorPayload): AdventDoor => ({
  id: payload.id,
  day: payload.day,
  date: payload.date,
  startTime: payload.start_time,
  endTime: payload.end_time,
  startsAt: payload.starts_at,
  endsAt: payload.ends_at,
  company: payload.company,
  capacity: payload.capacity,
  booked: payload.booked,
  bookedByMe: payload.booked_by_me,
  joinPath: payload.join_path,
});

export const toPayload = (door: AdventDoor): DoorPayload => ({
  id: door.id,
  day: door.day,
  date: door.date,
  start_time: door.startTime,
  end_time: door.endTime,
  starts_at: door.startsAt,
  ends_at: door.endsAt,
  company: door.company,
  capacity: door.capacity,
  booked: door.booked,
  booked_by_me: door.bookedByMe,
  join_path: door.joinPath,
});

export const freeSeats = (door: AdventDoor) =>
  Math.max(door.capacity - door.booked, 0);

export const doorVisual = (door: AdventDoor): DoorVisual => {
  if (door.bookedByMe) return 'booked';
  const free = freeSeats(door);
  if (free <= 0) return 'full';
  if (free <= ALMOST_FULL_FREE_SEATS) return 'almost';
  return 'open';
};

export const compareDoors = (a: AdventDoor, b: AdventDoor) =>
  a.date.localeCompare(b.date) ||
  a.startTime.localeCompare(b.startTime) ||
  a.id.localeCompare(b.id);

/** The backend lists only Advent doors; this drops one that ends while the page is open. */
export const isUpcoming = (door: AdventDoor, now = new Date()) =>
  new Date(door.endsAt).getTime() > now.getTime();

const calendarDate = (door: AdventDoor) => {
  const [year, month, day] = door.date.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const weekdayName = (door: AdventDoor, language: string) =>
  format(calendarDate(door), 'EEEE', { locale: dateLocale(language) });

export const longDate = (door: AdventDoor, language: string) =>
  format(calendarDate(door), 'd. MMMM yyyy', { locale: dateLocale(language) });

export const bookDoorRequest = (id: string) =>
  apiFetch<DoorPayload>(`${ADVENT_DOORS_ENDPOINT}${id}/book/`, {
    method: 'POST',
  });

export const cancelDoorRequest = (id: string) =>
  apiFetch<DoorPayload>(`${ADVENT_DOORS_ENDPOINT}${id}/cancel/`, {
    method: 'POST',
  });

export const isFullError = (error: unknown): DoorPayload | null => {
  const apiError = error as ApiError;
  if (apiError?.status === 409 && apiError.data?.door) {
    return apiError.data.door as DoorPayload;
  }
  return null;
};
