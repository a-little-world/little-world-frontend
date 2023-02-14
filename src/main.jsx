import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import CallSetup, { IncomingCall } from "@/call-setup";
import Chat from "@/chat/chat-full-view";
import { BACKEND_PATH, BACKEND_URL } from "@/ENVIRONMENT";
import Help from "@/help";
import "@/i18n";
import Notifications from "@/notifications";
import Overlay from "@/overlay";
import Link from "@/components/Link/path-prepend";
import Profile from "@/profile";
import Settings from "@/settings";
import { removeActiveTracks } from "@/twilio-helper";

import "@/community-events.css";
import "@/main.css";
import NotificationPanel from "@/components/NotificationPanel/notification-panel";
import Sidebar from '@/components/Sidebar/sidebar'
import MobileNavBar from "@/components/MobileNavbar/mobile-navbar";
import PartnerProfiles from '@/components/PartnerProfiles/partner-profiles';
import CommunityCalls from "@/pages/CommunityCalls/community-calls"; 



function NbtSelectorAdmin({ selection, setSelection, use, adminInfos }) {
  const { t } = useTranslation();
  if (!["main", "help"].includes(use)) {
    return null;
  }

  console.log("ADMIN INFOS", adminInfos);

  const pagesMatches = [...Array(adminInfos.num_pages).keys()].map((x) => x + 1);
  const defaultSelectors = ["conversation_partners", "appointments", "community_calls"];

  const nbtTopics = {
    main: [...defaultSelectors, ...pagesMatches],
  };
  const topics = nbtTopics[use];

  const nbtDisabled = {
    main: ["appointments"],
  };
  const disabled = nbtDisabled[use];

  const updateSelection = (e) => {
    const v = e.target.value;
    if (defaultSelectors.includes(v)) {
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
            {defaultSelectors.includes(topic) ? t(`nbt_${topic}`) : topic}
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
    help: ["videos", "faqs"]
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
                    {console.log('topic',disabled)}

          <label htmlFor={`${topic}-radio`} className={disabled&&disabled.includes(topic) ? "disabled" : ""}>
            {t(`nbt_${topic}`)}
          </label>
        </span>
      ))}
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

  const self = useSelector((state) => state.userData.self);

  const matchesInfo = users.filter(({ type }) => type !== "self");

  const [matchesUnconfirmed, setMatchesUnconfirmed] = useState(initalUnconfirmedMatches);
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
                />
                <NotificationPanel />
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "chat" && initChatComponent}
        {use === "notifications" && <Notifications />}
        {use === "profile" && <Profile setCallSetupPartner={setCallSetupPartner} userPk={userPk} />}
        {use === "help" && <Help selection={topSelection} />}
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
      {!(use === "chat") && <div className="disable-chat">{initChatComponent}</div>}
    </div>
  );
}

export default Main;