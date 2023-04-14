import { useTranslation } from "react-i18next";
import Link from "./path-prepend";
import Cookies from "js-cookie";
import Avatar from "react-nice-avatar";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import GridLoader from "react-spinners/GridLoader";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { updatePastRandomCallMatches } from "./features/userData";
import { BACKEND_URL, BACKEND_PATH } from "./ENVIRONMENT";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

function RandomCallsAcceptDenySelector({partner}) {
  const dispatch = useDispatch();

  const acceptDenyPartnerCall = (accept) => {
    fetch(`${BACKEND_URL}/api/user/random_calls/past_match_accept_deny/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        partner_hash: partner.user_hash,
        accept: accept,
      }),
    }).then((response) => {
      if (response.ok) {
        // use dispatch update
        dispatch(updatePastRandomCallMatches({ user_hash: partner.user_hash, accepted: accept }));
      }
    });
  }

  return <div className="buttons">
          <button
            type="button"
            className={partner.accepted ? "call deny": "call active deny"}
            onClick={() => {
              // TODO: call the api!
              acceptDenyPartnerCall(false);
            }}
          >
            <img alt="call" />
            <span className="text">Profil nicht geteilt</span>
          </button>
          <button
            type="button"
            className={partner.accepted ? "call active accept": "call accept"}
            onClick={() => {
              acceptDenyPartnerCall(true);
            }}
          >
            <img alt="call" />
            <span className="text">Profil geteilt</span>
          </button>
        </div>
}

function RandomCallsPastPartnerItem({partner}) {
  const { t } = useTranslation();

  const dateTime = new Date(partner.time);
  const two = (n) => (n < 10 ? `0${n}` : n);
  

    return  <div className="random-calls-past-call-match">
                <div className="frequency">
      {partner.user_image_type === 'avatar' ? (
        <Avatar className="profile-avatar" {...partner.user_profile} />
      ) : (
        <img alt="match" className="profile-image" src={partner.user_profile} />
      )}
        {/*<div className="frequency-text">Freq</div>*/}
      </div>
      <div className="main">
        <div className="event-info">
          <h3>{partner.user_first_name}</h3>
          <div className="text">
          </div>
        </div>
      <RandomCallsAcceptDenySelector partner={partner} />
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
    const navigate = useNavigate();
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
          }else if(["match_found"].includes(data.event)) {

            setState({...state, ...{ showOverlay: !state.showOverlay }});
            // TODO: we should dispatch an update to the past profile array
            // when we found a match we can easily redirect to the call screen which will handle the rest
            navigate(`${BACKEND_PATH}/call`, { state: { 
              userPk: data.match_hash, tracks: state.tracks, randomCallRoom: true
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

const Star = ({ marked, starId }) => {
  return (
    <span data-star-id={starId} className="star" role="button" style={{fontSize: '80px'}}>
      {marked ? '\u2605' : '\u2606'}
    </span>
  );
};

const StarRating = ({ value }) => {
  const [rating, setRating] = React.useState(parseInt(value) || 0);
  const [selection, setSelection] = React.useState(0);

  const hoverOver = event => {
    let val = 0;
    if (event && event.target && event.target.getAttribute('data-star-id'))
      val = event.target.getAttribute('data-star-id');
    setSelection(val);
  };
  return (
    <div
      onMouseOut={() => hoverOver(null)}
      onClick={e => setRating(e.target.getAttribute('data-star-id') || rating)}
      onMouseOver={hoverOver}
    >
      {Array.from({ length: 5 }, (v, i) => (
        <Star
          starId={i + 1}
          key={`star_${i + 1}`}
          marked={selection ? selection >= i + 1 : rating >= i + 1}
        />
      ))}
    </div>
  );
};

function AfterCallRoomOverlay({ state, setState, lastPastCallPartner }) {

    return <div className="overlay-shade">
        <div className="modal-box">
            <div className="content">
              <h3>{"How was your call?"}</h3>
            <div className="main">

              <div className="subtitle">{"Random calls are still in alpha please give us some swift feedback."}</div>
              <div className="sweet-loading">
                </div>
              <div className="stars">
                <StarRating value={3} />
              </div>
              <div className="text">{"Do you whish to share your profile with {{ name }}?\n It will only be shared it you both select yes."}</div>

            <div className="random-calls-past-call-match">
              <div className="main">
                <RandomCallsAcceptDenySelector partner={lastPastCallPartner} />
              </div>
            </div>
    
              <div className="buttons">
                <button type="button" className="save" onClick={() => {
                    setState({...state, ...{ showPastCallOverlay: !state.showPastCallOverlay }}); 
                }}>
                  {"Look for another random call"}
                </button>
                <button type="button" className="cancel" onClick={() => {
                    setState({...state, ...{ showPostCallOverlay: !state.showPostCallOverlay }});
                }}>
                  {"Back to dashboard"}
                </button>
              </div>
            </div>
        </div>
        </div>
    </div>
}

export function RandomCalls({setCallSetupPartner, randomCallState, setRandomCallState}) {

  const { t } = useTranslation();
  
  console.log("Random call state changed", randomCallState);
    
  const pastRandomCallMatches = useSelector((state) => state.userData.self.pastRandomCallMatches);
  const frontendState = useSelector((state) => state.userData.self.frontendState);

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
      {pastRandomCallMatches.map((partner) => {
        return <RandomCallsPastPartnerItem partner={partner}></RandomCallsPastPartnerItem>
      })}
      {/* We deliberately render this component *only* if it should be shown cause it will automaticly connect to the random call websocket */}
      {randomCallState.showOverlay && <WaitingRoomOverlay state={randomCallState} setState={setRandomCallState} />}
      {randomCallState.showPostCallOverlay && <AfterCallRoomOverlay state={randomCallState} setState={setRandomCallState} lastPastCallPartner={frontendState.lastRandomCallMatch}></AfterCallRoomOverlay>}
  </div>
  )
}