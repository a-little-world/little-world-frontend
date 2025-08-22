import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router-dom';
import { SWRConfig } from 'swr';

import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  USER_ENDPOINT,
  nativeSwrConfig,
} from '../../features/swr/index';
import i18n, { updateTranslationResources } from '../../i18n';
import { environment } from '../../environment';
import { useReceiveHandlerStore } from '../../features/stores';
import { getNativeRouter } from '../../router/router';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';

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

export function NativeMessageHandler() {
  const { setHandler } = useReceiveHandlerStore();
  const navigate = useNavigate();
  
  // Listen for navigation events from the handler
  useEffect(() => {
    const handleNavigation = (event) => {
      const { path } = event.detail;
      console.log('Navigation event received, navigating to:', path);
      navigate(path);
    };
    
    window.addEventListener('native-navigate', handleNavigation);
    
    return () => {
      window.removeEventListener('native-navigate', handleNavigation);
    };
  }, [navigate]);
  
  useEffect(() => {
    console.log('Establishing handler');
    const handler = async (action, payload) => {
      console.log('action', action, "TBS");
      console.log('payload', payload);
      
      switch (action) {
        case 'PING':
          return { ok: true, data: `Handled in package: ${new Date().toISOString()} payload: ${JSON.stringify(payload)}, window-location: ${window.location.href}` };
        case 'console.log':
          console.log('Console from native package:', payload);
          return { ok: true, data: 'Logged' };
        case 'navigate':
          // Dispatch a custom event for navigation instead of calling navigate directly
          window.dispatchEvent(new CustomEvent('native-navigate', { 
            detail: { path: payload?.path } 
          }));
          console.log('Navigation event dispatched for:', payload?.path);
          return { ok: true, data: 'Navigation event dispatched' };
        default:
          return { ok: false, error: 'Unhandled in package' };
      }
    };

    // Set the handler; the store will auto-register with the native bridge if available
    setHandler(handler);
  }, [setHandler]);

  return null;
}

export function LittleWorldWebNative({ sendMessageToReactNative, registerReceiveHandler }) {
  const router = getNativeRouter();
  const { handler, setSendMessageToReactNative } = useReceiveHandlerStore();
  
  console.log('onMessage', sendMessageToReactNative);
  
  useEffect(() => {
    // Store the sendMessageToReactNative function in the store
    setSendMessageToReactNative(sendMessageToReactNative);
  }, [sendMessageToReactNative, setSendMessageToReactNative]);
  
  useEffect(() => {
    if (registerReceiveHandler && handler) {
      console.log('Registering new handler with native bridge:', handler);
      registerReceiveHandler(handler);
    }
  }, [registerReceiveHandler, handler]);

  return (
    <I18nextProvider i18n={i18n}>
      <SWRConfig value={nativeSwrConfig}>
        <NativePreloader />
        <RouterProvider router={router} />
      </SWRConfig>
    </I18nextProvider>
  );
}
