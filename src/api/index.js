import Cookies from "js-cookie";

import { USER_FIELDS } from "../constants";
import { BACKEND_URL, PRODUCTION } from "../ENVIRONMENT";
import { simulatedAutoLogin } from "../loginSimulator";

export const mutateUserData = async (formData, onSucess, onFailure) => {
  try {
    const { image } = formData;
    let data;
    if (image) {
      data = new FormData();
      for (const key in formData) {
        if (key === USER_FIELDS.avatar) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }
    } else {
      data = JSON.stringify(formData);
    }

    const response = await fetch("/api/profile/", {
      method: "POST",
      headers: {
        ...(image ? {} : { "Content-Type": "application/json" }),
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-UseTagsOnly": "true",
      },
      body: data,
    });

    if (response.ok) {
      onSucess(response);
    } else {
      const responseBody = await response.json();
      const errorType = Object.keys(responseBody)?.[0];
      const errorTag = Object.values(responseBody)?.[0]?.[0];

      const error = new Error(errorTag, { cause: errorType ?? null });
      throw error;
    }
  } catch (error) {
    console.log("updating user data error");
    onFailure(error);
  }
};

export const fetchFormData = async () => {
  try {
    const response = await fetch("/api/profile/?options=true", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-UseTagsOnly": "true",
      },
    });

    if (response.ok) {
      return response.json();
    }
    throw Error(response.statusText);
  } catch (error) {
    console.log("fetching user data error", { error });
  }
};

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
