import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { archiveNotif, readNotif } from "./features/userData";

import "./notifications.css";

function timeToStr(seconds, t) {
  if (seconds < 60) {
    return t("notif_time_ago.now");
  }
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return t("notif_time_ago.minutes", { n: minutes });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return t("notif_time_ago.hours", { n: hours });
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return t("notif_time_ago.days", { n: days });
  }
  const months = Math.floor(days / 30);
  if (months < 12) {
    return t("notif_time_ago.months", { n: months });
  }
  const years = Math.floor(months / 12);
  return t("notif_time_ago.years", { n: years });
}

const secondsAgo = (start) => {
  const end = Math.floor(Date.now() / 1000); // trim to seconds
  const seconds = end - start;
  return seconds;
};

function Notifications() {
  const { t } = useTranslation();
  const [visibleNotifType, setVisibleNotifType] = useState("all");
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.userData.notifications);

  const groupedNotifs = {
    day: [],
    week: [],
    older: [],
  };

  const visibleNotifs = notifications.filter(({ status }) => {
    return (
      status === visibleNotifType ||
      (visibleNotifType === "all" && ["read", "unread"].includes(status))
    );
  });

  visibleNotifs.forEach((notif) => {
    const secondsOld = secondsAgo(notif.unixtime);
    if (secondsOld < 60 * 60 * 24) {
      groupedNotifs.day.push(notif);
    } else if (secondsOld < 60 * 60 * 24 * 7) {
      groupedNotifs.week.push(notif);
    } else {
      groupedNotifs.older.push(notif);
    }
  });

  const archive = (id) => {
    dispatch(archiveNotif(id));
  };
  const markRead = (id) => {
    dispatch(readNotif(id));
  };

  return (
    <>
      <div className="header">
        <span className="text">{t("nm_main_header_settings")}</span>
        <div className="buttons select-showing">
          <button
            type="button"
            className={visibleNotifType === "all" ? "all selected" : "all"}
            onClick={() => setVisibleNotifType("all")}
          >
            <img alt="" />
            {t("nm_filter_all")}
          </button>
          <button
            type="button"
            className={visibleNotifType === "unread" ? "unread selected" : "unread"}
            onClick={() => setVisibleNotifType("unread")}
          >
            <img alt="" />
            {t("nm_filter_unread")}
          </button>
          <button
            type="button"
            className={visibleNotifType === "archive" ? "archive selected" : "archive"}
            onClick={() => setVisibleNotifType("archive")}
          >
            <img alt="" />
            {t("nm_filter_archive")}
          </button>
        </div>
      </div>
      <div className="content panel">
        {Object.entries(groupedNotifs).map(([name, notifs]) => {
          if (notifs.length === 0) {
            return false;
          }
          return (
            <>
              <div className="notification-age">{name}</div>
              {groupedNotifs[name].map(({ id, status, type, text, dateString, unixtime }) => {
                const extraProps =
                  status === "unread"
                    ? {
                        onClick: () => markRead(id),
                        onKeyPress: () => markRead(id),
                        role: "button",
                        tabIndex: 0,
                      }
                    : {};

                return (
                  <div key={id} className={`notification-item ${status}`} {...extraProps}>
                    <img className={type.replace(" ", "-")} alt={type} />
                    <div className="info">
                      <div className="notification-headline">{text}</div>
                      <div className="notification-time">{dateString}</div>
                    </div>
                    <div className="status">
                      {status === "unread" && <div className="unread-indicator" />}
                      {status !== "archive" && (
                        <button type="button" className="archive-item" onClick={() => archive(id)}>
                          <img alt="archive item" />
                        </button>
                      )}
                      <div className="time-ago">{timeToStr(secondsAgo(unixtime), t)}</div>
                    </div>
                  </div>
                );
              })}
            </>
          );
        })}
        {visibleNotifs.length === 0 && <div>no notifications</div>}
      </div>
    </>
  );
}

export default Notifications;
