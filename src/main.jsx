import { Modal } from "@a-little-world/little-world-design-system";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import { confirmMatch, partiallyConfirmMatch, updateMatchData } from "./api";
import CallSetup, { IncomingCall } from "./call-setup";
import Chat from "./chat/chat-full-view";
import CancelSearching from "./components/blocks/CancelSearching";
import CommunityCalls from "./components/blocks/CommunityCalls";
import ConfirmMatchCard from "./components/blocks/ConfirmMatchCard";
import AppLayout from "./components/blocks/Layout/AppLayout";
import MobileNavBar from "./components/blocks/MobileNavBar";
import NbtSelector from "./components/blocks/NbtSelector";
import NewMatchCard from "./components/blocks/NewMatchCard";
import NotificationPanel from "./components/blocks/NotificationPanel";
import PartnerProfiles from "./components/blocks/PartnerProfiles";
import { initCallSetup, cancelCallSetup } from "./features/userData";
import Help from "./components/views/Help";
import CustomPagination from "./CustomPagination";
import { changeMatchCategory, removeMatch, updateConfirmedData } from "./features/userData";
import "./i18n";
import Notifications from "./notifications";
import Profile from "./profile";
import Settings from "./settings";
import { removeActiveTracks } from "./twilio-helper";

import "./community-events.css";
import "./main.css";

const MatchCardComponent = ({ showNewMatch, matchId, profile }) => {
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
            if (res.ok) {
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: "unconfirmed",
                  newCategory: "confirmed",
                })
              );
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
            res.json().then(() => {
              // Change 'proposed' to 'unconfirmed' so it will render the 'new match' popup next
              dispatch(
                changeMatchCategory({
                  match: { id: matchId },
                  category: "proposed",
                  newCategory: "unconfirmed",
                })
              );
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
              dispatch(
                removeMatch({
                  category: "proposed",
                  match: { id: matchId },
                })
              );
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
};

function Main() {
  const location = useLocation();
  const { userPk } = location.state || {};
  const dispatch = useDispatch();

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  // In order to define the frontent paginator numbers
  const pageItems = 10;
  const handlePageChange = async (page) => {
    // TODO: can be refactored using our redux stor
    const res = await updateMatchData(page, pageItems);
    if (res && res.status === 200) {
      const data = await res.json();
      if (data) {
        dispatch(updateConfirmedData(data.data.confirmed_matches));
        setCurrentPage(page);
      }
    } else {
      console.error(
        `Cancelling match searching failed with error ${res.status}: ${res.statusText}`
      );
    }
  };

  const user = useSelector((state) => state.userData.user);
  const matches = useSelector((state) => state.userData.matches);
  const incomingCalls = useSelector((state) => state.userData.incomingCalls);
  const callSetup = useSelector((state) => state.userData.callSetup);
  const activeCall = useSelector((state) => state.userData.activeCall);

  const dashboardVisibleMatches = matches
    ? [...matches.support.items, ...matches.confirmed.items]
    : [];

  useEffect(() => {
    const totalPage = matches?.confirmed?.totalItems / pageItems;
    setTotalPages(Math.ceil(totalPage));
  }, [matches]);
  
  useEffect(() => {
    if(!callSetup && !activeCall) {
      removeActiveTracks();
      document.body.classList.remove("hide-mobile-header");
    }
  }, [callSetup, activeCall]);

  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [showCancelSearching, setShowCancelSearching] = useState(false);

  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  // Manage the top navbar & extrac case where a user profile is selected ( must include the backup button top left instead of the hamburger menu )
  const use = location.pathname.split("/")[2] || (userPk ? "profile" : "main");
  const [topSelection, setTopSelection] = useState(null);
  const selfProfile = user?.id === userPk || typeof userPk === "undefined";
  const selectedProfile = dashboardVisibleMatches.find(
    (match) => match?.partner?.id === userPk
  )?.partner;

  useEffect(() => {
    if (use === "main") {
      setTopSelection("conversation_partners");
    }
    if (use === "help") {
      setTopSelection("contact");
    }
  }, [location, use]);

  const onPageChange = (page) => {
    handlePageChange(page);
  };
  
  const setCallSetupPartner = (partner) => {
    dispatch(initCallSetup({ userId: partner }))
  };
  
  return (
    <AppLayout page={use} sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}>
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          <NbtSelector selection={topSelection} setSelection={setTopSelection} use={use} />
        </div>
        {use === "main" && (
          <div>
            {topSelection === "conversation_partners" && (
              <>
                <div className="content-area-main">
                  <PartnerProfiles
                    setCallSetupPartner={setCallSetupPartner}
                    setShowCancel={setShowCancelSearching}
                    totalPaginations={totalPages}
                  />
                  <NotificationPanel />
                </div>
                {totalPages > 1 && (
                  <CustomPagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                  />
                )}
              </>
            )}
            {topSelection === "community_calls" && <CommunityCalls />}
          </div>
        )}
        {use === "chat" && (
          <Chat showChat={use === "chat"} matchesInfo={dashboardVisibleMatches} userPk={userPk} setCallSetupPartner={setCallSetupPartner}/>
        )}
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
          callSetup || incomingCalls?.length || showCancelSearching
            ? "overlay-shade"
            : "overlay-shade hidden"
        }
      >
        {callSetup && (
          <CallSetup userPk={callSetup?.userId} removeCallSetupPartner={() => {
            dispatch(cancelCallSetup());
            removeActiveTracks();
          }} />
        )}
        {incomingCalls.length > 0 && (
          <IncomingCall
            matchesInfo={dashboardVisibleMatches}
            userPk={incomingCalls[0].userId}
            setCallSetupPartner={setCallSetupPartner}
          />
        )}
        {showCancelSearching && <CancelSearching setShowCancel={setShowCancelSearching} />}
      </div>
      <Modal
        open={matches?.proposed?.items?.length || matches?.unconfirmed?.items?.length}
        locked={false}
        onClose={() => {}}
      >
        {(matches?.proposed?.items?.length || matches?.unconfirmed?.items?.length) &&
          MatchCardComponent({
            showNewMatch: Boolean(!matches?.proposed?.items?.length),
            matchId: matches?.proposed?.items?.length
              ? matches?.proposed.items[0].id
              : matches?.unconfirmed.items[0].id,
            profile: matches?.proposed?.items?.length
              ? matches?.proposed.items[0].partner
              : matches?.unconfirmed.items[0].partner,
          })}
      </Modal>
    </AppLayout>
  );
}

export default Main;
