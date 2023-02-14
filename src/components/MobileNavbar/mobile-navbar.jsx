import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import "@/i18n";

function MobileNavBar({ setShowSidebarMobile }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userPk } = location.state || {};
  const key = location.pathname.split("/").slice(-1)[0] || (userPk ? "user" : "home");

  return (
    <div className="mobile-header">
      <button type="button" className="menu" onClick={() => setShowSidebarMobile(true)}>
        <img alt="open menu" />
      </button>
      <div className="logo-with-text">
        <img className="logo-mobile" alt="" />
        <span className="logo-text">{t(`headers::${key}`)}</span>
      </div>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

export default MobileNavBar;