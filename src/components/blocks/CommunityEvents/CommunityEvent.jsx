import {
  Button,
  ButtonVariations,
  PhoneIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';

import { formatDate, formatEventTime } from '../../../helpers/date.ts';
import placeholderImage from '../../../images/coffee.webp';
import AddToCalendarButton from '../../atoms/AddToCalendarButton.tsx';
import {
  Buttons,
  DateTime,
  Event,
  EventImage,
  EventInfo,
  EventTitle,
  Events,
  FrequencyTitle,
  ImageContainer,
  Main,
} from './styles';

function CommunityEvent({
  _key,
  frequency,
  description,
  image,
  title,
  time,
  end_time,
  link,
}) {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const theme = useTheme();

  const [showFullText, setShowFullText] = useState(false);
  const initialWordsDescription = description.split(' ');
  const wordsToShow = showFullText
    ? initialWordsDescription.join(' ')
    : initialWordsDescription.slice(0, 15).join(' ');
  const isShortText = initialWordsDescription.length <= 15;
  const startDate = new Date(time);
  const endDate = end_time ? new Date(end_time) : null;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Event key={_key}>
      <ImageContainer>
        <EventImage alt="" src={image || placeholderImage} />
        <FrequencyTitle>
          {t(`community_events.frequency_${frequency}`)}
        </FrequencyTitle>
      </ImageContainer>
      <Main>
        <EventInfo>
          <EventTitle type={TextTypes.Heading4}>{title}</EventTitle>
          <Text>{wordsToShow}</Text>
          {!isShortText && (
            <Button
              color={theme.color.text.link}
              variation={ButtonVariations.Inline}
              onClick={toggleText}
            >
              {t(`community_events.show_${showFullText ? 'less' : 'more'}`)}
            </Button>
          )}
        </EventInfo>
        <DateTime>
          {frequency === 'weekly' && (
            <Text type={TextTypes.Body3} bold>
              {formatDate(startDate, 'cccc', language)}
            </Text>
          )}
          {frequency === 'once' && (
            <Text type={TextTypes.Body3} bold tag="span">
              {formatDate(startDate, 'cccc, LLLL do', language)}
            </Text>
          )}
          <Text type={TextTypes.Body3} bold>
            {formatEventTime(startDate, endDate)}
          </Text>
        </DateTime>
        <Buttons>
          <Button className="appointment disabled">
            <img alt="add appointment" />
            <span className="text">Termin hinzufügen</span>
          </Button>
          <Button
            type="button"
            variation={ButtonVariations.Basic}
            onClick={() => {
              window.open(link, '_blank');
            }}
          >
            <PhoneIcon color={theme.color.surface.primary} width="20px" />
            <span className="text">Gespräch beitreten</span>
          </Button>
          <AddToCalendarButton
            calendarEvent={{
              title,
              description,
              startDate,
              endDate,
              durationInMinutes: 60,
              link,
            }}
          />
        </Buttons>
      </Main>
    </Event>
  );
}

function CommunityEvents() {
  const events = useSelector(state => state.userData.communityEvents);

  return (
    <Events>
      {events.items.map(eventData => (
        <CommunityEvent key={eventData.id} _key={eventData.id} {...eventData} />
      ))}
    </Events>
  );
}

export default CommunityEvents;
