import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  DashboardIcon,
  Gradients,
  LogoutIcon,
  MessageIcon,
  ProfileIcon,
  QuestionIcon,
  SettingsIcon,
} from "@a-little-world/little-world-design-system";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { BACKEND_PATH, BACKEND_URL } from "../../ENVIRONMENT";
import Logo from "../atoms/Logo";
import MenuLink from "../atoms/MenuLink";

const Unread = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xxsmall};
  right: ${({ theme }) => theme.spacing.xxsmall};
  background: ${({ theme }) => theme.color.surface.highlight};
  color: ${({ theme }) => theme.color.text.button};
  height: 16px;
  aspect-ratio: 1;
  border-radius: 100%;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
`;

function UnreadDot({ count }) {
  return <Unread>{count}</Unread>;
}

function Sidebar({ sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const buttonData = [
    { label: "start", path: "/", Icon: DashboardIcon },
    { label: "messages", path: "/chat", Icon: MessageIcon },
    { label: "my_profile", path: "/profile", Icon: ProfileIcon },
    { label: "help", path: "/help", Icon: QuestionIcon },
    { label: "settings", path: "/settings", Icon: SettingsIcon },
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

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  const notifications = useSelector((state) => state.userData.notifications);

  const unread = {
    notifications: notifications.unread.items.filter(({ status }) => status === "unread"),
    messages: [],
  };

  useEffect(() => {
    // TODO:
  }, []);

  return (
    <>
      <div className={showSidebarMobile ? "sidebar" : "sidebar hidden"}>
        <Logo />
        {buttonData.map(({ label, path, clickEvent, Icon }) =>
          typeof clickEvent === typeof undefined ? (
            <MenuLink
              to={path}
              key={label}
              $appearance={
                location.pathname === `${BACKEND_PATH}${path}`
                  ? ButtonAppearance.Secondary
                  : ButtonAppearance.Primary
              }
            >
              {["messages", "notifications"].includes(label) && Boolean(unread[label].length) && (
                <UnreadDot count={unread[label].length} />
              )}
              <Icon
                label={label}
                labelId={label}
                {...(location.pathname === `${BACKEND_PATH}${path}`
                  ? { color: "white" }
                  : { gradient: Gradients.Blue })}
              />
              {t(`nbs_${label}`)}
            </MenuLink>
          ) : (
            <Button
              key={label}
              type="button"
              variation={ButtonVariations.Option}
              appearance={
                location.pathname === `${BACKEND_PATH}${path}`
                  ? ButtonAppearance.Secondary
                  : ButtonAppearance.Primary
              }
              onClick={clickEvent}
            >
              <LogoutIcon color="#5f5f5f" label={label} labelId={label} />
              {t(`nbs_${label}`)}
            </Button>
          )
        )}
      </div>
      <div className="mobile-shade" onClick={() => setShowSidebarMobile(false)} />
    </>
  );
  // else  return <h1>no notifications</h1>
}

export default Sidebar;
