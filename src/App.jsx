import React from 'react';
import { RouterProvider } from 'react-router-dom';
import useSWR, { mutate } from 'swr';

import './App.css';
import store from './app/store.ts';
import { useDevelopmentFeaturesStore } from './features/stores/developmentFeatures.ts';
import { API_OPTIONS_ENDPOINT, API_TRANSLATIONS_ENDPOINT, USER_ENDPOINT, fetcher } from './features/swr/index.ts';
import router from './router/router.jsx';

function Preloader({ user, apiTranslations, apiOptions, children }) {
  const { error: errorUser } = useSWR(USER_ENDPOINT, fetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: true,
  });

  const { error: errorApiOptions } = useSWR(API_OPTIONS_ENDPOINT, fetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: false, // No need to ever revalidate this
  });

  const { error: errorApiTranslations } = useSWR(API_TRANSLATIONS_ENDPOINT, fetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: false, // No need to ever revalidate this
  });

  return <>{children}</>;
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
      const currentState = store.getState().userData.developmentFeaturesEnabled;
      developmentFeatures.toggle();
      console.log(
        `Development features ${!currentState ? 'enabled' : 'disabled'}!`,
      );
    };
  }

  return (
    <Preloader
      user={user}
      apiTranslations={apiTranslations}
      apiOptions={apiOptions}
    >
      <RouterProvider router={router} />
    </Preloader>
  );
}

export default App;
