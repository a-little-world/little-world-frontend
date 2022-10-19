import { t } from "i18next";
import React, { useState } from "react";

import "./help.css";

function Contact() {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    console.log("DROP");
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  return (
    <div className="help panel">
      <div className="help-contact">
        <h2>{t("nbt_contact")}</h2>
        <p>
          {t("help_contact_intro_line1")}
          <br />
          {t("help_contact_intro_line2")}
        </p>
        <label htmlFor="problem">
          {t("help_contact_problem_label")}
          <textarea
            type="textarea"
            name="problem"
            inputMode="text"
            maxLength="300"
            placeholder={t("help_contact_problem_placeholder")}
          />
        </label>
        <div className="drop-zone-label">
          {t("help_contact_picture_label")}
          <div
            className={dragOver ? "picture-drop-zone dragover" : "picture-drop-zone"}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
          >
            <button type="button">
              <img alt="" />
              <span className="text">{t("help_contact_picture_btn")}</span>
            </button>
            <div className="drag-text">{t("help_contact_picture_drag")}</div>
          </div>
        </div>
        <button type="submit" className="contact-submit">
          {t("help_contact_submit")}
        </button>
      </div>
    </div>
  );
}

function Help({ selection }) {
  return (
    <div className="content-area-main">
      {selection === "contact" && <Contact />}
      <div className="help-support panel">
        <div className="topper">
          <div className="logos">
            <img className="logo-image" alt="" />
            <img className="logo-text" alt="little world" />
          </div>
          <div className="support-team">
            <h2>{t("help_support_header")}</h2>
            <div className="sub">{t("help_support_slogan")}</div>
          </div>
        </div>
        <div className="contact-buttons">
          <button type="button" className="support-message">
            <img alt="" />
            <span className="text">{t("help_support_message_btn")}</span>
          </button>
          <button type="button" className="support-call">
            <img alt="" />
            <span className="text">{t("help_support_call_btn")}</span>
          </button>
        </div>
        <div className="contact-info">
          <div className="main">
            <div className="top">
              <div className="logos-small">
                <img className="logo-image" alt="" />
                <img className="logo-text" alt="little world" />
              </div>
              <div className="business-name">Little World GbR</div>
            </div>
            <div className="bottom">
              <div className="contacts">
                <div>
                  <img className="web-icon" alt="web" />
                  www.little-world.de
                </div>
                <div>
                  <img className="email-icon" alt="e-mail" />
                  oliver@little-world.com
                </div>
                <div>
                  <img className="phone-icon" alt="phone" />
                  +49 241 980 93 490
                </div>
                <div>
                  <img className="mobile-icon" alt="mobile" />
                  +49 152 34 777 471
                </div>
              </div>
            </div>
          </div>
          <div className="socials">
            <a href="http://linkedin.com/littleworld">
              <img className="icon-linkedin" alt="linked in" />
            </a>
            <a href="http://facebook.com/littleworld">
              <img className="icon-facebook" alt="facebook" />
            </a>
            <a href="http://instagram.com/littleworld">
              <img className="icon-instagram" alt="instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
