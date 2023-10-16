import { Modal } from "@a-little-world/little-world-design-system";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { BACKEND_URL } from "../../ENVIRONMENT";
import { updateSearching } from "../../features/userData";
import { ProfileBox } from "../../profile";
import PartnerActionCard from "./PartnerActionCard";

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates, setShowCancel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const usersSel = useSelector((state) => state.userData.users);
  const matchStateSel = useSelector((state) => state.userData.self.stateInfo.matchingState);
  const [users, setUsers] = useState(usersSel);
  const [matchState, setMatchState] = useState(matchStateSel);
  const [partnerActionData, setPartnerActionData] = useState(null);

  useEffect(() => {
    setUsers(usersSel);
  }, [usersSel]);

  useEffect(() => {
    setMatchState(matchStateSel);
  }, [matchStateSel]);

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

  const onModalClose = () => {
    setPartnerActionData(null);
  };

  return (
    <div className="profiles">
      {users
        .filter(({ type }) => type !== "self")
        .map((user) => {
          return (
            <ProfileBox
              key={user.userPk}
              {...user}
              openPartnerModal={setPartnerActionData}
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
      <Modal open={Boolean(partnerActionData)} onClose={onModalClose}>
        {!!partnerActionData && (
          <PartnerActionCard data={partnerActionData} onClose={onModalClose} />
        )}
      </Modal>
    </div>
  );
}

export default PartnerProfiles;
