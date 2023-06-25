import { GlobalStyles } from "@a-little-world/little-world-design-system";
import React from "react";
import { Provider, useDispatch } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import store from "./app/store";
import ActiveCall from "./call";
import { BACKEND_PATH } from "./ENVIRONMENT";
import { initialise } from "./features/userData";
import Main from "./main";
import theme from "./theme";

import "./App.css";

function HandleRoutes({ data }) {
  const dispatch = useDispatch();
  dispatch(initialise(data));
  return (
    <Router>
      <Routes>
        <Route path={`${BACKEND_PATH}/`}>
          <Route index element={<Main />} />
          <Route path="call" element={<ActiveCall />} />
          <Route path="partners" element={<Main />} />
          <Route path="chat" element={<Main />} />
          <Route path="notifications" element={<Main />} />
          <Route path="profile" element={<Main />} />
          <Route path="help" element={<Main />} />
          <Route path="settings" element={<Main />} />
          <Route path="*" element="404" />
        </Route>
      </Routes>
    </Router>
  );
}

function App({ initData }) {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <GlobalStyles />
        <HandleRoutes data={initData} />
      </Provider>
    </ThemeProvider>
  );
}

export default App;
