import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import store from './app/store';
import { initialise } from './features/userData';
import router from './router';

function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

/// NOTE MOVE WEBSOCKET BRIDGE INTO ROUTER
function App({ data }) {
  return (
    <Provider store={store}>
      <InitializeDux data={data} />
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
