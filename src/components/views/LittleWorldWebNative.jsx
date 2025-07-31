import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import useSWR from 'swr';
import { SWRConfig } from 'swr';

import { API_OPTIONS_ENDPOINT, API_TRANSLATIONS_ENDPOINT, USER_ENDPOINT, swrConfig } from '../../features/swr/index';
import i18n from '../../i18n';
import { getNativeRouter } from '../../router/router';

export function NativePreloader() {
  const { error: _errorUser } = useSWR(USER_ENDPOINT);
  const { error: _errorApiOptions } = useSWR(API_OPTIONS_ENDPOINT);
  const { error: _errorApiTranslations } = useSWR(API_TRANSLATIONS_ENDPOINT);
  
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