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
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { COMMUNITY_EVENT_FREQUENCIES } from '../../constants/index';
import { formatDateForCalendarUrl, getEndTime } from '../../helpers/date';
import { CalendarEvent } from '../../helpers/events';

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

function getFormattedCalendarDates(calendarEvent: CalendarEvent) {
  const formattedStartDate = formatDateForCalendarUrl(
    new Date(calendarEvent.startDate),
  );

  // Use the endDate that's passed to us, or calculate based on duration if not provided
  const endDate = calendarEvent.endDate ?
    new Date(calendarEvent.endDate) :
    getEndTime(
        new Date(calendarEvent.startDate),
        calendarEvent.durationInMinutes,
        undefined,
      );
  const formattedEndDate = formatDateForCalendarUrl(endDate);
  return { formattedStartDate, formattedEndDate };
}

function generateRecurrenceRule(calendarEvent: CalendarEvent): string {
  const { frequency } = calendarEvent;

  if (!frequency || frequency === COMMUNITY_EVENT_FREQUENCIES.once) {
    return '';
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.weekly) {
    return 'FREQ=WEEKLY';
  }

  if (frequency === COMMUNITY_EVENT_FREQUENCIES.fortnightly) {
    return 'FREQ=WEEKLY;INTERVAL=2';
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

    return isLastWeek ?
      `FREQ=MONTHLY;BYDAY=-1${dayName}` :
      `FREQ=MONTHLY;BYDAY=${weekOfMonth}${dayName}`;
  }

  return '';
}

function formatDateTimeForIcs(dateString: string): string {
  return dateString.replace(/[-:]/g, '').replace('.000Z', 'Z');
}

function generateGoogleCalendarUrl(calendarEvent: CalendarEvent): string {
  const { formattedStartDate, formattedEndDate } =
    getFormattedCalendarDates(calendarEvent);
  const recurrenceRule = generateRecurrenceRule(calendarEvent);
  const recurrenceParam = recurrenceRule ?
    `&recur=RRULE:${recurrenceRule}` :
    '';

  const baseUrl = 'https://www.google.com/calendar/render?action=TEMPLATE';
  const params = [
    `text=${calendarEvent.title || ''}`,
    `dates=${formattedStartDate || ''}/${formattedEndDate || ''}`,
    `details=${
      calendarEvent.description ?
        `${calendarEvent.description}\nhttps://little-world.com` :
        'https://little-world.com'
    }`,
    `location=${calendarEvent.link || ''}`,
    'ctz=Europe%2FBerlin',
    'sprop=&sprop=name:',
  ].join('&');

  return encodeURI(`${baseUrl}&${params}${recurrenceParam}`);
}

function generateIcsCalendarFile(calendarEvent: CalendarEvent): string {
  const { formattedStartDate, formattedEndDate } =
    getFormattedCalendarDates(calendarEvent);
  const formattedStartDateTime = formatDateTimeForIcs(formattedStartDate);
  const formattedEndDateTime = formatDateTimeForIcs(formattedEndDate);
  const recurrenceRule = generateRecurrenceRule(calendarEvent);

  const icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Your Company//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}`,
    `URL:${document.URL}`,
    `DTSTART:${formattedStartDateTime}`,
    `DTEND:${formattedEndDateTime}`,
    `SUMMARY:${calendarEvent.title || ''}`,
    `DESCRIPTION:${calendarEvent.description || ''}`,
    `LOCATION:${calendarEvent.link || ''}`,
    ...(recurrenceRule ? [`RRULE:${recurrenceRule}`] : []),
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
          appearance={ButtonAppearance.Primary}
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
