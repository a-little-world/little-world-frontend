import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

import { archiveNotif, ArchiveNotificationAsync, FetchNotificationsAsync, readNotif } from "./features/userData";

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
  const [notifications,setNotifications] = useState([])
  const data = useSelector((state) => state.userData.notifications)
  const status = useSelector((state) => state.userData.status)
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const groupedNotifs = {
    day:[],
    week: [],
    older: [],
  };

  const visibleNotifs = notifications.filter(({ state }) => {
    return (
      state === visibleNotifType ||
      (visibleNotifType === "all" && ["read", "unread"].includes(state))
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
useEffect(()=>{
  dispatch(FetchNotificationsAsync({pageNumber:page+1,itemPerPage:20}))
  
  setNotifications([...notifications,...data])
  if(page*10>data.length)setHasMore(false)

},[page])

  const archive = (id) => {
    dispatch(ArchiveNotificationAsync(id));
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
              {groupedNotifs[name].map(({ hash, status, type, title, dateString, unixtime }) => {
                const extraProps =
                  status === "unread"
                    ? {
                        onClick: () => markRead(hash),
                        onKeyPress: () => markRead(hash),
                        role: "button",
                        tabIndex: 0,
                      }
                    : {};

                return (
                  <div key={hash} className={`notification-item ${status}`} {...extraProps}>
                    <img className={type.replace(" ", "-")} alt={type} />
                    <div className="info">
                      <div className="notification-headline">{title}</div>
                      <div className="notification-time">{dateString}</div>
                    </div>
                    <div className="status">
                      {status === "unread" && <div className="unread-indicator" />}
                      {status !== "archive" && (
                        <button type="button" className="archive-item" onClick={() => archive(hash)}>
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
          {visibleNotifs.length !== 0&&  (
                      <button className={`load-more ${!hasMore?'disabled':""} ${status==="loading"?"loading":"loading"}` }   onClick={() => setPage(page + 1)}>Load More</button>
                    )}
        {visibleNotifs.length === 0 && <div>no notifications</div>}
      </div>
    </>
  );
}

export default Notifications;
