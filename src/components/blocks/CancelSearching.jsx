import Cookies from "js-cookie";
import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { BACKEND_URL } from "../../ENVIRONMENT";
import { updateSearchState } from "../../features/userData";

const changeSearchStatePost = (updatedState) => {
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
    changeSearchStatePost("idle").then(({ status, statusText }) => {
      if (status === 200) {
        dispatch(updateSearchState(false));
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

export default CancelSearching;
