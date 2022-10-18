import { t } from "i18next";
import React from "react";

function Help({ selection }) {
  return (
    <div className="content-area-main">
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
