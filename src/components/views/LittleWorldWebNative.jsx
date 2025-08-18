import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  USER_ENDPOINT,
  swrConfig,
} from '../../features/swr/index';
import i18n, { updateTranslationResources } from '../../i18n';
import { getNativeRouter } from '../../router/router';
import useSWR from 'swr';

/**
 * TODO:
 * - apiTranslation, and also current apiOptions should be packaged with the native app!
 * - cleaner way to manage user authorization states and auto redirects from the frontend client.
 */

export function NativePreloader() {
  const { error: _errorUser } = useSWR(USER_ENDPOINT);
  const { error: _errorApiOptions } = useSWR(API_OPTIONS_ENDPOINT);
  const { error: _errorApiTranslations } = useSWR(API_TRANSLATIONS_ENDPOINT);

  if (_errorApiTranslations) {
    updateTranslationResources({ apiTranslations: _errorApiTranslations });
  }

  return null;
}

export function LittleWorldWebNative() {
  const router = getNativeRouter();

  return (
    <I18nextProvider i18n={i18n}>
      <SWRConfig value={swrConfig}>
        <NativePreloader />
        <RouterProvider router={router} />
      </SWRConfig>
    </I18nextProvider>
  );
}
