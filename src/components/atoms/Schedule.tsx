import { useMemo } from 'react';

import {
  ButtonSizes,
  CalendarIcon,
  ClockIcon,
  pixelate,
  Text,
  TextTypes,
  Tooltip,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import styled, { css, useTheme } from 'styled-components';

import { formatDate, formatEventTime } from '../../helpers/date';
import {
  nextSessionPerSeries,
  type ScheduleSession,
} from '../../helpers/schedule';
import { calendarRecurrenceFor } from '../../helpers/seriesCalendar';
import useIsBelowBreakpoint from '../../hooks/useIsBelowBreakpoint';
import AddToCalendarButton from './AddToCalendarButton';
import FrequencyTag from './FrequencyTag';

export type { ScheduleSession } from '../../helpers/schedule';

export type ScheduleProps = {
  title: string;
  sessions: ScheduleSession[];
  /** When set, the session list scrolls instead of growing the card. */
  listMaxHeight?: number;
  addToCalendar?: {
    title: string;
    description: string;
    link: string;
    frequency: string;
    durationInMinutes?: number;
    size?: ButtonSizes;
  };
};

const Wrapper = styled.div`
  background: ${({ theme }) => theme.color.surface.primary};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  padding: ${({ theme }) => theme.spacing.small};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
    }
  `}
`;

const Title = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.heading};
`;

// The list owns the columns and every row uses them through subgrid, so dates, times and
// tags line up across rows instead of each row sizing its own.
const SessionList = styled.div<{ $maxHeight?: number; $stacked?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $stacked }) =>
    $stacked
      ? 'minmax(0, 1fr) max-content max-content'
      : 'max-content max-content minmax(max-content, 1fr) max-content'};
  column-gap: ${({ theme }) => theme.spacing.small};
  row-gap: ${({ theme }) => theme.spacing.xxsmall};

  ${({ $maxHeight }) =>
    $maxHeight &&
    css`
      max-height: ${pixelate($maxHeight)};
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    `}
`;

const SessionRow = styled.div`
  display: grid;
  grid-column: 1 / -1;
  grid-template-columns: subgrid;
  align-items: flex-end;
  padding: ${({ theme }) => theme.spacing.xsmall};
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: ${({ theme }) => theme.radius.small};
  transition: background 0.15s ease;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      align-items: center;
    }
  `}
`;

const EmptyText = styled(Text)`
  grid-column: 1 / -1;
`;

/** The tag takes the remaining width and sits against the calendar button. */
const RowFrequencyTag = styled(FrequencyTag)`
  justify-self: end;
`;

/** The add-to-calendar button is always the last column. */
const CalendarCell = styled.div`
  grid-column: -2;
`;

const SessionDate = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
`;

// Icon and text together in one column, for both the date and the time.
const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const SessionTime = styled(Text)`
  color: ${({ theme }) => theme.color.text.secondary};
`;

// Small screens with frequency tags: date above time, so the row fits.
const DateTimeStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

const IconWrap = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export function Schedule({
  title,
  sessions,
  listMaxHeight,
  addToCalendar,
}: ScheduleProps) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language;
  const rows = useMemo(() => nextSessionPerSeries(sessions), [sessions]);
  // Each row's series as one recurring calendar event, from that session on.
  const calendarByRow = useMemo(
    () => rows.map(row => calendarRecurrenceFor(row, sessions)),
    [rows, sessions],
  );
  const theme = useTheme();
  const isSmallScreen = useIsBelowBreakpoint(theme.breakpoints.small);
  const stackDateTime =
    isSmallScreen && rows.some(row => Boolean(row.frequency));
  const textType = stackDateTime ? TextTypes.Body5 : undefined;

  return (
    <Wrapper>
      <Title bold type={TextTypes.Heading6}>
        {title}
      </Title>
      <SessionList $maxHeight={listMaxHeight} $stacked={stackDateTime}>
        {rows.length === 0 ? (
          <EmptyText>{t('random_calls.schedule_empty')}</EmptyText>
        ) : (
          rows.map((session, index) => {
            const start = new Date(session.start_time);
            const end = new Date(session.end_time);
            const dateLabel = formatDate(start, 'EEE d MMM', locale);
            const timeLabel = formatEventTime(start, end);
            const calendar = calendarByRow[index];
            const date = (
              <IconLabel>
                <IconWrap>
                  <CalendarIcon
                    label="date icon"
                    width={16}
                    height={16}
                    aria-hidden
                  />
                </IconWrap>
                <SessionDate tag="span" type={textType}>
                  {dateLabel}
                </SessionDate>
              </IconLabel>
            );
            const time = (
              <IconLabel>
                <IconWrap>
                  <ClockIcon
                    label="time icon"
                    width={16}
                    height={16}
                    aria-hidden
                  />
                </IconWrap>
                <SessionTime tag="span" type={textType}>
                  {timeLabel}
                </SessionTime>
              </IconLabel>
            );
            return (
              <SessionRow key={session.start_time ?? index}>
                {stackDateTime ? (
                  <DateTimeStack>
                    {date}
                    {time}
                  </DateTimeStack>
                ) : (
                  <>
                    {date}
                    {time}
                  </>
                )}
                <RowFrequencyTag frequency={session.frequency} />
                {addToCalendar && (
                  <CalendarCell>
                    <Tooltip
                      text={t('add_to_calendar')}
                      trigger={
                        <div>
                          <AddToCalendarButton
                            size={addToCalendar.size ?? ButtonSizes.Small}
                            calendarEvent={{
                              title: addToCalendar.title,
                              description: addToCalendar.description,
                              frequency: calendar.recurrence
                                ? calendar.frequency
                                : addToCalendar.frequency,
                              recurrence: calendar.recurrence,
                              startDate: start,
                              endDate: end,
                              durationInMinutes:
                                addToCalendar.durationInMinutes ?? 60,
                              link: addToCalendar.link,
                            }}
                          />
                        </div>
                      }
                    />
                  </CalendarCell>
                )}
              </SessionRow>
            );
          })
        )}
      </SessionList>
    </Wrapper>
  );
}
