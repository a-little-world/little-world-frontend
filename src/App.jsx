import React from "react";
import { Provider } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import store from "./app/store";
import ActiveCall from "./call";
import { BACKEND_PATH } from "./ENVIRONMENT";
import Main from "./main";

import "./App.css";

function App({ initialProfileData }) {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path={`${BACKEND_PATH}/`}>
            <Route index element={<Main initialProfileData={initialProfileData} />} />
            <Route path="call" element={<ActiveCall />} />
            <Route path="partners" element={<Main initialProfileData={initialProfileData} />} />
            <Route path="chat" element={<Main initialProfileData={initialProfileData} />} />
            <Route path="profile" element={<Main initialProfileData={initialProfileData} />} />
            <Route path="*" element="404" />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
