import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import WebsocketBridge from './WebsocketBridge.jsx';
import store from './app/store.ts';
import { initialise } from './features/userData.js';
import AuthGuard from './guards/AuthGuard.tsx';
import router from './router/router.jsx';

export function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

function App({ data }) {
  // WebsocketBridge is here so it dones't reconnect on every AppLayout change
  // But that means we need to manually connect it when userData is present

  return (
    <Provider store={store}>
      <AuthGuard>
        <WebsocketBridge />
      </AuthGuard>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
