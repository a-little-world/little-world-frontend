import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./app/store";
import CallSetup from "./call-setup";
import ActiveCall from "./call";
import Main from "./main";
import { ChatFull } from "./chat/chat-full-view";
import GLOB from "./ENVIRONMENT";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path={`${GLOB.BACKEND_PATH}/`}>
            <Route index element={<Main />} />
            {/* placeholder while we have no main page */}
            <Route path="call-setup" element={<CallSetup />} />
            <Route path="call" element={<ActiveCall />} />
            <Route path="partners" element={<Main />} />
            <Route path="chat" element={<Main />} />
            <Route path="*" element="404" />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
