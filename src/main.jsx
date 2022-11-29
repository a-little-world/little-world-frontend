import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CallSetup, { IncomingCall } from "./call-setup";
import Chat from "./chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import "./i18n";
import Overlay from "./overlay";
import Link from "./path-prepend";
import Profile, { ProfileBox } from "./profile";
import Settings from "./settings";
import { removeActiveTracks } from "./twilio-helper";

import "./community-events.css";
import "./main.css";

function UnreadDot({ count }) {
  if (!count) {
    return false;
  }
  return <div className="unread-dot">{count}</div>;
}

function Sidebar({ sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttonData = [
    { label: "start", path: "/" },
    { label: "messages", path: "/chat" },
    { label: "notifications", path: "" },
    { label: "my_profile", path: "/profile" },
    { label: "help", path: "" },
    { label: "settings", path: "/settings" },
    {
      label: "log_out",
      clickEvent: () => {
        fetch(`${BACKEND_URL}/api2/logout/`, {
          method: "GET",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        })
          .then((response) => {
            if (response.status === 200) {
              navigate("/login/"); // Redirect only valid in production
              navigate(0); // to reload the page
            } else {
              console.error("server error", response.status, response.statusText);
            }
          })
          .catch((error) => console.error(error));
      },
    },
  ];

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  return (
    <>
      <div className={showSidebarMobile ? "sidebar" : "sidebar hidden"}>
        <div className="logos">
          <img alt="little" className="logo-image" />
          <img alt="little world" className="logo-text" />
        </div>
        {buttonData.map(({ label, path, clickEvent }) =>
          typeof clickEvent === typeof undefined ? (
            <Link
              to={path}
              key={label}
              className={`sidebar-item ${label}${
                location.pathname === `${BACKEND_PATH}${path}` ? " selected" : ""
              }`}
            >
              {["messages", "notifications"].includes(label) && <UnreadDot count="3" />}
              <img alt={label} />
              {t(`nbs_${label}`)}
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              onClick={clickEvent}
              className={`sidebar-item ${label}${
                location.pathname === `${BACKEND_PATH}${path}` ? " selected" : ""
              }`}
            >
              <img alt={label} />
              {t(`nbs_${label}`)}
            </button>
          )
        )}
      </div>
      <div className="mobile-shade" onClick={() => setShowSidebarMobile(false)} />
    </>
  );
}

function MobileNavBar({ setShowSidebarMobile }) {
  const location = useLocation();
  const { userPk } = location.state || {};
  const use =
    location.pathname.split("/").slice(-1)[0] || (userPk ? "user profile" : "little world");
  const nameExceptions = {
    chat: "messages",
    profile: "my profile",
  };

  return (
    <div className="mobile-header">
      <button type="button" className="menu" onClick={() => setShowSidebarMobile(true)}>
        <img alt="open menu" />
      </button>
      <div className="logo-with-text">
        <img className="logo-mobile" alt="" />
        <span className="logo-text">{nameExceptions[use] || use}</span>
      </div>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

function NbtSelector({ selection, setSelection, use }) {
  const { t } = useTranslation();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  const nbtTopics = {
    main: ["conversation_partners", "appointments", "community_calls"],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments", "community_calls"],
  };
  const disabled = nbtDisabled[use];

  return (
    <div className="selector">
      {topics.map((topic) => (
        <span className={topic} key={topic}>
          <input
            type="radio"
            id={`${topic}-radio`}
            value={topic}
            checked={selection === topic}
            name="sidebar"
            onChange={(e) => setSelection(e.target.value)}
          />
          <label htmlFor={`${topic}-radio`} className={disabled.includes(topic) ? "disabled" : ""}>
            {t(`nbt_${topic}`)}
          </label>
        </span>
      ))}
    </div>
  );
}

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates }) {
  const { t } = useTranslation();
  const [matchState, setMatchState] = useState("idle");
  const users = useSelector((state) => state.userData.users);

  // backend values
  const matchStatuses = {
    0: "idle",
    1: "searching",
    2: "pending",
    3: "confirmed",
  };

  // useEffect(() => {
  //   if (!userInfo.matching) {
  //     return;
  //   }
  //   const searchCode = userInfo.matching.state;
  //   setMatchState(matchStatuses[searchCode]);
  // }, [userInfo]);

  function updateUserMatchingState() {
    fetch(`${BACKEND_URL}/api2/user_state/`, {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ action: "update_user_state" }).toString(),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        console.error("server error", response.status, response.statusText);
        return false;
      })
      .then((response) => {
        if (response) {
          userInfo = response; // TODO: this should be updated another way
        }
      })
      .catch((error) => console.error(error));
  }
  return (
    <div className="profiles">
      {users
        .filter(({ type }) => type !== "self")
        .map((user) => {
          return (
            <ProfileBox
              key={user.userPk}
              {...user}
              setCallSetupPartner={setCallSetupPartner}
              isOnline={matchesOnlineStates[user.userPk]}
            />
          );
        })}
      {["idle", "confirmed"].includes(matchState) && (
        <button type="button" className="match-status find-new" onClick={updateUserMatchingState}>
          <img alt="plus" />
          {matchState === "idle" && t("matching_state_not_searching_trans")}
          {matchState === "confirmed" && t("matching_state_found_confirmed_trans")}
        </button>
      )}
      {["searching", "pending"].includes(matchState) && (
        <div className="match-status searching">
          <img alt="" />
          {matchState === "searching" && t("matching_state_searching_trans")}
          {matchState === "pending" && t("matching_state_found_unconfirmed_trans")}
          <a className="change-criteria" href="/form">
            {t("cp_modify_search")}
          </a>
        </div>
      )}
    </div>
  );
}

function CommunityEvent({ frequency, header, text, dateTime }) {
  const { t } = useTranslation();
  const two = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div className="community-event">
      <div className="frequency">
        <img alt="" />
        <div className="frequency-text">{frequency}</div>
      </div>
      <div className="main">
        <div className="event-info">
          <h3>{header}</h3>
          <div className="text">
            {text} <Link className="show-more">Show more</Link>
          </div>
        </div>
        <div className="buttons">
          <button type="button" className="appointment">
            <img alt="add appointment" />
            <span className="text">Termin hinzufügen</span>
          </button>
          <button type="button" className="call">
            <img alt="call" />
            <span className="text">Gespräch beitreten</span>
          </button>
        </div>
      </div>
      <div className="dateTime">
        {frequency === "weekly" && (
          <div className="weekday">{t(`weekdays.${dateTime.getDay()}`)}</div>
        )}
        {frequency === "once" && (
          <>
            <div className="date">{two(dateTime.getDate())}</div>
            <div className="month">{t(`month_short.${dateTime.getMonth()}`)}</div>
          </>
        )}
        <div className="time">{`${two(dateTime.getHours())}:${two(dateTime.getMinutes())}`}</div>
      </div>
    </div>
  );
}

function CommunityCalls() {
  const now = new Date();
  const dummyEvents = [
    {
      id: 23,
      frequency: "weekly",
      header: "Kaffeerunden",
      text: "Come Together of the community - Grab a coffee and talk to other users, share your delights and enjoy!",
      dateTime: now,
    },
    {
      id: 26,
      frequency: "once",
      header: "Willkommen! Zeit für Fragen",
      text: "Confused? Don’t worry, our team will happily answer all your questions! Just join the call.",
      dateTime: now,
    },
    {
      id: 29,
      frequency: "once",
      header: "Lach-Yoga",
      text: "Want to have a heartily laugh with the community?  Treat yourself something good and join us! It’s free!",
      dateTime: now,
    },
  ];

  return (
    <div className="community-calls">
      {dummyEvents.map((eventData) => (
        <CommunityEvent key={eventData.id} {...eventData} />
      ))}
    </div>
  );
}

function NotificationPanel() {
  const { t } = useTranslation();
  const users = useSelector((state) => state.userData.users);
  const activeUser = users.find(({ type }) => type === "self");
  const { avatarCfg, firstName, lastName, imgSrc } = activeUser;

  const dummyNotifications = [
    {
      id: 2347,
      type: "appointment",
      text: "Notifications will be added soon",
      dateString: "27th October, 2022 at 3:00pm",
      unixtime: 1666364400,
    },
  ];

  // don't show unless names are available; ie API call has returned
  if (!firstName) {
    return false;
  }

  return (
    <div className="notification-panel">
      <div className="active-user">
        {avatarCfg ? (
          <Avatar className="avatar" {...avatarCfg} />
        ) : (
          <img src={imgSrc} alt="current user" />
        )}
        <div className="name">{`${firstName} ${lastName}`}</div>
      </div>
      <hr />
      <div className="notifications-header">{t("nbr_notifications")}</div>
      <div className="notifications-content">
        {dummyNotifications.map(({ id, type, text, dateString }) => (
          <div key={id} className="notification-item">
            <img className={type.replace(" ", "-")} alt={type} />
            <div className="info">
              <div className="notification-headline">{text}</div>
              <div className="notification-time">{dateString}</div>
            </div>
          </div>
        ))}
      </div>
      <Link className="show-all">{t("nbr_show_all")}</Link>
    </div>
  );
}

function Main() {
  const location = useLocation();
  const { userPk } = location.state || {};
  const { t } = useTranslation();
  const [profileOptions, setProfileOptions] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [matchesProfiles, setMatchesProfiles] = useState({});

  const users = useSelector((state) => state.userData.users);
  const matchesInfo = users.filter(({ type }) => type !== "self");

  const [matchesUnconfirmed, setMatchesUnconfirmed] = useState([]);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);
  const [matchesOnlineStates, setMatchesOnlineStates] = useState({});
  const [userPkToChatIdMap, setUserPkToChatIdMap] = useState({});
  const navigate = useNavigate();

  const [overlayState, setOverlayState] = useState({
    visible: false,
    title: "None",
    name: "Lorem",
    test: "Lorem",
    userInfo: null,
  });

  const updateOverlayState = (unconfirmedMatches, matchesData, _matchesProfiles) => {
    console.log("mProfiles", matchesProfiles);
    if (unconfirmedMatches.length > 0) {
      setOverlayState({
        visible: true,
        title: t("matching_state_found_unconfirmed_trans"),
        name: _matchesProfiles[unconfirmedMatches[0].user_h256_pk].first_name,
        test: "Look at his profile now!",
        userInfo: matchesData.filter(
          (match) => match.userPk === unconfirmedMatches[0].user_h256_pk
        )[0],
      });
    } else {
      setOverlayState({
        visible: false,
        title: "None",
        name: "Lorem",
        test: "Lorem",
        userInfo: null,
      });
    }
  };

  const setCallSetupPartner = (userPk) => {
    document.body.style.overflow = userPk ? "hidden" : "";
    setCallSetupPartnerKey(userPk);
    if (!userPk) {
      removeActiveTracks();
    }
  };

  removeActiveTracks();

  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  document.body.classList.remove("hide-mobile-header");

  const use = location.pathname.split("/").slice(-1)[0] || (userPk ? "profile" : "main");

  const [topSelection, setTopSelection] = useState(null);
  useEffect(() => {
    if (use === "main") {
      setTopSelection("conversation_partners");
    }
    if (use === "help") {
      setTopSelection("contact");
    }
  }, [location]);

  const updateOnlineState = (userOnlinePk, status) => {
    matchesOnlineStates[userOnlinePk] = status;
    setMatchesOnlineStates({ ...matchesOnlineStates }); // spreading creates a copy if we use the same var state wont update
  };

  const adminActionCallback = (action) => {
    // This will later be moved to a whole new websocket
    // The new socket should then only receive messages from the backend
    // Current implementation allows all matches to send 'admin actions'
    // Although they are filtered this could with some modifications allow other users to send these callbacks to their matches.
    // This is not desirable ( see ISSUE #112 )
    console.log("Received Triggered admin callback", action);
    if (action.includes("reload")) {
      // Backend says frontend should reload the page
      navigate(BACKEND_PATH);
      navigate(0);
    } else if (action.includes("entered_call")) {
      const params = action.substring(action.indexOf("(") + 1, action.indexOf(")")).split(":");

      // Backend says a partner has entered the call
      console.log(`User ${params[1]} entered video call!`);
      setShowIncoming(true);
      setIncomingUserPk(params[1]);
    } else if (action.includes("exited_call")) {
      const params = action.substring(action.indexOf("(") + 1, action.indexOf(")")).split(":");
      // Backend says a partner has exited the call
      setShowIncoming(false);
      console.log(`User ${params[1]} left the video call!`);
    }
  };

  const initChatComponent = (
    <Chat
      showChat={use === "chat"}
      matchesInfo={matchesInfo}
      userPk={userPk}
      setCallSetupPartner={setCallSetupPartner}
      userPkMappingCallback={setUserPkToChatIdMap}
      updateMatchesOnlineStates={updateOnlineState}
      adminActionCallback={adminActionCallback}
    />
  );

  const [showIncoming, setShowIncoming] = useState(false);
  const [incomingUserPk, setIncomingUserPk] = useState(null);

  return (
    <div className={`main-page show-${use}`}>
      <Sidebar sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }} />
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          <NbtSelector selection={topSelection} setSelection={setTopSelection} use={use} />
        </div>
        {use === "main" && (
          <div className="content-area-main">
            {topSelection === "conversation_partners" && (
              <>
                <PartnerProfiles
                  setCallSetupPartner={setCallSetupPartner}
                  matchesOnlineStates={matchesOnlineStates}
                />
                <NotificationPanel />
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "chat" && initChatComponent}
        {use === "profile" && <Profile setCallSetupPartner={setCallSetupPartner} userPk={userPk} />}
        {use === "settings" && <Settings userData={userProfile} />}
      </div>
      <div className={callSetupPartner || showIncoming ? "overlay-shade" : "overlay-shade hidden"}>
        {callSetupPartner && (
          <CallSetup userPk={callSetupPartner} setCallSetupPartner={setCallSetupPartner} />
        )}
        {incomingUserPk && showIncoming && (
          <IncomingCall
            matchesInfo={matchesInfo}
            userPk={incomingUserPk}
            setVisible={setShowIncoming}
            setCallSetupPartner={setCallSetupPartner}
          />
        )}
      </div>
      <div className={overlayState.visible ? "overlay" : "overlay hidden"}>
        {overlayState.visible && (
          <Overlay
            title={overlayState.title}
            name={overlayState.name}
            text={overlayState.text}
            userInfo={overlayState.userInfo}
            onOk={() => {
              fetch(`${BACKEND_URL}/api2/unconfirmed_matches/`, {
                method: "POST",
                headers: {
                  "X-CSRFToken": Cookies.get("csrftoken"),
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  partner_h256_pk: overlayState.userInfo.userPk,
                }).toString(),
              })
                .then(({ status, statusText }) => {
                  if (status === 200) {
                    const newUnconfirmed = matchesUnconfirmed.filter(
                      (m) => m.user_h256_pk !== overlayState.userInfo.userPk
                    );
                    setMatchesUnconfirmed(newUnconfirmed);
                    updateOverlayState(newUnconfirmed, matchesInfo, matchesProfiles);
                  } else {
                    console.error("server error", status, statusText);
                  }
                })
                .catch((error) => console.error(error));
            }}
          />
        )}
      </div>
      {!(use === "chat") && <div className="disable-chat">{initChatComponent}</div>}
    </div>
  );
}

export default Main;
