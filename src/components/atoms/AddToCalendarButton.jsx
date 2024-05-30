import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styled, { useTheme } from "styled-components";
import {
  Button,
  ButtonVariations,
  ButtonAppearance,
  CalendarIcon,
  Popover
} from '@a-little-world/little-world-design-system';
import { PopoverSizes } from '@a-little-world/little-world-design-system/dist/esm/components/Popover/Popover';
import { getEndTime, formatDateForCalendarUrl } from "../../helpers/date.ts";

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

export default function AddToCalendarButton({ calendarEvent }) {
  const { t } = useTranslation();
  const theme = useTheme();
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
          <CalendarIcon
            labelId="addToCalendar"
            label={t('new_translation')}
            width="20"/>
        </Button>
          }
    >

      <h5 style={{ color: theme.color.text.primary }}><b>{t('add_to_calendar')}</b></h5>
      <hr style={{color: theme.color.border.reversed, width: "100%"}}/>

       <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={
          () => {
            const url = generateGoogleCalendarUrl(calendarEvent);
            window.open(url, '_blank');
          }
        }
          >
            {t('google_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={
          () => {
            const url = generateIcsCalendarFile(calendarEvent);
            window.open(url, '_blank');
          }
        }
          >
            {t('apple_calendar')}
      </AddToCalendarOption>

      <AddToCalendarOption
        variation={ButtonVariations.Inline}
        onClick={
          () => {
            const url = generateIcsCalendarFile(calendarEvent);
            window.open(url, '_blank');
          }
        }
      >
            {t('outlook_calendar')}
        </AddToCalendarOption>
        </Popover>
  );
}

function generateGoogleCalendarUrl(calendarEvent) {
  const startDate = formatDateForCalendarUrl(calendarEvent.dateTime);
  const endDate = formatDateForCalendarUrl(getEndTime(calendarEvent.dateTime, calendarEvent.durationInMinutes || 60));

  const encodedUrl = encodeURI([
    'https://www.google.com/calendar/render',
    '?action=TEMPLATE',
    `&text=${calendarEvent.title || ''}`,
    `&dates=${startDate || ''}`,
    `/${endDate || ''}`,
    `&details=${calendarEvent.description ? `${calendarEvent.description}\nhttps://little-world.com` : 'https://little-world.com'}`,
    `&location=${calendarEvent.link || ''}`,
    '&ctz=Europe%2FBerlin',
    '&sprop=&sprop=name:'
  ].join(''));

  // open encodeUrl in new target blank
  return encodedUrl;
}

// Generates ICS for Apple and Outlook calendars
function generateIcsCalendarFile(calendarEvent) {
  const startDate = formatDateForCalendarUrl(calendarEvent.dateTime);
  const endDate = formatDateForCalendarUrl(getEndTime(calendarEvent.dateTime, calendarEvent.durationInMinutes || 60));

  const encodedUrl = encodeURI(
    `data:text/calendar;charset=utf8,${[
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `URL:${document.URL}`,
      `DTSTART:TZID=Europe/Berlin:${startDate || ''}`,
      `DTEND:TZID=Europe/Berlin:${endDate || ''}`,
      `SUMMARY:${calendarEvent.title || ''}`,
      `DESCRIPTION:${calendarEvent.description || ''}`,
      `LOCATION:${calendarEvent.link || ''}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n')}`
  );

  return encodedUrl;
}
