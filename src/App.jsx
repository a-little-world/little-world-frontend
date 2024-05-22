import React from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

import './App.css';
import WebsocketBridge from './WebsocketBridge';
import store from './app/store';
import { initialise } from './features/userData';
import router from './router';

function InitializeDux({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
}

function AuthGuard({ children }) {
  const user = useSelector(state => state.userData.user);
  return user ? children : null;
}

const ApiOptionsContext = React.createContext({});

function App({ data, apiOptions }) {
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
