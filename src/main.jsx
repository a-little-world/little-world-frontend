import React, { useEffect, useState } from "react";
import "./i18n";
import "./main.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

  return (
    <div className="sidebar">
      <img src={logoWithText} className="logo" />
      {buttonData.map(({ label, image, link }) => {
        return (
          <div key={label} className={`${label} ${selected === label ? "selected" : ""}`}>
            <img alt={label} />
            {t(`nbs_${label}`)}
          </div>
        );
      })}
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

function PartnerProfiles() {
  const { t } = useTranslation();
  const dummyProfiles = [
    { id: 312, name: "Frank", text: "Talk to Frank" },
    { id: 392, name: "Andreas", text: "Hi I'm Andreas hell yeah!" },
    { id: 399, name: "Hildegard", text: "I like big butts and I cannot lie" },
  ];
  return (
    <div className="profiles">
      {dummyProfiles.map(({ id, name, text }) => {
        return (
          <div key={id} className="profile-box">
            <img className="profile-image" src={`/images/profiles/${id}.jpg`} />
            <div className="profile-info">
              <div className="name">{name}</div>
              <div className="text">{text}</div>
            </div>
            <div className="buttons">
              <a className="profile">
                <img alt="profile" />
                {t("cp_profile")}
              </a>
              <a className="chat">
                <img alt="chat" />
                {t("cp_message")}
              </a>
              <a className="call">
                <img alt="call" />
                {t("cp_call")}
              </a>
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

function NotificationPanel() {
  const { t } = useTranslation();
  const dummyUserData = {
    id: 402,
    name: "Courtney Henry",
  };
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
        <img src={`../images/profiles/${dummyUserData.id}.jpg`} alt="current user" />
        <div className="name">{dummyUserData.name}</div>
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
  return (
    <div className="main">
      <Sidebar />
      <div className="content-area-right">
        <NavBarTop />
        <div className="content-area-main">
          <PartnerProfiles />
          <NotificationPanel />
        </div>
      </div>
    </div>
  );
}

export default Main;
