import { RouterProvider } from 'react-router-dom';
import useSWR, { SWRConfig, mutate } from 'swr';

import './App.css';
import { useDevelopmentFeaturesStore } from './features/stores/index';
import {
  API_OPTIONS_ENDPOINT,
  API_TRANSLATIONS_ENDPOINT,
  IS_AUTHENTICATED_ENDPOINT,
  USER_ENDPOINT,
  swrConfig,
} from './features/swr/index';
import router from './router/router';

function Preloader({ children }) {
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
  if (user) {
    mutate(USER_ENDPOINT, user, false);
    mutate(IS_AUTHENTICATED_ENDPOINT, true, false);
  }

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
        <RouterProvider router={router()} />
      </Preloader>
    </SWRConfig>
  );
}

export default App;
