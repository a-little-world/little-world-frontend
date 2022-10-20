import { t } from "i18next";
import React, { useRef, useState } from "react";

import "./help.css";

function FrequentQuestion({ question, answer }) {
  return (
    <div className="faq-item">
      <h3>{question}</h3>
      <p className="answer">{answer}</p>
    </div>
  );
}

function Faqs() {
  return (
    <div>
      <h2>{t("nbt_faqs")}</h2>
      <p className="intro-text">{t("help_faqs_intro")}</p>
      <div className="faq-items">
        <FrequentQuestion question="question1" answer="this is stock answer number one." />
        <FrequentQuestion question="question2" answer="this is stock answer number two." />
        <FrequentQuestion question="question3" answer="this is stock answer number three." />
        <FrequentQuestion question="question4" answer="this is stock answer number four." />
      </div>
    </div>
  );
}

function Contact() {
  const [dragOver, setDragOver] = useState(false);
  const [filenames, setFilenames] = useState([]);
  const fileRef = useRef();

  const handleSubmit = () => {};

  const handleDrop = (e) => {
    e.preventDefault();
    const fileList = [...e.dataTransfer.items]
      .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
      .map((item) => item.getAsFile().name);
    setFilenames(fileList);
    setDragOver(false);
  };

  const handleDragOver = (e) => e.preventDefault();
  const handleDragEnter = () => setDragOver(true);
  const handleDragLeave = () => setDragOver(false);

  const handleClick = () => fileRef.current.click();

  const handleChange = () => {
    const fileList = [...fileRef.current.files].map((file) => file.name);
    setFilenames(fileList);
  };

  return (
    <form
      method="post"
      encType="multipart/form-data"
      className="help-contact"
      onSubmit={handleSubmit}
    >
      <h2>{t("nbt_contact")}</h2>
      <p className="intro-text">
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
          <input type="file" ref={fileRef} multiple accept="image/*" onChange={handleChange} />
          <button type="button" onClick={handleClick}>
            {filenames.map((name) => {
              return (
                <div className="filename" key={name}>
                  <img alt="" />
                  {name}
                </div>
              );
            })}
            {filenames.length === 0 && (
              <>
                <img alt="" />
                <span className="text">{t("help_contact_picture_btn")}</span>
              </>
            )}
            {filenames.length > 0 && <span className="text">click to change files</span>}
          </button>
          <div className="drag-text">{t("help_contact_picture_drag")}</div>
        </div>
      </div>
      <button type="submit" className="contact-submit">
        {t("help_contact_submit")}
      </button>
    </form>
  );
}

function Help({ selection }) {
  return (
    <div className="content-area-main">
      <div className="help panel">
        {selection === "faqs" && <Faqs />}
        {selection === "contact" && <Contact />}
      </div>
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
