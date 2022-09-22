import React from "react";
import { useTranslation } from "react-i18next";

import "./settings.css";

function Settings() {
  const { t } = useTranslation();
  return (
    <>
      <div className="header">
        <span className="text">{t("sg_main_header_settings")}</span>
      </div>
      <div className="content"></div>
    </>
  );
}

export default Settings;
