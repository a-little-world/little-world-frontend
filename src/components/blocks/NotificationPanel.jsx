import React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useSelector } from "react-redux";

import Link from "../../path-prepend";
import { getAppRoute, NOTIFICATIONS_ROUTE } from "../../routes";

function NotificationPanel() {
  const { t } = useTranslation();

  const user = useSelector((state) => state.userData.user);
  const usesAvatar = user.profile.image_type === "avatar";
  const matches = useSelector((state) => state.userData.matches);
  const usersDisplay = [...matches.confirmed.items, ...matches.proposed.items];
  const notifications = useSelector((state) => state.userData.notifications);

  return (
    <div className="notification-panel">
      <div className="active-user">
        {usesAvatar ? (
          <Avatar className="avatar" {...user.profile.avatar_config} />
        ) : (
          <img src={user.profile.image} alt="current user" />
        )}
        <div className="name">{`${user.profile.first_name} ${user.profile.second_name}`}</div>
      </div>
      <hr />
      <div className="notifications-header">{t("nbr_notifications")}</div>
      <div className="notifications-content">
        {notifications.unread.items.map(({ hash, type, title, created_at }) => (
          <div key={hash} className="notification-item">
            <img className="appointment" alt={type} />
            <div className="info">
              <div className="notification-headline">{title}</div>
              <div className="notification-time">{created_at}</div>
            </div>
          </div>
        ))}
      </div>
      <Link to={getAppRoute(NOTIFICATIONS_ROUTE)} className="show-all">
        {t("nbr_show_all")}
      </Link>
    </div>
  );
}

export default NotificationPanel;
