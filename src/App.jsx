import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import WebsocketBridge from './WebsocketBridge';
import store from './app/store.ts';
import { initialise } from './features/userData';
import router from './router/router';

export function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
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
      <AuthGuard>
        <WebsocketBridge />
      </AuthGuard>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
