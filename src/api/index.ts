import Cookies from 'js-cookie';

import { API_FIELDS, USER_FIELDS } from '../constants/index';
import { environment } from '../environment';
import useMobileAuthTokenStore from '../features/stores/mobileAuthToken';
import useReceiveHandlerStore from '../features/stores/receiveHandler';
import { apiFetch } from './helpers';

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
      data = formData;
    }

    try {
      const response = await apiFetch(`/api/profile/`, {
        method: 'POST',
        headers: {
          ...(image ? {} : { 'Content-Type': 'application/json' }),
        },
        useTagsOnly: true,
        body: data,
      });
      onSuccess(response);
    } catch (error) {
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
    .then(() => onSuccess())
    .catch(error => {
      const errorTags = error[formTag];
      return onFailure(errorTags);
    });
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  if (!environment.isNative) {
    return apiFetch(`/api/user/login/`, {
      method: 'POST',
      useTagsOnly: true,
      body: { email, password },
    });
  }

  // Native flow: 1) get challenge 2) ask native to compute proof 3) call native-login
  const challengeResp = await apiFetch(`/api/user/challenge/`, {
    method: 'POST',
    useTagsOnly: true,
  });

  const { challenge, timestamp } = challengeResp || {};

  const { sendMessageToReactNative } = useReceiveHandlerStore.getState();
  if (!sendMessageToReactNative) {
    throw new Error('Native bridge not available');
  }

  // Wait for proof from native layer

  const proof = await sendMessageToReactNative({
    action: 'NATIVE_CHALLENGE_PROOF',
    payload: {
      challenge,
      timestamp,
      email: (email || '').toLowerCase(),
    },
  }).then(res => {
    if (!res.ok) {
      throw new Error(res.error);
    }
    if (!res.data?.proof) {
      throw new Error('Challenge proof missing');
    }
    return res.data.proof;
  });

  const loginData = await apiFetch(`/api/user/native-login/`, {
    method: 'POST',
    useTagsOnly: true,
    body: { email, password, challenge, proof },
  });

  // Store tokens locally for subsequent Authorization headers
  useMobileAuthTokenStore
    .getState()
    .setTokens(
      loginData?.token_access || null,
      loginData?.token_refresh || null,
    );

  return loginData;
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
}) =>
  apiFetch(`/api/register/`, {
    method: 'POST',
    useTagsOnly: true,
    body: {
      email,
      password1: password,
      password2: confirmPassword,
      first_name: firstName,
      second_name: lastName,
      birth_year: birthYear,
      newsletter_subscribed: mailingList,
      company,
    },
  });

export const requestPasswordReset = async ({ email }) =>
  apiFetch(`/api/user/resetpw/`, {
    method: 'POST',
    useTagsOnly: true,
    body: {
      email,
    },
  });

export const resetPassword = async ({ password, token }) =>
  apiFetch(`/api/user/resetpw/confirm/`, {
    method: 'POST',
    useTagsOnly: true,
    body: {
      password,
      token,
    },
  });

export const verifyEmail = async ({ verificationCode }) =>
  apiFetch(`/api/user/verify/email/${verificationCode}`, {
    method: 'POST',
    useTagsOnly: true,
  });

export const resendVerificationEmail = async () =>
  apiFetch(`/api/user/verify/email_resend/`, {
    method: 'POST',
    useTagsOnly: true,
  });

export const setNewEmail = async ({ email }) =>
  apiFetch(`/api/user/change_email/`, {
    useTagsOnly: true,
    method: 'POST',
    body: { email },
  });

export const setNewPassword = async data =>
  apiFetch(`/api/user/changepw/`, {
    useTagsOnly: true,
    method: 'POST',
    body: data,
  });
