import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import useSWR from 'swr';

import './App.css';
import WebsocketBridge from './WebsocketBridge';
import { apiFetch } from './api/helpers.ts';
import { API_PATH_USER_DATA } from './api/index.js';
import store from './app/store.ts';
import { initialise } from './features/userData';
import router from './router';

const REFRESH_INTERVAL = 5000; // ms

export function initializeStore(data) {
  store.dispatch(initialise(data));
}

export function InitializeDux({ data }) {
  const dispatch = useDispatch();
  const [shouldFetch, setShouldFetch] = useState(false);
  const {
    data: apiData,
    error,
    isLoading,
  } = useSWR(
    shouldFetch ? API_PATH_USER_DATA : null,
    url => apiFetch(url, { method: 'POST' }),
    { refreshInterval: REFRESH_INTERVAL },
  );

  dispatch(initialise(data));

  useEffect(() => {
    // We do not fetch data on mount
    setShouldFetch(true);
  }, [dispatch, data]);

  console.log({ apiData, error, isLoading });

  return null; // This component doesn't render anything
}

function AuthGuard({ children }) {
  const user = useSelector(state => state.userData.user);
  // TODO: should also check 1. 'session_id' present
  // 2. if 'session_id' & user present, else fetch userData
  return user ? children : null;
}

function App({ data }) {
  // WebsocketBridge is here so it dones't reconnect on every AppLayout change
  // But that means we need to manually connect it when userData is present

  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <AuthGuard>
        <WebsocketBridge />
      </AuthGuard>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
