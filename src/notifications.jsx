import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./notifications.css";

function Notifications() {
  const { t } = useTranslation();
  const [visibleNotifs, setVisibleNotifs] = useState("all");
  return (
    <>
      <div className="header">
        <span className="text">{t("nm_main_header_settings")}</span>
        <div className="buttons">
          <button
            type="button"
            className={visibleNotifs === "all" ? "show-all selected" : "show-all"}
            onClick={() => {
              setVisibleNotifs("all");
            }}
          >
            {t("nm_filter_all")}
          </button>
          <button
            type="button"
            className={visibleNotifs === "unread" ? "show-unread selected" : "show-unread"}
            onClick={() => {
              setVisibleNotifs("unread");
            }}
          >
            {t("nm_filter_unread")}
          </button>
          <button
            type="button"
            className={visibleNotifs === "archive" ? "show-archive selected" : "show-archive"}
            onClick={() => {
              setVisibleNotifs("archive");
            }}
          >
            {t("nm_filter_archive")}
          </button>
        </div>
      </div>
      <div className="content"></div>
    </>
  );
}

export default Notifications;
