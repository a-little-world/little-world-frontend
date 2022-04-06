import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CallSetup from "./call-setup";
import ActiveCall from "./call";
import Main from "./main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/">
          <Route index element={<Main />} />
          {/* placeholder while we have no main page */}
          <Route path="/call-setup" element={<CallSetup />} />
          <Route path="/call" element={<ActiveCall />} />
          <Route path="/partners" element={<Main />} />
          <Route path="*" element="404" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
