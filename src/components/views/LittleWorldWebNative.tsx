import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import useSWR, { mutate, SWRConfig } from 'swr';

import { apiFetch } from '../../api/helpers';
import { TokenStatus } from '../../api/types';
import { environment } from '../../environment';
import { useReceiveHandlerStore } from '../../features/stores';
import useNativeStore from '../../features/stores/nativeStore';
import { DomCommunicationMessageFn } from '../../features/stores/receiveHandler';
import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  IS_AUTHENTICATED_ENDPOINT,
  USER_ENDPOINT,
} from '../../features/swr';
import useNativeSwrConfig from '../../hooks/useNativeSwrConfig';
import i18n, { updateTranslationResources } from '../../i18n';
import { getNativeRouter } from '../../router/router';
import { getAppRoute } from '../../router/routes';

export interface LittleWorldWebNativeProps {
  sendMessageToReactNative: DomCommunicationMessageFn;
  registerReceiveHandler: (handler: DomCommunicationMessageFn) => void;
  apiFetchNative: typeof apiFetch;
  refreshAccessToken: () => Promise<TokenStatus>;
  getAccessToken: () => Promise<string | undefined>;
  setAccessTokens: (
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ) => Promise<void>;
  hasStoredToken?: boolean;
}

/**
 * TODO:
 * - apiTranslation, and also current apiOptions should be packaged with the native app!
 * - cleaner way to manage user authorization states and auto redirects from the frontend client.
 */

function NativePreloader() {
  const { isReady } = useNativeStore();

  useEffect(() => {
    if (isReady) {
      // force initial auth check
      apiFetch(IS_AUTHENTICATED_ENDPOINT).then(isAuthenticated =>
        mutate(IS_AUTHENTICATED_ENDPOINT, isAuthenticated, {
          revalidate: false,
        }),
      );
    }
  }, [isReady]);
  useSWR(API_OPTIONS_ENDPOINT);
  const { data: apiTranslations } = useSWR(API_TRANSLATIONS_ENDPOINT);
  const { data: isAuthenticated } = useSWR(IS_AUTHENTICATED_ENDPOINT);
  useSWR(isAuthenticated ? USER_ENDPOINT : null);

  if (apiTranslations) {
    updateTranslationResources({ apiTranslations });
  }

  return null;
}

export function LittleWorldWebNative({
  sendMessageToReactNative,
  registerReceiveHandler,
  apiFetchNative,
  refreshAccessToken,
  getAccessToken,
  setAccessTokens,
  hasStoredToken,
}: LittleWorldWebNativeProps) {
  // Optimistic startup: if native has a stored token, boot the hash-router at the app
  // route instead of the default login route so RouteGuard renders the app immediately
  // and only bounces to login if the token proves invalid. Empty-hash guard keeps this a
  // no-op after any real navigation (e.g. logout -> #/login), so no login flash.
  if (environment.isNative && hasStoredToken) {
    const h = window.location.hash;
    if (!h || h === '#' || h === '#/') {
      window.location.hash = getAppRoute();
    }
  }
  const router = getNativeRouter();
  const {
    handler,
    setSendMessageToReactNative,
    sendMessageToReactNative: sendMessageToReactNativeSet,
  } = useReceiveHandlerStore();
  const [communicationEstablished, setCommunicationEstablished] =
    useState(false);
  const {
    setApiFetchNative,
    setRefreshAccessToken,
    setGetAccesToken,
    setSetAccessTokens,
  } = useNativeStore();

  useEffect(() => {
    setSendMessageToReactNative(sendMessageToReactNative);
  }, [setSendMessageToReactNative, sendMessageToReactNative]);

  useEffect(() => {
    setApiFetchNative(apiFetchNative);
  }, [apiFetchNative, setApiFetchNative]);

  useEffect(() => {
    setRefreshAccessToken(refreshAccessToken);
  }, [refreshAccessToken, setRefreshAccessToken]);

  useEffect(() => {
    setGetAccesToken(getAccessToken);
  }, [getAccessToken, setGetAccesToken]);

  useEffect(() => {
    setSetAccessTokens(setAccessTokens);
  }, [setAccessTokens, setSetAccessTokens]);

  useEffect(() => {
    if (handler && sendMessageToReactNativeSet && !communicationEstablished) {
      setCommunicationEstablished(true);

      setSendMessageToReactNative(sendMessageToReactNative);
      registerReceiveHandler(handler);

      sendMessageToReactNative({
        action: 'WEBVIEW_READY',
        payload: {},
      }).then(res => {
        if (!res.ok) {
          throw new Error(res.error);
        }
        return res.data;
      });
    }
  }, [
    handler,
    registerReceiveHandler,
    sendMessageToReactNativeSet,
    communicationEstablished,
    setSendMessageToReactNative,
    sendMessageToReactNative,
  ]);

  const swrConfig = useNativeSwrConfig();

  return (
    <I18nextProvider i18n={i18n}>
      <SWRConfig value={swrConfig}>
        <NativePreloader />
        <RouterProvider router={router} />
      </SWRConfig>
    </I18nextProvider>
  );
}
