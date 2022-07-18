import React, { useEffect, useRef, useState } from "react";
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

function ItemsBox() {
  const { t } = useTranslation();

  const [editing, setEditing] = useState(false);
  const [topicIndexes, setTopicIndexes] = useState(dummyTopicsIds);
  const [tempTopicIndexes, setTempTopicIndexes] = useState(dummyTopicsIds);

  const location = useLocation();
  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const toggleInterest = (idx) => {
    const newIndexes = tempTopicIndexes.includes(idx)
      ? tempTopicIndexes.filter((item) => item !== idx) // remove item
      : [...tempTopicIndexes, idx]; // add item
    setTempTopicIndexes(newIndexes);
  };

  const saveTopics = () => {
    setTopicIndexes(tempTopicIndexes);
    setEditing(false);
  };

  const cancelTopics = () => {
    setTempTopicIndexes(topicIndexes);
    setEditing(false);
  };

  return (
    <div className="topics">
      <h3>{t("profile_topics")}</h3>
      <div className="selected-topics">
        {isSelf && (
          <button type="button" className="edit" onClick={() => setEditing(true)}>
            <img alt="edit" />
          </button>
        )}
        {topicIndexes.map((idx) => (
          <div key={idx} className="interest-item">
            <span className="text">{t(`profile_interests.${idx}`)}</span>
          </div>
        ))}
        {editing && (
          <div className="topics-shade">
            <div className="topics-selector">
              <div className="buttons">
                <button type="button" className="cancel" onClick={cancelTopics}>
                  <img alt="cancel" />
                </button>
                <button type="button" className="save" onClick={saveTopics}>
                  <img alt="save" />
                </button>
              </div>
              <h3>{t("profile_choose_interests")}</h3>
              <div className="items">
                {t("profile_interests", { returnObjects: true }).map((interest, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={
                      tempTopicIndexes.includes(idx)
                        ? "interest-item selected-item"
                        : "interest-item"
                    }
                    onClick={() => toggleInterest(idx)}
                  >
                    <span className="text">{interest}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const dummyText =
  "Augue neque gravida in Fermentum et solicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt. Tortor aliquam nulla Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat nisl Vel Pretium lectus quam id leo in vitae; turpis massa sed elementum tempus Egestas.";

function TextBox({ subject }) {
  const { t } = useTranslation();
  const location = useLocation();
  const editorRef = useRef();
  const [editState, setEditState] = useState(false);
  const [topicText, setTopicText] = useState(dummyText);
  const [textLen, setTextLen] = useState(0);

  const { userPk } = location.state || {};
  const isSelf = !userPk;

  const saveChange = () => {
    const html = editorRef.current.innerHTML;

    /* Unpick the weirdness that browsers are doing to the DOM when multiple returns
     * are included. If this is not done innerText will insert 2n-1 new lines and
     * giving different results between contenteditable and fixed content.
     */
    editorRef.current.innerHTML = html
      .replaceAll("<div><br></div>", "<br>")
      .replace("<div>", "<br>")
      .replace("</div>", "");
    const text = editorRef.current.innerText;
    setTopicText(text);
    setEditState(false);
  };

  const allowedCodes = [
    8, // backspace
    16, // shift - for selection
    17, // ctrl - for word deletion
    33, // pageUp
    34, // pageDown
    35, // end
    36, // home
    37, // left arrow
    38, // up arrow
    39, // right arrow
    40, // down arrow
    46, // delete
  ];
  const maxLen = 999;

  const handleKeyDown = (e) => {
    // preventing keyPresses needs to run on keyDown
    if (allowedCodes.includes(e.keyCode)) {
      return; // don't calculate length if not necessary
    }
    if (e.keyCode === 90 && e.ctrlKey) {
      return; // allow undo (ctrl+z)
    }
    const el = editorRef.current;
    const len = el.innerText.length;
    if (len >= maxLen) {
      e.preventDefault();
    }
  };

  const handleKeyUp = () => {
    // handling paste needs to run on keyUp
    const el = editorRef.current;
    const text = el.innerText;
    if (text.length > maxLen) {
      el.innerText = text.substring(0, maxLen);
    }
    setTextLen(el.innerText.length);
  };

  const handlePaste = (e) => {
    // ensures pastes are sent as unformatted plain text
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    window.document.execCommand("insertText", false, text); // WARN: this is deprecated, but nothing else does the same. still widely supported at creation.
    handleKeyUp(); // trim if too long.
  };

  useEffect(() => {
    if (editState) {
      editorRef.current.innerText = topicText;
      setTextLen(topicText.length);

      // initialise cursor at end of text
      const el = editorRef.current;
      const target = el.lastChild || el;
      window.getSelection().removeAllRanges(); // need to run this first otherwise selection will fail with empty text when mouse focus is in element area
      window.getSelection().setPosition(target, target.length);
    }
  }, [editState]);

  return (
    <div className={subject}>
      <h3>{t(`profile_${subject.replace("-", "_")}`)}</h3>
      <div className="profile-text">
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <p
          contentEditable={editState}
          ref={editorRef}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onPaste={handlePaste}
          style={editState ? {} : { display: "none" }}
        />
        {!editState && (
          <p>
            {topicText.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < topicText.split("\n").length - 1 ? <br /> : ""}
              </React.Fragment>
            ))}
          </p>
        )}
        {isSelf && !editState && (
          <button type="button" className="edit" onClick={() => setEditState(true)}>
            <img alt="edit" />
          </button>
        )}
        {isSelf && editState && (
          <div className="buttons">
            <button type="button" className="cancel" onClick={() => setEditState(false)}>
              <img alt="cancel" />
            </button>
            <button type="button" className="save" onClick={saveChange}>
              <img alt="save" />
            </button>
          </div>
        )}
        {editState && (
          <div className="character-limit">
            {textLen}/{maxLen}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileDetail() {
  return (
    <div className="profile-detail">
      <TextBox subject="about" />
      <ItemsBox />
      <TextBox subject="extra-topics" />
      <TextBox subject="expectations" />
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
        <ProfileDetail isSelf={!userPk} />
      </div>
    </div>
  );
}

export { ProfileBox };
export default Profile;
