import { t } from "i18next";
import React from "react";

function Contact() {
  return (
    <div className="help-contact panel">
      <h2>{t("nbt_contact")}</h2>
      <p>
        {t("help_contact_intro_line1")}
        <br />
        {t("help_contact_intro_line2")}
      </p>
      <label htmlFor="problem">{t("help_contact_problem_label")}</label>
      <textarea
        type="textarea"
        name="problem"
        inputMode="text"
        placeholder={t("help_contact_problem_placeholder")}
      />
      <div className="drop-zone-label">{t("help_contact_picture_label")}</div>
      <div className="picture-drop-zone">
        <img alt="" />
        <button type="button">{t("help_contact_picture_btn")}</button>
        <div className="drag-text">{t("help_contact_picture_drag")}</div>
      </div>
    </div>
  );
}

function Help({ selection }) {
  return (
    <div className="content-area-main">
      {selection === "contact" && <Contact />}
      <div className="help-support panel">
        <img className="logo" alt="little world" />
        <h2 className="support">{t("help_support_header")}</h2>
        <div className="support-sub">{t("help_support_slogan")}</div>
        <button type="button">{t("help_support_message_btn")}</button>
        <button type="button">{t("help_support_call_btn")}</button>
        <div className="contact-info">
          <div className="top">
            <img className="logo" alt="" />
            <img className="logo-text" alt="little-world" />
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
                oliver.berlin@little-world.com
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
            <div className="socials">
              <img className="icon-linked-in" alt="linked in" />
              <img className="icon-facebook" alt="facebook" />
              <img className="icon-instagram" alt="instagram" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
