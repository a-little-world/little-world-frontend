import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CallSetup, { IncomingCall } from "./call-setup";
import Chat from "./chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import { FetchNotificationsAsync, updateSearching } from "./features/userData";
import Help from "./help";
import "./i18n";
import Notifications from "./notifications";
import Overlay from "./overlay";
import { MatchConfirmOverlay } from "./overlay";
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
  const self = useSelector((state) => state.userData.self);

  const buttonData = [
    { label: "start", path: "/" },
    { label: "messages", path: "/chat" },
    { label: "notifications", path: "" }, // "/notifications" },
    { label: "my_profile", path: "/profile" },
    { label: "help", path: "/help" },
    { label: "settings", path: "/settings" },
    {
      label: "log_out",
      clickEvent: () => {
        fetch(`${BACKEND_URL}/api/user/logout/`, {
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

  if (self.isAdmin) {
    buttonData.push({
      label: "admin_panel",
      clickEvent: () => {
        navigate("/admin/"); // Redirect only valid in production
        navigate(0); // to reload the page
      },
    });
  }

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  const notifications = useSelector((state) => state.userData.notifications);

  const unread = {
    notifications: notifications.filter(({ status }) => status === "unread"),
    messages: [],
  };
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FetchNotificationsAsync({ pageNumber: 1, itemPerPage: 20 }));
  }, []);

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
              {["messages", "notifications"].includes(label) && (
                <UnreadDot count={unread[label].length} />
              )}
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
  // else  return <h1>no notifications</h1>
}

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userPk } = location.state || {};
  const key = location.pathname.split("/").slice(-1)[0] || (userPk ? "user" : "home");

  return (
    <div className="mobile-header">
      <button type="button" className="menu" onClick={() => setShowSidebarMobile(true)}>
        <img alt="open menu" />
      </button>
      <div className="logo-with-text">
        <img className="logo-mobile" alt="" />
        <span className="logo-text">{t(`headers::${key}`)}</span>
      </div>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

function NbtSelectorAdmin({ selection, setSelection, use, adminInfos }) {
  const { t } = useTranslation();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  console.log("ADMIN INFOS", adminInfos);

  const pagesMatches = [...Array(adminInfos.num_pages).keys()].map((x) => x + 1);
  const defaultSelectors = {
    main: ["conversation_partners", "appointments", "community_calls"],
    help: ["videos", "faqs", "contact"],
  }

  const nbtTopics = {
    main: [...defaultSelectors[use], ...pagesMatches],
    help: ["videos", "faqs", "contact"],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments"],
    help: ["videos"]
  };
  const disabled = nbtDisabled[use];

  const updateSelection = (e) => {
    const v = e.target.value;
    if (defaultSelectors[use].includes(v)) {
      setSelection(v);
    } else {
      // Then reload the page with ?page=x
      const url = window.location.href;
      const parser = new URL(url || window.location);
      parser.searchParams.set("page", v);
      window.location = parser.href;
    }
  };

  return (
    <div className="selector">
      {topics.map((topic) => (
        <span className={topic} key={topic}>
          <input
            type="radio"
            id={`${topic}-radio`}
            value={topic}
            checked={selection === topic || `${adminInfos.page}-radio` === `${topic}-radio`}
            name="sidebar"
            onChange={(e) => updateSelection(e)}
          />
          <label htmlFor={`${topic}-radio`} className={disabled.includes(topic) ? "disabled" : ""}>
            {defaultSelectors[use].includes(topic) ? t(`nbt_${topic}`) : topic}
          </label>
        </span>
      ))}
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
    help: ["videos", "faqs", "contact"],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments"],
    help: ["videos"],
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
          <label
            htmlFor={`${topic}-radio`}
            className={disabled && disabled.includes(topic) ? "disabled" : ""}
          >
            {t(`nbt_${topic}`)}
          </label>
        </span>
      ))}
    </div>
  );
}

function UnmatchModal({ user, setShow }) {
  const { t } = useTranslation();
  const [showContent, setShowContent] = useState("selector");

  const { imgSrc, firstName, lastName, avatarCfg } = user;

  const submitReport = (e) => {
    console.log(e);
    setShowContent("reported");
  };
  const submitUnmatch = () => {
    setShowContent("unmatched");
  };

  const selector = (
    <>
      {avatarCfg ? (
        <Avatar className="profile-avatar" {...avatarCfg} />
      ) : (
        <img alt="user to unmatch" className="profile-image" src={imgSrc} />
      )}
      <div className="name">
        {firstName} {lastName}
      </div>
      <div className="buttons">
        <button type="button" onClick={() => setShowContent("unmatch")}>
          {t("ur_unmatch")}
        </button>
        <div className="btn-detail">{t("ur_btn_unmatch_text")}</div>
        <button type="button" onClick={() => setShowContent("report")}>
          {t("ur_report")}
        </button>
        <div className="btn-detail">{t("ur_btn_report_text")}</div>
        <button type="button" className="cancel" onClick={() => setShow(false)}>
          {t("btn_cancel")}
        </button>
      </div>
    </>
  );

  // disables the submit report button until it meets the required length
  // feature disabled for now, needs at least an indicator of required length
  const [submitState, setSubmitState] = useState("");
  const textRef = useRef();
  const onKeyUp = () => {
    // const validForm = textRef.current.value.length > 9;
    // setSubmitState(validForm ? "active" : "disabled");
  };

  const report = (
    <>
      <label htmlFor="report">
        {t("ur_report_label", { name: firstName })}
        <textarea
          ref={textRef}
          onKeyUp={onKeyUp}
          className={submitState === "waiting" ? "disabled" : ""}
          type="textarea"
          name="report"
          inputMode="text"
          maxLength="999"
          placeholder={t("ur_report_placeholder")}
        />
      </label>
      <div className="buttons">
        <button type="button" onClick={submitReport} className={submitState}>
          {t("ur_report")}
        </button>
        <button type="button" className="cancel" onClick={() => setShow(false)}>
          {t("btn_cancel")}
        </button>
      </div>
    </>
  );

  const unmatch = (
    <>
      <img className="unmatched" alt="" />
      <div className="unconfirm-question">{t("ur_confirm_unmatch_line1", { name: firstName })}</div>
      <div className="extra-text">{t("ur_confirm_unmatch_line2")}</div>
      <div className="buttons">
        <button type="button" onClick={submitUnmatch}>
          {t("ur_unmatch")}
        </button>
        <button type="button" className="cancel" onClick={() => setShow(false)}>
          {t("btn_cancel")}
        </button>
      </div>
    </>
  );

  const unmatched = (
    <>
      <div className="main-text">{t("ur_unmatched", { name: firstName })}</div>
      <div className="buttons">
        <button type="button" className="cancel" onClick={() => setShow(false)}>
          {t("close")}
        </button>
      </div>
    </>
  );

  const reported = (
    <>
      <div>{t("ur_reported_line1", { name: firstName })}</div>
      <div className="extra-text">{t("ur_reported_line2")}</div>
      <div className="buttons">
        <button type="button" className="cancel" onClick={() => setShow(false)}>
          {t("close")}
        </button>
      </div>
    </>
  );

  const content = {
    selector,
    unmatch,
    report,
    unmatched,
    reported,
  };

  const header = {
    selector: "ur_header",
    unmatch: "ur_unmatch",
    report: "ur_report",
    unmatched: "ur_unmatch",
    reported: "ur_report",
  };

  return (
    <div className="modal-box unmatch-modal">
      <button type="button" className="modal-close" onClick={() => setShow(false)} />
      <h3>{t(header[showContent])}</h3>
      {content[showContent]}
    </div>
  );
}

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates, setShowCancel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const users = useSelector((state) => state.userData.users);
  const matchState = useSelector((state) => state.userData.self.stateInfo.matchingState);

  function updateUserMatchingState() {
    const updatedState = "searching";
    fetch(`${BACKEND_URL}/api/user/search_state/${updatedState}`, {
      method: "POST",
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
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
          // If this request works, we can safely update our state to 'searching'
          dispatch(updateSearching(updatedState));
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
      {["idle"].includes(matchState) && (
        <button type="button" className="match-status find-new" onClick={updateUserMatchingState}>
          <img alt="plus" />
          {matchState === "idle" && t("matching_state_not_searching_trans")}
          {/* matchState === "confirmed" && t("matching_state_found_confirmed_trans") */}
        </button>
      )}
      {["searching"].includes(matchState) && (
        <div className="match-status searching">
          <img alt="" />
          {matchState === "searching" && t("matching_state_searching_trans")}
          {/* matchState === "pending" && t("matching_state_found_unconfirmed_trans") */}
          <a className="change-criteria" href="/form">
            {t("cp_modify_search")}
          </a>
          <button className="cancel-search" type="button" onClick={() => setShowCancel(true)}>
            {t("cp_cancel_search")}
          </button>
        </div>
      )}
    </div>
  );
}

const changeSearchState = (updatedState) => {
  return fetch(`${BACKEND_URL}/api/user/search_state/${updatedState}`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });
};

function CancelSearching({ setShowCancel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const undoSearching = () => {
    changeSearchState("idle").then(({ status, statusText }) => {
      if (status === 200) {
        dispatch(updateSearching("idle"));
        setShowCancel(false);
      } else {
        console.error(`Cancelling match searching failed with error ${status}: ${statusText}`);
      }
    });
  };

  return (
    <div className="modal-box">
      <button type="button" className="modal-close" onClick={() => setShowCancel(false)} />
      <div className="content">
        <div className="message-text">{t("cp_cancel_search_confirm")}</div>
        <div className="buttons">
          <button type="button" className="confirm" onClick={undoSearching}>
            {t("cp_cancel_search")}
          </button>
          <button type="button" className="cancel" onClick={() => setShowCancel(false)}>
            {t("cp_cancel_search_reject")}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  console.log("EVENTS", events);

  const now = new Date();

  return (
    <div className="community-calls">
      {events.map((eventData) => (
        <CommunityEvent key={eventData.id} {...eventData} />
      ))}
    </div>
  );
}

function MatchConfirmOverlayComponent({ visible, userData }) {
  /** 
   * Matches now need to be confirmed!
   * This overlay is shown when a match is found and needs to be confirmed.
  
  */
  const navigate = useNavigate();
  console.log("USERDATA", userData);
  const { t } = useTranslation();
  const confirmMatch = ({acceptDeny}) => {
      fetch(`${BACKEND_URL}/api/user/match/confirm_deny/`, {
        headers: {
          "X-CSRFToken": Cookies.get("csrftoken"),
          "X-UseTagsOnly": true,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        method: 'POST',
        body: JSON.stringify({
          unconfirmed_match_hash: userData.hash,
          confirm: acceptDeny,
        })
      }).then((res) => {
        if(res.ok){
          res.json().then((data) => {
            console.log("DATA", data);
            // TODO: for now we just reload the page but this should normally trigger a redux action
            navigate(BACKEND_PATH);
            navigate(0);
          })
        }else{
          // TODO: same goes here, this *should* trigger a redux action, rather than a reload
          navigate(BACKEND_PATH);
          navigate(0);
        }
      })
  };

  return <MatchConfirmOverlay
    title={t('confirm_match_overlay_title')}
    name={t('confirm_match_overlay_title')}
    text={t('confirm_match_overlay_title')}
    userInfo={userData}
    onOk={() => {
      confirmMatch({acceptDeny: true });
    }}
    onExit={() => {
      confirmMatch({acceptDeny: false });
    }}
    ></MatchConfirmOverlay>
;
}

function NotificationPanel() {
  const { t } = useTranslation();
  const users = useSelector((state) => state.userData.users);
  const activeUser = users.find(({ type }) => type === "self");
  const { usesAvatar, avatarCfg, firstName, lastName, imgSrc } = activeUser;
  const notifications = useSelector((state) => state.userData.notifications);
  // don't show unless names are available; ie API call has returned
  if (!firstName) {
    return false;
  }

  return (
    <div className="notification-panel">
      <div className="active-user">
        {usesAvatar ? (
          <Avatar className="avatar" {...avatarCfg} />
        ) : (
          <img src={imgSrc} alt="current user" />
        )}
        <div className="name">{`${firstName} ${lastName}`}</div>
      </div>
      <hr />
      <div className="notifications-header">{t("nbr_notifications")}</div>
      <div className="notifications-content">
        {notifications.map(({ hash, type, title, created_at }) => (
          <div key={hash} className="notification-item">
            <img className="appointment" alt={type} />
            <div className="info">
              <div className="notification-headline">{title}</div>
              <div className="notification-time">{created_at}</div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/notifications" className="show-all">
        {t("nbr_show_all")}
      </Link>
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
  const initalUnconfirmedMatches = useSelector(
    (state) => state.userData.self.stateInfo.unconfirmedMatches
  );

  const initalPreMatches = useSelector(
    (state) => state.userData.self.stateInfo.preMatches
  );

  const self = useSelector((state) => state.userData.self);

  const matchesInfo = users.filter(({ type }) => type !== "self");

  const [matchesUnconfirmed, setMatchesUnconfirmed] = useState(initalUnconfirmedMatches);
  const [preMatches, setPreMatches] = useState(initalPreMatches);

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);
  const [matchesOnlineStates, setMatchesOnlineStates] = useState({});
  const [userPkToChatIdMap, setUserPkToChatIdMap] = useState({});
  const navigate = useNavigate();

  const updateOverlayState = (inlUnconfirmedMatches) => {
    const hasUnconfirmedMatches = inlUnconfirmedMatches.length > 0;
    if (!hasUnconfirmedMatches)
      return {
        visible: false,
        title: "None",
        name: "Lorem",
        test: "Lorem",
        userInfo: null,
      };

    const firstUnconfimed = matchesInfo.filter((m) => m.userPk === inlUnconfirmedMatches[0])[0];

    return {
      visible: true,
      title: t("matching_state_found_unconfirmed_trans"),
      name: firstUnconfimed.firstName,
      test: "Look at his profile now!",
      userInfo: firstUnconfimed,
    };
  };

  const [overlayState, setOverlayState] = useState(updateOverlayState(initalUnconfirmedMatches));

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

  const initChatComponent = (backgroundMode) => {
    return <Chat
      backgroundMode={backgroundMode}
      showChat={use === "chat"}
      matchesInfo={matchesInfo}
      userPk={userPk}
      setCallSetupPartner={setCallSetupPartner}
      userPkMappingCallback={setUserPkToChatIdMap}
      updateMatchesOnlineStates={updateOnlineState}
      adminActionCallback={adminActionCallback}
    />
  }

  const [showCancelSearching, setShowCancelSearching] = useState(false);

  const [showIncoming, setShowIncoming] = useState(false);
  const [incomingUserPk, setIncomingUserPk] = useState(null);

  return (
    <div className={`main-page show-${use}`}>
      <Sidebar sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }} />
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          {!self.isAdmin ? (
            <NbtSelector selection={topSelection} setSelection={setTopSelection} use={use} />
          ) : (
            <NbtSelectorAdmin
              selection={topSelection}
              setSelection={setTopSelection}
              use={use}
              adminInfos={self.adminInfos}
            />
          )}
        </div>
        {use === "main" && (
          <div className="content-area-main">
            {topSelection === "conversation_partners" && (
              <>
                <PartnerProfiles
                  setCallSetupPartner={setCallSetupPartner}
                  matchesOnlineStates={matchesOnlineStates}
                  setShowCancel={setShowCancelSearching}
                />
                <NotificationPanel />
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "chat" && initChatComponent(false)}
        {use === "notifications" && <Notifications />}
        {use === "profile" && <Profile setCallSetupPartner={setCallSetupPartner} userPk={userPk} />}
        {use === "help" && <Help selection={topSelection} />}
        {use === "settings" && <Settings userData={userProfile} />}
      </div>
      <div
        className={
          callSetupPartner || showIncoming || showCancelSearching
            ? "overlay-shade"
            : "overlay-shade hidden"
        }
      >
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
        {showCancelSearching && <CancelSearching setShowCancel={setShowCancelSearching} />}
      </div>
      { preMatches.length > 0 && <div className={"overlay"}>
          <MatchConfirmOverlayComponent visible={true} userData={preMatches[0]}></MatchConfirmOverlayComponent>
      </div>}
      <div className={overlayState.visible ? "overlay" : "overlay hidden"}>
        {overlayState.visible && (
          <Overlay
            title={overlayState.title}
            name={overlayState.name}
            text={overlayState.text}
            userInfo={overlayState.userInfo}
            onOk={() => {
              fetch(`${BACKEND_URL}/api/user/confirm_match/`, {
                /* TODO is incuded in main frontend data now! */
                method: "POST",
                headers: {
                  "X-CSRFToken": Cookies.get("csrftoken"),
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "X-UseTagsOnly": true,
                },
                body: JSON.stringify({ matches: [overlayState.userInfo.userPk] }),
              })
                .then(({ status, statusText }) => {
                  if (status === 200) {
                    console.log("Confirming", overlayState.userInfo, matchesUnconfirmed);
                    const newUnconfirmed = [];
                    matchesUnconfirmed.forEach((e) => {
                      console.log("UNK", e, overlayState.userInfo.userOnlinePk);
                      if (e !== overlayState.userInfo.userPk) newUnconfirmed.push(e);
                    });
                    console.log("NEW unconfirmed", newUnconfirmed);
                    setMatchesUnconfirmed(newUnconfirmed);
                    setOverlayState(updateOverlayState(newUnconfirmed));
                  } else {
                    console.error("server error", status, statusText);
                  }
                })
                .catch((error) => console.error(error));
            }}
          />
        )}
      </div>
      {!(use === "chat") && <div className="disable-chat">{initChatComponent(true)}</div>}
    </div>
  );
}

export default Main;
