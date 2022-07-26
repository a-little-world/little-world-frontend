import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

import "./i18n";
import Link from "./path-prepend";

import "./overlay.css";

function Overlay({ title, subtitle, text, onOk, onExit }) {
  const { t } = useTranslation();
  return (
    <div className="overlay-modal">
      <div className="modal-top">
        <div className="modal-header">
          <h3 className="title">{title}</h3>
          <span className="subtitle">{subtitle}</span>
        </div>
        <button type="button" className="modal-close" onClick={onExit} />
      </div>
      {text}
      <button type="button" className="av-setup-confirm" onClick={onOk}>
        {t("pcs_btn_join_call")}
      </button>
    </div>
  );
}

export default Overlay;
