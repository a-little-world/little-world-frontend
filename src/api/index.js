import Cookies from "js-cookie";

import { BACKEND_URL } from "../ENVIRONMENT";

export const confirmMatch = ({ userHash }) =>
  fetch(`${BACKEND_URL}/api/user/confirm_match/`, {
    /* TODO is incuded in main frontend data now! */
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-UseTagsOnly": true,
    },
    body: JSON.stringify({ matches: [userHash] }),
  });

export const partiallyConfirmMatch = ({ acceptDeny, userHash }) =>
  fetch(`${BACKEND_URL}/api/user/match/confirm_deny/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": true,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      unconfirmed_match_hash: userHash,
      confirm: acceptDeny,
    }),
  });
