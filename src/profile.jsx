import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import "./i18n";
import Link from "./path-prepend";

import "./profile.css";

function ProfileBox({ userPk, firstName, lastName, userDescription, imgSrc }) {
  const { t } = useTranslation();

  return (
    <div className="profile-box">
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
        <Link to="/chat" state={{ userPk }} className="chat">
          <img alt="chat" />
          {t("cp_message")}
        </Link>
        <Link to="/call-setup" state={{ userPk }} className="call">
          <img alt="call" />
          {t("cp_call")}
        </Link>
      </div>
    </div>
  );
}

const dummyText =
  "Augue neque gravida in Fermentum et solicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Tortor aliquam nulla Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl Vel Pretium lectus quam id leo in vitae; turpis massa sed elementum tempus Egestas.";

function ProfileDetail() {
  const { t } = useTranslation();

  return (
    <div className="profile-detail">
      <div className="about">
        <h3>{t("profile_about")}</h3>
        <div className="profile-text">{dummyText}</div>
      </div>
      <div className="topics">
        <h3>{t("profile_topics")}</h3>
        <div className="profile-text">{dummyText}</div>
      </div>
      <div className="extra-topics">
        <h3>{t("profile_extra_topics")}</h3>
        <div className="profile-text">{dummyText}</div>
      </div>
      <div className="expectations">
        <h3>{t("profile_expectations")}</h3>
        <div className="profile-text">{dummyText}</div>
      </div>
    </div>
  );
}

function Profile({ userData }) {
  const { t } = useTranslation();

  if (!userData) {
    return null; // don't render until ajax has returned
  }

  return (
    <div className="profile-component">
      <div className="header">
        <img alt="back" className="back" />
        {t("profile_my_profile")}
      </div>
      <div className="content">
        <ProfileBox {...userData} />
        <ProfileDetail />
      </div>
    </div>
  );
}

export { ProfileBox };
export default Profile;
