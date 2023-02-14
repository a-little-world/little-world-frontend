import Cookies from "js-cookie";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {  useSelector } from "react-redux";

import {  BACKEND_URL } from "@/ENVIRONMENT";
import { ProfileBox } from "@/profile";

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates }) {
  const { t } = useTranslation();
  const users = useSelector((state) => state.userData.users);
  const currentMatchingState = useSelector((state) => state.userData.self.stateInfo.matchingState);
  console.log("Current matching state", currentMatchingState);
  const [matchState, setMatchState] = useState(currentMatchingState);

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
          // TODO: we need to also update the redux state!
          setMatchState(updatedState);
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
        </div>
      )}
    </div>
  );
}

export default PartnerProfiles;