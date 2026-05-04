import { useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import useSWR, { SWRConfig } from 'swr';

import { useReceiveHandlerStore } from '../../features/stores';
import { DomCommunicationMessageFn } from '../../features/stores/receiveHandler';
import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  swrConfig,
} from '../../features/swr/index';
import i18n, { updateTranslationResources } from '../../i18n';
import { getNativeRouter } from '../../router/router';
import {
  createSafeNativeMessageSender,
  hasNativeWebViewBridge,
} from '../../webview/nativeBridge';

/**
 * TODO:
 * - apiTranslation, and also current apiOptions should be packaged with the native app!
 * - cleaner way to manage user authorization states and auto redirects from the frontend client.
 */

export function NativePreloader() {
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
  const safeSendMessageToReactNative = useMemo(
    () => createSafeNativeMessageSender(sendMessageToReactNative),
    [sendMessageToReactNative],
  );
  const {
    handler,
    setSendMessageToReactNative,
    sendMessageToReactNative: sendMessageToReactNativeSet,
  } = useReceiveHandlerStore();
  const [communicationEstablished, setCommunicationEstablished] =
    useState(false);

  useEffect(() => {
    if (!hasNativeWebViewBridge()) {
      setSendMessageToReactNative(null);
      return;
    }

    setSendMessageToReactNative(safeSendMessageToReactNative);
  }, [setSendMessageToReactNative, safeSendMessageToReactNative]);

  useEffect(() => {
    if (
      handler &&
      sendMessageToReactNativeSet &&
      hasNativeWebViewBridge() &&
      !communicationEstablished
    ) {
      setCommunicationEstablished(true);

      setSendMessageToReactNative(safeSendMessageToReactNative);
      registerReceiveHandler(handler);

      safeSendMessageToReactNative({
        action: 'WEBVIEW_READY',
        payload: {},
      }).then(res => {
        if (!res.ok) {
          console.warn(res.error);
          return undefined;
        }
        return res.data;
      });
    }
  }, [
    handler,
    registerReceiveHandler,
    sendMessageToReactNativeSet,
    setSendMessageToReactNative,
    safeSendMessageToReactNative,
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
