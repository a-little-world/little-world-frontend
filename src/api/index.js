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

export const reportMatch = ({ reason, userHash }) => null;
// fetch(`${BACKEND_URL}/api/user/unmatch_self/`, {
//   headers: {
//     "X-CSRFToken": Cookies.get("csrftoken"),
//     "X-UseTagsOnly": true,
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
//   method: "POST",
//   body: JSON.stringify({
//     other_user_hash: userHash,
//     reason,
//   }),
// });

export const unmatch = ({ reason, userHash }) =>
  fetch(`${BACKEND_URL}/api/user/unmatch_self/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": true,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      other_user_hash: userHash,
      reason,
    }),
  });

export const postUserProfileUpdate = (updateData, onFailure, onSuccess, formTag) => {
  fetch(`${BACKEND_URL}/api/profile/`, {
    method: "POST",
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-UseTagsOnly": true, // This automaticly requests error tags instead of direct translations!
    },
    body: JSON.stringify(updateData),
  }).then((response) => {
    const { status, statusText } = response;
    if (![200, 400].includes(status)) {
      console.error("server error", status, statusText);
    } else {
      response.json().then((report) => {
        if (response.status === 200) {
          return onSuccess();
        }
        const errorTags = report[formTag];
        return onFailure(errorTags);
      });
    }
  });
};
