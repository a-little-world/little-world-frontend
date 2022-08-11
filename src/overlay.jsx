import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import { useLocation, useNavigate } from "react-router-dom";

import "./i18n";
import Link from "./path-prepend";

import "./overlay.css";

function Overlay({ title, subtitle, text, onOk, onExit, userInfo }) {
  const { t } = useTranslation();
  // TODO: add translations for this stuff
  // <button type="button" className="modal-close" onClick={onExit} />
  return (
    <div className="overlay-modal">
      <div className="modal-top">
        <div className="modal-header">
          <h3 className="title">{title}</h3>
          <span className="subtitle">{subtitle}</span>
        </div>
      </div>
      {userInfo.usesAvatar ? (
        <Avatar className="profile-avatar" {...userInfo.avatarConfig} />
      ) : (
        <img alt="match" className="profile-image" src={userInfo.imgSrc} />
      )}
      {text}
      <button type="button" className="av-setup-confirm" onClick={onOk}>
        OK
      </button>
    </div>
  );
}

export default Overlay;
