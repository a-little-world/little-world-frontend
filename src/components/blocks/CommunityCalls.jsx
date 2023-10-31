
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";


export const Community = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: white;
  box-sizing: border-box;
  display: flex;
    ${({ theme }) => `
  border-radius: ${theme.spacing.large};
  padding: ${theme.spacing.small};
  gap: ${theme.spacing.small};
  `}
`;

export const FrequencyTitle = styled.div`
  background: white;
  border-radius: 100px;
  position: absolute;
  bottom: 0;
    ${({ theme }) => `
  border-radius: ${theme.spacing.xxxlarge};
  padding: ${theme.spacing.xxxsmall} ${theme.spacing.xsmall};
  margin: ${theme.spacing.xsmall};
  `}
`;

export const DateTime = styled.div`
  flex: 1 1 180px;
  width: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  justify-content: center;

  .weekday, .month, .time{
    font-weight: 600;
  font-size: 30px;
  text-transform: uppercase;
  }
`;

export const Buttons = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-evenly;
  ${({ theme }) => `
  gap: ${theme.spacing.xsmall};
  `}
`;

export const Button = styled.button`
background: rgba(230, 232, 236, 0.2);
  border: 2px solid rgba(230, 232, 236, 0.2);
  border-radius: 25px;
  flex: 0 1 max-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => `
  padding: ${theme.spacing.small};
  gap: ${theme.spacing.xsmall};
  `}
`;

export const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1 1 100%;
  ${({ theme }) => `
  gap: ${theme.spacing.large};
  `}
`



function CommunityEvent({ _key, frequency, description, title, time, link }) {
  const { t } = useTranslation();
  const two = (n) => (n < 10 ? `0${n}` : n);

  const dateTime = new Date(time);

  const [showFullText, setShowFullText] = useState(false);
  const initialWordsDescription = description.split(' ');
  const wordsToShow = showFullText ? initialWordsDescription.join(' ') : initialWordsDescription.slice(0, 15).join(' ');
  const isShortText = initialWordsDescription.length <= 15;

  const toggleText = () => {
    setShowFullText(!showFullText);
  };

  return (
    <Community key={_key} className="community-event">
      <div className="frequency">
        <img alt="" />
        <FrequencyTitle>{frequency}</FrequencyTitle>
      </div>
      <Main>
        <div className="event-info">
          <h3>{title}</h3>
          <div className="text">
            {wordsToShow} &nbsp;
            {!showFullText && !isShortText && (
              <a className="show-more" onClick={toggleText}>
                Show more
              </a>
            )}
            {showFullText && (
              <a className="show-more" onClick={toggleText}>
                Show less
              </a>
            )}
          </div>
        </div>
        <Buttons>
          <Button className="appointment disabled">
            <img alt="add appointment" />
            <span className="text">Termin hinzufügen</span>
          </Button>
          <Button
            type="button"
            className="call"
            onClick={() => {
              window.open(link, "_blank");
            }}
          >
            <img className="" alt="call" />
            <span className="text">Gespräch beitreten</span>
          </Button>
        </Buttons>
      </Main>
      <DateTime>
        {frequency === "weekly" && (
          <div className="weekday">{t(`weekdays::${dateTime.getDay()}`)}</div>
        )}
        {frequency === "once" && (
          <>
            <div className="date">{two(dateTime.getDate())}</div>
            <div className="month">{t(`month_short::${dateTime.getMonth()}`)}</div>
          </>
        )}
        <div className="time">{`${two(dateTime.getHours())}:${two(dateTime.getMinutes())}`}</div>
      </DateTime>
    </Community>
  );
}

function CommunityCalls() {
  const events = useSelector((state) => state.userData.communityEvents);
  const now = new Date();

  return (
    <div className="community-calls">
      {events.items.map((eventData) => (
        <CommunityEvent key={eventData.id} _key={eventData.id} {...eventData} />
      ))}
    </div>
  );
}

export default CommunityCalls;

