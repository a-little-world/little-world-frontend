
import React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useSelector } from "react-redux";

import "@/i18n";
import Link from "@/components/Link/path-prepend";


function NotificationPanel() {
  const { t } = useTranslation();
  const users = useSelector((state) => state.userData.users);
  const activeUser = users.find(({ type }) => type === "self");
  const { usesAvatar, avatarCfg, firstName, lastName, imgSrc } = activeUser;
  const notifications = useSelector((state) => state.userData.notifications);
  // don't show unless names are available; ie API call has returned
  if (!firstName) {
    return false;
  }

  return (
    <div className="notification-panel">
      <div className="active-user">
        {usesAvatar ? (
          <Avatar className="avatar" {...avatarCfg} />
        ) : (
          <img src={imgSrc} alt="current user" />
        )}
        <div className="name">{`${firstName} ${lastName}`}</div>
      </div>
      <hr />
      <div className="notifications-header">{t("nbr_notifications")}</div>
      <div className="notifications-content">
        {notifications.map(({ hash, type, title, created_at }) => (
          <div key={hash} className="notification-item">
            <img className="appointment" alt={type} />
            <div className="info">
              <div className="notification-headline">{title}</div>
              <div className="notification-time">{created_at}</div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/notifications" className="show-all">
        {t("nbr_show_all")}
      </Link>
    </div>
  );
}

export default NotificationPanel;