import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { BACKEND_URL } from "../../ENVIRONMENT";
import { updateSearching } from "../../features/userData";
import { ProfileBox } from "../../profile";

function PartnerProfiles({ setCallSetupPartner, matchesOnlineStates, setShowCancel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const matches = useSelector((state) => state.userData.matches);
  const matchesDisplay = [...matches.support.items, ...matches.confirmed.items];
  const user = useSelector((state) => state.userData.user);
  
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
      {matchesDisplay
        .map((match) => {
          return (
            <ProfileBox
              key={match.partner.id}
              userPk={match.partner.id}
              profile={match.partner}
              isSelf={false}
              setCallSetupPartner={setCallSetupPartner}
              isOnline={matchesOnlineStates[user.userPk]}
            />
          );
        })}
      {!user.isSearching && (
        <button type="button" className="match-status find-new" onClick={updateUserMatchingState}>
          <img alt="plus" />
          {(!user.isSearching) && t("matching_state_not_searching_trans")}
          {/* matchState === "confirmed" && t("matching_state_found_confirmed_trans") */}
        </button>
      )}
      {user.isSearching && (
        <div className="match-status searching">
          <img alt="" />
          {user.isSearching && t("matching_state_searching_trans")}
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

export default PartnerProfiles;
