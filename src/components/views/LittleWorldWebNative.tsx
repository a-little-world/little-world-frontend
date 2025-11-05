import { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import useSWR, { SWRConfig } from 'swr';

import { useReceiveHandlerStore } from '../../features/stores';
import { DomCommunicationMessageFn } from '../../features/stores/receiveHandler';
import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  USER_ENDPOINT,
  swrConfig,
} from '../../features/swr/index';
import i18n, { updateTranslationResources } from '../../i18n';
import { getNativeRouter } from '../../router/router';

/**
 * TODO:
 * - apiTranslation, and also current apiOptions should be packaged with the native app!
 * - cleaner way to manage user authorization states and auto redirects from the frontend client.
 */

export function NativePreloader() {
  const { error: _errorUser } = useSWR(USER_ENDPOINT);
  const { error: _errorApiOptions } = useSWR(API_OPTIONS_ENDPOINT);
  const { data: apiTranslations, error: _errorApiTranslations } = useSWR(
    API_TRANSLATIONS_ENDPOINT,
  );

  if (apiTranslations) {
    updateTranslationResources({ apiTranslations });
  }

  return null;
}

export function LittleWorldWebNative({
  sendMessageToReactNative,
  registerReceiveHandler,
}: {
  sendMessageToReactNative: DomCommunicationMessageFn;
  registerReceiveHandler: (handler: DomCommunicationMessageFn | null) => void;
}) {
  const router = getNativeRouter();
  const {
    handler,
    setSendMessageToReactNative,
    sendMessageToReactNative: sendMessageToReactNativeSet,
  } = useReceiveHandlerStore();
  const [communicationEstablished, setCommunicationEstablished] =
    useState(false);

  useEffect(() => {
    setSendMessageToReactNative(sendMessageToReactNative);
  }, [setSendMessageToReactNative, sendMessageToReactNative]);

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
  ]);

  return (
    <I18nextProvider i18n={i18n}>
      <SWRConfig value={swrConfig}>
        <NativePreloader />
        <RouterProvider router={router} />
      </SWRConfig>
    </I18nextProvider>
  );
}
