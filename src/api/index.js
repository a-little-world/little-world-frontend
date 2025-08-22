import Cookies from 'js-cookie';

import { API_FIELDS, USER_FIELDS } from '../constants/index';
import { environment } from '../environment';
import { apiFetch, formatApiError } from './helpers';

export const completeForm = async () => apiFetch(`/api/profile/completed/`);

export const mutateUserData = async (formData, onSuccess, onFailure) => {
  try {
    const { image } = formData;
    let data;
    // need to handle image file differently for api request
    if (image) {
      data = new FormData();
      // eslint-disable-next-line
      for (const key in formData) {
        if (key !== USER_FIELDS.avatar) data.append(key, formData[key]);
      }
    } else {
      data = JSON.stringify(formData);
    }

    try {
      const response = await apiFetch(`/api/profile/`, {
        method: 'POST',
        headers: {
          ...(image ? {} : { 'Content-Type': 'application/json' }),
          'X-UseTagsOnly': 'true',
        },
        body: data,
      });
      onSuccess(response);
    } catch (error) {
      // TODO: check this
      if (error?.status === 413)
        throw new Error('validation.image_upload_required', {
          cause: API_FIELDS.image,
        });
      else {
        throw error;
      }
    }
  } catch (error) {
    onFailure(error);
  }
};

export const submitHelpForm = async (formData, onSuccess, onFailure) => {
  try {
    try {
      const response = await apiFetch(`/api/help_message/`, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
          'X-UseTagsOnly': true,
        },
        method: 'POST',
        body: formData,
      });

      onSuccess(response);
    } catch (error) {
      // TODO: check this
      if (error?.status === 413)
        throw new Error('validation.image_upload_required');
      else {
        throw error;
      }
    }
  } catch (error) {
    onFailure(error);
  }
};

export const fetchFormData = async ({ handleError }) => {
  try {
    return apiFetch(`$/api/profile/?options=true`);
  } catch (error) {
    throw handleError?.(error);
  }
};

export const fetchUserMatch = async ({ userId }) =>
  apiFetch(`/api/profile/${userId}/match`);

export const postUserProfileUpdate = (
  updateData,
  onFailure,
  onSuccess,
  formTag,
) => {
  apiFetch(`/api/profile/`, {
    method: 'POST',
    headers: {
      'X-UseTagsOnly': true, // This automaticly requests error tags instead of direct translations!
    },
    body: JSON.stringify(updateData),
  })
    // TODO: check this
    .then(response => onSuccess())
    .catch(error => {
      // TODO: check this; error.errorTags[formTag] ?
      const errorTags = error[formTag];
      return onFailure(errorTags);
    });
};

export const login = async ({ email, password }) => {
  const url = environment.isNative
    ? `${environment.backendUrl}/api/user/login/?token_auth=true`
    : `${environment.backendUrl}/api/user/login/`;
  const response = await fetch(url, {
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
  throw formatApiError(responseBody, response);
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
  const response = await fetch(`${environment.backendUrl}/api/register/`, {
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
  throw formatApiError(responseBody, response);
};

export const requestPasswordReset = async ({ email }) => {
  const response = await fetch(`${environment.backendUrl}/api/user/resetpw/`, {
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
  throw formatApiError(responseBody, response);
};

export const resetPassword = async ({ password, token }) => {
  const response = await fetch(
    `${environment.backendUrl}/api/user/resetpw/confirm/`,
    {
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
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const verifyEmail = async ({ verificationCode }) => {
  const response = await fetch(
    `${environment.backendUrl}/api/user/verify/email/${verificationCode}`,
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
  throw formatApiError(responseBody, response);
};

export const resendVerificationEmail = async () => {
  const response = await fetch(
    `${environment.backendUrl}/api/user/verify/email_resend/`,
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
  throw formatApiError(responseBody, response);
};

export const setNewEmail = async ({ email }) => {
  const response = await fetch(
    `${environment.backendUrl}/api/user/change_email/`,
    {
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
    },
  );

  const responseBody = await response?.json();
  if (response.ok) return responseBody;
  throw formatApiError(responseBody, response);
};

export const setNewPassword = async data => {
  const response = await fetch(`${environment.backendUrl}/api/user/changepw/`, {
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
  throw formatApiError(responseBody, response);
};
