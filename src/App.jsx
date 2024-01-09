import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import WebsocketBridge from './WebsocketBridge';

import './App.css';
import store from './app/store';
import { initialise } from './features/userData';
import router from './router';

function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

function App({ data }) {
  // WebsocketBridge actually needs to be here so it dones't reconnect on every AppLayout change
  return (
    <Provider store={store}>
      <WebsocketBridge />
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
