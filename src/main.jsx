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
import Layout from "./components/blocks/Layout/AppLayout";
import AppLayout from "./components/blocks/Layout/AppLayout";
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
import { removeMatch, changeMatchCategory } from "./features/userData";

import "./community-events.css";
import "./main.css";

function getMatchCardComponent({ showNewMatch, matchId, profile }) {
  const usesAvatar = profile.image_type === "avatar";
  const dispatch = useDispatch();

  return showNewMatch ? (
    <NewMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onExit={() => {
        confirmMatch({ userHash: profile.id })
          .then((res) => {
            if(res.ok){
              dispatch(changeMatchCategory({
                match: {id: matchId},
                category: "unconfirmed",
                newCategory: "confirmed",
              }))
            }
          })
          .catch((error) => console.error(error));
      }}
    />
  ) : (
    <ConfirmMatchCard
      name={profile.first_name}
      imageType={profile.image_type}
      image={usesAvatar ? profile.avatar_config : profile.image}
      onConfirm={() => {
        partiallyConfirmMatch({ acceptDeny: true, matchId }).then((res) => {
          if (res.ok) {
            res.json().then((data) => {
              // Change 'proposed' to 'unconfirmed' so it will render the 'new match' popup next
              dispatch(changeMatchCategory({
                match: {id: matchId},
                category: "proposed",
                newCategory: "unconfirmed",
              }))
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onReject={() => {
        partiallyConfirmMatch({ acceptDeny: false, matchId }).then((res) => {
          if (res.ok) {
            res.json().then(() => {
              dispatch(removeMatch({ 
                category: "proposed",
                match: { id: matchId } 
              }))
            });
          } else {
            // TODO: Add toast error explainer or some error message
          }
        });
      }}
      onExit={() => {
        // TODO IMPORTANT: Now it's impossible to 'ingnore' confirming a match
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

  const user = useSelector((state) => state.userData.user);
  const matches = useSelector((state) => state.userData.matches);
  const incomingCalls = useSelector((state) => state.userData.incomingCalls);
  const dashboardVisibleMatches = [...matches.support.items, ...matches.confirmed.items];

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [callSetupPartner, setCallSetupPartnerKey] = useState(null);


  const [showCancelSearching, setShowCancelSearching] = useState(false);

  const setCallSetupPartner = (partnerKey) => {
    document.body.style.overflow = partnerKey ? "hidden" : "";
    setCallSetupPartnerKey(partnerKey);
    if (!partnerKey) {
      removeActiveTracks();
    }
  };

  removeActiveTracks();

  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  document.body.classList.remove("hide-mobile-header");

  // Manage the top navbar & extrac case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  const use = location.pathname.split("/").slice(-1)[0] || (userPk ? "profile" : "main");
  const [topSelection, setTopSelection] = useState(null);
  const selfProfile = user.id === userPk || typeof userPk === "undefined";
  const selectedProfile = dashboardVisibleMatches.find(
    (match) => match.partner.id === userPk
  )?.partner;

  useEffect(() => {
    if (use === "main") {
      setTopSelection("conversation_partners");
    }
    if (use === "help") {
      setTopSelection("contact");
    }
  }, [location, use]);

  return (
    <AppLayout page={use} sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}>
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
                  setShowCancel={setShowCancelSearching}
                />
                <NotificationPanel />
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "chat" && <Chat
          showChat={use === "chat"}
          matchesInfo={dashboardVisibleMatches}
          userPk={userPk}/>}
        {use === "notifications" && <Notifications />}
        {use === "profile" && (
          <Profile
            setCallSetupPartner={setCallSetupPartner}
            isSelf={selfProfile}
            profile={selfProfile ? user.profile : selectedProfile}
            userPk={selfProfile ? user.id : userPk}
          />
        )}
        {use === "help" && <Help selection={topSelection} />}
        {use === "settings" && <Settings />}
      </div>
      <div
        className={
          callSetupPartner || incomingCalls.length || showCancelSearching
            ? "overlay-shade"
            : "overlay-shade hidden"
        }
      >
        {callSetupPartner && (
          <CallSetup userPk={callSetupPartner} setCallSetupPartner={setCallSetupPartner} />
        )}
        {(incomingCalls.length > 0) && (
          <IncomingCall
            matchesInfo={dashboardVisibleMatches}
            userPk={incomingCalls[0].userId}
            setCallSetupPartner={setCallSetupPartner}
          />
        )}
        {showCancelSearching && <CancelSearching setShowCancel={setShowCancelSearching} />}
      </div>
      <Modal
        open={matches.proposed.items.length || matches.unconfirmed.items.length}
        locked={false}
        onClose={() => {}}
      >
        {(matches.proposed.items.length || matches.unconfirmed.items.length) &&
          getMatchCardComponent({
            showNewMatch: Boolean(!matches.proposed.items.length),
            matchId: matches.proposed.items.length
              ? matches.proposed.items[0].id
              : matches.unconfirmed.items[0].id,
            profile: matches.proposed.items.length
              ? matches.proposed.items[0].partner
              : matches.unconfirmed.items[0].partner,
          })}
      </Modal>
    </AppLayout>
  );
}

export default Main;
