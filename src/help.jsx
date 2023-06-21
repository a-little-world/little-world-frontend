import { t } from "i18next";
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { filterMessagesForDialog } from "./chat/chat.lib";
import { BACKEND_PATH, BACKEND_URL } from "./ENVIRONMENT";
import { setStatus } from "./features/userData";

import "./help.css";

function FrequentQuestion({ question, answer }) {
  const [showing, setShowing] = useState(false);
  const toggleShowing = () => setShowing(!showing);

  return (
    <div className={showing ? "faq-item showing" : "faq-item"}>
      <h3 onClick={toggleShowing}>
        <img alt="collapse/expand" />
        {question}
      </h3>
      <p className="answer">{answer}</p>
    </div>
  );
}

function Faqs() {
  const { t } = useTranslation();
  const help_faq = [
    {
      section: "before_talk",
      questions: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"],
    },
    {
      section: "during_talk",
      questions: ["q1", "q2", "q3", "q4", "q5", "q6"],
    },
    {
      section: "after_talk",
      questions: ["q1", "q2", "q3", "q4", "q5"],
    },
  ];
  return (
    <div>
      <h2>{t("nbt_faqs")}</h2>
      <p className="intro-text">{t("help_faqs_intro")}</p>
      <div className="faq-items">
        {help_faq.map((faq) => {
          return (
            <>
              <h2>{t(`faq::section_title::${faq.section}`)}</h2>
              {faq.questions.map((question) => {
                return (
                  <FrequentQuestion
                    question={t(`faq::section_content::${faq.section}::${question}::question`)}
                    answer={t(`faq::section_content::${faq.section}::${question}::answer`)}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </div>
  );
}

function Contact() {
  const [dragOver, setDragOver] = useState(false);
  const [filenames, setFilenames] = useState([]);
  const [helpMessage, setHelpMessage] = useState("");
  const [formState, setFormState] = useState("idle");
  const fileRef = useRef();

  const handleSubmit = () => {
    setFormState("pending");
    var data = new FormData();
    console.log(data, fileRef, filenames, fileRef.current);
    for (var i = 0; i < fileRef.current.files.length; ++i) {
      let file = fileRef.current.files.item(i);
      let name = file.name;
      console.log("file name: ", name);
      data.append("file", file, name);
    }
    data.set("message", helpMessage);
    fetch("/api/help_message/", {
      headers: {
        "X-CSRFToken": Cookies.get("csrftoken"),
        "X-UseTagsOnly": true,
      },
      method: "POST",
      body: data,
    }).then((res) => {
      if (res.ok) {
        setFormState("submitted");
      } else {
        setFormState("error");
      }
    });
  };

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

  if (formState === "pending") {
    return (
      <>
        <h2>Sending you message</h2>
      </>
    );
  } else if (formState === "submitted") {
    return (
      <>
        <h2>Your message has been submitted, thanks for your feedback!</h2>
      </>
    );
  } else if (formState === "error") {
    return (
      <>
        <h2>There has been an error submitting your message, please try sending an email.</h2>
      </>
    );
  }

  return (
    <form className="help-contact">
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
          onChange={(e) => {
            setHelpMessage(e.target.value);
          }}
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
      <button type="button" className="contact-submit" onClick={handleSubmit}>
        {t("help_contact_submit")}
      </button>
    </form>
  );
}

function Help({ selection }) {
  const adminUser = useSelector(
    (state) => state.userData.users.filter((u) => u.type === "support")[0]
  );
  const navigate = useNavigate();
  console.log("ADMIN", adminUser);

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
          <button
            type="button"
            className="support-message"
            onClick={() => {
              navigate(`${BACKEND_PATH}/chat`, { state: { userPk: adminUser.userPk } });
            }}
          >
            <img alt="" />
            <span className="text">{t("help_support_message_btn")}</span>
          </button>
          <button
            type="button"
            className="support-call"
            onClick={() => {
              window.open("tel:+4915234777471");
            }}
          >
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
              <div className="business-name">A Little World gUG</div>
            </div>
            <div className="bottom">
              <div className="contacts">
                <a href="mailto:support@little-world.com">
                  <img className="email-icon" alt="e-mail" />
                  <span className="text">support@little-world.com</span>
                </a>
                <a href="tel:+4915234777471">
                  <img className="mobile-icon" alt="mobile" />
                  <span className="text">+49 152 34 777 471</span>
                </a>
              </div>
            </div>
          </div>
          <div className="socials">
            <a href="https://www.linkedin.com/company/76488145/">
              <img className="icon-linkedin" alt="linked in" />
            </a>
            <a href="https://www.facebook.com/profile.php?id=100071509163812">
              <img className="icon-facebook" alt="facebook" />
            </a>
            <a href="https://www.instagram.com/littleworld_de/">
              <img className="icon-instagram" alt="instagram" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Help;
