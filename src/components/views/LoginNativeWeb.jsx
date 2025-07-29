import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { swrConfig } from '../../features/swr/index';
import i18n from '../../i18n';
import { getNativeRouter } from '../../router/router';

export const NativeWebWrapperL = ({ children }) => (
  <SWRConfig value={swrConfig}>{children}</SWRConfig>
);

export function LoginNativeWeb() {
  const router = getNativeRouter();

  return (
    <I18nextProvider i18n={i18n}>
      <NativeWebWrapperL>
        <RouterProvider router={router} />
      </NativeWebWrapperL>
    </I18nextProvider>
  );
} 