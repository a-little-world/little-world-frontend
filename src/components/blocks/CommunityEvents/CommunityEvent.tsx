import {
  Button,
  ButtonSizes,
  ButtonVariations,
  PhoneIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { groupBy } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import { COMMUNITY_EVENT_FREQUENCIES } from '../../../constants/index';
import { COMMUNITY_EVENTS_ENDPOINT } from '../../../features/swr/index';
import { formatDate, formatEventTime } from '../../../helpers/date';
import { Event, calculateNextOccurrence } from '../../../helpers/events';
import placeholderImage from '../../../images/coffee.webp';
import AddToCalendarButton from '../../atoms/AddToCalendarButton';
import ShowMoreText from '../../atoms/ShowMoreText';
import {
  Buttons,
  DateTimeEvent,
  EventContainer,
  EventImage,
  EventInfo,
  EventTitle,
  Events,
  FrequencyTitle,
  ImageContainer,
  Main,
  Session,
  SessionFlex,
  Sessions,
} from './styles';

interface GroupedEvent extends Event {
  sessions?: Array<{
    startDate: Date;
    endDate?: Date;
    link: string;
  }>;
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
  endDate,
  sessions,
}: {
  title: string;
  description: string;
  link: string;
  startDate: Date;
  endDate?: Date;
  frequency: string;
  sessions?: Array<{
    startDate: Date;
    endDate?: Date;
    link: string;
  }>;
}) => {
  const theme = useTheme();
  const {
    t,
    i18n: { language },
  } = useTranslation();

  if (sessions)
    return (
      <Sessions>
        {sessions.map(session => (
          <Session key={session.link}>
            <Text type={TextTypes.Body4} bold tag="span">
              {formatDate(session.startDate, 'cccc', language)}
            </Text>
            <Text type={TextTypes.Body4} bold color={theme.color.text.heading}>
              {formatEventTime(session.startDate, session.endDate)}
            </Text>
            <SessionFlex>
              <Button
                onClick={() => {
                  window.open(session.link, '_blank');
                }}
                variation={ButtonVariations.Circle}
                size={ButtonSizes.Small}
                backgroundColor={theme.color.gradient.orange10}
              >
                <PhoneIcon
                  label="join call"
                  color={theme.color.surface.primary}
                  width={14}
                  height={14}
                />
              </Button>
              <AddToCalendarButton
                calendarEvent={{
                  title,
                  description,
                  frequency,
                  startDate: session.startDate,
                  endDate: session.endDate,
                  durationInMinutes: 60,
                  link: session.link,
                }}
                size={ButtonSizes.Small}
              />
            </SessionFlex>
          </Session>
        ))}
      </Sessions>
    );

  return (
    <>
      <DateTimeEvent>
        <Text type={TextTypes.Body3} bold tag="span">
          {frequency === COMMUNITY_EVENT_FREQUENCIES.weekly
            ? t('community_events.every_week', {
                day: formatDate(startDate, 'EEEE', language),
              })
            : formatDate(startDate, 'cccc, LLLL do', language)}
        </Text>
        <Text type={TextTypes.Body3} bold color={theme.color.text.heading}>
          {formatEventTime(startDate, endDate)}
        </Text>
      </DateTimeEvent>
      <Buttons>
        <Button
          onClick={() => {
            window.open(link, '_blank');
          }}
        >
          <PhoneIcon
            label="join call icon"
            color={theme.color.text.button}
            width="20px"
          />
          <span className="text">{t('community_events.join_call')}</span>
        </Button>
        <AddToCalendarButton
          calendarEvent={{
            title,
            frequency,
            description,
            startDate,
            endDate,
            durationInMinutes: 60,
            link,
          }}
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
  end_time,
  link,
  sessions,
}: CommunityEventProps) {
  const { t } = useTranslation();

  const startDate = new Date(time);
  const endDate = end_time ? new Date(end_time) : undefined;

  return (
    <EventContainer id={id} key={_key}>
      <ImageContainer>
        <EventImage alt="" src={image || placeholderImage} />
        <FrequencyTitle>
          {t(`community_events.frequency_${frequency}`)}
        </FrequencyTitle>
      </ImageContainer>
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
          endDate={endDate}
          frequency={frequency}
          sessions={sessions}
        />
      </Main>
    </EventContainer>
  );
}

function CommunityEvents() {
  const { data: events } = useSWR(COMMUNITY_EVENTS_ENDPOINT);
  const groupedEvents = collateEvents(events?.results || []);

  return (
    <Events>
      {groupedEvents.map(eventData => (
        <CommunityEvent key={eventData.id} _key={eventData.id} {...eventData} />
      ))}
    </Events>
  );
}

export default CommunityEvents;
