import {
  Button,
  ButtonSizes,
  ButtonVariations,
  PhoneIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { groupBy } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { formatDate, formatEventTime } from '../../../helpers/date.ts';
import { Event } from '../../../helpers/events.ts';
import placeholderImage from '../../../images/coffee.webp';
import AddToCalendarButton from '../../atoms/AddToCalendarButton.tsx';
import ShowMoreText from '../../atoms/ShowMoreText.tsx';
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
} from './styles.tsx';
import useSWR from 'swr';
import { COMMUNITY_EVENTS_ENDPOINT, fetcher } from '../../../features/swr/index.ts';

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
        .map(event => ({
          startDate: new Date(event.time),
          endDate: event.end_time ? new Date(event.end_time) : undefined,
          link: event.link,
        }))
        .sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

      const groupedEvent: GroupedEvent = {
        ...first,
        sessions,
      };

      result.push(groupedEvent);
    } else {
      // Single event without group_id
      result.push(group[0]);
    }
  });

  return result;
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
                  window.open(link, '_blank');
                }}
                variation={ButtonVariations.Circle}
                size={ButtonSizes.Small}
                backgroundColor={theme.color.gradient.orange10}
              >
                <PhoneIcon
                  label="join call"
                  labelId="joinCall"
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
          {formatDate(startDate, 'cccc, LLLL do', language)}
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
            labelId="joinCall"
            color={theme.color.surface.primary}
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
  const { data: events } = useSWR(COMMUNITY_EVENTS_ENDPOINT, fetcher)
  const groupedEvents = collateEvents(events?.items || []);
  return (
    <Events>
      {groupedEvents.map(eventData => (
        <CommunityEvent key={eventData.id} _key={eventData.id} {...eventData} />
      ))}
    </Events>
  );
}

export default CommunityEvents;
