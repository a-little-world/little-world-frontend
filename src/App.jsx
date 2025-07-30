import React from 'react';
import { RouterProvider } from 'react-router/dom';
import useSWR, { SWRConfig, mutate } from 'swr';

import './App.css';
import { useDevelopmentFeaturesStore } from './features/stores/index.ts';
import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  USER_ENDPOINT,
  swrConfig,
} from './features/swr/index.ts';
import router from './router/router.jsx';

function Preloader({ children }) {
  const { error: _errorUser } = useSWR(USER_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: true,
  });

  const { error: _errorApiOptions } = useSWR(API_OPTIONS_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false, // No need to ever revalidate this
  });

  const { error: _errorApiTranslations } = useSWR(API_TRANSLATIONS_ENDPOINT, {
    revalidateOnMount: false,
    revalidateOnFocus: false, // No need to ever revalidate this
  });

  return children;
}

function App({ user, apiTranslations, apiOptions }) {
  mutate(USER_ENDPOINT, user, false);
  mutate(API_OPTIONS_ENDPOINT, apiOptions, false);
  mutate(API_TRANSLATIONS_ENDPOINT, apiTranslations, false);

  // Add this at the end of the file, before the export default
  // Attach functions to window to manage development features from console

  const developmentFeatures = useDevelopmentFeaturesStore();
  if (typeof window !== 'undefined') {
    window.enableDevFeatures = () => {
      developmentFeatures.enable();
      console.log('Development features enabled!');
    };

    window.disableDevFeatures = () => {
      developmentFeatures.disable();
      console.log('Development features disabled!');
    };

    window.toggleDevFeatures = () => {
      const currentState = developmentFeatures.enabled;
      developmentFeatures.toggle();
      console.log(
        `Development features ${!currentState ? 'enabled' : 'disabled'}!`,
      );
    };
  }

  return (
    <SWRConfig value={swrConfig}>
      <Preloader>
        <RouterProvider router={router} />
      </Preloader>
    </SWRConfig>
  );
}

export default App;
