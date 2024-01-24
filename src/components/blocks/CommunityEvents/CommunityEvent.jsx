import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  Link,
  PhoneIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useTheme } from 'styled-components';

import {
  Buttons,
  DateTime,
  Event,
  EventImage,
  EventInfo,
  EventTitle,
  FrequencyTitle,
  ImageContainer,
  Main,
} from './styles';

function CommunityEvent({ _key, frequency, description, title, time, link }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const two = n => (n < 10 ? `0${n}` : n);

  const dateTime = new Date(time);

  const [showFullText, setShowFullText] = useState(false);
  const initialWordsDescription = description.split(' ');
  const wordsToShow = showFullText
    ? initialWordsDescription.join(' ')
    : initialWordsDescription.slice(0, 15).join(' ');
  const isShortText = initialWordsDescription.length <= 15;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Event key={_key}>
      <ImageContainer className="frequency">
        <EventImage alt="" />
        <FrequencyTitle>{frequency}</FrequencyTitle>
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
              {t(`weekdays::${dateTime.getDay()}`)}
            </Text>
          )}
          {frequency === 'once' && (
            <>
              <Text type={TextTypes.Body3} bold>
                {two(dateTime.getDate())}
              </Text>
              <Text type={TextTypes.Body3} bold>
                {t(`month_short::${dateTime.getMonth()}`)}
              </Text>
            </>
          )}
          <Text type={TextTypes.Body3} bold>
            {`${two(dateTime.getHours())}:${two(dateTime.getMinutes())}`}
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
        </Buttons>
      </Main>
    </Event>
  );
}

function CommunityEvents() {
  const events = useSelector(state => state.userData.communityEvents);

  return (
    <div className="community-calls">
      {events.items.map(eventData => (
        <CommunityEvent key={eventData.id} _key={eventData.id} {...eventData} />
      ))}
    </div>
  );
}

export default CommunityEvents;
