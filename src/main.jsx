import { Modal } from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { partiallyConfirmMatch } from "./api";
import CallSetup, { IncomingCall } from "./call-setup";
import Chat from "./chat/chat-full-view";
import CancelSearching from "./components/blocks/CancelSearching";
import CommunityCalls from "./components/blocks/CommunityCalls";
import ConfirmMatchCard from "./components/blocks/ConfirmMatchCard";
import MobileNavBar from "./components/blocks/MobileNavBar";
import NbtSelector from "./components/blocks/NbtSelector";
import NbtSelectorAdmin from "./components/blocks/NbtSelectorAdmin";
import NewMatchCard from "./components/blocks/NewMatchCard";
import NotificationPanel from "./components/blocks/NotificationPanel";
import PartnerProfiles from "./components/blocks/PartnerProfiles";
import Sidebar from "./components/blocks/Sidebar";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { setUsers } from "./features/userData";
import Help from "./help";
import "./i18n";
import Notifications from "./notifications";
import Profile from "./profile";
import Settings from "./settings";
import { removeActiveTracks } from "./twilio-helper";

import "./community-events.css";
import "./main.css";

function getMatchCardComponent({
  isVolunteer,
  onConfirm,
  onPartialConfirm,
  showNewMatch,
  userData,
}) {
  return showNewMatch ? (
    <NewMatchCard
      name={userData.first_name}
      imageType={userData.image_type}
      image={userData.avatar_image}
      onExit={() => {
        if (isVolunteer) {
          confirmMatch({ userHash: userData?.hash })
            .then(onConfirm)
            .catch((error) => console.error(error));
        } else {
          onConfirm({ status: 200 });
        }
      }}
    />
  ) : (
    <ConfirmMatchCard
      name={userData.first_name}
      imageType={userData.image_type}
      image={userData.avatar_image}
      onConfirm={() => {
        partiallyConfirmMatch({ acceptDeny: true, userHash: userData?.hash }).then((res) => {
          if (res.ok) {
            res.json().then(() => {
              onPartialConfirm(userData);
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onExit={() => {
        partiallyConfirmMatch({ acceptDeny: false, userHash: userData?.hash }).then((res) => {
          if (res.ok) {
            res.json().then(() => {
              onPartialConfirm();
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
    />
  );
}

function Main() {
  const location = useLocation();
  const { userPk } = location.state || {};
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState(null);

  const users = useSelector((state) => state.userData.users);

  const initalPreMatches = useSelector((state) => state.userData.self.stateInfo.preMatches);
  const matchesInfo = users.filter(({ type }) => type !== "self");

  const initialPartiallyConfirmedMatches = useSelector((state) =>
    matchesInfo.find(
      (match) => match?.userPk === state.userData.self?.stateInfo?.unconfirmedMatches?.[0]
    )
  );

  const self = useSelector((state) => state.userData.self);

  const [preMatches, setPreMatches] = useState(initalPreMatches);
  const [partiallyConfirmedMatches, setPartiallyConfirmedMatches] = useState(
    initialPartiallyConfirmedMatches ? [initialPartiallyConfirmedMatches] : []
  );

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);
  const [matchesOnlineStates, setMatchesOnlineStates] = useState({});
  const [userPkToChatIdMap, setUserPkToChatIdMap] = useState({});
  const navigate = useNavigate();

  const onConfirm = ({ status, statusText }) => {
    if (status === 200) {
      setPartiallyConfirmedMatches([]);
    } else {
      console.error("server error", status, statusText);
    }
  };

  const onPartialConfirm = (match) => {
    // TODO this should come from the successful response
    setPreMatches([]);
    if (match) {
      setPartiallyConfirmedMatches([match]);
      dispatch(
        setUsers({
          userPk: match.user_hash,
          firstName: match.first_name,
          lastName: "",
          imgSrc: match.avatar_image,
          avatarCfg: match.avatar_image,
          usesAvatar: match.image_type === "avatar",
          description: "",
          type: "match",
          extraInfo: {
            about: "",
            interestTopics: [],
            extraTopics: "",
            expectations: "",
          },
        })
      );
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
    if (action.includes("reload")) {
      // Backend says frontend should reload the page
      navigate(BACKEND_PATH);
      navigate(0);
    } else if (action.includes("entered_call")) {
      const params = action.substring(action.indexOf("(") + 1, action.indexOf(")")).split(":");

      // Backend says a partner has entered the call
      setShowIncoming(true);
      setIncomingUserPk(params[1]);
    } else if (action.includes("exited_call")) {
      const params = action.substring(action.indexOf("(") + 1, action.indexOf(")")).split(":");
      // Backend says a partner has exited the call
      setShowIncoming(false);
    }
  };

  const initChatComponent = (backgroundMode) => {
    return (
      <Chat
        backgroundMode={backgroundMode}
        showChat={use === "chat"}
        matchesInfo={matchesInfo}
        userPk={userPk}
        setCallSetupPartner={setCallSetupPartner}
        userPkMappingCallback={setUserPkToChatIdMap}
        updateMatchesOnlineStates={updateOnlineState}
        adminActionCallback={adminActionCallback}
      />
    );
  };

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
      <Modal open={preMatches?.length || partiallyConfirmedMatches?.length} locked={false}>
        {(preMatches?.length || partiallyConfirmedMatches?.length) &&
          getMatchCardComponent({
            isVolunteer: self.userType === "volunteer",
            onConfirm,
            onPartialConfirm,
            showNewMatch: Boolean(!preMatches?.length),
            userData: preMatches?.length ? preMatches[0] : partiallyConfirmedMatches[0],
          })}
      </Modal>
      {!(use === "chat") && <div className="disable-chat">{initChatComponent(true)}</div>}
    </div>
  );
}

export default Main;
