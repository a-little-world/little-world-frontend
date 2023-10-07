import { Modal } from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { confirmMatch, partiallyConfirmMatch } from "./api";
import CallSetup, { IncomingCall } from "./call-setup";
import Chat from "./chat/chat-full-view";
import CancelSearching from "./components/blocks/CancelSearching";
import CommunityCalls from "./components/blocks/CommunityCalls";
import ConfirmMatchCard from "./components/blocks/ConfirmMatchCard";
import Layout from "./components/blocks/Layout/Layout";
import MobileNavBar from "./components/blocks/MobileNavBar";
import NbtSelector from "./components/blocks/NbtSelector";
import NbtSelectorAdmin from "./components/blocks/NbtSelectorAdmin";
import NewMatchCard from "./components/blocks/NewMatchCard";
import NotificationPanel from "./components/blocks/NotificationPanel";
import PartnerProfiles from "./components/blocks/PartnerProfiles";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { addUnconfirmed, removePreMatch, setUsers } from "./features/userData";
import Help from "./help";
import "./i18n";
import Notifications from "./notifications";
import Profile from "./profile";
import Settings from "./settings";
import { removeActiveTracks } from "./twilio-helper";

import "./community-events.css";
import "./main.css";

function getMatchCardComponent({ onConfirm, onPartialConfirm, showNewMatch, userData }) {
  return showNewMatch ? (
    <NewMatchCard
      name={userData.firstName}
      imageType={userData.usesAvatar ? "avatar" : "image"}
      image={userData.usesAvatar ? userData.avatarCfg : userData.imgSrc}
      onExit={() => {
        confirmMatch({ userHash: userData?.userPk })
          .then(onConfirm)
          .then(() => {})
          .catch((error) => console.error(error));
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
            res.json().then((data) => {
              // The user_data hash incase of a 'partial confirm will be the matching hash!
              onPartialConfirm(userData.hash, data.match);
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({ acceptDeny: false, userHash: userData?.hash }).then((res) => {
          if (res.ok) {
            res.json().then(() => {});
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onExit={() => {
        onPartialConfirm();
      }}
    />
  );
}

const userDataDefaultTransform = (data) => {
  return {
    userPk: data.user.hash,
    firstName: data.profile.first_name,
    lastName: "",
    imgSrc: data.profile.image,
    avatarCfg: data.profile.avatar_config,
    usesAvatar: data.profile.image_type === "avatar",
    description: data.profile.description,
    type: "match",
    extraInfo: {
      about: data.profile.description,
      interestTopics: data.profile.interests,
      extraTopics: data.profile.additional_interests,
      expectations: data.profile.language_skill_description,
    },
  };
};

function Main() {
  const location = useLocation();
  const { userPk } = location.state || {};
  const dispatch = useDispatch();

  const [userProfile, setUserProfile] = useState(null);

  const user = useSelector((state) => state.userData.user);
  const matches = useSelector((state) => state.userData.matches);
  const dashboardVisibleMatches = [...matches.confirmed.items, ...matches.proposed.items]

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);

  const [matchesOnlineStates, setMatchesOnlineStates] = useState({});

  const [userPkToChatIdMap, setUserPkToChatIdMap] = useState({});

  const [showCancelSearching, setShowCancelSearching] = useState(false);
  const [showIncoming, setShowIncoming] = useState(false);
  const [incomingUserPk, setIncomingUserPk] = useState(null);
  const navigate = useNavigate();

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
  }, [location, use]);

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

  return (
    <Layout page={use} sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}>
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          {!user.isAdmin ? (
            <NbtSelector selection={topSelection} setSelection={setTopSelection} use={use} />
          ) : (
            <NbtSelectorAdmin
              selection={topSelection}
              setSelection={setTopSelection}
              use={use}
              adminInfos={user.adminInfos}
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
      <Modal
        open={matches.proposed?.length || matches.unconfirmed?.length}
        locked={false}
        onClose={onModalClose}
      >
        {(matches.proposed?.length || matches.unconfirmed?.length) &&
          getMatchCardComponent({
            isVolunteer: user.userType === "volunteer",
            onConfirm,
            onPartialConfirm,
            showNewMatch: Boolean(!preMatches?.length),
            userData: matches.proposed?.length ? matches.proposed.items[0] : matches.unconfirmed.items[0],
          })}
      </Modal>
      {!(use === "chat") && <div className="disable-chat">{initChatComponent(true)}</div>}
    </Layout>
  );
}

export default Main;
