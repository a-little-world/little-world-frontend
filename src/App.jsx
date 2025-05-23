import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { mutate } from 'swr';

import useSWR from 'swr';
import './App.css';
import store from './app/store.ts';
import { USER_ENDPOINT } from './features/swr/index.ts';
import { initialise } from './features/userData.js';
import router from './router/router.jsx';
const fetcher = (url) => fetch(url).then(res => res.json())

export function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

function App({ data }) {
  // WebsocketBridge is here so it dones't reconnect on every AppLayout change
  // But that means we need to manually connect it when userData is present

  // At your app initialization (before rendering)


  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

function TestUserData() {
  const { data, error } = useSWR(USER_ENDPOINT, fetcher, {
    revalidateOnMount: false,
    revalidateOnFocus: true,
  })

  return <>SECOND: {JSON.stringify(data)}</>
}

function Preloader({ user, apiTranslations, apiOptions, children }) {

  const { error } = useSWR(
    USER_ENDPOINT,
    fetcher,
    {
      revalidateOnMount: false,
      revalidateOnFocus: true,
    }
  );

  return <>{children}</>
}

export function AppV2({ user, apiTranslations, apiOptions }) {

  mutate(USER_ENDPOINT, user, false);

  return <Preloader user={user} apiTranslations={apiTranslations} apiOptions={apiOptions}>
    <>{JSON.stringify(user)}</>
    <TestUserData />
  </Preloader>
}

export default App;
