import { useState } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  PhoneIcon,
  Text,
  TextTypes,
  Tooltip,
} from '@a-little-world/little-world-design-system';
import { groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getCommunityEventsEndpoint,
  UPCOMING_LOBBIES_ENDPOINT,
} from '../../../api/endpoints';
import { COMMUNITY_EVENT_FREQUENCIES } from '../../../constants/index';
import CustomPagination from '../../../CustomPagination';
import { formatDate, formatEventTime } from '../../../helpers/date';
import { calculateNextOccurrence, Event } from '../../../helpers/events';
import { type UpcomingLobbyItem } from '../../../helpers/randomCalls';
import placeholderImage from '../../../images/coffee.webp';
import randomCallsImage from '../../../images/random-calls-image.png';
import {
  getAppAbsoluteRoute,
  getAppRoute,
  RANDOM_CALLS_ROUTE,
} from '../../../router/routes';
import AddToCalendarButton from '../../atoms/AddToCalendarButton';
import PanelImage from '../../atoms/PanelImage';
import ShowMoreText from '../../atoms/ShowMoreText';
import {
  Buttons,
  DateText,
  DateTimeEvent,
  EventContainer,
  EventInfo,
  Events,
  EventsPagination,
  EventTitle,
  Main,
  Session,
  SessionFlex,
  Sessions,
  ShowMoreButton,
} from './styles';

type EventSession = {
  id?: string;
  startDate: Date;
  endDate?: Date;
  link: string;
};

interface GroupedEvent extends Event {
  original_time?: string;
  sessions?: EventSession[];
  sessionDateFormat?: string;
  openInApp?: boolean;
  joinCtaLabel?: string;
  calendarLink?: string;
}

interface CommunityEventProps extends GroupedEvent {
  _key: string;
}

function collateEvents(events: Event[]): GroupedEvent[] {
  const grouped = groupBy(events, e => e.group_id || `__${e.id}`);
  const result: GroupedEvent[] = [];

  Object.keys(grouped).forEach(key => {
    const group = grouped[key];
    const isGrouped = !key.startsWith('__');

    if (isGrouped) {
      const [first] = group;

      const sessions = group
        .map(event => {
          const nextOccurrence = calculateNextOccurrence(
            event.time,
            event.frequency,
            event.end_time,
          );
          // Calculate the correct end date by preserving the original duration
          let endDate: Date | undefined;
          if (event.end_time) {
            const originalStart = new Date(event.time);
            const originalEnd = new Date(event.end_time);
            const durationMs = originalEnd.getTime() - originalStart.getTime();
            endDate = new Date(nextOccurrence.getTime() + durationMs);
          }
          return {
            startDate: nextOccurrence,
            endDate,
            link: event.link,
          };
        })
        .sort((a, b) => {
          // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          const dayA = a.startDate.getDay();
          const dayB = b.startDate.getDay();

          // Convert to Monday-first week (0 = Monday, 6 = Sunday)
          const mondayFirstA = dayA === 0 ? 6 : dayA - 1;
          const mondayFirstB = dayB === 0 ? 6 : dayB - 1;

          // First sort by weekday
          const dayDiff = mondayFirstA - mondayFirstB;
          if (dayDiff !== 0) {
            return dayDiff;
          }

          // If same weekday, sort by time (hours and minutes)
          return a.startDate.getTime() - b.startDate.getTime();
        });

      const groupedEvent: GroupedEvent = {
        ...first,
        sessions,
      };

      result.push(groupedEvent);
    } else {
      // Single event without group_id
      const event = group[0];
      const nextOccurrence = calculateNextOccurrence(
        event.time,
        event.frequency,
        event.end_time,
      );
      // Calculate the correct end time by preserving the original duration
      let endTime: string | undefined;
      if (event.end_time) {
        const originalStart = new Date(event.time);
        const originalEnd = new Date(event.end_time);
        const durationMs = originalEnd.getTime() - originalStart.getTime();
        const newEndTime = new Date(nextOccurrence.getTime() + durationMs);
        endTime = newEndTime.toISOString();
      }
      result.push({
        ...event,
        original_time: event.time,
        time: nextOccurrence.toISOString(),
        end_time: endTime,
      });
    }
  });

  // Sort by next occurrence date, with grouped events pinned to last
  return result.sort((a, b) => {
    // If one has sessions and the other doesn't, sessions go last
    if (a.sessions && !b.sessions) return 1;
    if (!a.sessions && b.sessions) return -1;

    // If both are the same type, sort by next occurrence date
    let aNextDate: Date;
    let bNextDate: Date;

    if (a.sessions) {
      aNextDate = a.sessions[0].startDate; // Already sorted by date
    } else {
      aNextDate = new Date(a.time); // Already calculated next occurrence
    }

    if (b.sessions) {
      bNextDate = b.sessions[0].startDate;
    } else {
      bNextDate = new Date(b.time);
    }

    return aNextDate.getTime() - bNextDate.getTime();
  });
}

const EventCtas = ({
  title,
  frequency,
  description,
  link,
  startDate,
  originalStartDate,
  endDate,
  sessions,
  sessionDateFormat = 'cccc',
  openInApp = false,
  joinCtaLabel,
  calendarLink,
}: {
  title: string;
  description: string;
  link: string;
  startDate: Date;
  originalStartDate: Date;
  endDate?: Date;
  frequency: string;
  sessions?: EventSession[];
  sessionDateFormat?: string;
  openInApp?: boolean;
  joinCtaLabel?: string;
  calendarLink?: string;
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const now = new Date();
  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const isWeeklyLabelInRange =
    frequency === COMMUNITY_EVENT_FREQUENCIES.weekly &&
    (originalStartDate.getTime() <= now.getTime() ||
      originalStartDate.getTime() - now.getTime() < oneWeekMs);
  const showWideSessionDate = sessionDateFormat !== 'cccc';
  const joinLabel = joinCtaLabel ?? t('community_events.join_call');
  const showJoinIcon = !joinCtaLabel;
  const eventCalendarLink = calendarLink ?? link;

  const SESSIONS_COLLAPSED_COUNT = 5;
  const [sessionsExpanded, setSessionsExpanded] = useState(false);

  const onJoin = (sessionLink: string) => {
    if (openInApp) {
      navigate(sessionLink);
      return;
    }
    window.open(sessionLink, '_blank');
  };

  if (sessions) {
    const hasMore = sessions.length > SESSIONS_COLLAPSED_COUNT;
    const visibleSessions = sessionsExpanded
      ? sessions
      : sessions.slice(0, SESSIONS_COLLAPSED_COUNT);

    return (
      <Sessions>
        {visibleSessions.map(session => (
          <Session
            key={session.id || session.link}
            $wideDate={showWideSessionDate}
          >
            <Text type={TextTypes.Body4} bold tag="span">
              {formatDate(session.startDate, sessionDateFormat, language)}
            </Text>
            <Text type={TextTypes.Body4} bold color={theme.color.text.heading}>
              {formatEventTime(session.startDate, session.endDate)}
            </Text>
            <SessionFlex>
              <Button
                onClick={() => onJoin(session.link)}
                variation={ButtonVariations.Circle}
                size={ButtonSizes.Small}
              >
                <PhoneIcon
                  label="join call"
                  color={theme.color.surface.primary}
                  width={14}
                  height={14}
                />
              </Button>
              <Tooltip
                text={t('add_to_calendar')}
                trigger={
                  <div>
                    <AddToCalendarButton
                      calendarEvent={{
                        title,
                        description,
                        frequency,
                        startDate: session.startDate,
                        endDate: session.endDate,
                        durationInMinutes: 60,
                        link: eventCalendarLink,
                      }}
                      size={ButtonSizes.Small}
                    />
                  </div>
                }
              />
            </SessionFlex>
          </Session>
        ))}
        {hasMore && (
          <ShowMoreButton
            appearance={ButtonAppearance.Secondary}
            size={ButtonSizes.Small}
            onClick={() => setSessionsExpanded(prev => !prev)}
          >
            {sessionsExpanded
              ? t('community_events.show_less')
              : t('community_events.show_all')}
          </ShowMoreButton>
        )}
      </Sessions>
    );
  }

  return (
    <>
      <DateTimeEvent>
        <DateText type={TextTypes.Heading5} bold>
          {isWeeklyLabelInRange
            ? t('community_events.every_week', {
                day: formatDate(startDate, 'EEEE', language),
              })
            : formatDate(startDate, 'cccc, do LLLL', language)}
        </DateText>
        <Text type={TextTypes.Heading5} bold color={theme.color.text.heading}>
          {formatEventTime(startDate, endDate)}
        </Text>
      </DateTimeEvent>
      <Buttons>
        <Button onClick={() => onJoin(link)}>
          {showJoinIcon && (
            <PhoneIcon
              label="join call icon"
              color={theme.color.text.button}
              width="20px"
            />
          )}
          {joinLabel}
        </Button>
        <Tooltip
          text={t('add_to_calendar')}
          trigger={
            <div>
              <AddToCalendarButton
                calendarEvent={{
                  title,
                  frequency,
                  description,
                  startDate,
                  endDate,
                  durationInMinutes: 60,
                  link: eventCalendarLink,
                }}
              />
            </div>
          }
        />
      </Buttons>
    </>
  );
};

function CommunityEvent({
  _key,
  id,
  frequency,
  description,
  image,
  title,
  time,
  original_time: originalTime,
  end_time: endTime,
  link,
  sessions,
  sessionDateFormat,
  openInApp,
  joinCtaLabel,
  calendarLink,
}: CommunityEventProps) {
  const { t } = useTranslation();

  const startDate = new Date(time);
  const originalStartDate = new Date(originalTime || time);
  const endDate = endTime ? new Date(endTime) : undefined;

  return (
    <EventContainer id={id} key={_key}>
      <PanelImage
        src={image || placeholderImage}
        label={t(`community_events.frequency_${frequency}`)}
        alt="event image"
      />
      <Main>
        <EventInfo>
          <EventTitle type={TextTypes.Heading4}>{title}</EventTitle>
          <ShowMoreText text={description} />
        </EventInfo>
        <EventCtas
          title={title}
          description={description}
          link={link}
          startDate={startDate}
          originalStartDate={originalStartDate}
          endDate={endDate}
          frequency={frequency}
          sessions={sessions}
          sessionDateFormat={sessionDateFormat}
          openInApp={openInApp}
          joinCtaLabel={joinCtaLabel}
          calendarLink={calendarLink}
        />
      </Main>
    </EventContainer>
  );
}

function buildRandomCallsEvent(
  lobbies: UpcomingLobbyItem[],
  title: string,
  description: string,
  joinCtaLabel: string,
): GroupedEvent | null {
  if (lobbies.length === 0) return null;

  const randomCallsRoute = getAppRoute(RANDOM_CALLS_ROUTE);
  const randomCallsCalendarLink = getAppAbsoluteRoute(RANDOM_CALLS_ROUTE);
  const sortedLobbies = [...lobbies].sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  const [firstLobby] = sortedLobbies;

  return {
    id: 'random-calls',
    frequency: COMMUNITY_EVENT_FREQUENCIES.once,
    description,
    image: randomCallsImage,
    title,
    time: firstLobby.start_time,
    end_time: firstLobby.end_time,
    link: randomCallsRoute,
    calendarLink: randomCallsCalendarLink,
    openInApp: true,
    joinCtaLabel,
    ...(sortedLobbies.length > 1 && {
      sessions: sortedLobbies.map(lobby => ({
        id: lobby.uuid,
        startDate: new Date(lobby.start_time),
        endDate: new Date(lobby.end_time),
        link: randomCallsRoute,
      })),
      sessionDateFormat: 'EEE d MMM',
    }),
  };
}

function CommunityEvents() {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: events } = useSWR(getCommunityEventsEndpoint(currentPage));
  const { data: upcomingLobbies } = useSWR<UpcomingLobbyItem[]>(
    UPCOMING_LOBBIES_ENDPOINT,
  );
  const groupedEvents = collateEvents(events?.results || []);
  const randomCallsEvent =
    currentPage === 1
      ? buildRandomCallsEvent(
          upcomingLobbies ?? [],
          t('community_events.random_calls_title'),
          t('community_events.random_calls_description', {
            randomCallsLink: getAppAbsoluteRoute(RANDOM_CALLS_ROUTE),
          }),
          t('community_events.random_calls_cta'),
        )
      : null;

  const totalPages = events?.pages_total || 1;

  const onPageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <Events>
        {randomCallsEvent && (
          <CommunityEvent
            key={randomCallsEvent.id}
            _key={randomCallsEvent.id}
            {...randomCallsEvent}
          />
        )}
        {groupedEvents.map(eventData => (
          <CommunityEvent
            key={eventData.id}
            _key={eventData.id}
            {...eventData}
          />
        ))}
      </Events>
      {totalPages > 1 && (
        <EventsPagination>
          <CustomPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={onPageChange}
          />
        </EventsPagination>
      )}
    </>
  );
}

export default CommunityEvents;
