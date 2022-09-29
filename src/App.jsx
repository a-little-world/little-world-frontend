import React from "react";
import { combineReducers, Provider } from "react-redux";
import { createStore } from 'redux';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import ActiveCall from "./call";
import { BACKEND_PATH } from "./ENVIRONMENT";
import Main from "./main";

import "./App.css";

// eslint-disable-next-line default-param-last
const trackReducer = (state = null, action) => { // redux needs default param first
  // Initially there are no registered tracks
  switch (action.type) {
    case "addTrack":
      return { ...state, tracks: action.payload };
    default:
      return state;
  }
};

export const store = createStore(trackReducer);

function App({ initData }) {
  // const reducer = combineReducers({ trackReducer });

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path={`${BACKEND_PATH}/`}>
            <Route index element={<Main initData={initData} />} />
            <Route path="call" element={<ActiveCall />} />
            <Route path="partners" element={<Main initData={initData} />} />
            <Route path="chat" element={<Main initData={initData} />} />
            <Route path="profile" element={<Main initData={initData} />} />
            <Route path="*" element="404" />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
