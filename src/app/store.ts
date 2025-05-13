import { configureStore } from '@reduxjs/toolkit';

import userDataReducer, {
  setDevelopmentFeaturesEnabled,
} from '../features/userData';

const store = configureStore({
  reducer: {
    userData: userDataReducer,
  },
});

// Development-mode toggles:

export const enableDevelopmentFeatures = () => {
  store.dispatch(setDevelopmentFeaturesEnabled(true));
};

export const disableDevelopmentFeatures = () => {
  store.dispatch(setDevelopmentFeaturesEnabled(false));
};

export const toggleDevelopmentFeatures = () => {
  const currentState = store.getState().userData.developmentFeaturesEnabled;
  store.dispatch(setDevelopmentFeaturesEnabled(!currentState));
};

// Add this at the end of the file, before the export default
// Attach functions to window to manage development features from console
if (typeof window !== 'undefined') {
  (window as any).enableDevFeatures = () => {
    enableDevelopmentFeatures();
    console.log('Development features enabled!');
  };

  (window as any).disableDevFeatures = () => {
    disableDevelopmentFeatures();
    console.log('Development features disabled!');
  };

  (window as any).toggleDevFeatures = () => {
    const currentState = store.getState().userData.developmentFeaturesEnabled;
    toggleDevelopmentFeatures();
    console.log(
      `Development features ${!currentState ? 'enabled' : 'disabled'}!`,
    );
  };
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
