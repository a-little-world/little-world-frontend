import $ from "jquery";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useLocation, useNavigate } from "react-router-dom";

import CallSetup from "./call-setup";
import Chat from "./chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import "./i18n";
import Overlay from "./overlay";
import Link from "./path-prepend";
import Profile, { ProfileBox } from "./profile";
import { removeActiveTracks } from "./twilio-helper";

import "./community-events.css";
import "./main.css";

function Sidebar({ userInfo, sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttonData = [
    { label: "start", path: "/" },
    { label: "messages", path: "/chat" },
    { label: "notifications", path: "" },
    { label: "my_profile", path: "/profile" },
    { label: "help", path: "" },
    { label: "settings", path: "" },
    {
      label: "log_out",
      clickEvent: () => {
        $.ajax({
          type: "GET",
          url: `${BACKEND_URL}/api2/logout/`,
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        }).then(() => {
          navigate("/login/"); // Redirect only valid in production
          navigate(0); // to reload the page
        });
      },
    },
  ];

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  return (
    <>
      <div className={showSidebarMobile ? "sidebar" : "sidebar hidden"}>
        <div className="active-user">
          {userInfo.usesAvatar ? (
            <Avatar className="avatar" {...userInfo.avatarConfig} />
          ) : (
            <img src={userInfo.imgSrc} alt="current user" />
          )}
          <div className="name">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
        </div>
        <img alt="little world" className="logo" />
        {buttonData.map(({ label, path, clickEvent }) =>
          typeof clickEvent === typeof undefined ? (
            <Link
              to={path}
              key={label}
              className={`sidebar-item ${label}${
                location.pathname === `${BACKEND_PATH}${path}` ? " selected" : ""
              }`}
            >
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
  return (
    <div className="mobile-header">
      <button type="button" className="menu" onClick={() => setShowSidebarMobile(true)}>
        <img alt="open menu" />
      </button>
      <div className="logo-with-text">
        <img className="logo-mobile" alt="" />
        <span className="logo-text">Little World</span>
      </div>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

function Selector({ selection, setSelection }) {
  const { t } = useTranslation();
  const nbtTopics = ["conversation_partners", "appointments", "community_calls"];
  const disabled = ["appointments"];

  return (
    <div className="selector">
      {nbtTopics.map((topic) => (
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

function PartnerProfiles({ userInfo, matchesInfo, setCallSetupPartner, matchesOnlineStates }) {
  const { t } = useTranslation();
  const [findNewText, setFindNewText] = useState("");
  useEffect(() => {
    const findNewTextInitial =
      userInfo.matching !== null
        ? t(
            userInfo.matching.choices.find((obj) => {
              return obj.value === userInfo.matching.state;
            }).display_name
          )
        : t("matching_state_not_searching_trans");
    setFindNewText(findNewTextInitial);
  }, [userInfo]);

  function updateUserMatchingState() {
    $.ajax({
      type: "POST",
      url: `${BACKEND_URL}/api2/user_state/`,
      headers: { "X-CSRFToken": Cookies.get("csrftoken") },
      data: {
        action: "update_user_state",
      },
      success: (resp) => {
        setFindNewText(
          t(
            userInfo.matching.choices.find((obj) => {
              return obj.value === resp.state.matching_state;
            }).display_name
          )
        );
      },
    });
  }
  return (
    <div className="profiles">
      {matchesInfo.map((userData) => {
        return (
          <ProfileBox
            key={userData.userPk}
            {...userData}
            setCallSetupPartner={setCallSetupPartner}
            isOnline={matchesOnlineStates[userData.userPk]}
          />
        );
      })}
      <button className="find-new" onClick={updateUserMatchingState}>
        <img alt="plus" />
        {findNewText}
      </button>
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

function NotificationPanel({ userInfo }) {
  const { t } = useTranslation();

  const dummyNotifications = [
    {
      id: 2347,
      type: "appointment",
      text: "new appoinment?",
      dateString: "27th October, 2022 at 3:00pm",
      unixtime: 1666364400,
    },
    {
      id: 2346,
      type: "new friend",
      text: "New friend: George McCoy",
      dateString: "27th October, 2022 at 3:00pm",
      unixtime: 1666364400,
    },
    {
      id: 1973,
      type: "missed call",
      text: "missed call",
      dateString: "You missed appointment",
      unixtime: 1640995200,
    },
  ];

  // don't show unless names are available; ie API call has returned
  if (!(userInfo.firstName && userInfo.lastName)) {
    return false;
  }

  return (
    <div className="notification-panel">
      <div className="active-user">
        {userInfo.usesAvatar ? (
          <Avatar className="avatar" {...userInfo.avatarConfig} />
        ) : (
          <img src={userInfo.imgSrc} alt="current user" />
        )}
        <div className="name">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
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
  const [matchesInfo, setMatchesInfo] = useState([]);
  const [matchesUnconfirmed, setMatchesUnconfirmed] = useState([]);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);
  const [matchesOnlineStates, setMatchesOnlineStates] = useState({});
  const [userPkToChatIdMap, setUserPkToChatIdMap] = useState({});
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    imgSrc: null,
    avatarConfig: null,
    usesAvatar: null,
    firstName: "",
    lastName: "",
    matching: null, // Holds the matching state of the user
  });

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

  useEffect(() => {
    $.ajax({
      type: "POST",
      url: `${BACKEND_URL}/api2/composite/`,
      headers: {
        // The cookies is optained when authenticating via `api2/login/`
        "X-CSRFToken": Cookies.get("csrftoken"), // the login_had sets this, see 'login-simulator.js'
      },
      data: {
        "composite-request": JSON.stringify([
          {
            spec: {
              type: "simple",
              ref: "_matchesBasic",
            },
            method: "GET",
            path: "api2/matches/",
          },
          {
            spec: {
              type: "simple",
              ref: "unconfirmedMatches",
            },
            method: "GET",
            path: "api2/unconfirmed_matches/", // TODO @tbscode yes i'll compine the matches and unconfirmed matches api :)
          },
          {
            spec: {
              type: "simple",
              ref: "userData",
            },
            method: ["GET", "OPTIONS"],
            path: "api2/profile/",
          },
          {
            spec: {
              type: "simple",
              ref: "userState", // State of the current user
            },
            method: ["GET", "OPTIONS"],
            path: "api2/user_state/",
          },
          {
            spec: {
              type: "foreach",
              in: "_matchesBasic",
              as: "match",
              ref: "matches",
            },
            method: "POST",
            path: "api2/profile_of/",
            body: {
              partner_h256_pk: "${match.user_h256_pk}", // eslint-disable-line no-template-curly-in-string
            },
          },
        ]),
      },
    }).then(
      ({
        _matchesBasic,
        unconfirmedMatches,
        userDataGET,
        userDataOPTIONS,
        userStateGET,
        userStateOPTIONS,
        matches,
      }) => {
        let avatarConfig = null; // dummyAvatarConfig;
        let usesAvatar = false;
        try {
          avatarConfig = JSON.parse(userDataGET.profile_avatar);
          usesAvatar = userDataGET.profile_image_type === 0;
        } catch (error) {
          usesAvatar = false;
        }
        // If possibel load the avatar config json
        setProfileOptions(userDataOPTIONS.actions.POST);
        setUserProfile(userDataGET);
        setUserInfo({
          // userPk:
          firstName: userDataGET.first_name,
          lastName: userDataGET.second_name,
          // userDescription:
          imgSrc: userDataGET.profile_image,
          usesAvatar,
          avatarConfig,
          matching: {
            state: userStateGET.matching_state, // state of user matching
            choices: userStateOPTIONS.actions.POST.matching_state.choices, // what states are possible
          },
        });

        const matchesProfilesTmp = {};
        const matchesOnlineStatesTmp = {};
        matches.forEach((m) => {
          matchesProfilesTmp[m["match.user_h256_pk"]] = m;
          matchesOnlineStatesTmp[m["match.user_h256_pk"]] = false;
        });
        setMatchesProfiles(matchesProfilesTmp);
        setMatchesOnlineStates(matchesOnlineStatesTmp);

        const matchesData = matches.map((match) => {
          avatarConfig = null; // dummyAvatarConfig;
          usesAvatar = false;
          try {
            avatarConfig = JSON.parse(match.profile_avatar);
            usesAvatar = match.profile_image_type === 0;
          } catch (error) {
            usesAvatar = false;
          }
          return {
            userPk: match["match.user_h256_pk"],
            firstName: match.first_name,
            lastName: match.second_name,
            userDescription: match.description,
            userType: match.user_type,
            // If this match has been confirmed ( acknowleged )
            isConfirmed:
              unconfirmedMatches.filter((m) => m.user_h256_pk === match["match.user_h256_pk"])
                .length === 0,
            usesAvatar,
            avatarConfig,
            imgSrc: match.profile_image,
          };
        });
        setMatchesInfo(matchesData);
        setMatchesUnconfirmed(unconfirmedMatches);
        updateOverlayState(unconfirmedMatches, matchesData, matchesProfilesTmp);
      }
    );
  }, []);

  const [topSelection, setTopSelection] = useState("conversation_partners");

  document.body.classList.remove("hide-mobile-header");

  const use = location.pathname.split("/").slice(-1)[0] || (userPk ? "profile" : "main");
  const profileToDispay = userPk ? matchesProfiles[userPk] : userProfile;

  const updateOnlineState = (userOnlinePk, status) => {
    matchesOnlineStates[userOnlinePk] = status;
    setMatchesOnlineStates({ ...matchesOnlineStates }); // spreading creates a copy if we use the same var state wont update
  };

  const adminActionCallback = (action) => {
    console.log("Received Triggered admin callback", action);
    if (action.includes("reload")) {
      navigate(BACKEND_PATH);
      navigate(0);
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

  return (
    <div className={`main-page show-${use}`}>
      <Sidebar
        userInfo={userInfo}
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          <Selector selection={topSelection} setSelection={setTopSelection} />
        </div>
        {use === "main" && (
          <div className="content-area-main">
            {topSelection === "conversation_partners" && (
              <>
                <PartnerProfiles
                  userInfo={userInfo}
                  matchesInfo={matchesInfo.filter(({ userType }) => userType === 0)}
                  setCallSetupPartner={setCallSetupPartner}
                  matchesOnlineStates={matchesOnlineStates}
                />
                <NotificationPanel userInfo={userInfo} />
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "profile" && (
          <Profile
            matchesInfo={matchesInfo}
            userInfo={userInfo}
            setCallSetupPartner={setCallSetupPartner}
            profileOptions={profileOptions}
            profile={profileToDispay}
          />
        )}
        {use === "chat" && initChatComponent}
      </div>
      <div className={callSetupPartner ? "call-setup-overlay" : "call-setup-overlay hidden"}>
        {callSetupPartner && (
          <CallSetup userPk={callSetupPartner} setCallSetupPartner={setCallSetupPartner} />
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
              $.ajax({
                type: "POST",
                url: `${BACKEND_URL}/api2/unconfirmed_matches/`,
                headers: {
                  "X-CSRFToken": Cookies.get("csrftoken"),
                },
                data: {
                  partner_h256_pk: overlayState.userInfo.userPk,
                },
                success: () => {
                  const newUnconfirmed = matchesUnconfirmed.filter(
                    (m) => m.user_h256_pk !== overlayState.userInfo.userPk
                  );
                  setMatchesUnconfirmed(newUnconfirmed);
                  updateOverlayState(newUnconfirmed, matchesInfo, matchesProfiles);
                },
                error: (e) => {
                  console.log(e);
                },
              });
            }}
          />
        )}
      </div>
      {!(use === "chat") && <div style={{ visibility: "hidden" }}>{initChatComponent}</div>}
    </div>
  );
}

export default Main;
