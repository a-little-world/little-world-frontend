import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import "./i18n";
import Link from "./path-prepend";

import "./profile.css";

function ProfileBox({
  userPk,
  firstName,
  lastName,
  userDescription,
  imgSrc,
  isSelf,
  setCallSetupPartner,
}) {
  const { t } = useTranslation();

  return (
    <div className="profile-box">
      <img alt="match" className="profile-image" src={imgSrc} />
      <div className="profile-info">
        <div className="name">{`${firstName} ${lastName}`}</div>
        <div className="text">{userDescription}</div>
      </div>
      {!isSelf && (
        <div className="buttons">
          <Link to="/" state={{ userPk }} className="profile">
            <img alt="visit profile" />
            {t("cp_profile")}
          </Link>
          <Link to="/chat" state={{ userPk }} className="chat">
            <img alt="chat" />
            {t("cp_message")}
          </Link>
          <button type="button" onClick={() => setCallSetupPartner(userPk)} className="call">
            <img alt="call" />
            {t("cp_call")}
          </button>
        </div>
      )}
    </div>
  );
}

const dummyTopicsIds = [1, 19, 8];

function TopicsBox({ topicIds }) {
  const { t } = useTranslation();
  return (
    <div className="selected-topics">
      {topicIds.map((idx) => (
        <span key={idx}>{t(`profile_interests.${idx}`)}</span>
      ))}
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
        <TopicsBox topicIds={dummyTopicsIds} />
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

function Profile({ matchesInfo, userInfo, setCallSetupPartner }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { userPk } = location.state || {};
  const profileData = userPk ? matchesInfo.filter((data) => data.userPk === userPk)[0] : userInfo;

  if (!profileData) {
    return null; // don't render until ajax has returned the necessary data
  }

  const profileTitle = userPk
    ? t("profile_match_profile", { userName: profileData.firstName })
    : t("profile_my_profile");

  return (
    <div className="profile-component">
      <div className="header">
        {userPk && (
          <Link to="/" className="back">
            <img alt="back" />
          </Link>
        )}
        <span className="text">{profileTitle}</span>
      </div>
      <div className="content">
        <ProfileBox {...profileData} isSelf={!userPk} setCallSetupPartner={setCallSetupPartner} />
        <ProfileDetail />
      </div>
    </div>
  );
}

export { ProfileBox };
export default Profile;
