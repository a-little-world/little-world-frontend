import React from "react";
import { Provider, useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import store from "./app/store";
import ActiveCall from "./call";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { initialise } from "./features/userData";
import Main from "./main";

import "./App.css";

function DoRoutes({ initData }) {
  const dispatch = useDispatch();
  dispatch(initialise(initData));
  return (
    <Router>
      <Routes>
        <Route path={`${BACKEND_PATH}/`}>
          <Route index element={<Main />} />
          <Route path="call" element={<ActiveCall />} />
          <Route path="partners" element={<Main initData={initData} />} />
          <Route path="chat" element={<Main initData={initData} />} />
          <Route path="notifications" element={<Main initData={initData} />} />
          <Route path="profile" element={<Main />} />
          <Route path="help" element={<Main initData={initData} />} />
          <Route path="settings" element={<Main initData={initData} />} />
          <Route path="*" element="404" />
        </Route>
      </Routes>
    </Router>
  );
}

function App({ initData }) {
  return (
    <Provider store={store}>
      <DoRoutes initData={initData} />
    </Provider>
  );
}

export default App;
