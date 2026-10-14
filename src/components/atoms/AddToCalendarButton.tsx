import {
  AppointmentIcon,
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  Popover,
  Separator,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { COMMUNITY_EVENT_FREQUENCIES } from '../../constants/index';
import { formatDateForCalendarUrl, getEndTime } from '../../helpers/date';
import { CalendarEvent } from '../../helpers/events';
import {
  CALENDAR_TIME_ZONE,
  formatBerlinIcsDateTime,
  formatUtcIcsDateTime,
} from '../../helpers/seriesCalendar';

export const AddToCalendarOption = styled(Button)`
  font-size: 1rem;
  font-weight: normal;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  padding-left: 0px;

  &:not(:last-of-type) {
    margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }
`;

const DAY_NAMES = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'] as const;

function getEventDates(calendarEvent: CalendarEvent) {
  const startDate = new Date(calendarEvent.startDate);
  // Use the endDate that's passed to us, or calculate based on duration if not provided
  const endDate = calendarEvent.endDate
    ? new Date(calendarEvent.endDate)
    : getEndTime(startDate, calendarEvent.durationInMinutes, undefined);
  return { startDate, endDate };
}

function getFormattedCalendarDates(calendarEvent: CalendarEvent) {
  const { startDate, endDate } = getEventDates(calendarEvent);
  return {
    formattedStartDate: formatDateForCalendarUrl(startDate),
    formattedEndDate: formatDateForCalendarUrl(endDate),
  };
}

/** Same day every month, falling back to the month's last day when it is shorter. */
function monthDayRule(monthDay: number): string {
  if (monthDay <= 28) return `FREQ=MONTHLY;BYMONTHDAY=${monthDay}`;
  const candidateDays = Array.from(
    { length: monthDay - 27 },
    (_, index) => 28 + index,
  );
  return `FREQ=MONTHLY;BYMONTHDAY=${candidateDays.join(',')};BYSETPOS=-1`;
}

function generateBaseRecurrenceRule(calendarEvent: CalendarEvent): string {
  const { frequency, recurrence } = calendarEvent;

  if (!frequency || frequency === COMMUNITY_EVENT_FREQUENCIES.once) {
    return '';
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.weekly) {
    return 'FREQ=WEEKLY';
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.fortnightly) {
    return 'FREQ=WEEKLY;INTERVAL=2';
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.monthly && recurrence) {
    return monthDayRule(recurrence.monthDay);
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.monthly) {
    const startDate = new Date(calendarEvent.startDate);
    const dayOfWeek = startDate.getDay();
    const weekOfMonth = Math.ceil(startDate.getDate() / 7);
    const dayName = DAY_NAMES[dayOfWeek];

    // Check if this is the last occurrence of this weekday in the month
    const lastDayOfMonth = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0,
    ).getDate();
    const isLastWeek = startDate.getDate() + 7 > lastDayOfMonth;

    return isLastWeek
      ? `FREQ=MONTHLY;BYDAY=-1${dayName}`
      : `FREQ=MONTHLY;BYDAY=${weekOfMonth}${dayName}`;
  }

  return '';
}

function generateRecurrenceRule(calendarEvent: CalendarEvent): string {
  const rule = generateBaseRecurrenceRule(calendarEvent);
  const { recurrence } = calendarEvent;
  return rule && recurrence
    ? `${rule};UNTIL=${formatUtcIcsDateTime(recurrence.until)}`
    : rule;
}

// Times are written in Berlin time with this definition, so a weekly 18:00 stays at 18:00
// across DST in Apple and Outlook calendars, as it does in Google via `ctz`.
const BERLIN_VTIMEZONE = [
  'BEGIN:VTIMEZONE',
  `TZID:${CALENDAR_TIME_ZONE}`,
  'BEGIN:DAYLIGHT',
  'TZOFFSETFROM:+0100',
  'TZOFFSETTO:+0200',
  'TZNAME:CEST',
  'DTSTART:19700329T020000',
  'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU',
  'END:DAYLIGHT',
  'BEGIN:STANDARD',
  'TZOFFSETFROM:+0200',
  'TZOFFSETTO:+0100',
  'TZNAME:CET',
  'DTSTART:19701025T030000',
  'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU',
  'END:STANDARD',
  'END:VTIMEZONE',
];

const berlinIcsDates = (dates: Date[]) =>
  dates.map(formatBerlinIcsDateTime).join(',');

function generateGoogleCalendarUrl(calendarEvent: CalendarEvent): string {
  const { formattedStartDate, formattedEndDate } =
    getFormattedCalendarDates(calendarEvent);
  const recurrenceRule = generateRecurrenceRule(calendarEvent);
  const recurrenceParam = recurrenceRule
    ? `&recur=RRULE:${recurrenceRule}`
    : '';

  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = [
    `text=${calendarEvent.title || ''}`,
    `dates=${formattedStartDate || ''}/${formattedEndDate || ''}`,
    `details=${
      calendarEvent.description
        ? `${calendarEvent.description}\nhttps://little-world.com`
        : 'https://little-world.com'
    }`,
    `location=${calendarEvent.link || ''}`,
    'ctz=Europe%2FBerlin',
    'sprop=&sprop=name:',
  ].join('&');

  return encodeURI(`${baseUrl}&${params}${recurrenceParam}`);
}

function generateIcsCalendarFile(calendarEvent: CalendarEvent): string {
  const { startDate, endDate } = getEventDates(calendarEvent);
  const recurrenceRule = generateRecurrenceRule(calendarEvent);
  const { recurrence } = calendarEvent;
  const exdates = recurrenceRule ? (recurrence?.exdates ?? []) : [];
  const rdates = recurrenceRule ? (recurrence?.rdates ?? []) : [];

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Your Company//NONSGML v1.0//EN',
    ...BERLIN_VTIMEZONE,
    'BEGIN:VEVENT',
    `UID:${Date.now()}`,
    `URL:${document.URL}`,
    `DTSTART;TZID=${CALENDAR_TIME_ZONE}:${formatBerlinIcsDateTime(startDate)}`,
    `DTEND;TZID=${CALENDAR_TIME_ZONE}:${formatBerlinIcsDateTime(endDate)}`,
    `SUMMARY:${calendarEvent.title || ''}`,
    `DESCRIPTION:${calendarEvent.description || ''}`,
    `LOCATION:${calendarEvent.link || ''}`,
    ...(recurrenceRule ? [`RRULE:${recurrenceRule}`] : []),
    // Removed and moved sessions of a series. Google's add-event link can't carry these.
    ...(exdates.length
      ? [`EXDATE;TZID=${CALENDAR_TIME_ZONE}:${berlinIcsDates(exdates)}`]
      : []),
    ...(rdates.length
      ? [`RDATE;TZID=${CALENDAR_TIME_ZONE}:${berlinIcsDates(rdates)}`]
      : []),
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return icsLines.join('\n');
}

function downloadIcsFile(calendarEvent: CalendarEvent): void {
  const icsContent = generateIcsCalendarFile(calendarEvent);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${calendarEvent.title || 'event'}.ics`;
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AddToCalendarButton({
  calendarEvent,
  size = ButtonSizes.Large,
}: {
  calendarEvent: CalendarEvent;
  size?: ButtonSizes;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const onCalendarOptionClick = (
    generateCalendar: (calEvent: CalendarEvent) => string,
  ) => {
    const url = generateCalendar(calendarEvent);
    window.open(url, '_blank');
  };

  const onIcsDownload = () => {
    downloadIcsFile(calendarEvent);
  };

  return (
    <Popover
      width={PopoverSizes.Medium}
      showCloseButton
      trigger={
        <Button
          type="button"
          variation={ButtonVariations.Circle}
          appearance={ButtonAppearance.Secondary}
          borderColor={theme.color.text.link}
          size={size}
          color={theme.color.text.link}
        >
          <AppointmentIcon
            label={t('new_translation')}
            width={size === ButtonSizes.Large ? '20' : '16'}
            height={size === ButtonSizes.Large ? '20' : '16'}
          />
        </Button>
      }
    >
      <Text
        type={TextTypes.Body5}
        bold
        center
        tag="h5"
        color={theme.color.text.heading}
      >
        {t('add_to_calendar')}
      </Text>
      <Separator
        background={theme.color.surface.secondary}
        spacing={theme.spacing.xsmall}
      />

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={() => onCalendarOptionClick(generateGoogleCalendarUrl)}
      >
        {t('google_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={onIcsDownload}
      >
        {t('apple_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={onIcsDownload}
      >
        {t('outlook_calendar')}
      </AddToCalendarOption>
    </Popover>
  );
}
