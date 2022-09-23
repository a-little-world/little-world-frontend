import React from "react";
import { useTranslation } from "react-i18next";

import "./notifications.css";

function Notifications() {
  const { t } = useTranslation();
  return (
    <>
      <div className="header">
        <span className="text">{t("nm_main_header_settings")}</span>
      </div>
      <div className="content"></div>
    </>
  );
}

export default Notifications;
