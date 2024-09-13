import Cookies from 'js-cookie';

import { BACKEND_URL } from '../ENVIRONMENT';
import { API_FIELDS, USER_FIELDS } from '../constants';

export const formatApiError = responseBody => {
  if (typeof responseBody === 'string') return new Error(responseBody);
  const errorTypeApi = Object.keys(responseBody)?.[0];
  const errorType = API_FIELDS[errorTypeApi] ?? errorTypeApi;
  const errorTags = Object.values(responseBody)?.[0];
  const errorTag = Array.isArray(errorTags) ? errorTags[0] : errorTags;

  return new Error(errorTag, { cause: errorType ?? null });
};

export const completeForm = async () => {
  const res = await fetch('/api/profile/completed/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'true',
    },
  });

  const updatedUser = await res?.json();
  return updatedUser;
};

export const mutateUserData = async (formData, onSuccess, onFailure) => {
  try {
    const { image } = formData;
    let data;
    // need to handle image file differently for api request
    if (image) {
      data = new FormData();
      for (const key in formData) {
        if (key !== USER_FIELDS.avatar) data.append(key, formData[key]);
      }
    } else {
      data = JSON.stringify(formData);
    }

    const response = await fetch('/api/profile/', {
      method: 'POST',
      headers: {
        ...(image ? {} : { 'Content-Type': 'application/json' }),
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'true',
      },
      body: data,
    });

    if (response.ok) {
      const responseBody = await response?.json();
      onSuccess(responseBody);
    } else {
      if (response.status === 413)
        throw new Error('validation.image_upload_required', {
          cause: API_FIELDS.image,
        });
      const responseBody = await response?.json();
      const error = formatApiError(responseBody);
      throw error;
    }
  } catch (error) {
    onFailure(error);
  }
};

export const submitHelpForm = async (formData, onSuccess, onFailure) => {
  try {
    const response = await fetch('/api/help_message/', {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': true,
      },
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const responseBody = await response?.json();
      onSuccess(responseBody);
    } else {
      if (response.status === 413)
        throw new Error('validation.image_upload_required');
      const responseBody = await response?.json();
      const error = formatApiError(responseBody);
      throw error;
    }
  } catch (error) {
    onFailure(error);
  }
};

export const fetchFormData = async () => {
  try {
    const response = await fetch('/api/profile/?options=true', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'true',
      },
    });

    const responseBody = await response?.json();
    if (response.ok) return responseBody;
    throw formatApiError(responseBody);
  } catch (error) {
    console.log('fetching user data error', { error });
  }
};

export const fetchUserMatch = async ({ userId }) => {
  const response = await fetch(`${BACKEND_URL}/api/profile/${userId}/match`, {
    method: 'GET',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'Content-Type': 'application/json',
    },
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const confirmMatch = ({ userHash }) =>
  /** TODO: for consistency this api should also accept a matchId in the backend rather than userHashes ... */
  fetch(`${BACKEND_URL}/api/user/confirm_match/`, {
    /* TODO is incuded in main frontend data now! */
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-UseTagsOnly': true,
    },
    body: JSON.stringify({ matches: [userHash] }),
  });

export const partiallyConfirmMatch = ({ acceptDeny, matchId }) =>
  fetch(`${BACKEND_URL}/api/user/match/confirm_deny/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': true,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
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
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': true,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      other_user_hash: userHash,
      reason,
    }),
  });

export const updateMatchData = (page, pageItems) =>
  fetch(
    `${BACKEND_URL}/api/matches/confirmed/?page=${page}&itemsPerPage=${pageItems}`,
    {
      method: 'GET',
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'Content-Type': 'application/json',
      },
    },
  );

export const postUserProfileUpdate = (
  updateData,
  onFailure,
  onSuccess,
  formTag,
) => {
  fetch(`${BACKEND_URL}/api/profile/`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-UseTagsOnly': true, // This automaticly requests error tags instead of direct translations!
    },
    body: JSON.stringify(updateData),
  }).then(response => {
    const { status, statusText } = response;
    if (![200, 400].includes(status)) {
      console.error('server error', status, statusText);
    } else {
      response.json().then(report => {
        if (response.status === 200) {
          return onSuccess();
        }
        const errorTags = report[formTag];
        return onFailure(errorTags);
      });
    }
  });
};

export const login = async ({ email, password }) => {
  const response = await fetch(`${BACKEND_URL}/api/user/login/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const signUp = async ({
  email,
  birthYear,
  password,
  confirmPassword,
  firstName,
  lastName,
  mailingList,
  company = null,
}) => {
  const response = await fetch(`${BACKEND_URL}/api/register/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
      password1: password,
      password2: confirmPassword,
      first_name: firstName,
      second_name: lastName,
      birth_year: birthYear,
      newsletter_subscribed: mailingList,
      company,
    }),
  });

  if (response.ok) return response?.json();
  const responseBody = await response?.json();
  throw formatApiError(responseBody);
};

export const requestPasswordReset = async ({ email }) => {
  const response = await fetch(`${BACKEND_URL}/api/user/resetpw/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });

  const responseBody = await response?.json();

  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const resetPassword = async ({ password, token }) => {
  const response = await fetch(`${BACKEND_URL}/api/user/resetpw/confirm/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      password,
      token,
    }),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const verifyEmail = async ({ verificationCode }) => {
  const response = await fetch(
    `${BACKEND_URL}/api/user/verify/email/${verificationCode}`,
    {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken'),
        'X-UseTagsOnly': 'True',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const resendVerificationEmail = async () => {
  const response = await fetch(`${BACKEND_URL}/api/user/verify/email_resend/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const setNewEmail = async ({ email }) => {
  const response = await fetch(`${BACKEND_URL}/api/user/change_email/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      email,
    }),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const setNewPassword = async data => {
  const response = await fetch(`${BACKEND_URL}/api/user/changepw/`, {
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
      'X-UseTagsOnly': 'True',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(data),
  });

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody);
};

export const changeSearchStatePost = updatedState =>
  fetch(`${BACKEND_URL}/api/user/search_state/${updatedState}`, {
    method: 'POST',
    headers: {
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  });
