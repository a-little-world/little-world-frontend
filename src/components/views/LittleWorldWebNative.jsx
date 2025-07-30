import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { swrConfig } from '../../features/swr/index';
import i18n from '../../i18n';
import { getNativeRouter } from '../../router/router';

export function LittleWorldWebNative() {
  const router = getNativeRouter();

  return (
    <I18nextProvider i18n={i18n}>
      <SWRConfig value={swrConfig}>
        <RouterProvider router={router} />
      </SWRConfig>
    </I18nextProvider>
  );
} 