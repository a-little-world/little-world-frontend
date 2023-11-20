import Cookies from "js-cookie";

import { USER_FIELDS } from "../constants";
import { BACKEND_URL } from "../ENVIRONMENT";

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
    const responseBody = await response?.json();
    if (response.ok) {
      onSucess(responseBody);
    } else {
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
  /** TODO: for consistency this api should also accept a matchId in the backend rather than userHashes ... */
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

export const partiallyConfirmMatch = ({ acceptDeny, matchId }) =>
  fetch(`${BACKEND_URL}/api/user/match/confirm_deny/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": true,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      unconfirmed_match_hash: matchId,
      confirm: acceptDeny,
    }),
  });

export const reportMatch = ({ reason, userHash }) => Promise.resolve();
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

export const login = ({ email, password }) =>
  fetch(`${BACKEND_URL}/api/user/login/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

export const signUp = ({ email, birthYear, password, password2, firstName, secondName }) =>
  fetch(`${BACKEND_URL}/api/register/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
      password1: password,
      password2,
      first_name: firstName,
      second_name: secondName,
      birth_year: birthYear,
    }),
  });

export const requestPasswordReset = ({ email }) =>
  fetch(`${BACKEND_URL}/api/resetpw/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });

export const resetPassword = ({ password, token }) =>
  fetch(`${BACKEND_URL}/api/resetpw/confirm/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      password,
      token,
    }),
  });

export const verifyEmail = ({ verificationCode }) =>
  fetch(`${BACKEND_URL}/api/user/verify/email/${verificationCode}`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

export const resendVerificationEmail = () =>
  fetch(`${BACKEND_URL}/api/user/verify/email_resend/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
  });

export const setNewEmail = ({ email }) =>
  fetch(`${BACKEND_URL}/api/user/change_email/`, {
    headers: {
      "X-CSRFToken": Cookies.get("csrftoken"),
      "X-UseTagsOnly": "True",
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      email,
    }),
  });
