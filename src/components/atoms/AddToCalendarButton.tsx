import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  CalendarAddIcon,
  Popover,
  Separator,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { formatDateForCalendarUrl, getEndTime } from '../../helpers/date.ts';

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

interface CalendarEvent {
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  durationInMinutes: number;
  link: string;
}

export default function AddToCalendarButton({
  calendarEvent,
}: {
  calendarEvent: CalendarEvent;
}) {
  const { t } = useTranslation();
  const theme = useTheme();

  const onCalendarOptionClick = (
    generateCalendar: (calendarEvent: CalendarEvent) => string,
  ) => {
    const url = generateCalendar(calendarEvent);
    window.open(url, '_blank');
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
          color={theme.color.text.link}
        >
          <CalendarAddIcon
            labelId="addToCalendar"
            label={t('new_translation')}
            width="20"
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
      <Separator spacing={theme.spacing.xsmall} />

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={() => onCalendarOptionClick(generateGoogleCalendarUrl)}
      >
        {t('google_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={() => onCalendarOptionClick(generateIcsCalendarFile)}
      >
        {t('apple_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={() => onCalendarOptionClick(generateIcsCalendarFile)}
      >
        {t('outlook_calendar')}
      </AddToCalendarOption>
    </Popover>
  );
}

function generateGoogleCalendarUrl(calendarEvent: CalendarEvent) {
  const { formattedStartDate, formattedEndDate } =
    getFormattedCalendarDates(calendarEvent);
  const encodedUrl = encodeURI(
    [
      'https://www.google.com/calendar/render',
      '?action=TEMPLATE',
      `&text=${calendarEvent.title || ''}`,
      `&dates=${formattedStartDate || ''}`,
      `/${formattedEndDate || ''}`,
      `&details=${calendarEvent.description
        ? `${calendarEvent.description}\nhttps://little-world.com`
        : 'https://little-world.com'
      }`,
      `&location=${calendarEvent.link || ''}`,
      '&ctz=Europe%2FBerlin',
      '&sprop=&sprop=name:',
    ].join(''),
  );

  // open encodeUrl in new target blank
  return encodedUrl;
}

function getFormattedCalendarDates(calendarEvent: CalendarEvent) {
  const formattedStartDate = formatDateForCalendarUrl(calendarEvent.startDate);
  const endDate = getEndTime(
    calendarEvent.startDate,
    calendarEvent.durationInMinutes,
    calendarEvent.endDate,
  );
  const formattedEndDate = formatDateForCalendarUrl(endDate);
  return { formattedStartDate, formattedEndDate };
}

// Generates ICS for Apple and Outlook calendars
function generateIcsCalendarFile(calendarEvent: CalendarEvent) {
  const { formattedStartDate, formattedEndDate } = getFormattedCalendarDates(calendarEvent);

  const formattedStartDateTime = formattedStartDate.replace(/[-:]/g, '');
  const formattedEndDateTime = formattedEndDate.replace(/[-:]/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Your Company//NONSGML v1.0//EN',
    'BEGIN:VEVENT',
    `UID:${new Date().getTime()}`,
    `URL:${document.URL}`,
    `DTSTART;TZID=Europe/Berlin:${formattedStartDateTime}`,
    `DTEND;TZID=Europe/Berlin:${formattedEndDateTime}`,
    `SUMMARY:${calendarEvent.title || ''}`,
    `DESCRIPTION:${calendarEvent.description || ''}`,
    `LOCATION:${calendarEvent.link || ''}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const encodedUrl = encodeURI(`data:text/calendar;charset=utf8,${icsContent}`);
  return encodedUrl;
}
