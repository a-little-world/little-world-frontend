import React, { useEffect, useState } from "react";
import "./i18n";
import "./main.css";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import $ from "jquery";
import Cookies from "js-cookie";
import Link from "./path-prepend";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import logoWithText from "./images/logo-text.svg";
import Chat from "./chat/chat-full-view";
import Profile, { ProfileBox } from "./profile";

function Sidebar({ userInfo, sidebarMobile }) {
  const location = useLocation();
  const { t } = useTranslation();

  const buttonData = [
    { label: "start", path: "/" },
    { label: "messages", path: "/chat" },
    { label: "notifications", path: "" },
    { label: "my_profile", path: "/profile" },
    { label: "help", path: "" },
    { label: "settings", path: "" },
    { label: "log_out", path: "" },
  ];

  const [showSidebarMobile, setShowSidebarMobile] = [sidebarMobile.get, sidebarMobile.set];

  return (
    <>
      <div className={showSidebarMobile ? "sidebar" : "sidebar hidden"}>
        <div className="active-user">
          <img src={userInfo.imgSrc} alt="current user" />
          <div className="name">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
        </div>
        <img alt="little world" src={logoWithText} className="logo" />
        {buttonData.map(({ label, path }) => (
          <Link
            to={path}
            key={label}
            className={`sidebar-item ${label}${location.pathname === path ? " selected" : ""}`}
          >
            <img alt={label} />
            {t(`nbs_${label}`)}
          </Link>
        ))}
      </div>
      <div className="mobile-shade" onClick={() => setShowSidebarMobile(false)} />
    </>
  );
}

function MobileNavBar({ setShowSidebarMobile }) {
  return (
    <div className="mobile-header">
      <button type="button" className="menu" onClick={() => setShowSidebarMobile(true)}>
        <img alt="open menu" />
      </button>
      <div className="logo-with-text">
        <img className="logo-mobile" alt="" />
        <span className="logo-text">Little World</span>
      </div>
      <button className="notification disabled" type="button">
        <img alt="show notifications" />
      </button>
    </div>
  );
}

function Selector() {
  const { t } = useTranslation();
  const nbtTopics = ["conversation_partners", "appointments", "community_calls"];
  const [topSelection, setTopSelection] = useState("conversation_partners");
  const handleChange = (e) => setTopSelection(e.target.value);
  const disabled = ["appointments", "community_calls"];

  return (
    <div className="selector">
      {nbtTopics.map((topic) => (
        <span className={topic} key={topic}>
          <input
            type="radio"
            id={`${topic}-radio`}
            value={topic}
            checked={topSelection === topic}
            name="sidebar"
            onChange={handleChange}
          />
          <label htmlFor={`${topic}-radio`} className={disabled.includes(topic) ? "disabled" : ""}>
            {t(`nbt_${topic}`)}
          </label>
        </span>
      ))}
    </div>
  );
}

function PartnerProfiles({ matchesInfo }) {
  const { t } = useTranslation();

  return (
    <div className="profiles">
      {matchesInfo.map((userData) => {
        return <ProfileBox key={userData.userPk} {...userData} />;
      })}
      <Link className="find-new">
        <img alt="plus" />
        {t("cp_find_new_partner")}
      </Link>
    </div>
  );
}

function NotificationPanel({ userInfo }) {
  const { t } = useTranslation();

  const dummyNotifications = [
    {
      id: 2347,
      type: "appointment",
      text: "new appoinment?",
      dateString: "27th October, 2022 at 3:00pm",
      unixtime: 1666364400,
    },
    {
      id: 2346,
      type: "new friend",
      text: "New friend: George McCoy",
      dateString: "27th October, 2022 at 3:00pm",
      unixtime: 1666364400,
    },
    {
      id: 1973,
      type: "call",
      text: "missed call",
      dateString: "You missed appointment",
      unixtime: 1640995200,
    },
  ];
  return (
    <div className="notification-panel">
      <div className="active-user">
        <img src={userInfo.imgSrc} alt="current user" />
        <div className="name">{`${userInfo.firstName} ${userInfo.lastName}`}</div>
      </div>
      <div className="notifications-header">{t("nbr_notifications")}</div>
      <div className="notifications-content">
        {dummyNotifications.map((item) => (
          <div key={item.id} className="notification-item">
            <img className={item.type} alt={item.type} />
            <div className="info">
              <div className="notification-headline">{item.text}</div>
              <div className="notification-time">{item.dateString}</div>
            </div>
          </div>
        ))}
      </div>
      <Link className="show-all">{t("nbr_show_all")}</Link>
    </div>
  );
}

function Main() {
  const location = useLocation();
  const { userPk } = location.state || {};

  const [userInfo, setUserInfo] = useState({
    imgSrc: null,
    firstName: "",
    lastName: "",
  });

  const [matchesInfo, setMatchesInfo] = useState([]);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  useEffect(() => {
    setShowSidebarMobile(false);
  }, [location]);

  useEffect(() => {
    $.ajax({
      type: "POST",
      url: `${BACKEND_URL}/api2/composite/`,
      headers: {
        // The cookies is optained when authenticating via `api2/login/`
        "X-CSRFToken": Cookies.get("csrftoken"), // the login_had sets this, see 'login-simulator.js'
      },
      data: {
        "composite-request": JSON.stringify([
          {
            spec: {
              type: "simple",
              ref: "_matchesBasic",
            },
            method: "GET",
            path: "api2/matches/",
          },
          {
            spec: {
              type: "simple",
              ref: "userData",
            },
            method: "GET",
            path: "api2/profile/",
          },
          {
            spec: {
              type: "foreach",
              in: "_matchesBasic",
              as: "match",
              ref: "matches",
            },
            method: "POST",
            path: "api2/profile_of/",
            body: {
              partner_h256_pk: "${match.user_h256_pk}", // eslint-disable-line no-template-curly-in-string
            },
          },
        ]),
      },
    }).then(({ _matchesBasic, userData, matches }) => {
      setUserInfo({
        // userPk:
        firstName: userData.real_name_first,
        lastName: userData.real_name_last,
        // userDescription:
        imgSrc: userData.profile_image,
      });

      const matchesData = matches.map((match) => {
        return {
          userPk: match["match.user_h256_pk"],
          firstName: match.real_name_first,
          lastName: match.real_name_last,
          userDescription: match.user_description,
          imgSrc: match.profile_image,
        };
      });
      setMatchesInfo(matchesData);
    });
  }, []);

  document.body.classList.remove("hide-mobile-header");

  const use = location.pathname.split("/").slice(-1)[0] || "main";

  return (
    <div className={`main-page show-${use}`}>
      <Sidebar
        userInfo={userInfo}
        sidebarMobile={{ get: showSidebarMobile, set: setShowSidebarMobile }}
      />
      <div className="content-area">
        <div className="nav-bar-top">
          <MobileNavBar setShowSidebarMobile={setShowSidebarMobile} />
          <Selector />
        </div>
        {location.pathname === `${BACKEND_PATH}/` && (
          <div className="content-area-main">
            <NotificationPanel userInfo={userInfo} />
            <PartnerProfiles matchesInfo={matchesInfo} />
          </div>
        )}
        {location.pathname === `${BACKEND_PATH}/chat` && (
          <Chat matchesInfo={matchesInfo} userPk={userPk} />
        )}
        {location.pathname === `${BACKEND_PATH}/profile` && <Profile userData={userInfo} />}
      </div>
    </div>
  );
}

export default Main;
