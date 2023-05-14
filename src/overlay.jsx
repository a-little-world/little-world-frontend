import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useLocation, useNavigate } from "react-router-dom";

import "./i18n";
import Link from "./path-prepend";

import "./overlay.css";

function Overlay({ title, name, text, onOk, onExit, userInfo }) {
  const { t } = useTranslation();
  // TODO: add translations for this stuff
  // <button type="button" className="modal-close" onClick={onExit} />
  // <span className="subtitle">{subtitle}</span>
  return (
    <div className="overlay-modal modal-box">
      <div className="modal-top">
        <div className="modal-header">
          <h3 className="title">{title}</h3>
        </div>
      </div>
      {userInfo.usesAvatar ? (
        <Avatar className="profile-avatar" {...userInfo.avatarConfig} />
      ) : (
        <img alt="match" className="profile-image" src={userInfo.imgSrc} />
      )}
      {text}
      <div className="centered">
        <h1>{name}</h1>
      </div>
      <div className="centered">
        <h3>{t("match_overlay_text")}</h3>
      </div>
      <button type="button" className="av-setup-confirm" onClick={onOk}>
        {t("match_overlay_button_text")}
      </button>
    </div>
  );
}


export function MatchConfirmOverlay({ title, name, text, onOk, onExit, userInfo }) {
  const { t } = useTranslation();
  // TODO: add translations for this stuff
  // <button type="button" className="modal-close" onClick={onExit} />
  // <span className="subtitle">{subtitle}</span>
  return (
    <div className="overlay-modal modal-box">
      <div className="modal-top">
        <div className="modal-header">
          <h3 className="title">{title}</h3>
        </div>
      </div>
      {userInfo.image_type === 'avatar' ? (
        <Avatar className="profile-avatar" {...userInfo.avatar_image} />
      ) : (
        <img alt="match" className="profile-image" src={userInfo.avatar_image} />
      )}
      {text}
      <div className="centered">
        <h1>{name}</h1>
      </div>
      <div className="centered">
        <h3>{t("match_overlay_text")}</h3>
      </div>
      <button type="button" className="av-setup-confirm" onClick={onOk}>
        {t("confirm_match_overlay_accept_text")}
      </button>
      <button type="button" className="av-setup-reject" onClick={onExit}>
        {t("confrim_match_overlay_reject_text")}
      </button>
    </div>
  );
}

export default Overlay;
