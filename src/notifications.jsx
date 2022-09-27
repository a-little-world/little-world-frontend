import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import "./notifications.css";

const dummyNotifications = [
  {
    id: 2347,
    status: "unread",
    type: "appointment",
    text: "new appoinment?",
    dateString: "27th October, 2022 at 3:00pm",
    unixtime: 1666364400,
  },
  {
    id: 2346,
    status: "read",
    type: "new friend",
    text: "New friend: George McCoy",
    dateString: "27th October, 2022 at 3:00pm",
    unixtime: 1666364400,
  },
  {
    id: 1973,
    status: "archive",
    type: "missed call",
    text: "missed call",
    dateString: "You missed appointment",
    unixtime: 1640995200,
  },
];

function timeAgo(start) {
  const end = Math.floor(Date.now() / 1000); // trim to seconds
  const seconds = end - start;

  if (seconds < 60) {
    return "just now";
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days} days ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months} months ago`;
  }
  const years = Math.floor(months / 12);
  return `${years} years ago`;
}

function Notifications() {
  const { t } = useTranslation();
  const [visibleNotifs, setVisibleNotifs] = useState("all");
  return (
    <>
      <div className="header">
        <span className="text">{t("nm_main_header_settings")}</span>
        <div className="buttons select-showing">
          <button
            type="button"
            className={visibleNotifs === "all" ? "all selected" : "all"}
            onClick={() => {
              setVisibleNotifs("all");
            }}
          >
            <img alt="" />
            {t("nm_filter_all")}
          </button>
          <button
            type="button"
            className={visibleNotifs === "unread" ? "unread selected" : "unread"}
            onClick={() => {
              setVisibleNotifs("unread");
            }}
          >
            <img alt="" />
            {t("nm_filter_unread")}
          </button>
          <button
            type="button"
            className={visibleNotifs === "archive" ? "archive selected" : "archive"}
            onClick={() => {
              setVisibleNotifs("archive");
            }}
          >
            <img alt="" />
            {t("nm_filter_archive")}
          </button>
        </div>
      </div>
      <div className="content panel">
        {dummyNotifications.map(({ id, status, type, text, dateString, unixtime }) => {
          if (
            status === visibleNotifs ||
            (visibleNotifs === "all" && ["read", "unread"].includes(status))
          ) {
            return (
              <div key={id} className="notification-item">
                <img className={type.replace(" ", "-")} alt={type} />
                <div className="info">
                  <div className="notification-headline">{text}</div>
                  <div className="notification-time">{dateString}</div>
                </div>
                <div className="status">
                  {status === "unread" && <div className="unread-indicator" />}
                  {status !== "archive" && (
                    <button type="button" className="archive-item">
                      <img alt="archive item" />
                    </button>
                  )}
                  <div className="time-ago">{timeAgo(unixtime)}</div>
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </>
  );
}

export { dummyNotifications };
export default Notifications;
