import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Link from "./path-prepend";
import "./profile.css";
import "./i18n";

function ProfileUser() {
  return (
    <div className="profile-user">
      <img />
      <div className="user-name">Courtney</div>
      <div className="user-summary">Valkenburg</div>
      <div className="user-actions"></div>
    </div>
  );
}

const dummyText =
  "Augue neque gravida in Fermentum et solicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Tortor aliquam nulla Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl Vel Pretium lectus quam id leo in vitae; turpis massa sed elementum tempus Egestas.";

function ProfileDetail() {
  const {t} = useTranslation();

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

function Profile() {
  const {t} = useTranslation();

  return (
    <div className="profile">
      <div className="left">
        <div className="back">
          <img alt="back" />
          {t("profile_back")}
        </div>
        <ProfileUser />
      </div>
      <div className="main">
        <div className="header">{t("profile_my_profile")}</div>
        <ProfileDetail />
      </div>
    </div>
  );
}

export default Profile;
