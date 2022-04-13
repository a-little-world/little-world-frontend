import React, { useEffect, useState } from "react";
import "./i18n";
import "./main.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import $ from "jquery";
import Cookies from "js-cookie";
import * as simulator from "./login-simulator";
import GLOB from "./ENVIRONMENT";
import logoWithText from "./images/logo-text.svg";

function Sidebar() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("start");

  const buttonData = [
    { label: "start", image: "", link: "" },
    { label: "messages", image: "", link: "" },
    { label: "notifications", image: "", link: "" },
    { label: "my_profile", image: "", link: "" },
    { label: "help", image: "", link: "" },
    { label: "settings", image: "", link: "" },
    { label: "log_out", image: "", link: "" },
  ];

  const initCredentials =
    window.localStorage.getItem("credentials") || "benjamin.tim@gmx.de:Test123";
  const [login, setLogin] = useState(initCredentials);

  const handleChange = (e) => {
    setLogin(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /*
     * We force login the new user and reload the window
     * NOTE: we did change the `crsftoken` and `sessionid`
     * so they have to be realoded accordingly, prob only relevant for `crsftoken`
     */
    const [userLogin, userPass] = login.split(":");
    // I stole this trick with local storage, it's not cleared on reload an can be used to set defaults
    window.localStorage.setItem("current_login_user", userLogin);
    window.localStorage.setItem("current_login_pass", userPass);
    // simulator.awaitSimulatedLogin(userPass[0], userPass[1], true);
    window.location.reload();
  };

  return (
    <div className="sidebar">
      <img alt="little world" src={logoWithText} className="logo" />
      {buttonData.map(({ label, image, link }) => {
        return (
          <div key={label} className={`${label} ${selected === label ? "selected" : ""}`}>
            <img alt={label} />
            {t(`nbs_${label}`)}
          </div>
        );
      })}
      <form onSubmit={handleSubmit}>
        <input
          type="login"
          name="login"
          placeholder="Enter username:password"
          onChange={handleChange}
          value={login}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

function NavBarTop() {
  const { t } = useTranslation();
  const nbtTopics = ["conversation_partners", "appointments", "community_calls"];
  const [topSelection, setTopSelection] = useState("conversation_partners");
  const handleChange = (e) => setTopSelection(e.target.value);

  return (
    <div className="nav-bar-top">
      <div className="selector">
        {nbtTopics.map((topic) => (
          <span key={topic}>
            <input
              type="radio"
              id={`${topic}-radio`}
              value={topic}
              checked={topSelection === topic}
              name="sidebar"
              onChange={handleChange}
            />
            <label htmlFor={`${topic}-radio`}>{t(`nbt_${topic}`)}</label>
          </span>
        ))}
      </div>
    </div>
  );
}

function PartnerProfiles({ matchesInfo }) {
  const { t } = useTranslation();

  return (
    <div className="profiles">
      {matchesInfo.map(({ userPk, firstName, lastName, userDescription, imgSrc }) => {
        return (
          <div key={userPk} className="profile-box">
            <img alt="match" className="profile-image" src={imgSrc} />
            <div className="profile-info">
              <div className="name">{`${firstName} ${lastName}`}</div>
              <div className="text">{userDescription}</div>
            </div>
            <div className="buttons">
              <a className="profile">
                <img alt="visit profile" />
                {t("cp_profile")}
              </a>
              <a className="chat">
                <img alt="chat" />
                {t("cp_message")}
              </a>
              <Link to="/call-setup" state={{ userPk }} className="call">
                <img alt="call" />
                {t("cp_call")}
              </Link>
            </div>
          </div>
        );
      })}
      <div className="find-new">
        <img alt="plus" />
        {t("cp_find_new_partner")}
      </div>
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
        {dummyNotifications.map((item) => {
          return (
            <div key={item.id} className="notification-item">
              <img className={item.type} alt={item.type} />
              <div className="info">
                <div className="notification-headline">{item.text}</div>
                <div className="notification-time">{item.dateString}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="show-all">{t("nbr_show_all")}</div>
    </div>
  );
}

function Main() {
  const [userInfo, setUserInfo] = useState({
    imgSrc: null,
    firstName: "",
    lastName: "",
  });

  const [matchesInfo, setMatchesInfo] = useState([]);

  useEffect(() => {
    const loginString = window.localStorage.getItem("credentials") || "benjamin.tim@gmx.de:Test123";
    $.ajax({
      type: "POST",
      url: `${GLOB.BACKEND_URL}/api2/composite/`,
      headers: {
        // The cookies is optained when authenticating via `api2/login/`
        "X-CSRFToken": Cookies.get("csrftoken") // the login_had sets this, see 'login-simulator.js'
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
              partner_h256_pk: "${match.user_h256_pk}",
            },
          },
        ]),
      },
    }).then(({ _matchesBasic, userData, matches }) => {
      setUserInfo({
        imgSrc: userData.profile_image,
        firstName: userData.real_name_first,
        lastName: userData.real_name_last,
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

  return (
    <div className="main">
      <Sidebar />
      <div className="content-area-right">
        <NavBarTop />
        <div className="content-area-main">
          <PartnerProfiles matchesInfo={matchesInfo} />
          <NotificationPanel userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
}

export default Main;
