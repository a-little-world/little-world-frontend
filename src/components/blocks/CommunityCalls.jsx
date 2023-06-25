import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CommunityEvent({ frequency, description, title, time, link }) {
  const { t } = useTranslation();
  const two = (n) => (n < 10 ? `0${n}` : n);

  const dateTime = new Date(time);

  return (
    <div className="community-event">
      <div className="frequency">
        <img alt="" />
        <div className="frequency-text">{frequency}</div>
      </div>
      <div className="main">
        <div className="event-info">
          <h3>{title}</h3>
          <div className="text">
            {description} <Link className="show-more">Show more</Link>
          </div>
        </div>
        <div className="buttons">
          <button type="button" className="appointment disabled">
            <img alt="add appointment" />
            <span className="text">Termin hinzufügen</span>
          </button>
          <button
            type="button"
            className="call"
            onClick={() => {
              window.open(link, "_blank");
            }}
          >
            <img alt="call" />
            <span className="text">Gespräch beitreten</span>
          </button>
        </div>
      </div>
      <div className="dateTime">
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
      </div>
    </div>
  );
}

function CommunityCalls() {
  const events = useSelector((state) => state.userData.communityEvents);
  const now = new Date();

  return (
    <div className="community-calls">
      {events.map((eventData) => (
        <CommunityEvent key={eventData.id} {...eventData} />
      ))}
    </div>
  );
}

export default CommunityCalls;
