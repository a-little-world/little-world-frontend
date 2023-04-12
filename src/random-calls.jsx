import { useTranslation } from "react-i18next";
import Link from "./path-prepend";
import React, { useEffect, useRef, useState, useCallback } from "react";
import GridLoader from "react-spinners/GridLoader";
import useWebSocket, { ReadyState } from 'react-use-websocket';

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

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
    let [loading, setLoading] = useState(true);
    let [color, setColor] = useState("#000000");
    const [waitingRoomState, setWaitingRoomState] = useState({
      total_users_waiting: 0,
      position_in_queue: 0,
    })

    const { t } = useTranslation();
    
    const [socketUrl, setSocketUrl] = useState('ws://localhost:8000/api/random_calls/ws');
    const [messageHistory, setMessageHistory] = useState([]);
  
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)
    
    useEffect(() => {
        console.log("MESSAGE RECEIVED:", lastMessage)
        if (lastMessage !== null) {
          // Read the data
          const data = JSON.parse(lastMessage.data);

          console.log("data parsed", data)
          
          if(["user_joined", "user_left", "users_matched"].includes(data.event)) {
            console.log("User waaiting updated event")
            setWaitingRoomState({...waitingRoomState, 
              ...{ total_users_waiting: data.total_users, 
                position_in_queue: data.position_in_queue }});
          }else if(["found_match"].includes(data.event)) {

            navigate(`${BACKEND_PATH}/call`, { state: { 
              userPk: data.match_hash
            } });  
          }
          setMessageHistory((prev) => prev.concat(lastMessage));
        }
      }, [lastMessage, setMessageHistory]);
    
      const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);
    
      const connectionStatus = {
        [ReadyState.CONNECTING]: 'connecting',
        [ReadyState.OPEN]: 'connected',
        [ReadyState.CLOSING]: 'disconnecting',
        [ReadyState.CLOSED]: 'disconnected',
        [ReadyState.UNINSTANTIATED]: 'idle',
      }[readyState];
    

    return <div className="overlay-shade">
        <div style={{position: "absolute"}}>
          <h2>DEBUG LOG:</h2> 
          <ol>
            {messageHistory.map((message, idx) => {
              return <div key={idx}>
                <li>{message.data}</li>
              </div>
            })}
          </ol>
        </div>
        <div className="modal-box">
            <div className="content">
              <h3>{t("nbt_random_calls_overlay_title")}</h3>
                <div className="connection-indicator"><span class="light"></span> {connectionStatus} </div>
            <div className="main">

              <div className="subtitle">{t('nbt_random_calls_overlay_subtitle')}</div>
              <div className="sweet-loading">
                  <GridLoader
                    color={color}
                    loading={loading}
                    cssOverride={override}
                    size={40}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                  />
                </div>
              <div className="text">{t('nbt_random_calls_overlay_text', {nqueue : waitingRoomState.position_in_queue.toString()})}</div>
              <div className="buttons">
                <button type="button" className="cancel" onClick={() => {
                    setState({...state, ...{ showOverlay: !state.showOverlay }});
                }}>
                  {"Leave random call queue"}
                </button>
              </div>
            </div>
        </div>
        </div>
    </div>
}

export function RandomCalls({setCallSetupPartner, randomCallState, setRandomCallState}) {

  const { t } = useTranslation();
    
  const past_partners = [{name: "Test"}];

  return (
    <div className="random-calls">
      <div className="random-calls-header">
        <div className="main">
          <h2>{t('nbt_random_calls')}</h2>
          <div className="text">
           {t('nbt_random_calls_description')}
          </div>
          <button onClick={() => {
            setCallSetupPartner("random"); // this indicates that we set a parter for a 'random' call
            //setJoinOverlayState({...joinOverlayState, ...{ showOverlay: !joinOverlayState.show }});
          }}>
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
      {randomCallState.showOverlay && <WaitingRoomOverlay state={randomCallState} setState={setRandomCallState} />}
  </div>
  )
}