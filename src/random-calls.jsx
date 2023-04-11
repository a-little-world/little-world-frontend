import { useTranslation } from "react-i18next";
import Link from "./path-prepend";
import React, { useEffect, useRef, useState } from "react";

function RandomCallsPastPartnerItem({partner}) {
  const { t } = useTranslation();

  const dateTime = new Date();
  const two = (n) => (n < 10 ? `0${n}` : n);

    return  <div className="random-calls-past-call-match">
                <div className="frequency">
        <img alt="" />
        <div className="frequency-text">Freq</div>
      </div>
      <div className="main">
        <div className="event-info">
          <h3>Title</h3>
          <div className="text">
            Blub <Link className="show-more">Show more</Link>
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
          <>
            <div className="date">{two(dateTime.getDate())}</div>
            <div className="month">{t(`month_short::${dateTime.getMonth()}`)}</div>
          </>
        <div className="time">{`${two(dateTime.getHours())}:${two(dateTime.getMinutes())}`}</div>
      </div>
      </div>
}

function WaitingRoomOverlay({ state, setState }) {
    return <div className="overlay-shade">
        <div className="modal-box">
              <button type="button" className="modal-close" onClick={() => {}} />
        </div>
    </div>
}

export function RandomCalls() {
  const { t } = useTranslation();
    
  const [joinOverlayState, setJoinOverlayState] = useState({
    show: false,
  });

  const past_partners = [{name: "Test"}];

  return (
    <div className="random-calls">
      <div className="random-calls-header">
        <div className="main">
          <h2>{t('nbt_random_calls')}</h2>
          <div className="text">
           {t('nbt_random_calls_description')}
          </div>
          <button>
           {t('nbt_random_calls_join_button')}
          </button>
        </div>
      </div>
      <div className="random-calls-past-partners">
        <div className="main">
        <h3>Past conversation partners</h3>
            <div className="text">
              only shown if they agreed to share their profile
            </div>
        </div>
      </div>
      {past_partners.map((partner) => {
        return <RandomCallsPastPartnerItem partner={partner}></RandomCallsPastPartnerItem>
      })}
      {/* We deliberately render this component *only* if it should be shown cause it will automaticly connect to the random call websocket */}
      {joinOverlayState.show && <WaitingRoomOverlay state={joinOverlayState} setState={setJoinOverlayState} />}
  </div>
  )
}