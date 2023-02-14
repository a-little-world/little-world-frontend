import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { FetchNotificationsAsync } from "@/features/userData";
import { BACKEND_PATH, BACKEND_URL } from "@/ENVIRONMENT";
import Link from "@/components/Link/path-prepend";


function UnreadDot({ count }) {
  if (!count) {
    return false;
  }
  return <div className="unread-dot">{count}</div>;
}

function Sidebar({ sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const self = useSelector((state) => state.userData.self);

  const buttonData = [
    { label: "start", path: "/" },
    { label: "messages", path: "/chat" },
    { label: "notifications", path: ""},//"/notifications" },
    { label: "my_profile", path: "/profile" },
    { label: "help", path: "/help" },
    { label: "settings", path: "/settings" },
    {
      label: "log_out",
      clickEvent: () => {
        fetch(`${BACKEND_URL}/api/user/logout/`, {
          method: "GET",
          headers: { "X-CSRFToken": Cookies.get("csrftoken") },
        })
          .then((response) => {
            if (response.status === 200) {
              navigate("/login/"); // Redirect only valid in production
              navigate(0); // to reload the page
            } else {
              console.error("server error", response.status, response.statusText);
            }
          })
          .catch((error) => console.error(error));
      },
    },
  ];

  if (self.isAdmin) {
    buttonData.push({
      label: "admin_panel",
      clickEvent: () => {
        navigate("/admin/"); // Redirect only valid in production
        navigate(0); // to reload the page
      },
    });
  }

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  const notifications = useSelector(state => state.userData.notifications);

  const unread = {
    notifications: notifications.filter(({ status }) => status === "unread"),
    messages: [],
  };
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(FetchNotificationsAsync({ pageNumber: 1, itemPerPage: 20 }));
  }, []);
  

  return (
    <>
      <div className={showSidebarMobile ? "sidebar" : "sidebar hidden"}>
        <div className="logos">
          <img alt="little" className="logo-image" />
          <img alt="little world" className="logo-text" />
        </div>
        {buttonData.map(({ label, path, clickEvent }) =>
          typeof clickEvent === typeof undefined ? (
            <Link
              to={path}
              key={label}
              className={`sidebar-item ${label}${
                location.pathname === `${BACKEND_PATH}${path}` ? " selected" : ""
              }`}
            >
              {["messages", "notifications"].includes(label) && (
                <UnreadDot count={unread[label].length} />
              )}
              <img alt={label} />
              {t(`nbs_${label}`)}
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              onClick={clickEvent}
              className={`sidebar-item ${label}${
                location.pathname === `${BACKEND_PATH}${path}` ? " selected" : ""
              }`}
            >
              <img alt={label} />
              {t(`nbs_${label}`)}
            </button>
          )
        )}
      </div>
      <div className="mobile-shade" onClick={() => setShowSidebarMobile(false)} />
    </>
  );
  // else  return <h1>no notifications</h1>
}

export default Sidebar;