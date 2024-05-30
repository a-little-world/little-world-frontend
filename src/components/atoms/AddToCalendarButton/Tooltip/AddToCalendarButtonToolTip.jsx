import "./style.css";
import React from "react";

import styled, { css, useTheme } from 'styled-components';
import { useTranslation } from "react-i18next";

const ToolTipContainer = styled.div`
  position: absolute;
  top: 40px;
  right: 40px;
  width: 212px;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px rgba(81, 92, 98, 0.08), 0px 0px 1px rgba(179, 183, 186, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  z-index: 999;

  ${({ theme }) => `
    border-radius: ${theme.radius.large};
    padding: ${theme.spacing.small};
    gap: ${theme.spacing.medium};
  `}

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      left: -150px;
    }
  `}
`;
export default function AddToCalendarButtonTooltip({ calendarEvent }) {
  const { t } = useTranslation();
  const theme = useTheme();
  return (
    <ToolTipContainer>
      <h4 style={{color: theme.color.text.primary, textAlign:"center"}}><b>{t('add_to_calendar')} </b></h4>
      <a
        href={generateGoogleCalendarUrl(calendarEvent)}
        target="_blank" rel="noopener noreferrer"
        className="calendar-provider-link">
        <span className="icon__placeholder" style={{backgroundColor: theme.color.text.link}}/> Google Calendar
      </a>
      <a
        href={generateIcsCalendarFile(calendarEvent)}
        target="_blank" rel="noopener noreferrer"
        className="calendar-provider-link">
        <span className="icon__placeholder" style={{backgroundColor: theme.color.text.link}} /> Apple Calendar
      </a>
      <a
        href={generateIcsCalendarFile(calendarEvent)}
        target="_blank"
        rel="noopener noreferrer"
        className="calendar-provider-link">
        <span className="icon__placeholder" style={{backgroundColor: theme.color.text.link}} /> Outlook Calendar
      </a>
    </ToolTipContainer>
  );
}

// utils
const MINUTE_IN_MS = 60 * 1000;

function getEndTime(calendarEvent) {
  const durationInMinutes = calendarEvent.durationInMinutes || 60;
  return calendarEvent.endDate ?? addMinutesToDate(calendarEvent.dateTime, durationInMinutes);
}

function formatDateForCalendarUrl(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
}

function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * MINUTE_IN_MS);
}

function generateGoogleCalendarUrl(calendarEvent) {
  const startDate = formatDateForCalendarUrl(calendarEvent.dateTime);
  const endDate = formatDateForCalendarUrl(getEndTime(calendarEvent));

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

  return encodedUrl;
}

// Generates ICS for Apple and Outlook calendars
function generateIcsCalendarFile(calendarEvent) {
  const startDate = formatDateForCalendarUrl(calendarEvent.dateTime);
  const endDate = formatDateForCalendarUrl(getEndTime(calendarEvent));

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
